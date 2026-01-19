import express from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  getUnreadCount,
  getNotificationsValidation,
  getNotificationValidation
} from '../controllers/notification.controller.js';

const router = express.Router();

router.use(authenticate);

// Get all notifications for current user
router.get('/', getNotificationsValidation, getNotifications);

// Get unread count
router.get('/unread-count', getUnreadCount);

// Mark notification as read
router.put('/:id/read', getNotificationValidation, markAsRead);

// Mark all notifications as read
router.put('/read-all', markAllAsRead);

export default router;
