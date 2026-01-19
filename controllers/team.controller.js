import TeamService from '../src/services/TeamService.js';
import {
  createTeamValidation,
  updateTeamValidation,
  getTeamValidation,
  getTeamsValidation
} from '../src/validators/team.validator.js';

export const getTeams = async (req, res, next) => {
  try {
    const teams = await TeamService.getTeams(req.user, req.query);
    res.json(teams);
  } catch (error) {
    next(error);
  }
};

export const getTeamById = async (req, res, next) => {
  try {
    const team = await TeamService.getTeamById(req.user, req.params.id);
    res.json({ data: team });
  } catch (error) {
    next(error);
  }
};

export const createTeam = async (req, res, next) => {
  try {
    const team = await TeamService.createTeam(req.user, req.body);
    res.status(201).json({
      message: 'Team created successfully',
      data: team
    });
  } catch (error) {
    next(error);
  }
};

export const updateTeam = async (req, res, next) => {
  try {
    const team = await TeamService.updateTeam(req.user, req.params.id, req.body);
    res.json({
      message: 'Team updated successfully',
      data: team
    });
  } catch (error) {
    next(error);
  }
};

export const deleteTeam = async (req, res, next) => {
  try {
    await TeamService.deleteTeam(req.user, req.params.id);
    res.json({ message: 'Team deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export {
  createTeamValidation,
  updateTeamValidation,
  getTeamValidation,
  getTeamsValidation
};
