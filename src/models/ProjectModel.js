import { BaseModel } from './BaseModel.js';
import pool from '../../config/database.js';

/**
 * Project Model
 */
export class ProjectModel extends BaseModel {
  constructor() {
    super('projects');
  }

  /**
   * Get projects with role-based filtering
   */
  async findWithFilters(user, filters = {}, pagination = {}) {
    let query = `
      SELECT 
        p.*,
        u.name as creator_name,
        u.email as creator_email,
        t.name as team_name,
        o.name as organization_name,
        COUNT(DISTINCT pm.user_id) as member_count,
        COUNT(DISTINCT tk.id) as ticket_count
      FROM projects p
      INNER JOIN users u ON p.created_by = u.id
      LEFT JOIN teams t ON p.team_id = t.id
      LEFT JOIN organizations o ON p.organization_id = o.id
      LEFT JOIN project_members pm ON p.id = pm.project_id
      LEFT JOIN tickets tk ON p.id = tk.project_id
    `;
    const params = [];
    const conditions = [];

    // Role-based filtering
    if (user.role === 'ORG_ADMIN' && user.organization_id) {
      conditions.push('p.organization_id = ?');
      params.push(user.organization_id);
    } else if (user.role === 'TEAM_LEAD' && user.team_id) {
      conditions.push('(p.team_id = ? OR p.id IN (SELECT project_id FROM project_members WHERE user_id IN (SELECT id FROM users WHERE team_id = ?)))');
      params.push(user.team_id, user.team_id);
    } else if (user.role === 'USER') {
      conditions.push('(p.created_by = ? OR p.id IN (SELECT project_id FROM project_members WHERE user_id = ?))');
      params.push(user.id, user.id);
    }

    // Apply filters
    if (filters.organization_id) {
      conditions.push('p.organization_id = ?');
      params.push(filters.organization_id);
    }
    if (filters.team_id) {
      conditions.push('p.team_id = ?');
      params.push(filters.team_id);
    }
    if (filters.is_active !== undefined) {
      conditions.push('p.is_active = ?');
      params.push(filters.is_active);
    }
    if (filters.search) {
      conditions.push('(p.name LIKE ? OR p.description LIKE ?)');
      params.push(`%${filters.search}%`, `%${filters.search}%`);
    }

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(' AND ')}`;
    }

    query += ` GROUP BY p.id ORDER BY p.created_at DESC`;

    if (pagination.limit) {
      const offset = pagination.offset || 0;
      query += ` LIMIT ? OFFSET ?`;
      params.push(pagination.limit, offset);
    }

    const [rows] = await pool.query(query, params);
    return rows;
  }

  /**
   * Get project with members and details
   */
  async findByIdWithDetails(projectId) {
    const project = await this.findById(projectId);
    if (!project) return null;

    // Get members
    const membersQuery = `
      SELECT 
        u.id, u.name, u.email, u.role, u.is_active
      FROM project_members pm
      INNER JOIN users u ON pm.user_id = u.id
      WHERE pm.project_id = ?
      ORDER BY u.name
    `;
    const [members] = await pool.query(membersQuery, [projectId]);

    return {
      ...project,
      members
    };
  }
}

export default new ProjectModel();
