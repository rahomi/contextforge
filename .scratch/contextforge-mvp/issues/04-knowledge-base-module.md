"# 04 — Knowledge Base Module

**What to build:** Full knowledge base management module — CRUD operations for knowledge documents, automatic versioning on content changes, tag management with auto-creation, and full-text search. Includes the knowledge base routes/controller/service and ownership enforcement.

**Blocked by:** Ticket 02 (auth middleware) and Ticket 03 (pagination utility)

**Status:** complete

## Acceptance Criteria

### Document CRUD
- [x] `POST /api/v1/knowledge-base` — create a new knowledge document with optional tags (authenticated user owns it)
- [x] `GET /api/v1/knowledge-base` — list user's documents (paginated, supports `?page=1&limit=20&category=&status=&tag=&search=`)
- [x] `GET /api/v1/knowledge-base/:id` — get single document with its tags
- [x] `PUT /api/v1/knowledge-base/:id` — update document fields (title, content, summary, category, status, is_public, metadata, tags)
- [x] `DELETE /api/v1/knowledge-base/:id` — soft-delete (set `status = 'archived'`)
- [x] **Ownership enforced** — users can only access their own documents; all queries filter by `user_id = req.user.id`

### Versioning
- [x] `GET /api/v1/knowledge-base/:id/versions` — list all versions of a document (paginated, newest first)
- [x] `GET /api/v1/knowledge-base/:id/versions/:versionId` — get a specific version
- [x] **Auto-versioning** — updating title or content automatically creates a new version with incremented `current_version`

### Tag Management
- [x] `GET /api/v1/knowledge-base/tags` — list all tags (paginated, supports `?search=`)
- [x] `POST /api/v1/knowledge-base/tags` — create a new tag
- [x] `PUT /api/v1/knowledge-base/tags/:tagId` — update tag (name, color, description)
- [x] `DELETE /api/v1/knowledge-base/tags/:tagId` — delete a tag
- [x] **Auto-creation** — tags are normalized to lowercase slugs and auto-created via `findOrCreate` when assigning to documents

### Search
- [x] `GET /api/v1/knowledge-base/search?q=` — full-text search across documents with relevance ranking (title matches first)
- [x] Supports additional filters: `?category=`, `?status=`, `?tag=`

### Structure
- [x] **KnowledgeBaseService** (`src/backend/src/services/knowledgeBase.service.js`) — all business logic
- [x] **KnowledgeBaseController** (`src/backend/src/controllers/knowledgeBase.controller.js`) — thin async handlers
- [x] **Knowledge Base routes** — update `src/backend/src/routes/knowledgeBase.routes.js` from stub to full implementation
- [x] **Paginated responses** — all list endpoints return `{ data: [...], pagination: { page, limit, total, totalPages } }`
- [x] **All new routes protected** by `auth` middleware from Ticket 02

## Key Design Decisions

- Ownership is always derived from `req.user.id` — never trust client-provided user IDs
- Soft-delete via `status: 'archived'` — not destructive deletion; default queries exclude archived docs
- Route ordering matters: `/tags`, `/search` defined before `/:id` to avoid route conflicts
- Auto-versioning on content/title changes using `current_version` counter; `change_notes` can be provided
- Tags normalized to lowercase hyphenated slugs, auto-created via `findOrCreate` to prevent duplicates
- Pagination reuses `getPagination(query)` and `getPaginationMeta(count, page, limit)` from Ticket 03
- Response format: `{ data: { ... } }` for single resources, `{ data: [...], pagination: {...} }` for lists
- Error names follow existing `errorHandler.js` patterns: `ValidationError` (400), `NotFoundError` (404), `ConflictError` (409)
- All new files follow existing patterns: direct module exports, camelCase function names, snake_case DB columns via `underscored: true`

## File Inventory

| File | Action | Status |
|------|--------|--------|
| `src/backend/src/services/knowledgeBase.service.js` | **Create** — all business logic | ✅ Done |
| `src/backend/src/controllers/knowledgeBase.controller.js` | **Create** — thin request handlers | ✅ Done |
| `src/backend/src/routes/knowledgeBase.routes.js` | **Update** — replace stub with full implementation | ✅ Done |

## API Routes Summary

```
Auth middleware (all routes require authentication)

Tag management:
  GET    /api/v1/knowledge-base/tags              → listTags
  POST   /api/v1/knowledge-base/tags              → createTag
  PUT    /api/v1/knowledge-base/tags/:tagId        → updateTag
  DELETE /api/v1/knowledge-base/tags/:tagId        → removeTag

Search:
  GET    /api/v1/knowledge-base/search             → search

Document CRUD:
  POST   /api/v1/knowledge-base                    → create
  GET    /api/v1/knowledge-base                    → list
  GET    /api/v1/knowledge-base/:id                → getById
  PUT    /api/v1/knowledge-base/:id                → update
  DELETE /api/v1/knowledge-base/:id                → remove

Versioning:
  GET    /api/v1/knowledge-base/:id/versions       → listVersions
  GET    /api/v1/knowledge-base/:id/versions/:versionId → getVersion
```

## Error Handling Table

| Condition | Error Name | Status |
|-----------|-----------|--------|
| Missing required fields (title, content) on create | `ValidationError` | 400 |
| Title exceeds 500 characters | `ValidationError` | 400 |
| Document not found (or not owned by user) | `NotFoundError` | 404 |
| Accessing another user's document | `NotFoundError` | 404 |
| Invalid status transition | `ValidationError` | 400 |
| Duplicate tag name | `ConflictError` | 409 |
| Version not found on document | `NotFoundError` | 404 |
| No valid fields provided for update | `ValidationError` | 400 |
| Empty search query | `ValidationError` | 400 |

## Self-Review Checklist

- [x] All knowledge base routes protected with `auth` middleware
- [x] Ownership enforced: `where: { user_id: req.user.id }` on all queries
- [x] Soft-delete respected: default queries exclude `status: 'archived'`
- [x] Pagination consistent across all list endpoints
- [x] Auto-versioning works on content/title changes
- [x] Tags auto-created via `findOrCreate` with slug normalization
- [x] Error names match errorHandler.js patterns exactly
- [x] Controllers use async wrapper catching to `next(err)`
- [x] Service layer validates input before DB calls
- [x] Response format uses `{ data }` consistently
- [x] Route ordering prevents `/tags` and `/search` conflicts with `/:id`
- [x] Server boots cleanly with updated routes
- [x] All sensitive validation done server-side"