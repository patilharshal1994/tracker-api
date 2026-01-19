import ActivityModel from '../models/ActivityModel.js';
import TicketModel from '../models/TicketModel.js';
import { getPaginationParams, createPaginationMeta } from '../utils/pagination.js';

/**
 * Activity Service
 */
class ActivityService {
  /**
   * Get activities for a ticket
   */
  async getTicketActivities(ticketId, query = {}) {
    // Verify ticket exists
    const ticket = await TicketModel.findById(ticketId);
    if (!ticket) {
      throw new Error('Ticket not found');
    }

    const pagination = getPaginationParams(query);
    const activities = await ActivityModel.findByTicketId(ticketId);

    // Apply pagination manually since we already have all activities
    const start = (pagination.page - 1) * pagination.limit;
    const end = start + pagination.limit;
    const paginatedActivities = activities.slice(start, end);

    return {
      data: paginatedActivities,
      pagination: createPaginationMeta(activities.length, pagination.page, pagination.limit)
    };
  }
}

export default new ActivityService();
