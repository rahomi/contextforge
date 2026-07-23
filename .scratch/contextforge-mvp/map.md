# ContextForge MVP — Ticket Map

## Overview

This document maps the MVP (Minimum Viable Product) implementation for the ContextForge backend.
The backend uses **Express.js + Sequelize + PostgreSQL** (not Laravel — the architecture docs were aspirational).
All tickets build on each other sequentially.

---

## Ticket Dependency Graph

```
Ticket 01 (Models) ─────────────────────────────────────────┐
                                                             │
            ┌─────────────────────────────────────────────────┘
            ▼
Ticket 02 (Auth + User Module) ──┐
                                  │
             ┌────────────────────┘
             ▼
Ticket 03 (Repository Module) ───┐
                                  │
             ┌────────────────────┘
             ▼
Ticket 04 (Knowledge Base Module) ──┐
                                     │
             ┌───────────────────────┘
             ▼
Ticket 05 (AI Assistant Module)
```

---

## Ticket Status

| # | Module | Files to Create/Update | Blocked By | Status |
|---|--------|----------------------|------------|--------|
| 01 | Backend Models | 4 model files + index.js | None | ✅ Complete |
| 02 | Auth & User | 6 files (service, controller, middleware, routes, encryption) | Ticket 01 | ✅ Complete |
| 03 | Repository Module | 4 files (service, controller, routes, pagination) | Tickets 01-02 | ✅ Complete |
| 04 | Knowledge Base | 3 files (service, controller, routes) | Tickets 01-03 | ✅ Complete |
| 05 | AI Assistant | 4 files (service, provider, controller, routes) | Tickets 01-03 | 🔲 Ready for Agent |

---

## Ticket Details

### 01 — Complete Remaining Backend Models
- **What:** Create AIConversation, AIMessage, AIEmbedding, EngineeringActivity models
- **Files:** `src/backend/src/models/*.js`
- **Key Models:** All 11 models registered in models/index.js with associations
- **Status:** ✅ Complete

### 02 — Auth Middleware + User Module
- **What:** JWT auth, user CRUD, GitHub OAuth, encryption service
- **Files:** `auth.js`, `encryption.service.js`, `user.service.js`, `user.controller.js`, `user.routes.js`, 3 stub routes
- **Key Decisions:** bcrypt cost 12, JWT 24h expiry, AES-256-GCM encryption, state-map for OAuth
- **Status:** ✅ Complete

### 03 — Repository Module
- **What:** Repository CRUD, analysis triggering, metrics/stats, pagination
- **Files:** `repository.service.js`, `repository.controller.js`, `repository.routes.js`, `pagination.js`
- **Key Decisions:** Ownership by `req.user.id`, soft-delete via `is_active`, pagination utility
- **Status:** ✅ Complete

### 04 — Knowledge Base Module
- **What:** Document CRUD with versioning, tag management, full-text search
- **Files:** `knowledgeBase.service.js`, `knowledgeBase.controller.js`, `knowledgeBase.routes.js`
- **Key Decisions:** Auto-versioning, tag auto-creation via findOrCreate, ILIKE search with relevance ranking
- **Status:** ✅ Complete

### 05 — AI Assistant Module
- **What:** Conversation management, message exchange, AI provider stub, embedding support
- **Files:** `ai.service.js`, `ai.provider.js`, `ai.controller.js`, `ai.routes.js`
- **Key Decisions:** Pluggable AI provider, SSE streaming, JSONB embeddings (ready for pgvector)
- **Status:** 🔲 Ready for Agent

---

## Completed Files (All Tickets)

### src/backend/src/models/ (11 files)
- `User.js`, `Repository.js`, `RepositoryAnalysis.js`, `RepositoryMetric.js`
- `KnowledgeDocument.js`, `DocumentTag.js`, `DocumentVersion.js`
- `AIConversation.js`, `AIMessage.js`, `AIEmbedding.js`, `EngineeringActivity.js`

### src/backend/src/middleware/ (2 files)
- `auth.js` — JWT verification
- `errorHandler.js` — Error name → HTTP status mapping

### src/backend/src/services/ (3 files)
- `encryption.service.js` — AES-256-GCM
- `user.service.js` — Auth, profiles, OAuth
- `repository.service.js` — Repo CRUD, analysis, metrics
- `knowledgeBase.service.js` — Document CRUD, versions, tags, search

### src/backend/src/controllers/ (3 files)
- `user.controller.js` — 7 handlers
- `repository.controller.js` — 10 handlers
- `knowledgeBase.controller.js` — 12 handlers

### src/backend/src/routes/ (5 files)
- `index.js` — Route aggregator, health check
- `user.routes.js` — Full implementation
- `repository.routes.js` — Full implementation
- `knowledgeBase.routes.js` — Full implementation
- `ai.routes.js` — Stub (needs Ticket 05)

### src/backend/src/utils/ (1 file)
- `pagination.js` — `getPagination()`, `getPaginationMeta()`"

