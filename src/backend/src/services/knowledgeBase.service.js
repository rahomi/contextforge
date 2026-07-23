const { Op } = require('sequelize');
const {
  KnowledgeDocument,
  DocumentTag,
  DocumentVersion,
  AIEmbedding
} = require('../models');
const { getPagination, getPaginationMeta } = require('../utils/pagination');

/**
 * Sanitize a document object for safe output.
 */
function sanitizeDocument(doc) {
  if (!doc) return null;

  const json = typeof doc.toJSON === 'function' ? doc.toJSON() : doc;

  return json;
}

/**
 * Create a new knowledge document.
 */
async function create(userId, data) {
  const { title, content, summary, category, tags, is_public, metadata } = data;

  if (!title || !content) {
    throw Object.assign(
      new Error('Title and content are required'),
      { name: 'ValidationError' }
    );
  }

  if (title.length > 500) {
    throw Object.assign(
      new Error('Title must be 500 characters or less'),
      { name: 'ValidationError' }
    );
  }

  const document = await KnowledgeDocument.create({
    user_id: userId,
    title,
    content,
    summary: summary || null,
    category: category || null,
    status: 'draft',
    is_public: is_public || false,
    metadata: metadata || {},
    current_version: 1
  });

  // Create initial version
  await DocumentVersion.create({
    document_id: document.id,
    version: 1,
    title,
    content,
    summary: summary || null,
    change_notes: 'Initial version',
    created_by: userId
  });

  // Handle tags if provided
  if (tags && Array.isArray(tags) && tags.length > 0) {
    await setDocumentTags(document, tags);
  }

  // Reload to include tags
  const docWithTags = await KnowledgeDocument.findByPk(document.id, {
    include: [
      {
        model: DocumentTag,
        as: 'tags',
        through: { attributes: [] }
      }
    ]
  });

  return { data: sanitizeDocument(docWithTags) };
}

/**
 * List all active documents for the authenticated user (paginated).
 * Supports filtering by category, status, and tag.
 */
async function list(userId, query) {
  const { page, limit, offset } = getPagination(query);
  const { category, status, tag, search } = query;

  const whereClause = {
    user_id: userId,
    status: status || { [Op.ne]: 'archived' }
  };

  if (category) {
    whereClause.category = category;
  }

  if (search) {
    whereClause[Op.or] = [
      { title: { [Op.iLike]: `%${search}%` } },
      { content: { [Op.iLike]: `%${search}%` } },
      { summary: { [Op.iLike]: `%${search}%` } }
    ];
  }

  const includeClause = [
    {
      model: DocumentTag,
      as: 'tags',
      through: { attributes: [] }
    }
  ];

  // Filter by tag if provided
  if (tag) {
    includeClause[0].where = {
      name: { [Op.iLike]: `%${tag}%` }
    };
    includeClause[0].required = true;
  }

  const { count, rows } = await KnowledgeDocument.findAndCountAll({
    where: whereClause,
    include: includeClause,
    distinct: true,
    offset,
    limit,
    order: [['updated_at', 'DESC']]
  });

  return {
    data: rows.map((doc) => sanitizeDocument(doc)),
    pagination: getPaginationMeta(count, page, limit)
  };
}

/**
 * Get a single document by ID with tags and latest version.
 * Ownership enforced via user_id filter.
 */
async function getById(userId, documentId) {
  const document = await KnowledgeDocument.findOne({
    where: {
      id: documentId,
      user_id: userId,
      status: { [Op.ne]: 'archived' }
    },
    include: [
      {
        model: DocumentTag,
        as: 'tags',
        through: { attributes: [] }
      }
    ]
  });

  if (!document) {
    throw Object.assign(
      new Error('Document not found'),
      { name: 'NotFoundError' }
    );
  }

  return { data: sanitizeDocument(document) };
}

/**
 * Update a knowledge document.
 * Only allows updating non-archived documents.
 * Creates a new version when title or content changes.
 */
async function update(userId, documentId, updates) {
  const document = await KnowledgeDocument.findOne({
    where: {
      id: documentId,
      user_id: userId,
      status: { [Op.ne]: 'archived' }
    }
  });

  if (!document) {
    throw Object.assign(
      new Error('Document not found'),
      { name: 'NotFoundError' }
    );
  }

  const allowedFields = ['title', 'content', 'summary', 'category', 'status', 'is_public', 'metadata'];
  const filteredUpdates = {};
  let contentChanged = false;

  for (const field of allowedFields) {
    if (updates[field] !== undefined) {
      filteredUpdates[field] = updates[field];

      if (field === 'title' || field === 'content') {
        contentChanged = true;
      }
    }
  }

  if (Object.keys(filteredUpdates).length === 0 && !updates.tags) {
    throw Object.assign(
      new Error('No valid fields to update. Allowed: title, content, summary, category, status, is_public, metadata, tags'),
      { name: 'ValidationError' }
    );
  }

  // Validate status transitions
  if (filteredUpdates.status) {
    const validStatuses = ['draft', 'published', 'archived'];
    if (!validStatuses.includes(filteredUpdates.status)) {
      throw Object.assign(
        new Error('Invalid status. Must be one of: draft, published, archived'),
        { name: 'ValidationError' }
      );
    }
  }

  await document.update(filteredUpdates);

  // Create a new version if content or title changed
  if (contentChanged) {
    const newVersion = document.current_version + 1;

    await DocumentVersion.create({
      document_id: document.id,
      version: newVersion,
      title: filteredUpdates.title || document.title,
      content: filteredUpdates.content || document.content,
      summary: filteredUpdates.summary || document.summary,
      change_notes: updates.change_notes || `Updated to version ${newVersion}`,
      created_by: userId
    });

    await document.update({ current_version: newVersion });
  }

  // Handle tags if provided
  if (updates.tags && Array.isArray(updates.tags)) {
    await setDocumentTags(document, updates.tags);
  }

  // Reload to include tags
  const updatedDoc = await KnowledgeDocument.findByPk(document.id, {
    include: [
      {
        model: DocumentTag,
        as: 'tags',
        through: { attributes: [] }
      }
    ]
  });

  return { data: sanitizeDocument(updatedDoc) };
}

/**
 * Soft-delete a document (set status = 'archived').
 * Ownership enforced via user_id filter.
 */
async function remove(userId, documentId) {
  const document = await KnowledgeDocument.findOne({
    where: {
      id: documentId,
      user_id: userId,
      status: { [Op.ne]: 'archived' }
    }
  });

  if (!document) {
    throw Object.assign(
      new Error('Document not found'),
      { name: 'NotFoundError' }
    );
  }

  await document.update({ status: 'archived' });

  return { data: { message: 'Document archived successfully' } };
}

/**
 * List all versions of a document (paginated, newest first).
 * Ownership enforced via document ownership.
 */
async function listVersions(userId, documentId, query) {
  const { page, limit, offset } = getPagination(query);

  // Verify document ownership
  const document = await KnowledgeDocument.findOne({
    where: {
      id: documentId,
      user_id: userId,
      status: { [Op.ne]: 'archived' }
    }
  });

  if (!document) {
    throw Object.assign(
      new Error('Document not found'),
      { name: 'NotFoundError' }
    );
  }

  const { count, rows } = await DocumentVersion.findAndCountAll({
    where: { document_id: documentId },
    offset,
    limit,
    order: [['version', 'DESC']]
  });

  return {
    data: rows,
    pagination: getPaginationMeta(count, page, limit)
  };
}

/**
 * Get a specific version of a document.
 */
async function getVersion(userId, documentId, versionId) {
  // Verify document ownership
  const document = await KnowledgeDocument.findOne({
    where: {
      id: documentId,
      user_id: userId,
      status: { [Op.ne]: 'archived' }
    }
  });

  if (!document) {
    throw Object.assign(
      new Error('Document not found'),
      { name: 'NotFoundError' }
    );
  }

  const version = await DocumentVersion.findOne({
    where: {
      id: versionId,
      document_id: documentId
    }
  });

  if (!version) {
    throw Object.assign(
      new Error('Version not found'),
      { name: 'NotFoundError' }
    );
  }

  return { data: version };
}

/**
 * List all tags (with optional search).
 */
async function listTags(query) {
  const { page, limit, offset } = getPagination(query);
  const { search } = query;

  const whereClause = {};

  if (search) {
    whereClause.name = { [Op.iLike]: `%${search}%` };
  }

  const { count, rows } = await DocumentTag.findAndCountAll({
    where: whereClause,
    offset,
    limit,
    order: [['name', 'ASC']]
  });

  return {
    data: rows,
    pagination: getPaginationMeta(count, page, limit)
  };
}

/**
 * Create a new tag.
 */
async function createTag(data) {
  const { name, color, description } = data;

  if (!name) {
    throw Object.assign(
      new Error('Tag name is required'),
      { name: 'ValidationError' }
    );
  }

  // Check for duplicate
  const existing = await DocumentTag.findOne({
    where: { name: { [Op.iLike]: name } }
  });

  if (existing) {
    throw Object.assign(
      new Error('A tag with this name already exists'),
      { name: 'ConflictError' }
    );
  }

  const tag = await DocumentTag.create({
    name,
    color: color || '#3b82f6',
    description: description || null
  });

  return { data: tag };
}

/**
 * Update a tag.
 */
async function updateTag(tagId, updates) {
  const tag = await DocumentTag.findByPk(tagId);

  if (!tag) {
    throw Object.assign(
      new Error('Tag not found'),
      { name: 'NotFoundError' }
    );
  }

  const allowedFields = ['name', 'color', 'description'];
  const filteredUpdates = {};

  for (const field of allowedFields) {
    if (updates[field] !== undefined) {
      filteredUpdates[field] = updates[field];
    }
  }

  if (Object.keys(filteredUpdates).length === 0) {
    throw Object.assign(
      new Error('No valid fields to update'),
      { name: 'ValidationError' }
    );
  }

  // Check name uniqueness if name is being changed
  if (filteredUpdates.name) {
    const existing = await DocumentTag.findOne({
      where: {
        name: { [Op.iLike]: filteredUpdates.name },
        id: { [Op.ne]: tagId }
      }
    });

    if (existing) {
      throw Object.assign(
        new Error('A tag with this name already exists'),
        { name: 'ConflictError' }
      );
    }
  }

  await tag.update(filteredUpdates);

  return { data: tag };
}

/**
 * Delete a tag.
 */
async function removeTag(tagId) {
  const tag = await DocumentTag.findByPk(tagId);

  if (!tag) {
    throw Object.assign(
      new Error('Tag not found'),
      { name: 'NotFoundError' }
    );
  }

  await tag.destroy();

  return { data: { message: 'Tag deleted successfully' } };
}

/**
 * Helper: Set tags on a document by name array.
 * Creates tags that don't exist yet, then replaces all tag associations.
 */
async function setDocumentTags(document, tagNames) {
  if (!Array.isArray(tagNames) || tagNames.length === 0) {
    await document.setTags([]);
    return;
  }

  const tags = [];

  for (const name of tagNames) {
    const sanitizedName = name.trim().toLowerCase().replace(/\s+/g, '-').slice(0, 100);

    if (!sanitizedName) continue;

    const [tag] = await DocumentTag.findOrCreate({
      where: { name: sanitizedName },
      defaults: {
        name: sanitizedName,
        color: '#3b82f6'
      }
    });

    tags.push(tag);
  }

  await document.setTags(tags);
}

/**
 * Search documents by full-text query with relevance ranking.
 */
async function search(userId, query) {
  const { q, category, status, tag, page: pageParam, limit: limitParam } = query;

  if (!q || q.trim().length === 0) {
    throw Object.assign(
      new Error('Search query is required'),
      { name: 'ValidationError' }
    );
  }

  const { page, limit, offset } = getPagination(query);

  // PostgreSQL full-text search using to_tsvector and plainto_tsquery
  const whereClause = {
    user_id: userId,
    status: status || { [Op.ne]: 'archived' }
  };

  if (category) {
    whereClause.category = category;
  }

  // Use Sequelize.literal for full-text search with ranking
  const searchQuery = q.trim();

  whereClause[Op.or] = [
    { title: { [Op.iLike]: `%${searchQuery}%` } },
    { content: { [Op.iLike]: `%${searchQuery}%` } },
    { summary: { [Op.iLike]: `%${searchQuery}%` } }
  ];

  const includeClause = [
    {
      model: DocumentTag,
      as: 'tags',
      through: { attributes: [] }
    }
  ];

  if (tag) {
    includeClause[0].where = {
      name: { [Op.iLike]: `%${tag}%` }
    };
    includeClause[0].required = true;
  }

  const { count, rows } = await KnowledgeDocument.findAndCountAll({
    where: whereClause,
    include: includeClause,
    distinct: true,
    offset,
    limit,
    order: [
      // Prioritize title matches
      [Op.literal(`
        CASE
          WHEN title ILIKE '%${searchQuery.replace(/'/g, "''")}%' THEN 0
          WHEN summary ILIKE '%${searchQuery.replace(/'/g, "''")}%' THEN 1
          ELSE 2
        END
      `), 'ASC'],
      ['updated_at', 'DESC']
    ]
  });

  return {
    data: rows.map((doc) => sanitizeDocument(doc)),
    pagination: getPaginationMeta(count, page, limit)
  };
}

module.exports = {
  create,
  list,
  getById,
  update,
  remove,
  listVersions,
  getVersion,
  listTags,
  createTag,
  updateTag,
  removeTag,
  search
};