import pool from '../config/database.js';
import { sendTicketNotification } from '../services/email.service.js';

export const getTickets = async (req, res, next) => {
  try {
    const {
      project_id,
      status,
      assignee_id,
      reporter_id,
      priority,
      is_breached,
      assigned_to_me,
      reported_by_me
    } = req.query;

    let query = `
      SELECT t.id, t.project_id, t.type, t.title, t.description, t.reporter_id, 
             t.assignee_id, t.branch_name, t.scenario, t.start_date, t.due_date,
             t.duration_hours, t.status, t.priority, t.is_breached, t.created_at, t.updated_at,
             p.name as project_name, 
             r.name as reporter_name, r.email as reporter_email,
             a.name as assignee_name, a.email as assignee_email
      FROM tickets t
      LEFT JOIN projects p ON t.project_id = p.id
      LEFT JOIN users r ON t.reporter_id = r.id
      LEFT JOIN users a ON t.assignee_id = a.id
      WHERE 1=1
    `;

    const params = [];

    // Apply filters
    if (project_id) {
      query += ' AND t.project_id = ?';
      params.push(project_id);
    }

    if (status) {
      query += ' AND t.status = ?';
      params.push(status);
    }

    if (assignee_id) {
      query += ' AND t.assignee_id = ?';
      params.push(assignee_id);
    }

    if (reporter_id) {
      query += ' AND t.reporter_id = ?';
      params.push(reporter_id);
    }

    if (priority) {
      query += ' AND t.priority = ?';
      params.push(priority);
    }

    if (is_breached === 'true') {
      query += ' AND t.is_breached = TRUE';
    }

    // User-specific filters
    if (req.user.role !== 'ADMIN') {
      // Users can only see tickets from their projects
      query += ` AND (
        t.project_id IN (
          SELECT project_id FROM project_members WHERE user_id = ?
        ) OR
        t.project_id IN (
          SELECT id FROM projects WHERE team_id = ?
        )
      )`;
      params.push(req.user.id, req.user.team_id);
    }

    if (assigned_to_me === 'true') {
      query += ' AND t.assignee_id = ?';
      params.push(req.user.id);
    }

    if (reported_by_me === 'true') {
      query += ' AND t.reporter_id = ?';
      params.push(req.user.id);
    }

    query += ' ORDER BY t.created_at DESC';

    const [tickets] = await pool.execute(query, params);

    res.json(tickets);
  } catch (error) {
    next(error);
  }
};

export const getTicketById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [tickets] = await pool.execute(
      `SELECT t.*, 
              p.name as project_name, 
              r.name as reporter_name, r.email as reporter_email,
              a.name as assignee_name, a.email as assignee_email
       FROM tickets t
       LEFT JOIN projects p ON t.project_id = p.id
       LEFT JOIN users r ON t.reporter_id = r.id
       LEFT JOIN users a ON t.assignee_id = a.id
       WHERE t.id = ?`,
      [id]
    );

    if (tickets.length === 0) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    const ticket = tickets[0];

    // Check access (admin or project member)
    if (req.user.role !== 'ADMIN') {
      const [members] = await pool.execute(
        'SELECT user_id FROM project_members WHERE project_id = ? AND user_id = ?',
        [ticket.project_id, req.user.id]
      );

      const [projects] = await pool.execute('SELECT team_id FROM projects WHERE id = ?', [
        ticket.project_id
      ]);

      if (
        members.length === 0 &&
        (!projects[0] || projects[0].team_id !== req.user.team_id)
      ) {
        return res.status(403).json({ error: 'Access denied' });
      }
    }

    // Get comments
    const [comments] = await pool.execute(
      `SELECT tc.id, tc.comment_text, tc.attachment_url, tc.created_at,
              u.id as user_id, u.name as user_name, u.email as user_email
       FROM ticket_comments tc
       JOIN users u ON tc.user_id = u.id
       WHERE tc.ticket_id = ?
       ORDER BY tc.created_at ASC`,
      [id]
    );

    res.json({
      ...ticket,
      comments
    });
  } catch (error) {
    next(error);
  }
};

export const createTicket = async (req, res, next) => {
  try {
    const {
      project_id,
      type = 'TASK',
      title,
      description,
      assignee_id,
      branch_name,
      scenario,
      start_date,
      due_date,
      duration_hours,
      priority = 'MEDIUM'
    } = req.body;

    // Verify project access
    if (req.user.role !== 'ADMIN') {
      const [members] = await pool.execute(
        'SELECT user_id FROM project_members WHERE project_id = ? AND user_id = ?',
        [project_id, req.user.id]
      );

      const [projects] = await pool.execute('SELECT team_id FROM projects WHERE id = ?', [
        project_id
      ]);

      if (
        members.length === 0 &&
        (!projects[0] || projects[0].team_id !== req.user.team_id)
      ) {
        return res.status(403).json({ error: 'Access denied to this project' });
      }
    }

    const [result] = await pool.execute(
      `INSERT INTO tickets 
       (project_id, type, title, description, reporter_id, assignee_id, branch_name, 
        scenario, start_date, due_date, duration_hours, priority)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        project_id,
        type,
        title,
        description || null,
        req.user.id,
        assignee_id || null,
        branch_name || null,
        scenario || null,
        start_date || null,
        due_date || null,
        duration_hours || null,
        priority
      ]
    );

    const [newTicket] = await pool.execute(
      `SELECT t.*, 
              p.name as project_name, 
              r.name as reporter_name, r.email as reporter_email,
              a.name as assignee_name, a.email as assignee_email
       FROM tickets t
       LEFT JOIN projects p ON t.project_id = p.id
       LEFT JOIN users r ON t.reporter_id = r.id
       LEFT JOIN users a ON t.assignee_id = a.id
       WHERE t.id = ?`,
      [result.insertId]
    );

    // Send notification
    try {
      await sendTicketNotification('created', newTicket[0]);
    } catch (emailError) {
      console.error('Failed to send email notification:', emailError);
    }

    res.status(201).json(newTicket[0]);
  } catch (error) {
    next(error);
  }
};

export const updateTicket = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      status,
      priority,
      assignee_id,
      due_date,
      branch_name,
      scenario
    } = req.body;

    // Get current ticket
    const [tickets] = await pool.execute(
      'SELECT * FROM tickets WHERE id = ?',
      [id]
    );

    if (tickets.length === 0) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    const currentTicket = tickets[0];

    // Check permissions: reporter, assignee, or admin can update
    if (
      req.user.role !== 'ADMIN' &&
      currentTicket.reporter_id !== req.user.id &&
      currentTicket.assignee_id !== req.user.id
    ) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Only reporter or admin can change status from CREATED
    if (status && status !== currentTicket.status) {
      if (
        currentTicket.status === 'CREATED' &&
        req.user.role !== 'ADMIN' &&
        currentTicket.reporter_id !== req.user.id
      ) {
        return res.status(403).json({ error: 'Only reporter or admin can change status from CREATED' });
      }
    }

    const updates = [];
    const values = [];

    if (title !== undefined) {
      updates.push('title = ?');
      values.push(title);
    }
    if (description !== undefined) {
      updates.push('description = ?');
      values.push(description);
    }
    if (status !== undefined) {
      updates.push('status = ?');
      values.push(status);
    }
    if (priority !== undefined) {
      updates.push('priority = ?');
      values.push(priority);
    }
    if (assignee_id !== undefined) {
      updates.push('assignee_id = ?');
      values.push(assignee_id || null);
    }
    if (due_date !== undefined) {
      updates.push('due_date = ?');
      values.push(due_date || null);
    }
    if (branch_name !== undefined) {
      updates.push('branch_name = ?');
      values.push(branch_name);
    }
    if (scenario !== undefined) {
      updates.push('scenario = ?');
      values.push(scenario);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    values.push(id);

    await pool.execute(`UPDATE tickets SET ${updates.join(', ')} WHERE id = ?`, values);

    const [updatedTicket] = await pool.execute(
      `SELECT t.*, 
              p.name as project_name, 
              r.name as reporter_name, r.email as reporter_email,
              a.name as assignee_name, a.email as assignee_email
       FROM tickets t
       LEFT JOIN projects p ON t.project_id = p.id
       LEFT JOIN users r ON t.reporter_id = r.id
       LEFT JOIN users a ON t.assignee_id = a.id
       WHERE t.id = ?`,
      [id]
    );

    // Send notification for status/assignee changes
    try {
      if (status && status !== currentTicket.status) {
        await sendTicketNotification('status_changed', updatedTicket[0]);
      }
      if (assignee_id !== undefined && assignee_id !== currentTicket.assignee_id) {
        await sendTicketNotification('assignee_changed', updatedTicket[0]);
      }
    } catch (emailError) {
      console.error('Failed to send email notification:', emailError);
    }

    res.json(updatedTicket[0]);
  } catch (error) {
    next(error);
  }
};

export const deleteTicket = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check permissions
    const [tickets] = await pool.execute('SELECT reporter_id FROM tickets WHERE id = ?', [id]);
    if (tickets.length === 0) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    if (
      req.user.role !== 'ADMIN' &&
      tickets[0].reporter_id !== req.user.id
    ) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const [result] = await pool.execute('DELETE FROM tickets WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    res.json({ message: 'Ticket deleted successfully' });
  } catch (error) {
    next(error);
  }
};
