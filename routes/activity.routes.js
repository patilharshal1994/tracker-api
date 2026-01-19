import express from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import {
  getTicketActivities,
  getTicketActivitiesValidation
} from '../controllers/activity.controller.js';

const router = express.Router();

router.use(authenticate);

// Get activities for a ticket
router.get('/tickets/:ticketId', getTicketActivitiesValidation, getTicketActivities);

export default router;
