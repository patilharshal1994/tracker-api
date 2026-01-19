import pool from '../config/database.js';

export const getTeams = async (req, res, next) => {
  try {
    const [teams] = await pool.execute(
      'SELECT id, name, created_at FROM teams ORDER BY name ASC'
    );

    res.json(teams);
  } catch (error) {
    next(error);
  }
};

export const getTeamById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [teams] = await pool.execute(
      'SELECT id, name, created_at FROM teams WHERE id = ?',
      [id]
    );

    if (teams.length === 0) {
      return res.status(404).json({ error: 'Team not found' });
    }

    // Get team members
    const [members] = await pool.execute(
      `SELECT u.id, u.name, u.email, u.role 
       FROM users u 
       WHERE u.team_id = ? 
       ORDER BY u.name ASC`,
      [id]
    );

    res.json({
      ...teams[0],
      members
    });
  } catch (error) {
    next(error);
  }
};

export const createTeam = async (req, res, next) => {
  try {
    const { name } = req.body;

    // Check if team name already exists
    const [existing] = await pool.execute('SELECT id FROM teams WHERE name = ?', [name]);
    if (existing.length > 0) {
      return res.status(409).json({ error: 'Team name already exists' });
    }

    const [result] = await pool.execute('INSERT INTO teams (name) VALUES (?)', [name]);

    const [newTeam] = await pool.execute(
      'SELECT id, name, created_at FROM teams WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json(newTeam[0]);
  } catch (error) {
    next(error);
  }
};

export const updateTeam = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    // Check if team exists
    const [teams] = await pool.execute('SELECT id FROM teams WHERE id = ?', [id]);
    if (teams.length === 0) {
      return res.status(404).json({ error: 'Team not found' });
    }

    // Check if new name already exists
    const [existing] = await pool.execute(
      'SELECT id FROM teams WHERE name = ? AND id != ?',
      [name, id]
    );
    if (existing.length > 0) {
      return res.status(409).json({ error: 'Team name already exists' });
    }

    await pool.execute('UPDATE teams SET name = ? WHERE id = ?', [name, id]);

    const [updatedTeam] = await pool.execute(
      'SELECT id, name, created_at FROM teams WHERE id = ?',
      [id]
    );

    res.json(updatedTeam[0]);
  } catch (error) {
    next(error);
  }
};

export const deleteTeam = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if team has users
    const [users] = await pool.execute('SELECT id FROM users WHERE team_id = ?', [id]);
    if (users.length > 0) {
      return res.status(400).json({
        error: 'Cannot delete team with members. Remove members first or reassign them.'
      });
    }

    const [result] = await pool.execute('DELETE FROM teams WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Team not found' });
    }

    res.json({ message: 'Team deleted successfully' });
  } catch (error) {
    next(error);
  }
};
