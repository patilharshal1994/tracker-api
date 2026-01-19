import express from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import {
  getTicketActivities,
  getTicketActivitiesValidation
} from '../controllers/activity.controller.js';

const router = express.Router();

router.use(authenticate);

/**
 * @swagger
 * /api/activities/tickets/{ticketId}:
 *   get:
 *     summary: Get activities for a ticket
 *     tags: [Activities]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: ticketId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Ticket ID
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Items per page
 *     responses:
 *       200:
 *         description: List of ticket activities
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Activity'
 *       404:
 *         description: Ticket not found
 *       403:
 *         description: Access denied
 */
router.get('/tickets/:ticketId', getTicketActivitiesValidation, getTicketActivities);

export default router;
