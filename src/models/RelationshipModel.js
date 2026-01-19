import { BaseModel } from './BaseModel.js';
import pool from '../../config/database.js';

/**
 * Ticket Relationship Model
 */
export class RelationshipModel extends BaseModel {
  constructor() {
    super('ticket_relationships');
  }

  /**
   * Check if relationship exists
   */
  async exists(ticketId, relatedTicketId, relationshipType) {
    return this.findOne({
      ticket_id: ticketId,
      related_ticket_id: relatedTicketId,
      relationship_type: relationshipType
    });
  }

  /**
   * Get relationships for a ticket
   */
  async findByTicketId(ticketId) {
    const query = `
      SELECT 
        r.*,
        t.title as related_ticket_title,
        t.status as related_ticket_status,
        t.priority as related_ticket_priority,
        u.name as created_by_name
      FROM ticket_relationships r
      INNER JOIN tickets t ON r.related_ticket_id = t.id
      INNER JOIN users u ON r.created_by = u.id
      WHERE r.ticket_id = ?
      ORDER BY r.created_at DESC
    `;
    const [rows] = await pool.query(query, [ticketId]);
    return rows;
  }

  /**
   * Delete relationship
   */
  async deleteRelationship(ticketId, relatedTicketId, relationshipType) {
    const query = `
      DELETE FROM ticket_relationships 
      WHERE ticket_id = ? AND related_ticket_id = ? AND relationship_type = ?
    `;
    const [result] = await pool.query(query, [ticketId, relatedTicketId, relationshipType]);
    return result.affectedRows > 0;
  }
}

export default new RelationshipModel();
