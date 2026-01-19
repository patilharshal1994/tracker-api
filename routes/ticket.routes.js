import express from 'express';
import {
  getTickets,
  getTicketById,
  createTicket,
  updateTicket,
  deleteTicket,
  addComment,
  addTag,
  removeTag,
  addWatcher,
  removeWatcher,
  addRelationship,
  logTime,
  createTicketValidation,
  updateTicketValidation,
  getTicketValidation,
  getTicketsValidation,
  addCommentValidation,
  addTagValidation,
  addWatcherValidation,
  addRelationshipValidation,
  logTimeValidation
} from '../controllers/ticket.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { uuidParamValidation } from '../src/validators/common.validator.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

/**
 * @swagger
 * /api/tickets:
 *   get:
 *     summary: Get all tickets with filtering and pagination
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [CREATED, IN_PROGRESS, DEPENDENCY, HOLD, SOLVED, CLOSED]
 *       - in: query
 *         name: priority
 *         schema:
 *           type: string
 *           enum: [LOW, MEDIUM, HIGH, URGENT]
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [TASK, BUG, ISSUE, SUGGESTION]
 *       - in: query
 *         name: project_id
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: assignee_id
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: assigned_to_me
 *         schema:
 *           type: boolean
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of tickets
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Ticket'
 *   post:
 *     summary: Create a new ticket
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - project_id
 *               - title
 *             properties:
 *               project_id:
 *                 type: string
 *                 format: uuid
 *               type:
 *                 type: string
 *                 enum: [TASK, BUG, ISSUE, SUGGESTION]
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               module:
 *                 type: string
 *               assignee_id:
 *                 type: string
 *                 format: uuid
 *               priority:
 *                 type: string
 *                 enum: [LOW, MEDIUM, HIGH, URGENT]
 *               mentioned_users:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: uuid
 *     responses:
 *       201:
 *         description: Ticket created successfully
 */
router.get('/', getTicketsValidation, getTickets);

/**
 * @swagger
 * /api/tickets/{id}:
 *   get:
 *     summary: Get ticket by ID with all details
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Ticket details with comments, watchers, activities, relationships
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Ticket'
 *       404:
 *         description: Ticket not found
 *   put:
 *     summary: Update ticket
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [CREATED, IN_PROGRESS, DEPENDENCY, HOLD, SOLVED, CLOSED]
 *               priority:
 *                 type: string
 *                 enum: [LOW, MEDIUM, HIGH, URGENT]
 *               assignee_id:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       200:
 *         description: Ticket updated successfully
 *   delete:
 *     summary: Delete ticket
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Ticket deleted successfully
 */
router.get('/:id', getTicketValidation, getTicketById);
router.post('/', createTicketValidation, createTicket);
router.put('/:id', updateTicketValidation, updateTicket);
router.delete('/:id', getTicketValidation, deleteTicket);

/**
 * @swagger
 * /api/tickets/{id}/comments:
 *   post:
 *     summary: Add comment to ticket
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - comment_text
 *             properties:
 *               comment_text:
 *                 type: string
 *     responses:
 *       201:
 *         description: Comment added successfully
 */
router.post('/:id/comments', addCommentValidation, addComment);

/**
 * @swagger
 * /api/tickets/{id}/tags:
 *   post:
 *     summary: Add tag to ticket
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - tag_id
 *             properties:
 *               tag_id:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       200:
 *         description: Tag added successfully
 */
router.post('/:id/tags', addTagValidation, addTag);

/**
 * @swagger
 * /api/tickets/{id}/tags/{tagId}:
 *   delete:
 *     summary: Remove tag from ticket
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: path
 *         name: tagId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Tag removed successfully
 */
router.delete('/:id/tags/:tagId', getTicketValidation, uuidParamValidation('tagId'), removeTag);

/**
 * @swagger
 * /api/tickets/{id}/watchers:
 *   post:
 *     summary: Add watcher to ticket
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *             properties:
 *               user_id:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       200:
 *         description: Watcher added successfully
 */
router.post('/:id/watchers', addWatcherValidation, addWatcher);

/**
 * @swagger
 * /api/tickets/{id}/watchers/{userId}:
 *   delete:
 *     summary: Remove watcher from ticket
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Watcher removed successfully
 */
router.delete('/:id/watchers/:userId', getTicketValidation, uuidParamValidation('userId'), removeWatcher);

/**
 * @swagger
 * /api/tickets/{id}/relationships:
 *   post:
 *     summary: Add relationship between tickets
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - related_ticket_id
 *               - relationship_type
 *             properties:
 *               related_ticket_id:
 *                 type: string
 *                 format: uuid
 *               relationship_type:
 *                 type: string
 *                 enum: [BLOCKS, BLOCKED_BY, DUPLICATE, RELATES_TO, PARENT, CHILD]
 *     responses:
 *       200:
 *         description: Relationship added successfully
 */
router.post('/:id/relationships', addRelationshipValidation, addRelationship);

/**
 * @swagger
 * /api/tickets/{id}/time-logs:
 *   post:
 *     summary: Log time for ticket
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - hours
 *             properties:
 *               hours:
 *                 type: number
 *                 format: float
 *               description:
 *                 type: string
 *               logged_date:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Time logged successfully
 */
router.post('/:id/time-logs', logTimeValidation, logTime);

export default router;
