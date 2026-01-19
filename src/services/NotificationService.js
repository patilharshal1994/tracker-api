import NotificationModel from '../models/NotificationModel.js';
import { getPaginationParams, createPaginationMeta } from '../utils/pagination.js';

/**
 * Notification Service
 */
class NotificationService {
  /**
   * Create a new notification
   */
  async createNotification(notificationData) {
    return NotificationModel.create(notificationData);
  }

  /**
   * Get notifications for a user
   */
  async getUserNotifications(userId, query = {}) {
    const pagination = getPaginationParams(query);
    const filters = {};

    if (query.is_read !== undefined) {
      filters.is_read = query.is_read === 'true';
    }
    if (query.type) {
      filters.type = query.type;
    }

    const notifications = await NotificationModel.findByUserId(userId, filters, pagination);
    const total = await NotificationModel.count({ user_id: userId, ...filters });

    return {
      data: notifications,
      pagination: createPaginationMeta(total, pagination.page, pagination.limit)
    };
  }

  /**
   * Mark notification as read
   */
  async markAsRead(userId, notificationId) {
    const notification = await NotificationModel.findById(notificationId);
    if (!notification) {
      throw new Error('Notification not found');
    }
    if (notification.user_id !== userId) {
      throw new Error('Access denied');
    }
    return NotificationModel.markAsRead(notificationId);
  }

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(userId) {
    return NotificationModel.markAllAsRead(userId);
  }

  /**
   * Get unread count
   */
  async getUnreadCount(userId) {
    return NotificationModel.getUnreadCount(userId);
  }
}

export default new NotificationService();
