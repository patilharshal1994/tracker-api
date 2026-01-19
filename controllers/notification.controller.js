import pool from '../config/database.js';

export const getNotifications = async (req, res, next) => {
  try {
    const { is_read, limit = 50, offset = 0 } = req.query;
    const userId = req.user.id;

    let query = `
      SELECT n.*, 
             t.id as ticket_id, t.title as ticket_title,
             u.name as actor_name
      FROM notifications n
      LEFT JOIN tickets t ON n.related_ticket_id = t.id
      LEFT JOIN users u ON n.user_id = u.id
      WHERE n.user_id = ?
    `;
    const params = [userId];

    if (is_read !== undefined) {
      query += ' AND n.is_read = ?';
      params.push(is_read === 'true');
    }

    query += ' ORDER BY n.created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const [notifications] = await pool.execute(query, params);

    // Get unread count
    const [unreadCount] = await pool.execute(
      'SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = FALSE',
      [userId]
    );

    res.json({
      data: notifications,
      unread_count: unreadCount[0].count,
      total: notifications.length
    });
  } catch (error) {
    next(error);
  }
};

export const markAsRead = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    await pool.execute(
      'UPDATE notifications SET is_read = TRUE WHERE id = ? AND user_id = ?',
      [id, userId]
    );

    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    next(error);
  }
};

export const markAllAsRead = async (req, res, next) => {
  try {
    const userId = req.user.id;

    await pool.execute(
      'UPDATE notifications SET is_read = TRUE WHERE user_id = ? AND is_read = FALSE',
      [userId]
    );

    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    next(error);
  }
};

export const deleteNotification = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    await pool.execute(
      'DELETE FROM notifications WHERE id = ? AND user_id = ?',
      [id, userId]
    );

    res.json({ message: 'Notification deleted' });
  } catch (error) {
    next(error);
  }
};

// Helper function to create notification
export const createNotification = async (userId, type, title, message, relatedTicketId = null, relatedCommentId = null) => {
  try {
    await pool.execute(
      'INSERT INTO notifications (user_id, type, title, message, related_ticket_id, related_comment_id) VALUES (?, ?, ?, ?, ?, ?)',
      [userId, type, title, message, relatedTicketId, relatedCommentId]
    );
  } catch (error) {
    console.error('Failed to create notification:', error);
  }
};
