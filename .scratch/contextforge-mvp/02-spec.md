# 📄 Specification: Auth & User Module (Ticket 02)

## 1. Overview

Implement a full JWT-based authentication system with user registration, login, profile management, and GitHub OAuth integration. This includes the auth middleware, user routes/controller/service, and encryption service for GitHub tokens.

---

## 2. Architecture & Data Flow

### User Registration
```
POST /api/v1/users/register
Body: { email, password, name }
  → UserController.register(req, res)
    → UserService.register(email, password, name)
      → bcrypt.hash(password, 12)
      → User.create({ email, name, password_hash, ... })
      → jwt.sign({ userId, email }, JWT_SECRET, { expiresIn: '24h' })
      → Return { user (safe), token }
```

### User Login
```
POST /api/v1/users/login
Body: { email, password }
  → UserController.login(req, res)
    → UserService.login(email, password)
      → User.findOne({ where: { email, is_active: true } })
      → bcrypt.compare(password, user.password_hash)
      → Update last_login_at
      → jwt.sign(...)
      → Return { user (safe), token }
```

### Authenticated Routes
```
Request → auth.js Middleware
  → Extract "Bearer <token>" from Authorization header
  → jwt.verify(token, JWT_SECRET) → { userId, email }
  → Attach user to req.user
  → next()
```

### GitHub OAuth Flow
```
GET /auth/github
  → Generate random state → store in map (keyed by state)
  → Redirect to GitHub authorize URL

GET /auth/github/callback?code=xxx&state=yyy
  → Validate state matches stored state
  → Exchange code for access token (POST https://github.com/login/oauth/access_token)
  → Fetch user info (GET https://api.github.com/user)
  → Find or create User by github_id or email
  → Encrypt github_token via EncryptionService
  → Save github_token_encrypted (plaintext token discarded)
  → Generate JWT
  → Return { user, token }
```

---

## 3. File Inventory & Responsibilities

| File | Purpose |
|------|---------|
| `src/backend/src/services/encryption.service.js` | AES-256-GCM encrypt/decrypt via Node crypto |
| `src/backend/src/services/user.service.js` | All user business logic (auth, profile, OAuth) |
| `src/backend/src/controllers/user.controller.js` | Thin request handlers delegating to UserService |
| `src/backend/src/middleware/auth.js` | JWT verification, attaches `req.user` |
| `src/backend/src/routes/user.routes.js` | User endpoint definitions |
| `src/backend/src/routes/repository.routes.js` | Stub — `express.Router()` export |
| `src/backend/src/routes/knowledgeBase.routes.js` | Stub — `express.Router()` export |
| `src/backend/src/routes/ai.routes.js` | Stub — `express.Router()` export |

---

## 4. Detailed File Specifications

### 4.1 `encryption.service.js`

```javascript
// Uses AES-256-GCM with:
// - Key from process.env.ENCRYPTION_KEY (32 bytes hex)
// - Random 16-byte IV per encryption
// - auth tag concatenated to ciphertext

module.exports = {
  encrypt(plaintext)   → { encrypted, iv, authTag } as hex strings
  decrypt(cipherObj)   → plaintext string | null
};
```

- Export factory pattern? No — stateless utility, module exports directly.
- Use `crypto.randomBytes(16)` for IV.
- Return hex-encoded strings for DB storage.

### 4.2 `user.service.js`

Factory function matching model pattern? No — services export class/object directly.

**Exported methods:**

| Method | Params | Returns | Notes |
|--------|--------|---------|-------|
| `register(email, password, name)` | string, string, string | `{ user, token }` | Validate email/password; reject duplicate email |
| `login(email, password)` | string, string | `{ user, token }` | Reject inactive; verify password |
| `getProfile(userId)` | UUID | user (safe) | Exclude password_hash, github_token_encrypted |
| `updateProfile(userId, updates)` | UUID, object | updated user | Allowed: name, avatar_url, preferences |
| `initiateGitHubOAuth()` | — | `{ url, state }` | Generate state, store in memory Map |
| `handleGitHubCallback(code, state)` | string, string | `{ user, token }` | Validate state, exchange code, find/link user |

**Error behavior:** throw objects with `.name = 'UnauthorizedError'`, `.name = 'ConflictError'`, `.name = 'ValidationError'`, `.name = 'NotFoundError'` matching errorHandler.js patterns.

### 4.3 `user.controller.js`

Wrap each async handler to catch errors → `next(err)`.

**Endpoints mapping:**

| Route | Controller Method |
|-------|-------------------|
| `POST /register` | `register` |
| `POST /login` | `login` |
| `POST /logout` | `logout` |
| `GET /me` | `getProfile` |
| `PUT /me` | `updateProfile` |
| `GET /auth/github` | `initiateGitHubOAuth` |
| `GET /auth/github/callback` | `handleGitHubCallback` |

### 4.4 `auth.js` middleware

1. Check `Authorization: Bearer <token>`
2. `jwt.verify(token, process.env.JWT_SECRET)` 
3. Find user by `userId` payload (to ensure user still active)
4. Attach `req.user = { id, email }` to request
5. On failure → throw `UnauthorizedError` (name-based)

### 4.5 `user.routes.js`

```javascript
const router = express.Router();
router.post('/register', ...);
router.post('/login', ...);
router.post('/logout', auth, ...);
router.get('/me', auth, ...);
router.put('/me', auth, ...);
router.get('/auth/github', ...);
router.get('/auth/github/callback', ...);
module.exports = router;
```

### 4.6 Stub route files

Each is a 3-line file exporting an empty Router.

---

## 5. Error Handling

Following the existing `errorHandler.js` pattern:

| Condition | Error Name | Status |
|-----------|-----------|--------|
| Missing/invalid JWT | `UnauthorizedError` | 401 |
| Expired JWT | `UnauthorizedError` | 401 |
| Inactive user | `ForbiddenError` | 403 |
| Duplicate email on register | `ConflictError` | 409 |
| Invalid credentials | `UnauthorizedError` | 401 |
| Missing required fields | `ValidationError` | 400 |
| User not found | `NotFoundError` | 404 |
| Invalid OAuth state | `UnauthorizedError` | 401 |
| GitHub API failure | `ServerError` | 502 |

---

## 6. Environment Variables Expected

```env
JWT_SECRET=<random-256-bit-string>
ENCRYPTION_KEY=<32-byte-hex-string>
GITHUB_CLIENT_ID=<github-oauth-app-client-id>
GITHUB_CLIENT_SECRET=<github-oauth-app-secret>
GITHUB_REDIRECT_URI=http://localhost:3001/api/v1/users/auth/github/callback
```

---

## 7. Self-Review Checklist (code-review skill)

- [ ] All error throw names match errorHandler.js patterns
- [ ] bcrypt cost factor = 12
- [ ] JWT payload only contains `{ userId, email }`
- [ ] Passwords never logged or returned
- [ ] GitHub token encrypted before storage; plaintext discarded
- [ ] Auth middleware checks user still active
- [ ] Controllers use async wrappers with next(err)
- [ ] Factory exports for services? No — object literal exports for utilities, class/object for services
- [ ] Sequelize operations use `findOne`/`findByPk` consistently
- [ ] Sensitive fields excluded from responses using `attributes` or manual omit