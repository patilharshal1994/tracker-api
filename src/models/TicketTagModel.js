import { BaseModel } from './BaseModel.js';

/**
 * Ticket Tag Model (Many-to-Many relationship)
 */
export class TicketTagModel extends BaseModel {
  constructor() {
    super('ticket_tags');
  }

  /**
   * Check if tag is already assigned to ticket
   */
  async exists(ticketId, tagId) {
    return this.findOne({ ticket_id: ticketId, tag_id: tagId });
  }
}

export default new TicketTagModel();
