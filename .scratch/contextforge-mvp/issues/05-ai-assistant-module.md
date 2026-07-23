"# 05 — AI Assistant Module

**What to build:** Full AI assistant module — conversation management with CRUD, message history, AI-powered responses via Omniroute integration (stubbed), and embedding support for semantic search. Includes the AI routes/controller/service.

**Blocked by:** Ticket 02 (auth middleware) and Ticket 03 (pagination utility)

**Status:** ready-for-agent

## Acceptance Criteria

### Conversation Management
- [ ] `POST /api/v1/ai/conversations` — create a new conversation (optionally linked to a repository)
- [ ] `GET /api/v1/ai/conversations` — list user's conversations (paginated, supports `?page=1&limit=20&status=`)
- [ ] `GET /api/v1/ai/conversations/:id` — get a single conversation with its messages
- [ ] `PUT /api/v1/ai/conversations/:id` — update conversation (title, summary, context, metadata)
- [ ] `DELETE /api/v1/ai/conversations/:id` — soft-delete (set `status = 'deleted'`)
- [ ] **Ownership enforced** — users can only access their own conversations; all queries filter by `user_id = req.user.id`

### Message Exchange
- [ ] `POST /api/v1/ai/conversations/:id/messages` — send a message and get AI response (stubbed — returns simulated response)
- [ ] `GET /api/v1/ai/conversations/:id/messages` — list all messages for a conversation (paginated, oldest first)
- [ ] `GET /api/v1/ai/conversations/:id/messages/:messageId` — get a single message
- [ ] **Tracks tokens_used and model** for cost monitoring

### AI Integration (Stubbed)
- [ ] `POST /api/v1/ai/chat` — direct chat endpoint (creates conversation if none provided, returns AI response)
- [ ] `POST /api/v1/ai/generate` — generate content (documentation, summaries, code analysis) without conversation context
- [ ] **Omniroute stub** — AI responses are simulated with a configurable delay and response pattern, ready to swap with real API call
- [ ] **Streaming support** — endpoint returns response in chunks via Server-Sent Events (SSE)

### Embeddings (Stubbed)
- [ ] `POST /api/v1/ai/embeddings` — generate embedding for text content (stubbed — returns mock embedding vector)
- [ ] `POST /api/v1/ai/search` — semantic search across knowledge documents using embeddings (stubbed)
- [ ] **Ready for pgvector** — schema supports storing embeddings; stub returns mock vectors until pgvector is configured

### Structure
- [ ] **AIService** (`src/backend/src/services/ai.service.js`) — all business logic including AI stub integration
- [ ] **AIController** (`src/backend/src/controllers/ai.controller.js`) — thin async handlers with SSE support
- [ ] **AI routes** — update `src/backend/src/routes/ai.routes.js` from stub to full implementation
- [ ] **Omniroute stub** (`src/backend/src/services/ai.provider.js`) — pluggable AI provider with simulated responses
- [ ] **Paginated responses** — all list endpoints return `{ data: [...], pagination: { page, limit, total, totalPages } }`
- [ ] **All new routes protected** by `auth` middleware from Ticket 02 (except health checks)

## Key Design Decisions

- Ownership is always derived from `req.user.id` — never trust client-provided user IDs
- Soft-delete via `status: 'deleted'` — conversations can be soft-deleted; archived for later review
- AI provider is abstracted behind `ai.provider.js` — swap stubbed responses for real Omniroute/SDK without changing service logic
- Message ordering: oldest first by default (chronological conversation flow)
- Streaming via SSE (`text/event-stream`) for real-time AI responses when available
- Embeddings stored as JSONB (not native pgvector) — ready for pgvector migration via `ALTER COLUMN` later
- Conversation `message_count` and `last_activity_at` auto-updated on new messages
- Error names follow existing `errorHandler.js` patterns: `ValidationError` (400), `NotFoundError` (404), `ForbiddenError` (403)
- All new files follow existing patterns: direct module exports, camelCase function names, snake_case DB columns via `underscored: true`

## Existing Model References

### AIConversation (`src/backend/src/models/AIConversation.js`)
```javascript
{
  id: UUID PK,
  user_id: UUID (FK → users),
  repository_id: UUID? (FK → repositories),
  title: STRING(500),
  summary: TEXT?,
  context: JSONB {},
  metadata: JSONB {},
  message_count: INTEGER 0,
  status: ENUM('active', 'archived', 'deleted') DEFAULT 'active',
  last_activity_at: DATE
}
// Associations: belongsTo User, belongsTo Repository, hasMany AIMessage
```

### AIMessage (`src/backend/src/models/AIMessage.js`)
```javascript
{
  id: UUID PK,
  conversation_id: UUID (FK → ai_conversations),
  role: ENUM('user', 'assistant', 'system'),
  content: TEXT,
  tokens_used: INTEGER?,
  model: STRING(100)?,
  metadata: JSONB {},
  is_streaming: BOOLEAN false
}
// Associations: belongsTo AIConversation
```

### AIEmbedding (`src/backend/src/models/AIEmbedding.js`)
```javascript
{
  id: UUID PK,
  document_id: UUID (FK → knowledge_documents),
  content_chunk: TEXT,
  embedding: JSONB,        // vector stored as JSONB array
  chunk_index: INTEGER,
  chunk_count: INTEGER,
  model: STRING(100)?,
  metadata: JSONB {}
}
// Associations: belongsTo KnowledgeDocument
```

## File Inventory

| File | Action |
|------|--------|
| `src/backend/src/services/ai.service.js` | **Create** — all business logic |
| `src/backend/src/services/ai.provider.js` | **Create** — pluggable AI provider stub |
| `src/backend/src/controllers/ai.controller.js` | **Create** — thin request handlers |
| `src/backend/src/routes/ai.routes.js` | **Update** — replace stub with full implementation |

## API Routes Summary

```
Auth middleware (all routes require authentication)

Chat:
  POST   /api/v1/ai/chat                    → chat (direct AI chat, creates conversation if needed)
  POST   /api/v1/ai/generate                → generate (content generation without conversation)

Conversations:
  POST   /api/v1/ai/conversations            → createConversation
  GET    /api/v1/ai/conversations            → listConversations
  GET    /api/v1/ai/conversations/:id        → getConversation
  PUT    /api/v1/ai/conversations/:id        → updateConversation
  DELETE /api/v1/ai/conversations/:id        → removeConversation

Messages:
  GET    /api/v1/ai/conversations/:id/messages           → listMessages
  POST   /api/v1/ai/conversations/:id/messages           → sendMessage
  GET    /api/v1/ai/conversations/:id/messages/:messageId → getMessage

Embeddings:
  POST   /api/v1/ai/embeddings              → createEmbedding
  POST   /api/v1/ai/search                  → semanticSearch
```

## AI Provider Stub Spec

Create `src/backend/src/services/ai.provider.js`:

```javascript
// Pluggable AI provider abstraction.
// Swap implementation for real Omniroute/OpenAI SDK without changing service logic.

module.exports = {
  async chat(messages, options = {}) → { content, tokens_used, model }
  async generate(prompt, options = {}) → { content, tokens_used, model }
  async createEmbedding(text, options = {}) → { vector, model, tokens_used }
  async streamChat(messages, options = {}) → AsyncIterator<{ chunk, done }>
};

// Stub responses simulate realistic AI output with configurable delay.
// Real implementation would call Omniroute SDK or OpenAI API.
```

## Error Handling Table

| Condition | Error Name | Status |
|-----------|-----------|--------|
| Missing required fields on create | `ValidationError` | 400 |
| Conversation not found (or not owned by user) | `NotFoundError` | 404 |
| Accessing another user's conversation | `NotFoundError` | 404 |
| Invalid message role | `ValidationError` | 400 |
| Empty message content | `ValidationError` | 400 |
| Conversation is deleted/archived | `ForbiddenError` | 403 |
| AI provider not configured | `ServerError` | 502 |
| Embedding generation failed | `ServerError` | 502 |

## Self-Review Checklist

- [ ] All AI routes protected with `auth` middleware
- [ ] Ownership enforced: `where: { user_id: req.user.id }` on all queries
- [ ] Soft-delete respected: default queries exclude `status: 'deleted'`
- [ ] Pagination consistent across all list endpoints
- [ ] AI provider abstracted behind pluggable interface
- [ ] Streaming support via SSE for real-time AI responses
- [ ] `message_count` and `last_activity_at` auto-updated
- [ ] Error names match errorHandler.js patterns exactly
- [ ] Controllers use async wrapper catching to `next(err)`
- [ ] Service layer validates input before DB calls
- [ ] Response format uses `{ data }` consistently
- [ ] Server boots cleanly with updated routes
- [ ] All sensitive validation done server-side
- [ ] models/index.js includes all AI models (AIConversation, AIMessage, AIEmbedding)"