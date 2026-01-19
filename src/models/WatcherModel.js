import { BaseModel } from './BaseModel.js';
import pool from '../../config/database.js';

/**
 * Watcher Model
 */
export class WatcherModel extends BaseModel {
  constructor() {
    super('ticket_watchers');
  }

  /**
   * Check if user is watching ticket
   */
  async exists(ticketId, userId) {
    return this.findOne({ ticket_id: ticketId, user_id: userId });
  }

  /**
   * Get watchers for a ticket
   */
  async findByTicketId(ticketId) {
    const query = `
      SELECT 
        w.*,
        u.name as user_name,
        u.email as user_email,
        u.role as user_role
      FROM ticket_watchers w
      INNER JOIN users u ON w.user_id = u.id
      WHERE w.ticket_id = ?
      ORDER BY u.name
    `;
    const [rows] = await pool.query(query, [ticketId]);
    return rows;
  }

  /**
   * Delete watcher by ticket and user
   */
  async deleteByTicketAndUser(ticketId, userId) {
    const query = `DELETE FROM ticket_watchers WHERE ticket_id = ? AND user_id = ?`;
    const [result] = await pool.query(query, [ticketId, userId]);
    return result.affectedRows > 0;
  }
}

export default new WatcherModel();
