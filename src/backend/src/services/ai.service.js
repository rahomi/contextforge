const { Op } = require('sequelize');
const { AIConversation, AIMessage, AIEmbedding, KnowledgeDocument } = require('../models');
const { getPagination, getPaginationMeta } = require('../utils/pagination');
const aiProvider = require('./ai.provider');

/**
 * Sanitize a conversation object for safe output.
 */
function sanitizeConversation(conv) {
  if (!conv) return null;
  const json = typeof conv.toJSON === 'function' ? conv.toJSON() : conv;
  return json;
}

/**
 * Sanitize a message object for safe output.
 */
function sanitizeMessage(msg) {
  if (!msg) return null;
  const json = typeof msg.toJSON === 'function' ? msg.toJSON() : msg;
  return json;
}

/**
 * POST /api/v1/ai/chat - Direct chat endpoint.
 * Creates a conversation if none is provided, sends message, returns AI response.
 */
async function chat(userId, body) {
  const { conversation_id, message, repository_id, title } = body;

  if (!message || !message.content) {
    throw Object.assign(
      new Error('Message content is required'),
      { name: 'ValidationError' }
    );
  }

  let conversation;

  if (conversation_id) {
    conversation = await AIConversation.findOne({
      where: { id: conversation_id, user_id: userId, status: 'active' }
    });

    if (!conversation) {
      throw Object.assign(
        new Error('Conversation not found'),
        { name: 'NotFoundError' }
      );
    }
  } else {
    conversation = await AIConversation.create({
      user_id: userId,
      title: title || message.content.slice(0, 100),
      repository_id: repository_id || null,
      status: 'active',
      message_count: 0
    });
  }

  // Save user message
  const userMessage = await AIMessage.create({
    conversation_id: conversation.id,
    role: 'user',
    content: message.content,
    metadata: message.metadata || {}
  });

  // Get conversation history for context
  const history = await AIMessage.findAll({
    where: { conversation_id: conversation.id },
    order: [['created_at', 'ASC']],
    limit: 50
  });

  const messagesForAI = history.map((m) => ({
    role: m.role,
    content: m.content
  }));

  // Get AI response
  const aiResponse = await aiProvider.chat(messagesForAI, {
    model: message.model || undefined,
    temperature: message.temperature || undefined
  });

  // Save AI response message
  const assistantMessage = await AIMessage.create({
    conversation_id: conversation.id,
    role: 'assistant',
    content: aiResponse.content,
    tokens_used: aiResponse.tokens_used,
    model: aiResponse.model,
    metadata: {}
  });

  // Update conversation metadata
  await conversation.update({
    message_count: conversation.message_count + 2,
    last_activity_at: new Date()
  });

  return {
    data: {
      conversation_id: conversation.id,
      message: sanitizeMessage(assistantMessage),
      tokens_used: aiResponse.tokens_used,
      model: aiResponse.model
    }
  };
}

/**
 * POST /api/v1/ai/generate - Generate content without conversation context.
 */
async function generate(userId, body) {
  const { prompt, type, context } = body;

  if (!prompt) {
    throw Object.assign(
      new Error('Prompt is required'),
      { name: 'ValidationError' }
    );
  }

  const aiResponse = await aiProvider.generate(prompt, {
    model: body.model || undefined,
    temperature: body.temperature || undefined
  });

  return {
    data: {
      content: aiResponse.content,
      type: type || 'general',
      tokens_used: aiResponse.tokens_used,
      model: aiResponse.model
    }
  };
}

/**
 * POST /api/v1/ai/conversations - Create a new conversation.
 */
async function createConversation(userId, data) {
  const { title, repository_id, context, metadata } = data;

  if (!title) {
    throw Object.assign(
      new Error('Title is required'),
      { name: 'ValidationError' }
    );
  }

  if (title.length > 500) {
    throw Object.assign(
      new Error('Title must be 500 characters or less'),
      { name: 'ValidationError' }
    );
  }

  const conversation = await AIConversation.create({
    user_id: userId,
    title,
    repository_id: repository_id || null,
    context: context || {},
    metadata: metadata || {},
    status: 'active',
    message_count: 0
  });

  return { data: sanitizeConversation(conversation) };
}

/**
 * GET /api/v1/ai/conversations - List user's conversations (paginated).
 */
async function listConversations(userId, query) {
  const { page, limit, offset } = getPagination(query);
  const { status } = query;

  const whereClause = { user_id: userId };

  if (status) {
    whereClause.status = status;
  } else {
    whereClause.status = { [Op.ne]: 'deleted' };
  }

  const { count, rows } = await AIConversation.findAndCountAll({
    where: whereClause,
    offset,
    limit,
    order: [['last_activity_at', 'DESC']],
    include: [
      {
        model: AIMessage,
        as: 'messages',
        attributes: ['id', 'role', 'content', 'created_at'],
        limit: 1,
        order: [['created_at', 'DESC']]
      }
    ]
  });

  return {
    data: rows.map((c) => sanitizeConversation(c)),
    pagination: getPaginationMeta(count, page, limit)
  };
}

/**
 * GET /api/v1/ai/conversations/:id - Get a single conversation with its messages.
 */
async function getConversation(userId, conversationId) {
  const conversation = await AIConversation.findOne({
    where: { id: conversationId, user_id: userId },
    include: [
      {
        model: AIMessage,
        as: 'messages',
        order: [['created_at', 'ASC']],
        limit: 100
      }
    ]
  });

  if (!conversation) {
    throw Object.assign(
      new Error('Conversation not found'),
      { name: 'NotFoundError' }
    );
  }

  return { data: sanitizeConversation(conversation) };
}

/**
 * PUT /api/v1/ai/conversations/:id - Update conversation fields.
 */
async function updateConversation(userId, conversationId, updates) {
  const conversation = await AIConversation.findOne({
    where: { id: conversationId, user_id: userId, status: { [Op.ne]: 'deleted' } }
  });

  if (!conversation) {
    throw Object.assign(
      new Error('Conversation not found'),
      { name: 'NotFoundError' }
    );
  }

  const allowedFields = ['title', 'summary', 'context', 'metadata', 'status'];
  const filteredUpdates = {};

  for (const field of allowedFields) {
    if (updates[field] !== undefined) {
      filteredUpdates[field] = updates[field];
    }
  }

  if (Object.keys(filteredUpdates).length === 0) {
    throw Object.assign(
      new Error('No valid fields to update. Allowed: title, summary, context, metadata, status'),
      { name: 'ValidationError' }
    );
  }

  // Validate status transitions
  if (filteredUpdates.status) {
    const validStatuses = ['active', 'archived', 'deleted'];
    if (!validStatuses.includes(filteredUpdates.status)) {
      throw Object.assign(
        new Error('Invalid status. Must be one of: active, archived, deleted'),
        { name: 'ValidationError' }
      );
    }

    if (conversation.status === 'deleted' && filteredUpdates.status !== 'deleted') {
      throw Object.assign(
        new Error('Cannot un-delete a deleted conversation'),
        { name: 'ForbiddenError' }
      );
    }
  }

  await conversation.update(filteredUpdates);

  return { data: sanitizeConversation(conversation) };
}

/**
 * DELETE /api/v1/ai/conversations/:id - Soft-delete conversation.
 */
async function removeConversation(userId, conversationId) {
  const conversation = await AIConversation.findOne({
    where: { id: conversationId, user_id: userId, status: { [Op.ne]: 'deleted' } }
  });

  if (!conversation) {
    throw Object.assign(
      new Error('Conversation not found'),
      { name: 'NotFoundError' }
    );
  }

  await conversation.update({ status: 'deleted' });

  return { data: { message: 'Conversation deleted successfully' } };
}

/**
 * POST /api/v1/ai/conversations/:id/messages - Send a message and get AI response.
 */
async function sendMessage(userId, conversationId, body) {
  const { content, role, metadata, model, temperature } = body;

  if (!content || typeof content !== 'string' || content.trim().length === 0) {
    throw Object.assign(
      new Error('Message content is required and must be a non-empty string'),
      { name: 'ValidationError' }
    );
  }

  // Validate role
  const validRoles = ['user', 'assistant', 'system'];
  const messageRole = role || 'user';
  if (!validRoles.includes(messageRole)) {
    throw Object.assign(
      new Error('Invalid role. Must be one of: user, assistant, system'),
      { name: 'ValidationError' }
    );
  }

  const conversation = await AIConversation.findOne({
    where: { id: conversationId, user_id: userId }
  });

  if (!conversation) {
    throw Object.assign(
      new Error('Conversation not found'),
      { name: 'NotFoundError' }
    );
  }

  if (conversation.status === 'deleted') {
    throw Object.assign(
      new Error('Cannot send messages to a deleted conversation'),
      { name: 'ForbiddenError' }
    );
  }

  if (conversation.status === 'archived') {
    throw Object.assign(
      new Error('Cannot send messages to an archived conversation'),
      { name: 'ForbiddenError' }
    );
  }

  // Save the user message
  const userMessage = await AIMessage.create({
    conversation_id: conversationId,
    role: messageRole,
    content,
    metadata: metadata || {}
  });

  // If the message is from the user, generate an AI response
  let assistantMessage = null;

  if (messageRole === 'user') {
    // Get conversation history for context
    const history = await AIMessage.findAll({
      where: { conversation_id: conversationId },
      order: [['created_at', 'ASC']],
      limit: 50
    });

    const messagesForAI = history.map((m) => ({
      role: m.role,
      content: m.content
    }));

    const aiResponse = await aiProvider.chat(messagesForAI, {
      model: model || undefined,
      temperature: temperature || undefined
    });

    assistantMessage = await AIMessage.create({
      conversation_id: conversationId,
      role: 'assistant',
      content: aiResponse.content,
      tokens_used: aiResponse.tokens_used,
      model: aiResponse.model,
      metadata: {}
    });

    // Update conversation
    await conversation.update({
      message_count: conversation.message_count + 2,
      last_activity_at: new Date()
    });
  } else {
    // For system/assistant messages sent by the user, just update the count
    await conversation.update({
      message_count: conversation.message_count + 1,
      last_activity_at: new Date()
    });
  }

  return {
    data: {
      user_message: sanitizeMessage(userMessage),
      assistant_message: assistantMessage ? sanitizeMessage(assistantMessage) : null,
      conversation_id: conversationId
    }
  };
}

/**
 * GET /api/v1/ai/conversations/:id/messages - List messages for a conversation.
 */
async function listMessages(userId, conversationId, query) {
  const { page, limit, offset } = getPagination(query);

  // Verify conversation ownership
  const conversation = await AIConversation.findOne({
    where: { id: conversationId, user_id: userId }
  });

  if (!conversation) {
    throw Object.assign(
      new Error('Conversation not found'),
      { name: 'NotFoundError' }
    );
  }

  const { count, rows } = await AIMessage.findAndCountAll({
    where: { conversation_id: conversationId },
    offset,
    limit,
    order: [['created_at', 'ASC']]
  });

  return {
    data: rows.map((m) => sanitizeMessage(m)),
    pagination: getPaginationMeta(count, page, limit)
  };
}

/**
 * GET /api/v1/ai/conversations/:id/messages/:messageId - Get a single message.
 */
async function getMessage(userId, conversationId, messageId) {
  // Verify conversation ownership
  const conversation = await AIConversation.findOne({
    where: { id: conversationId, user_id: userId }
  });

  if (!conversation) {
    throw Object.assign(
      new Error('Conversation not found'),
      { name: 'NotFoundError' }
    );
  }

  const message = await AIMessage.findOne({
    where: { id: messageId, conversation_id: conversationId }
  });

  if (!message) {
    throw Object.assign(
      new Error('Message not found'),
      { name: 'NotFoundError' }
    );
  }

  return { data: sanitizeMessage(message) };
}

/**
 * POST /api/v1/ai/embeddings - Generate embedding for text content.
 */
async function createEmbedding(userId, body) {
  const { text, document_id, chunk_index, chunk_count } = body;

  if (!text) {
    throw Object.assign(
      new Error('Text is required for embedding'),
      { name: 'ValidationError' }
    );
  }

  const result = await aiProvider.createEmbedding(text, {
    model: body.model || undefined
  });

  // If document_id is provided, store the embedding
  if (document_id) {
    await AIEmbedding.create({
      document_id,
      content_chunk: text,
      embedding: result.vector,
      chunk_index: chunk_index || 0,
      chunk_count: chunk_count || 1,
      model: result.model,
      metadata: body.metadata || {}
    });
  }

  return {
    data: {
      vector: result.vector,
      model: result.model,
      tokens_used: result.tokens_used,
      dimensions: result.vector.length
    }
  };
}

/**
 * POST /api/v1/ai/search - Semantic search across knowledge documents.
 */
async function semanticSearch(userId, body) {
  const { query, limit: limitParam } = body;

  if (!query || typeof query !== 'string' || query.trim().length === 0) {
    throw Object.assign(
      new Error('Search query is required'),
      { name: 'ValidationError' }
    );
  }

  // Generate embedding for the search query
  const queryEmbedding = await aiProvider.createEmbedding(query);

  // Fetch all embeddings belonging to the user's documents
  const userEmbeddings = await AIEmbedding.findAll({
    include: [
      {
        model: KnowledgeDocument,
        as: 'document',
        where: { user_id: userId },
        attributes: ['id', 'title', 'content', 'summary', 'category']
      }
    ]
  });

  if (!userEmbeddings || userEmbeddings.length === 0) {
    return {
      data: {
        results: [],
        query,
        total_results: 0
      }
    };
  }

  // Calculate similarity scores
  const results = userEmbeddings
    .map((emb) => {
      const similarity = aiProvider.cosineSimilarity(queryEmbedding.vector, emb.embedding);
      return {
        document_id: emb.document_id,
        document: emb.document ? {
          id: emb.document.id,
          title: emb.document.title,
          content: emb.document.content,
          summary: emb.document.summary,
          category: emb.document.category
        } : null,
        content_chunk: emb.content_chunk,
        chunk_index: emb.chunk_index,
        similarity: parseFloat(similarity.toFixed(4))
      };
    })
    .filter((r) => r.document !== null)
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, limitParam || 10);

  return {
    data: {
      results,
      query,
      total_results: results.length
    }
  };
}

module.exports = {
  chat,
  generate,
  createConversation,
  listConversations,
  getConversation,
  updateConversation,
  removeConversation,
  sendMessage,
  listMessages,
  getMessage,
  createEmbedding,
  semanticSearch
};
