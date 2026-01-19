import { BaseModel } from './BaseModel.js';
import pool from '../../config/database.js';

/**
 * Team Model
 */
export class TeamModel extends BaseModel {
  constructor() {
    super('teams');
  }

  /**
   * Get teams with organization info and role-based filtering
   */
  async findWithDetails(user, filters = {}, pagination = {}) {
    let query = `
      SELECT 
        t.*,
        o.name as organization_name,
        COUNT(DISTINCT u.id) as member_count
      FROM teams t
      LEFT JOIN organizations o ON t.organization_id = o.id
      LEFT JOIN users u ON u.team_id = t.id
    `;
    const params = [];
    const conditions = [];

    // Apply role-based filtering
    if (user.role === 'ORG_ADMIN' && user.organization_id) {
      conditions.push('t.organization_id = ?');
      params.push(user.organization_id);
    }

    // Apply additional filters
    if (filters.organization_id) {
      conditions.push('t.organization_id = ?');
      params.push(filters.organization_id);
    }
    if (filters.search) {
      conditions.push('t.name LIKE ?');
      params.push(`%${filters.search}%`);
    }

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(' AND ')}`;
    }

    query += ` GROUP BY t.id ORDER BY t.created_at DESC`;

    // Apply pagination
    if (pagination.limit) {
      const offset = pagination.offset || 0;
      query += ` LIMIT ? OFFSET ?`;
      params.push(pagination.limit, offset);
    }

    const [rows] = await pool.query(query, params);
    return rows;
  }

  /**
   * Find team by name and organization_id
   */
  async findByNameAndOrganization(name, organizationId) {
    const query = `SELECT * FROM ${this.tableName} WHERE name = ? AND organization_id = ?`;
    const [rows] = await pool.query(query, [name, organizationId]);
    return rows.length > 0 ? rows[0] : null;
  }

  /**
   * Get team with members
   */
  async findByIdWithMembers(teamId) {
    const team = await this.findById(teamId);
    if (!team) return null;

    const membersQuery = `
      SELECT 
        u.id, u.name, u.email, u.role, u.is_active
      FROM users u
      WHERE u.team_id = ?
      ORDER BY u.name
    `;
    const [members] = await pool.query(membersQuery, [teamId]);

    return {
      ...team,
      members
    };
  }
}

export default new TeamModel();
