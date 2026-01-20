import TemplateService from '../src/services/TemplateService.js';
import {
  createTemplateValidation,
  updateTemplateValidation,
  getTemplateValidation,
  getTemplatesValidation
} from '../src/validators/template.validator.js';

export const getTemplates = async (req, res, next) => {
  try {
    const result = await TemplateService.getTemplates(req.user, req.query);
    // Return consistent format: { data: [...], pagination: {...} }
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const getTemplateById = async (req, res, next) => {
  try {
    const template = await TemplateService.getTemplateById(req.user, req.params.id);
    res.json({ data: template });
  } catch (error) {
    next(error);
  }
};

export const createTemplate = async (req, res, next) => {
  try {
    const template = await TemplateService.createTemplate(req.user, req.body);
    res.status(201).json({
      message: 'Template created successfully',
      data: template
    });
  } catch (error) {
    next(error);
  }
};

export const updateTemplate = async (req, res, next) => {
  try {
    const template = await TemplateService.updateTemplate(req.user, req.params.id, req.body);
    res.json({
      message: 'Template updated successfully',
      data: template
    });
  } catch (error) {
    next(error);
  }
};

export const deleteTemplate = async (req, res, next) => {
  try {
    await TemplateService.deleteTemplate(req.user, req.params.id);
    res.json({ message: 'Template deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export {
  createTemplateValidation,
  updateTemplateValidation,
  getTemplateValidation,
  getTemplatesValidation
};
