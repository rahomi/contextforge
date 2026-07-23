const knowledgeBaseService = require('../services/knowledgeBase.service');

/**
 * Wraps async route handlers to catch errors and pass to next().
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

/**
 * POST /api/v1/knowledge-base
 * Create a new knowledge document.
 */
const create = asyncHandler(async (req, res) => {
  const result = await knowledgeBaseService.create(req.user.id, req.body);

  res.status(201).json({
    data: result.data
  });
});

/**
 * GET /api/v1/knowledge-base
 * List the authenticated user's knowledge documents (paginated).
 * Supports filtering by: category, status, tag, search
 */
const list = asyncHandler(async (req, res) => {
  const result = await knowledgeBaseService.list(req.user.id, req.query);

  res.status(200).json({
    data: result.data,
    pagination: result.pagination
  });
});

/**
 * GET /api/v1/knowledge-base/search
 * Search documents with full-text search.
 */
const search = asyncHandler(async (req, res) => {
  const result = await knowledgeBaseService.search(req.user.id, req.query);

  res.status(200).json({
    data: result.data,
    pagination: result.pagination
  });
});

/**
 * GET /api/v1/knowledge-base/:id
 * Get a single knowledge document with tags.
 */
const getById = asyncHandler(async (req, res) => {
  const result = await knowledgeBaseService.getById(req.user.id, req.params.id);

  res.status(200).json({
    data: result.data
  });
});

/**
 * PUT /api/v1/knowledge-base/:id
 * Update a knowledge document.
 */
const update = asyncHandler(async (req, res) => {
  const result = await knowledgeBaseService.update(req.user.id, req.params.id, req.body);

  res.status(200).json({
    data: result.data
  });
});

/**
 * DELETE /api/v1/knowledge-base/:id
 * Soft-delete (archive) a knowledge document.
 */
const remove = asyncHandler(async (req, res) => {
  const result = await knowledgeBaseService.remove(req.user.id, req.params.id);

  res.status(200).json({
    data: result.data
  });
});

/**
 * GET /api/v1/knowledge-base/:id/versions
 * List all versions of a document.
 */
const listVersions = asyncHandler(async (req, res) => {
  const result = await knowledgeBaseService.listVersions(req.user.id, req.params.id, req.query);

  res.status(200).json({
    data: result.data,
    pagination: result.pagination
  });
});

/**
 * GET /api/v1/knowledge-base/:id/versions/:versionId
 * Get a specific version of a document.
 */
const getVersion = asyncHandler(async (req, res) => {
  const result = await knowledgeBaseService.getVersion(req.user.id, req.params.id, req.params.versionId);

  res.status(200).json({
    data: result.data
  });
});

/**
 * GET /api/v1/knowledge-base/tags
 * List all tags (with optional search).
 */
const listTags = asyncHandler(async (req, res) => {
  const result = await knowledgeBaseService.listTags(req.query);

  res.status(200).json({
    data: result.data,
    pagination: result.pagination
  });
});

/**
 * POST /api/v1/knowledge-base/tags
 * Create a new tag.
 */
const createTag = asyncHandler(async (req, res) => {
  const result = await knowledgeBaseService.createTag(req.body);

  res.status(201).json({
    data: result.data
  });
});

/**
 * PUT /api/v1/knowledge-base/tags/:tagId
 * Update a tag.
 */
const updateTag = asyncHandler(async (req, res) => {
  const result = await knowledgeBaseService.updateTag(req.params.tagId, req.body);

  res.status(200).json({
    data: result.data
  });
});

/**
 * DELETE /api/v1/knowledge-base/tags/:tagId
 * Delete a tag.
 */
const removeTag = asyncHandler(async (req, res) => {
  const result = await knowledgeBaseService.removeTag(req.params.tagId);

  res.status(200).json({
    data: result.data
  });
});

module.exports = {
  create,
  list,
  search,
  getById,
  update,
  remove,
  listVersions,
  getVersion,
  listTags,
  createTag,
  updateTag,
  removeTag
};