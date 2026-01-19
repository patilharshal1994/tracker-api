import bcrypt from 'bcrypt';
import pool from '../config/database.js';

export const getCurrentUser = async (req, res, next) => {
  try {
    const [users] = await pool.execute(
      'SELECT id, name, email, role, team_id, is_active, created_at FROM users WHERE id = ?',
      [req.user.id]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(users[0]);
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (req, res, next) => {
  try {
    const [users] = await pool.execute(
      'SELECT id, name, email, role, team_id, is_active, created_at FROM users ORDER BY created_at DESC'
    );

    res.json(users);
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Users can only view their own profile unless they're admin
    if (req.user.role !== 'ADMIN' && parseInt(id) !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const [users] = await pool.execute(
      'SELECT id, name, email, role, team_id, is_active, created_at FROM users WHERE id = ?',
      [id]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(users[0]);
  } catch (error) {
    next(error);
  }
};

export const createUser = async (req, res, next) => {
  try {
    const { name, email, password, role = 'USER', team_id, is_active = true } = req.body;

    // Check if email already exists
    const [existing] = await pool.execute('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    // Hash password if provided
    let passwordHash = null;
    if (password) {
      passwordHash = await bcrypt.hash(password, 10);
    } else {
      // Generate a random password if not provided
      passwordHash = await bcrypt.hash(Math.random().toString(36), 10);
    }

    const [result] = await pool.execute(
      'INSERT INTO users (name, email, password_hash, role, team_id, is_active) VALUES (?, ?, ?, ?, ?, ?)',
      [name, email, passwordHash, role, team_id || null, is_active]
    );

    const [newUser] = await pool.execute(
      'SELECT id, name, email, role, team_id, is_active, created_at FROM users WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json(newUser[0]);
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email, password, role, team_id, is_active } = req.body;

    // Check permissions
    if (req.user.role !== 'ADMIN' && parseInt(id) !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Only admins can change role and is_active
    if ((role !== undefined || is_active !== undefined) && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Only admins can change role or active status' });
    }

    // Check if user exists
    const [users] = await pool.execute('SELECT id FROM users WHERE id = ?', [id]);
    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check email uniqueness if changing email
    if (email) {
      const [existing] = await pool.execute(
        'SELECT id FROM users WHERE email = ? AND id != ?',
        [email, id]
      );
      if (existing.length > 0) {
        return res.status(409).json({ error: 'Email already in use' });
      }
    }

    // Build update query dynamically
    const updates = [];
    const values = [];

    if (name !== undefined) {
      updates.push('name = ?');
      values.push(name);
    }
    if (email !== undefined) {
      updates.push('email = ?');
      values.push(email);
    }
    if (password !== undefined) {
      const passwordHash = await bcrypt.hash(password, 10);
      updates.push('password_hash = ?');
      values.push(passwordHash);
    }
    if (role !== undefined && req.user.role === 'ADMIN') {
      updates.push('role = ?');
      values.push(role);
    }
    if (team_id !== undefined) {
      updates.push('team_id = ?');
      values.push(team_id || null);
    }
    if (is_active !== undefined && req.user.role === 'ADMIN') {
      updates.push('is_active = ?');
      values.push(is_active);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    values.push(id);

    await pool.execute(
      `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    const [updatedUser] = await pool.execute(
      'SELECT id, name, email, role, team_id, is_active, created_at FROM users WHERE id = ?',
      [id]
    );

    res.json(updatedUser[0]);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (parseInt(id) === req.user.id) {
      return res.status(400).json({ error: 'Cannot delete your own account' });
    }

    const [result] = await pool.execute('DELETE FROM users WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
};
