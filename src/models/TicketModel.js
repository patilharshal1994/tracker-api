import { BaseModel } from './BaseModel.js';
import pool from '../../config/database.js';

/**
 * Ticket Model
 */
export class TicketModel extends BaseModel {
  constructor() {
    super('tickets');
  }

  /**
   * Get tickets with filters and role-based access
   */
  async findWithFilters(user, filters = {}, pagination = {}) {
    let query = `
      SELECT 
        t.*,
        p.name as project_name,
        p.id as project_id,
        r.name as reporter_name,
        r.email as reporter_email,
        a.name as assignee_name,
        a.email as assignee_email
      FROM tickets t
      INNER JOIN projects p ON t.project_id = p.id
      INNER JOIN users r ON t.reporter_id = r.id
      LEFT JOIN users a ON t.assignee_id = a.id
    `;
    const params = [];
    const conditions = [];

    // Role-based filtering
    if (user.role === 'ORG_ADMIN' && user.organization_id) {
      conditions.push('p.organization_id = ?');
      params.push(user.organization_id);
    } else if (user.role === 'TEAM_LEAD' && user.team_id) {
      conditions.push('(p.team_id = ? OR t.assignee_id IN (SELECT id FROM users WHERE team_id = ?))');
      params.push(user.team_id, user.team_id);
    } else if (user.role === 'USER') {
      conditions.push('(t.reporter_id = ? OR t.assignee_id = ?)');
      params.push(user.id, user.id);
    }

    // Apply filters
    if (filters.project_id) {
      conditions.push('t.project_id = ?');
      params.push(filters.project_id);
    }
    if (filters.status) {
      conditions.push('t.status = ?');
      params.push(filters.status);
    }
    if (filters.priority) {
      conditions.push('t.priority = ?');
      params.push(filters.priority);
    }
    if (filters.type) {
      conditions.push('t.type = ?');
      params.push(filters.type);
    }
    if (filters.module) {
      conditions.push('t.module = ?');
      params.push(filters.module);
    }
    if (filters.assignee_id) {
      conditions.push('t.assignee_id = ?');
      params.push(filters.assignee_id);
    }
    if (filters.reporter_id) {
      conditions.push('t.reporter_id = ?');
      params.push(filters.reporter_id);
    }
    if (filters.is_breached !== undefined) {
      conditions.push('t.is_breached = ?');
      params.push(filters.is_breached);
    }
    if (filters.search) {
      conditions.push('(t.title LIKE ? OR t.description LIKE ?)');
      params.push(`%${filters.search}%`, `%${filters.search}%`);
    }

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(' AND ')}`;
    }

    query += ` ORDER BY t.created_at DESC`;

    if (pagination.limit) {
      const offset = pagination.offset || 0;
      query += ` LIMIT ? OFFSET ?`;
      params.push(pagination.limit, offset);
    }

    const [rows] = await pool.query(query, params);
    return rows;
  }

  /**
   * Get ticket by ID with all related data
   */
  async findByIdWithDetails(ticketId) {
    const query = `
      SELECT 
        t.*,
        p.name as project_name,
        p.description as project_description,
        p.organization_id as project_organization_id,
        r.name as reporter_name,
        r.email as reporter_email,
        r.role as reporter_role,
        a.name as assignee_name,
        a.email as assignee_email,
        a.role as assignee_role
      FROM tickets t
      INNER JOIN projects p ON t.project_id = p.id
      INNER JOIN users r ON t.reporter_id = r.id
      LEFT JOIN users a ON t.assignee_id = a.id
      WHERE t.id = ?
    `;
    const [rows] = await pool.query(query, [ticketId]);
    return rows[0] || null;
  }

  /**
   * Count tickets with filters
   */
  async countWithFilters(user, filters = {}) {
    let query = `
      SELECT COUNT(*) as total 
      FROM tickets t
      INNER JOIN projects p ON t.project_id = p.id
    `;
    const params = [];
    const conditions = [];

    // Role-based filtering
    if (user.role === 'ORG_ADMIN' && user.organization_id) {
      conditions.push('p.organization_id = ?');
      params.push(user.organization_id);
    } else if (user.role === 'TEAM_LEAD' && user.team_id) {
      conditions.push('(p.team_id = ? OR t.assignee_id IN (SELECT id FROM users WHERE team_id = ?))');
      params.push(user.team_id, user.team_id);
    } else if (user.role === 'USER') {
      conditions.push('(t.reporter_id = ? OR t.assignee_id = ?)');
      params.push(user.id, user.id);
    }

    // Apply filters
    Object.keys(filters).forEach((key) => {
      if (filters[key] !== undefined && filters[key] !== null && key !== 'search') {
        conditions.push(`t.${key} = ?`);
        params.push(filters[key]);
      }
    });

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(' AND ')}`;
    }

    const [rows] = await pool.query(query, params);
    return rows[0].total;
  }
}

export default new TicketModel();
