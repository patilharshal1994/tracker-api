import pool from '../../config/database.js';
import { generateUUID } from '../utils/uuid.js';

/**
 * Base Model class with common database operations
 */
export class BaseModel {
  constructor(tableName, primaryKey = 'id') {
    this.tableName = tableName;
    this.primaryKey = primaryKey;
  }

  /**
   * Generate UUID for new record
   */
  generateId() {
    return generateUUID();
  }

  /**
   * Find all records with optional filters and pagination
   */
  async findAll(filters = {}, pagination = {}) {
    let query = `SELECT * FROM ${this.tableName}`;
    const params = [];
    const conditions = [];

    // Apply filters
    Object.keys(filters).forEach((key) => {
      if (filters[key] !== undefined && filters[key] !== null) {
        conditions.push(`${key} = ?`);
        params.push(filters[key]);
      }
    });

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(' AND ')}`;
    }

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
   * Find one record by primary key
   */
  async findById(id) {
    const query = `SELECT * FROM ${this.tableName} WHERE ${this.primaryKey} = ?`;
    const [rows] = await pool.query(query, [id]);
    return rows[0] || null;
  }

  /**
   * Find one record by criteria
   */
  async findOne(filters) {
    const rows = await this.findAll(filters, { limit: 1 });
    return rows[0] || null;
  }

  /**
   * Create a new record
   */
  async create(data) {
    const id = this.generateId();
    const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
    
    const record = {
      [this.primaryKey]: id,
      ...data,
      created_at: timestamp,
      updated_at: timestamp
    };

    const columns = Object.keys(record).join(', ');
    const placeholders = Object.keys(record).map(() => '?').join(', ');
    const values = Object.values(record);

    const query = `INSERT INTO ${this.tableName} (${columns}) VALUES (${placeholders})`;
    await pool.query(query, values);
    
    return this.findById(id);
  }

  /**
   * Update a record by primary key
   */
  async update(id, data) {
    const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
    
    const updateData = {
      ...data,
      updated_at: timestamp
    };

    const setClause = Object.keys(updateData).map(key => `${key} = ?`).join(', ');
    const values = [...Object.values(updateData), id];

    const query = `UPDATE ${this.tableName} SET ${setClause} WHERE ${this.primaryKey} = ?`;
    const [result] = await pool.query(query, values);
    
    if (result.affectedRows === 0) {
      return null;
    }

    return this.findById(id);
  }

  /**
   * Delete a record by primary key
   */
  async delete(id) {
    const query = `DELETE FROM ${this.tableName} WHERE ${this.primaryKey} = ?`;
    const [result] = await pool.query(query, [id]);
    return result.affectedRows > 0;
  }

  /**
   * Count records with optional filters
   */
  async count(filters = {}) {
    let query = `SELECT COUNT(*) as total FROM ${this.tableName}`;
    const params = [];
    const conditions = [];

    Object.keys(filters).forEach((key) => {
      if (filters[key] !== undefined && filters[key] !== null) {
        conditions.push(`${key} = ?`);
        params.push(filters[key]);
      }
    });

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(' AND ')}`;
    }

    const [rows] = await pool.query(query, params);
    return rows[0].total;
  }

  /**
   * Execute custom query
   */
  async query(sql, params = []) {
    const [rows] = await pool.query(sql, params);
    return rows;
  }
}
