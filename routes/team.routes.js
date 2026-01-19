import express from 'express';
import {
  getTeams,
  getTeamById,
  createTeam,
  updateTeam,
  deleteTeam,
  createTeamValidation,
  updateTeamValidation,
  getTeamValidation,
  getTeamsValidation
} from '../controllers/team.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get all teams
router.get('/', getTeamsValidation, getTeams);

// Get team by ID
router.get('/:id', getTeamValidation, getTeamById);

// Create team
router.post('/', createTeamValidation, createTeam);

// Update team
router.put('/:id', updateTeamValidation, updateTeam);

// Delete team
router.delete('/:id', getTeamValidation, deleteTeam);

export default router;
