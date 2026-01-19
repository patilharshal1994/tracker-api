import pool from '../../config/database.js';

/**
 * Build WHERE clause for role-based filtering
 * @param {Object} user - Current user object
 * @returns {Object} WHERE clause conditions
 */
export const buildRoleBasedFilter = (user) => {
  const conditions = [];
  const params = [];

  if (user.role === 'ORG_ADMIN') {
    conditions.push('u.organization_id = ?');
    params.push(user.organization_id);
  } else if (user.role === 'TEAM_LEAD') {
    conditions.push('u.team_id = ?');
    params.push(user.team_id);
  }

  return {
    where: conditions.length > 0 ? conditions.join(' AND ') : null,
    params
  };
};

/**
 * Build search query for full-text search
 * @param {string} searchTerm - Search term
 * @param {Array} searchFields - Fields to search in
 * @returns {Object} Search conditions
 */
export const buildSearchQuery = (searchTerm, searchFields = []) => {
  if (!searchTerm || !searchFields.length) {
    return { where: null, params: [] };
  }

  const conditions = searchFields.map(field => `${field} LIKE ?`);
  const params = searchFields.map(() => `%${searchTerm}%`);

  return {
    where: `(${conditions.join(' OR ')})`,
    params
  };
};

/**
 * Execute paginated query
 * @param {string} baseQuery - Base SQL query
 * @param {Array} baseParams - Base query parameters
 * @param {Object} pagination - Pagination parameters { page, limit, offset }
 * @param {string} countQuery - Count query (optional)
 * @returns {Promise<Object>} Paginated results
 */
export const executePaginatedQuery = async (baseQuery, baseParams = [], pagination, countQuery = null) => {
  // Get total count
  const totalCountQuery = countQuery || `SELECT COUNT(*) as total FROM (${baseQuery}) as count_table`;
  const [countResult] = await pool.query(totalCountQuery, baseParams);
  const total = countResult[0]?.total || 0;

  // Get paginated data
  const paginatedQuery = `${baseQuery} LIMIT ? OFFSET ?`;
  const paginatedParams = [...baseParams, pagination.limit, pagination.offset];
  const [data] = await pool.query(paginatedQuery, paginatedParams);

  return {
    data,
    total,
    page: pagination.page,
    limit: pagination.limit,
    totalPages: Math.ceil(total / pagination.limit)
  };
};
