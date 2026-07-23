# 03 — Repository Module

**What to build:** Full repository management module — CRUD operations for user repositories, analysis triggering with status tracking, and metrics retrieval. Includes the repository routes/controller/service and ownership enforcement.

**Blocked by:** Ticket 02 (auth middleware exists at `src/backend/src/middleware/auth.js` — used to protect all routes)

**Status:** ready-for-agent

## Acceptance Criteria

### Repository CRUD
- [ ] `POST /api/v1/repositories` — register a new repository (authenticated user owns it)
- [ ] `GET /api/v1/repositories` — list user's repositories (paginated, supports ?page=1&limit=20)
- [ ] `GET /api/v1/repositories/:id` — get single repository with its latest analysis
- [ ] `PUT /api/v1/repositories/:id` — update repository fields (name, analysis_config, default_branch)
- [ ] `DELETE /api/v1/repositories/:id` — soft-delete (set `is_active = false`)
- [ ] **Ownership enforced** — users can only access their own repositories; all queries filter by `user_id = req.user.id`

### Analysis
- [ ] `POST /api/v1/repositories/:id/analyze` — trigger a new analysis (creates `RepositoryAnalysis` with status `'pending'`)
- [ ] `GET /api/v1/repositories/:id/analyses` — list all analyses for a repository (paginated, newest first)
- [ ] `GET /api/v1/repositories/:id/analyses/:analysisId` — get a single analysis with full results

### Metrics
- [ ] `GET /api/v1/repositories/:id/metrics` — get metrics for a repository (supports `?metric_type=` filter)
- [ ] `GET /api/v1/repositories/:id/stats` — aggregated stats (latest health_score, total analyses, last_analyzed_at)

### Structure
- [ ] **RepositoryService** (`src/backend/src/services/repository.service.js`) — all business logic
- [ ] **RepositoryController** (`src/backend/src/controllers/repository.controller.js`) — thin async handlers
- [ ] **Repository routes** — update `src/backend/src/routes/repository.routes.js` from stub to full implementation
- [ ] **Paginated responses** — all list endpoints return `{ data: [...], pagination: { page, limit, total, totalPages } }`
- [ ] **All new routes protected** by `auth` middleware from Ticket 02

## Key Design Decisions

- Ownership is always derived from `req.user.id` — never trust client-provided user IDs
- Repository uniqueness: `user_id` + `full_name` unique constraint (existing index on model)
- Soft-delete via `is_active` — all queries default to `{ is_active: true }` unless explicitly requesting inactive
- Analysis is asynchronous: `POST /analyze` creates a `RepositoryAnalysis` record with `status: 'pending'` — actual analysis execution will be implemented in a future ticket
- Pagination utility: create `src/backend/src/utils/pagination.js` for reusable `getPagination(query)` and `getPaginationMeta(count, page, limit)`
- Response format: `{ data: { ... } }` for single resources, `{ data: [...], pagination: {...} }` for lists
- Error names follow existing `errorHandler.js` patterns: `ValidationError` (400), `NotFoundError` (404), `ForbiddenError` (403)
- All new files follow existing patterns: direct module exports (not factory functions for services/controllers), camelCase function names, snake_case DB columns via `underscored: true`
- Use existing `Sequelize.Op` operators for queries (`Op.and`, `Op.eq`, `Op.or`)

## Existing Model References

### Repository (`src/backend/src/models/Repository.js`)
```javascript
{
  id: UUID PK,
  user_id: UUID (FK → users),
  github_id: STRING(255)?,
  name: STRING(255),            // e.g. "my-repo"
  full_name: STRING(255),       // e.g. "owner/my-repo"
  description: TEXT?,
  github_url: STRING(500)?,
  default_branch: STRING(100) DEFAULT 'main',
  language: STRING(100)?,
  languages: JSONB {},
  topics: ARRAY(STRING),
  is_private: BOOLEAN false,
  is_fork: BOOLEAN false,
  size_kb: INTEGER 0,
  stars_count: INTEGER 0,
  forks_count: INTEGER 0,
  open_issues_count: INTEGER 0,
  health_score: DECIMAL(5,2) 0.00,
  analysis_config: JSONB { auto_analyze, interval, analyze_dependencies, analyze_security },
  last_analyzed_at: DATE?,
  last_synced_at: DATE?,
  is_active: BOOLEAN true
}
// Associations: belongsTo User, hasMany RepositoryAnalysis, hasMany RepositoryMetric
```

### RepositoryAnalysis (`src/backend/src/models/RepositoryAnalysis.js`)
```javascript
{
  id: UUID PK,
  repository_id: UUID (FK → repositories),
  analysis_type: ENUM('initial','scheduled','manual','webhook') DEFAULT 'initial',
  status: ENUM('pending','running','completed','failed') DEFAULT 'pending',
  results: JSONB {},
  summary: TEXT?,
  health_score: DECIMAL(5,2)?,
  code_quality: JSONB {},
  dependencies: JSONB {},
  security_issues: JSONB [],
  structure: JSONB {},
  metrics: JSONB {},
  error_message: TEXT?,
  started_at: DATE?,
  completed_at: DATE?,
  duration_ms: INTEGER?
}
```

### RepositoryMetric (`src/backend/src/models/RepositoryMetric.js`)
```javascript
{
  id: UUID PK,
  repository_id: UUID (FK → repositories),
  metric_type: STRING(100),    // e.g. 'code_quality', 'performance', 'security'
  metric_key: STRING(255),     // e.g. 'lines_of_code', 'test_coverage'
  value: JSONB,                // flexible — can be number, string, or object
  recorded_at: DATE
}
```

## File Inventory

| File | Action |
|------|--------|
| `src/backend/src/services/repository.service.js` | **Create** — all business logic |
| `src/backend/src/controllers/repository.controller.js` | **Create** — thin request handlers |
| `src/backend/src/routes/repository.routes.js` | **Update** — replace stub with full implementation |
| `src/backend/src/utils/pagination.js` | **Create** — reusable pagination helper |

## Pagination Utility Spec

Create `src/backend/src/utils/pagination.js`:

```javascript
// getPagination(query) → { page, limit, offset }
// getPaginationMeta(count, page, limit) → { page, limit, total, totalPages }
```

Reused by every list endpoint. Default: page=1, limit=20, max limit=100.

## Error Handling Table

| Condition | Error Name | Status |
|-----------|-----------|--------|
| Missing required fields on create | `ValidationError` | 400 |
| Repository not found (or not owned by user) | `NotFoundError` | 404 |
| Accessing another user's repository | `NotFoundError` | 404 |
| Duplicate repository (same user + full_name) | `ConflictError` | 409 |
| Invalid repository ID format | `ValidationError` | 400 |
| Analysis not found on repo | `NotFoundError` | 404 |

## Self-Review Checklist

- [ ] All repository routes protected with `auth` middleware
- [ ] Ownership enforced: `where: { user_id: req.user.id }` on all queries
- [ ] Soft-delete respected: default queries include `is_active: true`
- [ ] Pagination consistent across all list endpoints
- [ ] `POST /analyze` creates a `RepositoryAnalysis` with `status: 'pending'`
- [ ] Error names match errorHandler.js patterns exactly
- [ ] Controllers use async wrapper catching to `next(err)`
- [ ] Service layer validates input before DB calls
- [ ] Response format uses `{ data }` consistently
- [ ] Follows existing Sequelize patterns (UUID PKs, underscored, factory exports for models)
- [ ] Server boots cleanly with updated routes
- [ ] All sensitive validation done server-side
