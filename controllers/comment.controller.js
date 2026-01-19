import pool from '../config/database.js';
import { sendTicketNotification } from '../services/email.service.js';

export const getComments = async (req, res, next) => {
  try {
    const { ticketId } = req.params;

    // Verify ticket access
    const [tickets] = await pool.execute('SELECT project_id FROM tickets WHERE id = ?', [ticketId]);
    if (tickets.length === 0) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    if (req.user.role !== 'ADMIN') {
      const [members] = await pool.execute(
        'SELECT user_id FROM project_members WHERE project_id = ? AND user_id = ?',
        [tickets[0].project_id, req.user.id]
      );

      const [projects] = await pool.execute('SELECT team_id FROM projects WHERE id = ?', [
        tickets[0].project_id
      ]);

      if (
        members.length === 0 &&
        (!projects[0] || projects[0].team_id !== req.user.team_id)
      ) {
        return res.status(403).json({ error: 'Access denied' });
      }
    }

    const [comments] = await pool.execute(
      `SELECT tc.id, tc.comment_text, tc.attachment_url, tc.created_at, tc.updated_at,
              u.id as user_id, u.name as user_name, u.email as user_email
       FROM ticket_comments tc
       JOIN users u ON tc.user_id = u.id
       WHERE tc.ticket_id = ?
       ORDER BY tc.created_at ASC`,
      [ticketId]
    );

    res.json(comments);
  } catch (error) {
    next(error);
  }
};

export const createComment = async (req, res, next) => {
  try {
    const { ticket_id, comment_text } = req.body;
    const attachmentUrl = req.file ? `/uploads/${req.file.filename}` : null;

    // Verify ticket access
    const [tickets] = await pool.execute('SELECT project_id FROM tickets WHERE id = ?', [ticket_id]);
    if (tickets.length === 0) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    if (req.user.role !== 'ADMIN') {
      const [members] = await pool.execute(
        'SELECT user_id FROM project_members WHERE project_id = ? AND user_id = ?',
        [tickets[0].project_id, req.user.id]
      );

      const [projects] = await pool.execute('SELECT team_id FROM projects WHERE id = ?', [
        tickets[0].project_id
      ]);

      if (
        members.length === 0 &&
        (!projects[0] || projects[0].team_id !== req.user.team_id)
      ) {
        return res.status(403).json({ error: 'Access denied' });
      }
    }

    const [result] = await pool.execute(
      'INSERT INTO ticket_comments (ticket_id, user_id, comment_text, attachment_url) VALUES (?, ?, ?, ?)',
      [ticket_id, req.user.id, comment_text, attachmentUrl]
    );

    const [newComment] = await pool.execute(
      `SELECT tc.id, tc.comment_text, tc.attachment_url, tc.created_at,
              u.id as user_id, u.name as user_name, u.email as user_email
       FROM ticket_comments tc
       JOIN users u ON tc.user_id = u.id
       WHERE tc.id = ?`,
      [result.insertId]
    );

    // Get ticket for notification
    const [ticketData] = await pool.execute(
      `SELECT t.*, 
              p.name as project_name, 
              r.name as reporter_name, r.email as reporter_email,
              a.name as assignee_name, a.email as assignee_email
       FROM tickets t
       LEFT JOIN projects p ON t.project_id = p.id
       LEFT JOIN users r ON t.reporter_id = r.id
       LEFT JOIN users a ON t.assignee_id = a.id
       WHERE t.id = ?`,
      [ticket_id]
    );

    // Send notification
    try {
      await sendTicketNotification('commented', ticketData[0]);
    } catch (emailError) {
      console.error('Failed to send email notification:', emailError);
    }

    res.status(201).json(newComment[0]);
  } catch (error) {
    next(error);
  }
};

export const updateComment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { comment_text } = req.body;

    // Check if comment exists and user owns it
    const [comments] = await pool.execute('SELECT user_id FROM ticket_comments WHERE id = ?', [id]);
    if (comments.length === 0) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    if (req.user.role !== 'ADMIN' && comments[0].user_id !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    await pool.execute('UPDATE ticket_comments SET comment_text = ? WHERE id = ?', [
      comment_text,
      id
    ]);

    const [updatedComment] = await pool.execute(
      `SELECT tc.id, tc.comment_text, tc.attachment_url, tc.created_at, tc.updated_at,
              u.id as user_id, u.name as user_name, u.email as user_email
       FROM ticket_comments tc
       JOIN users u ON tc.user_id = u.id
       WHERE tc.id = ?`,
      [id]
    );

    res.json(updatedComment[0]);
  } catch (error) {
    next(error);
  }
};

export const deleteComment = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if comment exists and user owns it
    const [comments] = await pool.execute('SELECT user_id FROM ticket_comments WHERE id = ?', [id]);
    if (comments.length === 0) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    if (req.user.role !== 'ADMIN' && comments[0].user_id !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const [result] = await pool.execute('DELETE FROM ticket_comments WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    next(error);
  }
};
