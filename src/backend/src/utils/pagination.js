/**
 * Pagination utility for list endpoints.
 * Provides consistent pagination throughout the API.
 */

/**
 * Extracts pagination parameters from query string.
 * Defaults: page=1, limit=20. Maximum limit: 100.
 *
 * @param {object} query - Express query object (req.query)
 * @returns {{ page: number, limit: number, offset: number }}
 */
function getPagination(query) {
  let page = parseInt(query.page, 10) || 1;
  let limit = parseInt(query.limit, 10) || 20;

  if (page < 1) page = 1;
  if (limit < 1) limit = 1;
  if (limit > 100) limit = 100;

  const offset = (page - 1) * limit;

  return { page, limit, offset };
}

/**
 * Builds pagination metadata from count and pagination params.
 *
 * @param {number} count - Total number of records
 * @param {number} page - Current page number
 * @param {number} limit - Items per page
 * @returns {{ page: number, limit: number, total: number, totalPages: number }}
 */
function getPaginationMeta(count, page, limit) {
  const totalPages = Math.ceil(count / limit) || 0;

  return {
    page,
    limit,
    total: count,
    totalPages
  };
}

module.exports = { getPagination, getPaginationMeta };