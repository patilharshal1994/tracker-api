import express from 'express';
import {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  addMember,
  removeMember,
  createProjectValidation,
  updateProjectValidation,
  getProjectValidation,
  getProjectsValidation
} from '../controllers/project.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { uuidParamValidation } from '../src/validators/common.validator.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get all projects
router.get('/', getProjectsValidation, getProjects);

// Get project by ID
router.get('/:id', getProjectValidation, getProjectById);

// Create project
router.post('/', createProjectValidation, createProject);

// Update project
router.put('/:id', updateProjectValidation, updateProject);

// Delete project
router.delete('/:id', getProjectValidation, deleteProject);

// Add member to project
router.post('/:id/members', getProjectValidation, addMember);

// Remove member from project
router.delete('/:id/members/:userId', getProjectValidation, uuidParamValidation('userId'), removeMember);

export default router;
