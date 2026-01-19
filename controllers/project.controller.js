import pool from '../config/database.js';

export const getProjects = async (req, res, next) => {
  try {
    let projects;

    if (req.user.role === 'ADMIN') {
      // Admins see all projects
      [projects] = await pool.execute(
        `SELECT p.id, p.name, p.description, p.created_by, p.team_id, p.created_at,
                u.name as creator_name, t.name as team_name
         FROM projects p
         LEFT JOIN users u ON p.created_by = u.id
         LEFT JOIN teams t ON p.team_id = t.id
         ORDER BY p.created_at DESC`
      );
    } else {
      // Users see only projects they're members of or assigned to their team
      [projects] = await pool.execute(
        `SELECT DISTINCT p.id, p.name, p.description, p.created_by, p.team_id, p.created_at,
                u.name as creator_name, t.name as team_name
         FROM projects p
         LEFT JOIN users u ON p.created_by = u.id
         LEFT JOIN teams t ON p.team_id = t.id
         LEFT JOIN project_members pm ON p.id = pm.project_id
         WHERE p.team_id = ? OR pm.user_id = ?
         ORDER BY p.created_at DESC`,
        [req.user.team_id, req.user.id]
      );
    }

    res.json(projects);
  } catch (error) {
    next(error);
  }
};

export const getProjectById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [projects] = await pool.execute(
      `SELECT p.id, p.name, p.description, p.created_by, p.team_id, p.created_at,
              u.name as creator_name, t.name as team_name
       FROM projects p
       LEFT JOIN users u ON p.created_by = u.id
       LEFT JOIN teams t ON p.team_id = t.id
       WHERE p.id = ?`,
      [id]
    );

    if (projects.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const project = projects[0];

    // Check access (admin or member)
    if (req.user.role !== 'ADMIN') {
      const [members] = await pool.execute(
        'SELECT user_id FROM project_members WHERE project_id = ? AND user_id = ?',
        [id, req.user.id]
      );

      if (members.length === 0 && project.team_id !== req.user.team_id) {
        return res.status(403).json({ error: 'Access denied' });
      }
    }

    // Get project members
    const [members] = await pool.execute(
      `SELECT u.id, u.name, u.email, u.role
       FROM project_members pm
       JOIN users u ON pm.user_id = u.id
       WHERE pm.project_id = ?
       ORDER BY u.name ASC`,
      [id]
    );

    // Get ticket count by status
    const [ticketStats] = await pool.execute(
      `SELECT status, COUNT(*) as count
       FROM tickets
       WHERE project_id = ?
       GROUP BY status`,
      [id]
    );

    res.json({
      ...project,
      members,
      ticketStats: ticketStats.reduce((acc, stat) => {
        acc[stat.status] = stat.count;
        return acc;
      }, {})
    });
  } catch (error) {
    next(error);
  }
};

export const createProject = async (req, res, next) => {
  try {
    const { name, description, team_id } = req.body;

    const [result] = await pool.execute(
      'INSERT INTO projects (name, description, created_by, team_id) VALUES (?, ?, ?, ?)',
      [name, description || null, req.user.id, team_id || null]
    );

    const [newProject] = await pool.execute(
      `SELECT p.id, p.name, p.description, p.created_by, p.team_id, p.created_at,
              u.name as creator_name, t.name as team_name
       FROM projects p
       LEFT JOIN users u ON p.created_by = u.id
       LEFT JOIN teams t ON p.team_id = t.id
       WHERE p.id = ?`,
      [result.insertId]
    );

    res.status(201).json(newProject[0]);
  } catch (error) {
    next(error);
  }
};

export const updateProject = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, team_id } = req.body;

    // Check if project exists
    const [projects] = await pool.execute('SELECT created_by FROM projects WHERE id = ?', [id]);
    if (projects.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Only admin or creator can update
    if (req.user.role !== 'ADMIN' && projects[0].created_by !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const updates = [];
    const values = [];

    if (name !== undefined) {
      updates.push('name = ?');
      values.push(name);
    }
    if (description !== undefined) {
      updates.push('description = ?');
      values.push(description);
    }
    if (team_id !== undefined) {
      updates.push('team_id = ?');
      values.push(team_id || null);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    values.push(id);

    await pool.execute(`UPDATE projects SET ${updates.join(', ')} WHERE id = ?`, values);

    const [updatedProject] = await pool.execute(
      `SELECT p.id, p.name, p.description, p.created_by, p.team_id, p.created_at,
              u.name as creator_name, t.name as team_name
       FROM projects p
       LEFT JOIN users u ON p.created_by = u.id
       LEFT JOIN teams t ON p.team_id = t.id
       WHERE p.id = ?`,
      [id]
    );

    res.json(updatedProject[0]);
  } catch (error) {
    next(error);
  }
};

export const deleteProject = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [result] = await pool.execute('DELETE FROM projects WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const addProjectMember = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { user_id } = req.body;

    // Check permissions (admin or project creator)
    const [projects] = await pool.execute('SELECT created_by FROM projects WHERE id = ?', [id]);
    if (projects.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    if (req.user.role !== 'ADMIN' && projects[0].created_by !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Check if user exists
    const [users] = await pool.execute('SELECT id FROM users WHERE id = ?', [user_id]);
    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if already a member
    const [existing] = await pool.execute(
      'SELECT id FROM project_members WHERE project_id = ? AND user_id = ?',
      [id, user_id]
    );
    if (existing.length > 0) {
      return res.status(409).json({ error: 'User is already a project member' });
    }

    await pool.execute('INSERT INTO project_members (project_id, user_id) VALUES (?, ?)', [
      id,
      user_id
    ]);

    const [member] = await pool.execute(
      `SELECT u.id, u.name, u.email, u.role
       FROM project_members pm
       JOIN users u ON pm.user_id = u.id
       WHERE pm.project_id = ? AND pm.user_id = ?`,
      [id, user_id]
    );

    res.status(201).json(member[0]);
  } catch (error) {
    next(error);
  }
};

export const removeProjectMember = async (req, res, next) => {
  try {
    const { id, userId } = req.params;

    // Check permissions
    const [projects] = await pool.execute('SELECT created_by FROM projects WHERE id = ?', [id]);
    if (projects.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    if (req.user.role !== 'ADMIN' && projects[0].created_by !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const [result] = await pool.execute(
      'DELETE FROM project_members WHERE project_id = ? AND user_id = ?',
      [id, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Project member not found' });
    }

    res.json({ message: 'Member removed successfully' });
  } catch (error) {
    next(error);
  }
};
