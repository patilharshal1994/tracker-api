import pool from '../config/database.js';

export const getTicketActivities = async (req, res, next) => {
  try {
    const { ticketId } = req.params;

    const [activities] = await pool.execute(
      `SELECT ta.*, 
              u.name as user_name, u.email as user_email,
              u.avatar_url as user_avatar
       FROM ticket_activities ta
       JOIN users u ON ta.user_id = u.id
       WHERE ta.ticket_id = ?
       ORDER BY ta.created_at DESC`,
      [ticketId]
    );

    res.json({ data: activities });
  } catch (error) {
    next(error);
  }
};

// Helper function to log activity
export const logActivity = async (ticketId, userId, actionType, fieldName = null, oldValue = null, newValue = null, description = null) => {
  try {
    await pool.execute(
      'INSERT INTO ticket_activities (ticket_id, user_id, action_type, field_name, old_value, new_value, description) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [ticketId, userId, actionType, fieldName, oldValue, newValue, description]
    );
  } catch (error) {
    console.error('Failed to log activity:', error);
  }
};
