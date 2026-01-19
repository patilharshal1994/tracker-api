import { BaseModel } from './BaseModel.js';
import pool from '../../config/database.js';

/**
 * Tag Model
 */
export class TagModel extends BaseModel {
  constructor() {
    super('tags');
  }

  /**
   * Find tag by name
   */
  async findByName(name) {
    return this.findOne({ name });
  }

  /**
   * Get tags for a ticket
   */
  async findByTicketId(ticketId) {
    const query = `
      SELECT 
        t.*,
        tt.id as ticket_tag_id
      FROM tags t
      INNER JOIN ticket_tags tt ON t.id = tt.tag_id
      WHERE tt.ticket_id = ?
      ORDER BY t.name
    `;
    const [rows] = await pool.query(query, [ticketId]);
    return rows;
  }

  /**
   * Add tag to ticket (use TicketTagModel separately)
   */
  async addToTicket(ticketId, tagId) {
    // This should be handled by TicketTagModel
    // Kept for backward compatibility
    return null;
  }

  /**
   * Remove tag from ticket
   */
  async removeFromTicket(ticketId, tagId) {
    const query = `DELETE FROM ticket_tags WHERE ticket_id = ? AND tag_id = ?`;
    const [result] = await pool.query(query, [ticketId, tagId]);
    return result.affectedRows > 0;
  }
}

export default new TagModel();
