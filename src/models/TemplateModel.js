import { BaseModel } from './BaseModel.js';
import pool from '../../config/database.js';

/**
 * Ticket Template Model
 */
export class TemplateModel extends BaseModel {
  constructor() {
    super('ticket_templates');
  }

  /**
   * Get templates for a user (shared + user's own)
   */
  async findByUserId(userId) {
    const query = `
      SELECT * FROM ticket_templates
      WHERE created_by = ? OR is_shared = true
      ORDER BY created_at DESC
    `;
    const [rows] = await pool.query(query, [userId]);
    return rows;
  }
}

export default new TemplateModel();
