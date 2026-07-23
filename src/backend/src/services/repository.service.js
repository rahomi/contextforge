const { Op } = require('sequelize');
const { Repository, RepositoryAnalysis, RepositoryMetric } = require('../models');
const { getPagination, getPaginationMeta } = require('../utils/pagination');

/**
 * Register a new repository for the authenticated user.
 * Enforces unique constraint on (user_id, full_name).
 */
async function create(userId, data) {
  const { name, full_name, description, github_url, default_branch, language, analysis_config } = data;

  if (!name || !full_name) {
    throw Object.assign(
      new Error('Repository name and full_name are required'),
      { name: 'ValidationError' }
    );
  }

  // Check for duplicate (user_id + full_name)
  const existing = await Repository.findOne({
    where: {
      user_id: userId,
      full_name
    }
  });

  if (existing) {
    throw Object.assign(
      new Error('A repository with this full_name already exists'),
      { name: 'ConflictError' }
    );
  }

  const repository = await Repository.create({
    user_id: userId,
    name,
    full_name,
    description: description || null,
    github_url: github_url || null,
    default_branch: default_branch || 'main',
    language: language || null,
    analysis_config: analysis_config || {
      auto_analyze: true,
      interval: 'daily',
      analyze_dependencies: true,
      analyze_security: true
    }
  });

  return { data: repository };
}

/**
 * List all active repositories for the authenticated user (paginated).
 */
async function list(userId, query) {
  const { page, limit, offset } = getPagination(query);

  const { count, rows } = await Repository.findAndCountAll({
    where: {
      user_id: userId,
      is_active: true
    },
    offset,
    limit,
    order: [['created_at', 'DESC']]
  });

  return {
    data: rows,
    pagination: getPaginationMeta(count, page, limit)
  };
}

/**
 * Get a single repository by ID (with its latest analysis).
 * Ownership enforced via user_id filter.
 */
async function getById(userId, repositoryId) {
  const repository = await Repository.findOne({
    where: {
      id: repositoryId,
      user_id: userId,
      is_active: true
    },
    include: [
      {
        model: RepositoryAnalysis,
        as: 'analyses',
        required: false,
        order: [['created_at', 'DESC']],
        limit: 1
      }
    ]
  });

  if (!repository) {
    throw Object.assign(
      new Error('Repository not found'),
      { name: 'NotFoundError' }
    );
  }

  return { data: repository };
}

/**
 * Update repository fields (name, analysis_config, default_branch).
 * Ownership enforced via user_id filter.
 */
async function update(userId, repositoryId, updates) {
  const repository = await Repository.findOne({
    where: {
      id: repositoryId,
      user_id: userId,
      is_active: true
    }
  });

  if (!repository) {
    throw Object.assign(
      new Error('Repository not found'),
      { name: 'NotFoundError' }
    );
  }

  const allowedFields = ['name', 'description', 'analysis_config', 'default_branch', 'language'];
  const filteredUpdates = {};

  for (const field of allowedFields) {
    if (updates[field] !== undefined) {
      filteredUpdates[field] = updates[field];
    }
  }

  if (Object.keys(filteredUpdates).length === 0) {
    throw Object.assign(
      new Error('No valid fields to update. Allowed: name, description, analysis_config, default_branch, language'),
      { name: 'ValidationError' }
    );
  }

  await repository.update(filteredUpdates);

  return { data: repository };
}

/**
 * Soft-delete a repository (set is_active = false).
 * Ownership enforced via user_id filter.
 */
async function remove(userId, repositoryId) {
  const repository = await Repository.findOne({
    where: {
      id: repositoryId,
      user_id: userId,
      is_active: true
    }
  });

  if (!repository) {
    throw Object.assign(
      new Error('Repository not found'),
      { name: 'NotFoundError' }
    );
  }

  await repository.update({ is_active: false });

  return { data: { message: 'Repository deleted successfully' } };
}

/**
 * Trigger a new analysis for a repository.
 * Creates a RepositoryAnalysis record with status 'pending'.
 */
async function triggerAnalysis(userId, repositoryId, analysisType = 'manual') {
  const repository = await Repository.findOne({
    where: {
      id: repositoryId,
      user_id: userId,
      is_active: true
    }
  });

  if (!repository) {
    throw Object.assign(
      new Error('Repository not found'),
      { name: 'NotFoundError' }
    );
  }

  const analysis = await RepositoryAnalysis.create({
    repository_id: repositoryId,
    analysis_type: analysisType,
    status: 'pending'
  });

  return { data: analysis };
}

/**
 * List all analyses for a repository (paginated, newest first).
 * Ownership enforced via repository ownership.
 */
async function listAnalyses(userId, repositoryId, query) {
  const { page, limit, offset } = getPagination(query);

  // Verify repository ownership first
  const repository = await Repository.findOne({
    where: {
      id: repositoryId,
      user_id: userId,
      is_active: true
    }
  });

  if (!repository) {
    throw Object.assign(
      new Error('Repository not found'),
      { name: 'NotFoundError' }
    );
  }

  const { count, rows } = await RepositoryAnalysis.findAndCountAll({
    where: { repository_id: repositoryId },
    offset,
    limit,
    order: [['created_at', 'DESC']]
  });

  return {
    data: rows,
    pagination: getPaginationMeta(count, page, limit)
  };
}

/**
 * Get a single analysis by ID, ensuring it belongs to the user's repository.
 */
async function getAnalysisById(userId, repositoryId, analysisId) {
  // Verify repository ownership
  const repository = await Repository.findOne({
    where: {
      id: repositoryId,
      user_id: userId,
      is_active: true
    }
  });

  if (!repository) {
    throw Object.assign(
      new Error('Repository not found'),
      { name: 'NotFoundError' }
    );
  }

  const analysis = await RepositoryAnalysis.findOne({
    where: {
      id: analysisId,
      repository_id: repositoryId
    }
  });

  if (!analysis) {
    throw Object.assign(
      new Error('Analysis not found'),
      { name: 'NotFoundError' }
    );
  }

  return { data: analysis };
}

/**
 * Get metrics for a repository, with optional metric_type filter.
 */
async function getMetrics(userId, repositoryId, query) {
  // Verify repository ownership
  const repository = await Repository.findOne({
    where: {
      id: repositoryId,
      user_id: userId,
      is_active: true
    }
  });

  if (!repository) {
    throw Object.assign(
      new Error('Repository not found'),
      { name: 'NotFoundError' }
    );
  }

  const whereClause = { repository_id: repositoryId };

  if (query.metric_type) {
    whereClause.metric_type = query.metric_type;
  }

  const metrics = await RepositoryMetric.findAll({
    where: whereClause,
    order: [['recorded_at', 'DESC']],
    limit: 100
  });

  return { data: metrics };
}

/**
 * Get aggregated stats for a repository:
 * - latest health_score
 * - total number of analyses
 * - last_analyzed_at
 */
async function getStats(userId, repositoryId) {
  // Verify repository ownership
  const repository = await Repository.findOne({
    where: {
      id: repositoryId,
      user_id: userId,
      is_active: true
    }
  });

  if (!repository) {
    throw Object.assign(
      new Error('Repository not found'),
      { name: 'NotFoundError' }
    );
  }

  const totalAnalyses = await RepositoryAnalysis.count({
    where: { repository_id: repositoryId }
  });

  // Get latest analysis for the most recent health_score
  const latestAnalysis = await RepositoryAnalysis.findOne({
    where: { repository_id: repositoryId },
    order: [['created_at', 'DESC']]
  });

  return {
    data: {
      health_score: repository.health_score,
      total_analyses: totalAnalyses,
      last_analyzed_at: repository.last_analyzed_at,
      latest_analysis_status: latestAnalysis ? latestAnalysis.status : null
    }
  };
}

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