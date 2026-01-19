import ProjectService from '../src/services/ProjectService.js';
import {
  createProjectValidation,
  updateProjectValidation,
  getProjectValidation,
  getProjectsValidation
} from '../src/validators/project.validator.js';
import { uuidParamValidation } from '../src/validators/common.validator.js';
import { body } from 'express-validator';
import { validate } from '../src/validators/auth.validator.js';

export const getProjects = async (req, res, next) => {
  try {
    const projects = await ProjectService.getProjects(req.user, req.query);
    res.json(projects);
  } catch (error) {
    next(error);
  }
};

export const getProjectById = async (req, res, next) => {
  try {
    const project = await ProjectService.getProjectById(req.user, req.params.id);
    res.json({ data: project });
  } catch (error) {
    next(error);
  }
};

export const createProject = async (req, res, next) => {
  try {
    const project = await ProjectService.createProject(req.user, req.body);
    res.status(201).json({
      message: 'Project created successfully',
      data: project
    });
  } catch (error) {
    next(error);
  }
};

export const updateProject = async (req, res, next) => {
  try {
    const project = await ProjectService.updateProject(req.user, req.params.id, req.body);
    res.json({
      message: 'Project updated successfully',
      data: project
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProject = async (req, res, next) => {
  try {
    await ProjectService.deleteProject(req.user, req.params.id);
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const addMember = async (req, res, next) => {
  try {
    const member = await ProjectService.addMember(req.user, req.params.id, req.body.user_id);
    res.status(201).json({
      message: 'Member added successfully',
      data: member
    });
  } catch (error) {
    next(error);
  }
};

export const addMemberValidation = validate([
  uuidParamValidation('id'),
  body('user_id')
    .isUUID()
    .withMessage('Invalid user ID format')
]);

export const removeMember = async (req, res, next) => {
  try {
    await ProjectService.removeMember(req.user, req.params.id, req.params.userId);
    res.json({ message: 'Member removed successfully' });
  } catch (error) {
    next(error);
  }
};

export {
  createProjectValidation,
  updateProjectValidation,
  getProjectValidation,
  getProjectsValidation,
  addMemberValidation
};
