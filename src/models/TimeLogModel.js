import { BaseModel } from './BaseModel.js';
import pool from '../../config/database.js';

/**
 * Time Log Model
 */
export class TimeLogModel extends BaseModel {
  constructor() {
    super('ticket_time_logs');
  }

  /**
   * Get time logs for a ticket
   */
  async findByTicketId(ticketId) {
    const query = `
      SELECT 
        tl.*,
        u.name as user_name,
        u.email as user_email
      FROM ticket_time_logs tl
      INNER JOIN users u ON tl.user_id = u.id
      WHERE tl.ticket_id = ?
      ORDER BY tl.logged_date DESC, tl.created_at DESC
    `;
    const [rows] = await pool.query(query, [ticketId]);
    return rows;
  }

  /**
   * Get total hours logged for a ticket
   */
  async getTotalHours(ticketId) {
    const query = `
      SELECT COALESCE(SUM(hours), 0) as total_hours
      FROM ticket_time_logs
      WHERE ticket_id = ?
    `;
    const [rows] = await pool.query(query, [ticketId]);
    return rows[0].total_hours || 0;
  }

  /**
   * Get time logs by user
   */
  async findByUserId(userId, filters = {}) {
    let query = `
      SELECT 
        tl.*,
        t.title as ticket_title,
        t.status as ticket_status
      FROM ticket_time_logs tl
      INNER JOIN tickets t ON tl.ticket_id = t.id
      WHERE tl.user_id = ?
    `;
    const params = [userId];

    if (filters.start_date) {
      query += ` AND tl.logged_date >= ?`;
      params.push(filters.start_date);
    }
    if (filters.end_date) {
      query += ` AND tl.logged_date <= ?`;
      params.push(filters.end_date);
    }

    query += ` ORDER BY tl.logged_date DESC, tl.created_at DESC`;

    const [rows] = await pool.query(query, params);
    return rows;
  }
}

export default new TimeLogModel();
