import express from 'express';
import { body } from 'express-validator';
import {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  addProjectMember,
  removeProjectMember
} from '../controllers/project.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validation.middleware.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get all projects (filtered by user role)
router.get('/', getProjects);

// Get project by ID
router.get('/:id', getProjectById);

// Create project (admin only)
router.post(
  '/',
  authorize('ADMIN'),
  [
    body('name').trim().notEmpty().isLength({ min: 2, max: 255 }),
    body('description').trim().optional(),
    body('team_id').isInt().optional({ nullable: true })
  ],
  validate,
  createProject
);

// Update project
router.put(
  '/:id',
  [
    body('name').trim().isLength({ min: 2, max: 255 }).optional(),
    body('description').trim().optional(),
    body('team_id').isInt().optional({ nullable: true })
  ],
  validate,
  updateProject
);

// Delete project (admin only)
router.delete('/:id', authorize('ADMIN'), deleteProject);

// Add project member
router.post(
  '/:id/members',
  [body('user_id').isInt()],
  validate,
  addProjectMember
);

// Remove project member
router.delete('/:id/members/:userId', removeProjectMember);

export default router;
