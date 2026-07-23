const repositoryService = require('../services/repository.service');

/**
 * Wraps async route handlers to catch errors and pass to next().
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

/**
 * POST /api/v1/repositories
 * Register a new repository for the authenticated user.
 */
const create = asyncHandler(async (req, res) => {
  const result = await repositoryService.create(req.user.id, req.body);

  res.status(201).json({
    data: result.data
  });
});

/**
 * GET /api/v1/repositories
 * List the authenticated user's repositories (paginated).
 */
const list = asyncHandler(async (req, res) => {
  const result = await repositoryService.list(req.user.id, req.query);

  res.status(200).json({
    data: result.data,
    pagination: result.pagination
  });
});

/**
 * GET /api/v1/repositories/:id
 * Get a single repository with its latest analysis.
 */
const getById = asyncHandler(async (req, res) => {
  const result = await repositoryService.getById(req.user.id, req.params.id);

  res.status(200).json({
    data: result.data
  });
});

/**
 * PUT /api/v1/repositories/:id
 * Update repository fields.
 */
const update = asyncHandler(async (req, res) => {
  const result = await repositoryService.update(req.user.id, req.params.id, req.body);

  res.status(200).json({
    data: result.data
  });
});

/**
 * DELETE /api/v1/repositories/:id
 * Soft-delete a repository (set is_active = false).
 */
const remove = asyncHandler(async (req, res) => {
  const result = await repositoryService.remove(req.user.id, req.params.id);

  res.status(200).json({
    data: result.data
  });
});

/**
 * POST /api/v1/repositories/:id/analyze
 * Trigger a new analysis for a repository.
 */
const triggerAnalysis = asyncHandler(async (req, res) => {
  const result = await repositoryService.triggerAnalysis(req.user.id, req.params.id, req.body.analysis_type);

  res.status(201).json({
    data: result.data
  });
});

/**
 * GET /api/v1/repositories/:id/analyses
 * List all analyses for a repository (paginated, newest first).
 */
const listAnalyses = asyncHandler(async (req, res) => {
  const result = await repositoryService.listAnalyses(req.user.id, req.params.id, req.query);

  res.status(200).json({
    data: result.data,
    pagination: result.pagination
  });
});

/**
 * GET /api/v1/repositories/:id/analyses/:analysisId
 * Get a single analysis with full results.
 */
const getAnalysisById = asyncHandler(async (req, res) => {
  const result = await repositoryService.getAnalysisById(req.user.id, req.params.id, req.params.analysisId);

  res.status(200).json({
    data: result.data
  });
});

/**
 * GET /api/v1/repositories/:id/metrics
 * Get metrics for a repository with optional metric_type filter.
 */
const getMetrics = asyncHandler(async (req, res) => {
  const result = await repositoryService.getMetrics(req.user.id, req.params.id, req.query);

  res.status(200).json({
    data: result.data
  });
});

/**
 * GET /api/v1/repositories/:id/stats
 * Get aggregated stats for a repository.
 */
const getStats = asyncHandler(async (req, res) => {
  const result = await repositoryService.getStats(req.user.id, req.params.id);

  res.status(200).json({
    data: result.data
  });
});

module.exports = {
  create,
  list,
  getById,
  update,
  remove,
  triggerAnalysis,
  listAnalyses,
  getAnalysisById,
  getMetrics,
  getStats
};