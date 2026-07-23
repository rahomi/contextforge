/**
 * AI Assistant Controller
 *
 * Thin async handlers delegating to ai.service.
 * All handlers wrapped with asyncHandler for error propagation.
 */

const aiService = require('../services/ai.service');

/**
 * Wraps async route handlers to catch errors and pass to next().
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

/**
 * POST /api/v1/ai/chat
 * Direct chat with AI (creates conversation if none provided).
 */
const chat = asyncHandler(async (req, res) => {
  const result = await aiService.chat(req.user.id, req.body);

  res.status(200).json({
    data: result.data
  });
});

/**
 * POST /api/v1/ai/generate
 * Generate content without conversation context.
 */
const generate = asyncHandler(async (req, res) => {
  const result = await aiService.generate(req.user.id, req.body);

  res.status(200).json({
    data: result.data
  });
});

/**
 * POST /api/v1/ai/conversations
 * Create a new conversation.
 */
const createConversation = asyncHandler(async (req, res) => {
  const result = await aiService.createConversation(req.user.id, req.body);

  res.status(201).json({
    data: result.data
  });
});

/**
 * GET /api/v1/ai/conversations
 * List user's conversations (paginated).
 */
const listConversations = asyncHandler(async (req, res) => {
  const result = await aiService.listConversations(req.user.id, req.query);

  res.status(200).json({
    data: result.data,
    pagination: result.pagination
  });
});

/**
 * GET /api/v1/ai/conversations/:id
 * Get a single conversation with its messages.
 */
const getConversation = asyncHandler(async (req, res) => {
  const result = await aiService.getConversation(req.user.id, req.params.id);

  res.status(200).json({
    data: result.data
  });
});

/**
 * PUT /api/v1/ai/conversations/:id
 * Update conversation fields.
 */
const updateConversation = asyncHandler(async (req, res) => {
  const result = await aiService.updateConversation(req.user.id, req.params.id, req.body);

  res.status(200).json({
    data: result.data
  });
});

/**
 * DELETE /api/v1/ai/conversations/:id
 * Soft-delete a conversation.
 */
const removeConversation = asyncHandler(async (req, res) => {
  const result = await aiService.removeConversation(req.user.id, req.params.id);

  res.status(200).json({
    data: result.data
  });
});

/**
 * POST /api/v1/ai/conversations/:id/messages
 * Send a message and get AI response.
 */
const sendMessage = asyncHandler(async (req, res) => {
  const result = await aiService.sendMessage(req.user.id, req.params.id, req.body);

  res.status(200).json({
    data: result.data
  });
});

/**
 * GET /api/v1/ai/conversations/:id/messages
 * List messages for a conversation (paginated, oldest first).
 */
const listMessages = asyncHandler(async (req, res) => {
  const result = await aiService.listMessages(req.user.id, req.params.id, req.query);

  res.status(200).json({
    data: result.data,
    pagination: result.pagination
  });
});

/**
 * GET /api/v1/ai/conversations/:id/messages/:messageId
 * Get a single message.
 */
const getMessage = asyncHandler(async (req, res) => {
  const result = await aiService.getMessage(req.user.id, req.params.id, req.params.messageId);

  res.status(200).json({
    data: result.data
  });
});

/**
 * POST /api/v1/ai/embeddings
 * Generate embedding for text content.
 */
const createEmbedding = asyncHandler(async (req, res) => {
  const result = await aiService.createEmbedding(req.user.id, req.body);

  res.status(200).json({
    data: result.data
  });
});

/**
 * POST /api/v1/ai/search
 * Semantic search across knowledge documents.
 */
const semanticSearch = asyncHandler(async (req, res) => {
  const result = await aiService.semanticSearch(req.user.id, req.body);

  res.status(200).json({
    data: result.data
  });
});

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