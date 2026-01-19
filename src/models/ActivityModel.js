import { BaseModel } from './BaseModel.js';
import pool from '../../config/database.js';

/**
 * Activity Model - for ticket activity logs
 */
export class ActivityModel extends BaseModel {
  constructor() {
    super('ticket_activities');
  }

  /**
   * Create activity log entry
   */
  async logActivity(ticketId, userId, activityType, oldValue, newValue, description) {
    const activity = {
      ticket_id: ticketId,
      user_id: userId,
      activity_type: activityType,
      old_value: oldValue ? JSON.stringify(oldValue) : null,
      new_value: newValue ? JSON.stringify(newValue) : null,
      description: description || null
    };
    return this.create(activity);
  }

  /**
   * Get activities for a ticket
   */
  async findByTicketId(ticketId) {
    const query = `
      SELECT 
        a.*,
        u.name as user_name,
        u.email as user_email
      FROM ticket_activities a
      INNER JOIN users u ON a.user_id = u.id
      WHERE a.ticket_id = ?
      ORDER BY a.created_at DESC
    `;
    const [rows] = await pool.query(query, [ticketId]);
    return rows;
  }

  /**
   * Log ticket creation
   */
  async logTicketCreated(ticketId, userId, ticketData) {
    return this.logActivity(
      ticketId,
      userId,
      'CREATED',
      null,
      { title: ticketData.title, status: ticketData.status },
      `Ticket created: ${ticketData.title}`
    );
  }

  /**
   * Log status change
   */
  async logStatusChange(ticketId, userId, oldStatus, newStatus) {
    return this.logActivity(
      ticketId,
      userId,
      'STATUS_CHANGED',
      { status: oldStatus },
      { status: newStatus },
      `Status changed from ${oldStatus} to ${newStatus}`
    );
  }

  /**
   * Log assignee change
   */
  async logAssigneeChange(ticketId, userId, oldAssigneeId, newAssigneeId, oldAssigneeName, newAssigneeName) {
    return this.logActivity(
      ticketId,
      userId,
      'ASSIGNEE_CHANGED',
      oldAssigneeId ? { assignee_id: oldAssigneeId, assignee_name: oldAssigneeName } : null,
      newAssigneeId ? { assignee_id: newAssigneeId, assignee_name: newAssigneeName } : null,
      newAssigneeId 
        ? `Assigned to ${newAssigneeName}` 
        : `Unassigned from ${oldAssigneeName}`
    );
  }

  /**
   * Log priority change
   */
  async logPriorityChange(ticketId, userId, oldPriority, newPriority) {
    return this.logActivity(
      ticketId,
      userId,
      'PRIORITY_CHANGED',
      { priority: oldPriority },
      { priority: newPriority },
      `Priority changed from ${oldPriority} to ${newPriority}`
    );
  }

  /**
   * Log field update
   */
  async logFieldUpdate(ticketId, userId, fieldName, oldValue, newValue) {
    return this.logActivity(
      ticketId,
      userId,
      'FIELD_UPDATED',
      { [fieldName]: oldValue },
      { [fieldName]: newValue },
      `${fieldName} updated`
    );
  }

  /**
   * Log comment added
   */
  async logCommentAdded(ticketId, userId, commentId) {
    return this.logActivity(
      ticketId,
      userId,
      'COMMENT_ADDED',
      null,
      { comment_id: commentId },
      'Comment added'
    );
  }

  /**
   * Log attachment added
   */
  async logAttachmentAdded(ticketId, userId, attachmentId, filename) {
    return this.logActivity(
      ticketId,
      userId,
      'ATTACHMENT_ADDED',
      null,
      { attachment_id: attachmentId, filename },
      `Attachment added: ${filename}`
    );
  }

  /**
   * Log tag added
   */
  async logTagAdded(ticketId, userId, tagId, tagName) {
    return this.logActivity(
      ticketId,
      userId,
      'TAG_ADDED',
      null,
      { tag_id: tagId, tag_name: tagName },
      `Tag added: ${tagName}`
    );
  }

  /**
   * Log tag removed
   */
  async logTagRemoved(ticketId, userId, tagId, tagName) {
    return this.logActivity(
      ticketId,
      userId,
      'TAG_REMOVED',
      { tag_id: tagId, tag_name: tagName },
      null,
      `Tag removed: ${tagName}`
    );
  }

  /**
   * Log watcher added
   */
  async logWatcherAdded(ticketId, userId, watcherId, watcherName) {
    return this.logActivity(
      ticketId,
      userId,
      'WATCHER_ADDED',
      null,
      { watcher_id: watcherId, watcher_name: watcherName },
      `Watcher added: ${watcherName}`
    );
  }

  /**
   * Log watcher removed
   */
  async logWatcherRemoved(ticketId, userId, watcherId, watcherName) {
    return this.logActivity(
      ticketId,
      userId,
      'WATCHER_REMOVED',
      { watcher_id: watcherId, watcher_name: watcherName },
      null,
      `Watcher removed: ${watcherName}`
    );
  }

  /**
   * Log relationship added
   */
  async logRelationshipAdded(ticketId, userId, relatedTicketId, relationshipType) {
    return this.logActivity(
      ticketId,
      userId,
      'RELATIONSHIP_ADDED',
      null,
      { related_ticket_id: relatedTicketId, relationship_type: relationshipType },
      `Relationship added: ${relationshipType}`
    );
  }

  /**
   * Log time logged
   */
  async logTimeLogged(ticketId, userId, hours, description) {
    return this.logActivity(
      ticketId,
      userId,
      'TIME_LOGGED',
      null,
      { hours, description },
      `Time logged: ${hours} hours`
    );
  }
}

export default new ActivityModel();
