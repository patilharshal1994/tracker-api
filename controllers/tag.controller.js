import TagService from '../src/services/TagService.js';
import { uuidParamValidation, paginationValidation } from '../src/validators/common.validator.js';
import { body } from 'express-validator';
import { validate } from '../src/validators/auth.validator.js';

export const getTags = async (req, res, next) => {
  try {
    const result = await TagService.getTags(req.query);
    // Frontend expects response.data to be array
    res.json(result.data || result);
  } catch (error) {
    next(error);
  }
};

export const getTagById = async (req, res, next) => {
  try {
    const tag = await TagService.getTagById(req.params.id);
    res.json({ data: tag });
  } catch (error) {
    next(error);
  }
};

export const createTag = async (req, res, next) => {
  try {
    const tag = await TagService.createTag(req.body);
    res.status(201).json({
      message: 'Tag created successfully',
      data: tag
    });
  } catch (error) {
    next(error);
  }
};

export const updateTag = async (req, res, next) => {
  try {
    const tag = await TagService.updateTag(req.params.id, req.body);
    res.json({
      message: 'Tag updated successfully',
      data: tag
    });
  } catch (error) {
    next(error);
  }
};

export const deleteTag = async (req, res, next) => {
  try {
    await TagService.deleteTag(req.params.id);
    res.json({ message: 'Tag deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const createTagValidation = validate([
  body('name')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Name must be between 1 and 100 characters'),
  body('color')
    .optional()
    .matches(/^#[0-9A-F]{6}$/i)
    .withMessage('Color must be a valid hex color'),
  body('description')
    .optional()
    .trim()
]);

export const updateTagValidation = validate([
  uuidParamValidation('id'),
  body('name')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Name must be between 1 and 100 characters'),
  body('color')
    .optional()
    .matches(/^#[0-9A-F]{6}$/i)
    .withMessage('Color must be a valid hex color'),
  body('description')
    .optional()
    .trim()
]);

export {
  uuidParamValidation as getTagValidation,
  paginationValidation as getTagsValidation
};
