import express from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import { getTicketActivities } from '../controllers/activity.controller.js';

const router = express.Router();

router.use(authenticate);

router.get('/tickets/:ticketId', getTicketActivities);

export default router;
