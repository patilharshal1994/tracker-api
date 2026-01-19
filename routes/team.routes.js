import express from 'express';
import { body } from 'express-validator';
import {
  getTeams,
  getTeamById,
  createTeam,
  updateTeam,
  deleteTeam
} from '../controllers/team.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validation.middleware.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get all teams
router.get('/', getTeams);

// Get team by ID
router.get('/:id', getTeamById);

// Create team (admin only)
router.post(
  '/',
  authorize('ADMIN'),
  [body('name').trim().notEmpty().isLength({ min: 2, max: 255 })],
  validate,
  createTeam
);

// Update team (admin only)
router.put(
  '/:id',
  authorize('ADMIN'),
  [body('name').trim().notEmpty().isLength({ min: 2, max: 255 })],
  validate,
  updateTeam
);

// Delete team (admin only)
router.delete('/:id', authorize('ADMIN'), deleteTeam);

export default router;
