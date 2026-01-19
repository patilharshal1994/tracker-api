import TeamModel from '../models/TeamModel.js';
import OrganizationModel from '../models/OrganizationModel.js';
import { getPaginationParams, createPaginationMeta } from '../utils/pagination.js';
import { ROLES } from '../utils/roleHierarchy.js';

/**
 * Team Service
 */
class TeamService {
  /**
   * Get all teams with filtering
   */
  async getTeams(currentUser, query = {}) {
    const pagination = getPaginationParams(query);
    const filters = {};

    if (query.organization_id) {
      filters.organization_id = query.organization_id;
    }
    if (query.search) {
      filters.search = query.search;
    }

    const teams = await TeamModel.findWithDetails(currentUser, filters, pagination);
    const total = await TeamModel.count(filters);

    // Frontend expects array directly
    return teams;
  }

  /**
   * Get team by ID with members
   */
  async getTeamById(currentUser, teamId) {
    const team = await TeamModel.findByIdWithMembers(teamId);
    if (!team) {
      throw new Error('Team not found');
    }

    // Check access permissions
    if (currentUser.role === 'ORG_ADMIN' && team.organization_id !== currentUser.organization_id) {
      throw new Error('Access denied');
    }

    return team;
  }

  /**
   * Create team
   */
  async createTeam(currentUser, teamData) {
    // Only Super Admin and Org Admin can create teams
    if (currentUser.role !== ROLES.SUPER_ADMIN && currentUser.role !== ROLES.ORG_ADMIN) {
      throw new Error('Access denied');
    }

    // Set organization_id for Org Admin
    if (currentUser.role === ROLES.ORG_ADMIN) {
      teamData.organization_id = currentUser.organization_id;
    }

    // Validate organization exists (if provided)
    if (teamData.organization_id && currentUser.role === ROLES.SUPER_ADMIN) {
      const org = await OrganizationModel.findById(teamData.organization_id);
      if (!org) {
        throw new Error('Organization not found');
      }
    }

    return TeamModel.create(teamData);
  }

  /**
   * Update team
   */
  async updateTeam(currentUser, teamId, updateData) {
    const team = await TeamModel.findById(teamId);
    if (!team) {
      throw new Error('Team not found');
    }

    // Check access permissions
    if (currentUser.role === 'ORG_ADMIN' && team.organization_id !== currentUser.organization_id) {
      throw new Error('Access denied');
    }

    // Org Admin cannot change organization
    if (currentUser.role === ROLES.ORG_ADMIN && updateData.organization_id) {
      delete updateData.organization_id;
    }

    return TeamModel.update(teamId, updateData);
  }

  /**
   * Delete team
   */
  async deleteTeam(currentUser, teamId) {
    const team = await TeamModel.findById(teamId);
    if (!team) {
      throw new Error('Team not found');
    }

    // Only Super Admin and Org Admin can delete teams
    if (currentUser.role !== ROLES.SUPER_ADMIN && currentUser.role !== ROLES.ORG_ADMIN) {
      throw new Error('Access denied');
    }

    // Org Admin can only delete teams in their organization
    if (currentUser.role === ROLES.ORG_ADMIN && team.organization_id !== currentUser.organization_id) {
      throw new Error('Access denied');
    }

    const deleted = await TeamModel.delete(teamId);
    if (!deleted) {
      throw new Error('Failed to delete team');
    }

    return { success: true };
  }
}

export default new TeamService();
