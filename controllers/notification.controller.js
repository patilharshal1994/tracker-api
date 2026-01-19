import NotificationService from '../src/services/NotificationService.js';
import { uuidParamValidation, paginationValidation } from '../src/validators/common.validator.js';
import { body } from 'express-validator';
import { validate } from '../src/validators/auth.validator.js';

export const getNotifications = async (req, res, next) => {
  try {
    const notifications = await NotificationService.getUserNotifications(req.user.id, req.query);
    res.json(notifications);
  } catch (error) {
    next(error);
  }
};

export const markAsRead = async (req, res, next) => {
  try {
    await NotificationService.markAsRead(req.user.id, req.params.id);
    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    next(error);
  }
};

export const markAllAsRead = async (req, res, next) => {
  try {
    await NotificationService.markAllAsRead(req.user.id);
    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    next(error);
  }
};

export const getUnreadCount = async (req, res, next) => {
  try {
    const count = await NotificationService.getUnreadCount(req.user.id);
    res.json({ count });
  } catch (error) {
    next(error);
  }
};

export {
  uuidParamValidation as getNotificationValidation,
  paginationValidation as getNotificationsValidation
};
