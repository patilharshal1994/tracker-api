import { BaseModel } from './BaseModel.js';
import pool from '../../config/database.js';

/**
 * Comment Model
 */
export class CommentModel extends BaseModel {
  constructor() {
    super('ticket_comments');
  }

  /**
   * Get comments for a ticket
   */
  async findByTicketId(ticketId) {
    const query = `
      SELECT 
        c.*,
        u.name as user_name,
        u.email as user_email,
        u.role as user_role
      FROM ticket_comments c
      INNER JOIN users u ON c.user_id = u.id
      WHERE c.ticket_id = ?
      ORDER BY c.created_at ASC
    `;
    const [rows] = await pool.query(query, [ticketId]);
    return rows;
  }

  /**
   * Get comment with user details
   */
  async findByIdWithUser(commentId) {
    const query = `
      SELECT 
        c.*,
        u.name as user_name,
        u.email as user_email,
        u.role as user_role
      FROM ticket_comments c
      INNER JOIN users u ON c.user_id = u.id
      WHERE c.id = ?
    `;
    const [rows] = await pool.query(query, [commentId]);
    return rows[0] || null;
  }
}

export default new CommentModel();
