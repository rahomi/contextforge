# 02 — Auth Middleware + User Module

**What to build:** JWT-based authentication system with user registration, login, profile management, and GitHub OAuth integration. Includes the auth middleware, user routes/controller/service, and encrypts GitHub tokens at rest.

**Blocked by:** None (Ticket 01 models are all registered — User.js associations exist)

**Status:** ready-for-agent

## Acceptance Criteria

- [ ] `POST /api/v1/users/register` — creates user with email/password (bcrypt hashed)
- [ ] `POST /api/v1/users/login` — returns JWT access token (expires in 24h)
- [ ] `POST /api/v1/users/logout` — invalidates session
- [ ] `GET /api/v1/users/me` — returns current user profile (requires auth)
- [ ] `PUT /api/v1/users/me` — updates preferences/name/avatar
- [ ] `GET /api/v1/users/auth/github` — initiates GitHub OAuth flow
- [ ] `GET /api/v1/users/auth/github/callback` — handles OAuth callback, creates/links user
- [ ] **Auth middleware** (`src/backend/src/middleware/auth.js`) — verifies JWT, attaches `req.user`
- [ ] **Error handling** — 401 for missing/invalid token, 403 for insufficient permissions
- [ ] **EncryptionService** (`src/backend/src/services/encryption.service.js`) — AES encrypt/decrypt for github_token
- [ ] **UserService** (`src/backend/src/services/user.service.js`) — all business logic (password hashing, token generation, profile updates)
- [ ] **UserController** (`src/backend/src/controllers/user.controller.js`) — thin handlers calling UserService
- [ ] **Route files** — `user.routes.js` in routes directory (unblocks server startup)
- [ ] 3 stub route files also created for other modules (repository, knowledgeBase, ai) so server boots

## Key Design Decisions

- JWT secret from `process.env.JWT_SECRET`
- Token payload: `{ userId, email }` only — never embed sensitive data
- Password hashing: bcrypt with cost factor 12
- GitHub OAuth state param uses a cryptographically random string stored in Redis/session
- All new files follow existing patterns: factory exports, snake_case table refs, UUID PKs
- Encryption uses `crypto.createCipheriv` with AES-256-GCM (Node.js built-in)