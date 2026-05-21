import mysql from 'mysql2/promise';
import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, '../../data');
const sqlitePath = path.join(dataDir, 'task_manager.sqlite');

let activePool = null;

function createSqlitePool() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  const db = new Database(sqlitePath);
  db.pragma('foreign_keys = ON');

  return {
    dialect: 'sqlite',
    async query(sql, params = []) {
      const upper = sql.trim().toUpperCase();

      if (upper.startsWith('SELECT')) {
        return [db.prepare(sql).all(...params)];
      }
      if (upper.startsWith('INSERT')) {
        const info = db.prepare(sql).run(...params);
        return [{ insertId: Number(info.lastInsertRowid), affectedRows: info.changes }];
      }
      if (upper.startsWith('UPDATE') || upper.startsWith('DELETE')) {
        const info = db.prepare(sql).run(...params);
        return [{ affectedRows: info.changes }];
      }
      db.exec(sql);
      return [[]];
    },
  };
}

async function createMysqlPool() {
  const config = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    waitForConnections: true,
    connectionLimit: 10,
  };
  const dbName = process.env.DB_NAME || 'task_manager';

  const bootstrap = await mysql.createConnection(config);
  await bootstrap.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
  await bootstrap.end();

  const mysqlPool = mysql.createPool({ ...config, database: dbName });
  await mysqlPool.query('SELECT 1');
  return { dialect: 'mysql', query: (...args) => mysqlPool.query(...args), raw: mysqlPool };
}

function initSqliteTables() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  const db = new Database(sqlitePath);
  db.pragma('foreign_keys = ON');
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'Pending' CHECK(status IN ('Pending', 'Completed')),
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);
  migrateSqliteUsersTable(db);
  db.close();
}

function migrateSqliteUsersTable(db) {
  const columns = db.prepare('PRAGMA table_info(users)').all();
  const hasName = columns.some((col) => col.name === 'name');
  if (!hasName) {
    db.exec(`ALTER TABLE users ADD COLUMN name TEXT NOT NULL DEFAULT ''`);
    console.log('SQLite: added users.name column');
  }
}

async function migrateMysqlUsersTable(conn) {
  try {
    await conn.query(
      `ALTER TABLE users ADD COLUMN name VARCHAR(255) NOT NULL DEFAULT ''`
    );
    console.log('MySQL: added users.name column');
  } catch (err) {
    if (err.code !== 'ER_DUP_FIELDNAME') throw err;
  }
}

async function initMysqlTables(mysqlPool) {
  const conn = await mysqlPool.getConnection();
  try {
    await conn.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    await migrateMysqlUsersTable(conn);
    await conn.query(`
      CREATE TABLE IF NOT EXISTS tasks (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        title VARCHAR(500) NOT NULL,
        status ENUM('Pending', 'Completed') NOT NULL DEFAULT 'Pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
  } finally {
    conn.release();
  }
}

export async function initDatabase() {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is missing. Copy backend/.env.example to backend/.env');
  }

  const preferred = process.env.DB_DIALECT || 'auto';

  if (preferred === 'sqlite') {
    initSqliteTables();
    activePool = createSqlitePool();
    console.log('Database: SQLite (backend/data/task_manager.sqlite)');
    return;
  }

  if (preferred === 'mysql') {
    activePool = await createMysqlPool();
    await initMysqlTables(activePool.raw);
    console.log('Database: MySQL (' + (process.env.DB_NAME || 'task_manager') + ')');
    return;
  }

  try {
    activePool = await createMysqlPool();
    await initMysqlTables(activePool.raw);
    console.log('Database: MySQL (' + (process.env.DB_NAME || 'task_manager') + ')');
  } catch (err) {
    console.warn('MySQL unavailable, using SQLite:', err.code || err.message);
    initSqliteTables();
    activePool = createSqlitePool();
    console.log('Database: SQLite (backend/data/task_manager.sqlite)');
  }
}

const pool = {
  query: (...args) => {
    if (!activePool) throw new Error('Database not initialized');
    return activePool.query(...args);
  },
};

export default pool;
