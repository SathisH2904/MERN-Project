import pool from '../config/db.js';
import { validateTaskTitle } from '../utils/validation.js';

export async function getTasks(req, res) {
  try {
    const [tasks] = await pool.query(
      'SELECT id, title, status, created_at, updated_at FROM tasks WHERE user_id = ? ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json({ tasks });
  } catch (err) {
    console.error('Get tasks error:', err);
    res.status(500).json({ message: 'Server error' });
  }
}

export async function createTask(req, res) {
  try {
    const { title } = req.body;
    const titleError = validateTaskTitle(title);
    if (titleError) return res.status(400).json({ message: titleError });

    const [result] = await pool.query(
      'INSERT INTO tasks (user_id, title, status) VALUES (?, ?, ?)',
      [req.user.id, title.trim(), 'Pending']
    );

    const [rows] = await pool.query(
      'SELECT id, title, status, created_at, updated_at FROM tasks WHERE id = ?',
      [result.insertId]
    );
    res.status(201).json({ task: rows[0] });
  } catch (err) {
    console.error('Create task error:', err);
    res.status(500).json({ message: 'Server error' });
  }
}

export async function updateTaskStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['Pending', 'Completed'].includes(status)) {
      return res.status(400).json({ message: 'Status must be Pending or Completed' });
    }

    const [existing] = await pool.query(
      'SELECT id FROM tasks WHERE id = ? AND user_id = ?',
      [id, req.user.id]
    );
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await pool.query('UPDATE tasks SET status = ? WHERE id = ?', [status, id]);

    const [rows] = await pool.query(
      'SELECT id, title, status, created_at, updated_at FROM tasks WHERE id = ?',
      [id]
    );
    res.json({ task: rows[0] });
  } catch (err) {
    console.error('Update status error:', err);
    res.status(500).json({ message: 'Server error' });
  }
}
