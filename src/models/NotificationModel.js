import { BaseModel } from './BaseModel.js';
import pool from '../../config/database.js';

/**
 * Notification Model
 */
export class NotificationModel extends BaseModel {
  constructor() {
    super('notifications');
  }

  /**
   * Get notifications for a user
   */
  async findByUserId(userId, filters = {}, pagination = {}) {
    let query = `
      SELECT * FROM notifications
      WHERE user_id = ?
    `;
    const params = [userId];
    const conditions = [];

    if (filters.is_read !== undefined) {
      conditions.push('is_read = ?');
      params.push(filters.is_read);
    }
    if (filters.type) {
      conditions.push('type = ?');
      params.push(filters.type);
    }

    if (conditions.length > 0) {
      query += ` AND ${conditions.join(' AND ')}`;
    }

    query += ` ORDER BY created_at DESC`;

    if (pagination.limit) {
      const offset = pagination.offset || 0;
      query += ` LIMIT ? OFFSET ?`;
      params.push(pagination.limit, offset);
    }

    const [rows] = await pool.query(query, params);
    return rows;
  }

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId) {
    const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
    return this.update(notificationId, { is_read: true, read_at: timestamp });
  }

  /**
   * Mark all notifications as read for a user
   */
  async markAllAsRead(userId) {
    const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const query = `
      UPDATE notifications 
      SET is_read = true, read_at = ?
      WHERE user_id = ? AND is_read = false
    `;
    const [result] = await pool.query(query, [timestamp, userId]);
    return result.affectedRows;
  }

  /**
   * Get unread count for a user
   */
  async getUnreadCount(userId) {
    return this.count({ user_id: userId, is_read: false });
  }
}

export default new NotificationModel();
