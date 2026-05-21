import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/db.js';
import { validateEmail, validatePassword, validateName } from '../utils/validation.js';

function signToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

export async function signup(req, res) {
  try {
    const { name, email, password } = req.body;
    const nameError = validateName(name);
    if (nameError) return res.status(400).json({ message: nameError });
    const emailError = validateEmail(email);
    if (emailError) return res.status(400).json({ message: emailError });
    const passwordError = validatePassword(password);
    if (passwordError) return res.status(400).json({ message: passwordError });

    const normalizedName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();
    const [existing] = await pool.query(
      'SELECT id FROM users WHERE email = ?',
      [normalizedEmail]
    );
    if (existing.length > 0) {
      return res.status(409).json({ message: 'Email is already registered' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [normalizedName, normalizedEmail, hashed]
    );

    const user = { id: result.insertId, name: normalizedName, email: normalizedEmail };
    const token = signToken(user);
    res.status(201).json({ message: 'Account created', token, user });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ message: 'Server error' });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    const emailError = validateEmail(email);
    if (emailError) return res.status(400).json({ message: emailError });
    const passwordError = validatePassword(password);
    if (passwordError) return res.status(400).json({ message: passwordError });

    const normalizedEmail = email.trim().toLowerCase();
    const [rows] = await pool.query(
      'SELECT id, name, email, password FROM users WHERE email = ?',
      [normalizedEmail]
    );
    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = signToken({ id: user.id, email: user.email });
    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
}
