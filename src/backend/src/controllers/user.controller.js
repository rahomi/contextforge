const userService = require('../services/user.service');

/**
 * Wraps async route handlers to catch errors and pass to next().
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

/**
 * POST /api/v1/users/register
 * Create a new user account.
 */
const register = asyncHandler(async (req, res) => {
  const { email, password, name } = req.body;

  const result = await userService.register(email, password, name);

  res.status(201).json({
    data: {
      user: result.user,
      token: result.token
    }
  });
});

/**
 * POST /api/v1/users/login
 * Authenticate user and return JWT.
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const result = await userService.login(email, password);

  res.status(200).json({
    data: {
      user: result.user,
      token: result.token
    }
  });
});

/**
 * POST /api/v1/users/logout
 * Invalidate current session (placeholder).
 */
const logout = asyncHandler(async (req, res) => {
  const result = await userService.logout(req.user.id);

  res.status(200).json({
    data: result
  });
});

/**
 * GET /api/v1/users/me
 * Get current user profile.
 */
const getProfile = asyncHandler(async (req, res) => {
  const user = await userService.getProfile(req.user.id);

  res.status(200).json({
    data: {
      user
    }
  });
});

/**
 * PUT /api/v1/users/me
 * Update current user profile.
 */
const updateProfile = asyncHandler(async (req, res) => {
  const updates = req.body;

  const user = await userService.updateProfile(req.user.id, updates);

  res.status(200).json({
    data: {
      user
    }
  });
});

/**
 * GET /api/v1/users/auth/github
 * Initiate GitHub OAuth flow.
 */
const initiateGitHubOAuth = asyncHandler(async (req, res) => {
  const result = await userService.initiateGitHubOAuth();

  res.status(200).json({
    data: {
      url: result.url,
      state: result.state
    }
  });
});

/**
 * GET /api/v1/users/auth/github/callback
 * Handle GitHub OAuth callback.
 */
const handleGitHubCallback = asyncHandler(async (req, res) => {
  const { code, state } = req.query;

  const result = await userService.handleGitHubCallback(code, state);

  res.status(200).json({
    data: {
      user: result.user,
      token: result.token
    }
  });
});

module.exports = {
  register,
  login,
  logout,
  getProfile,
  updateProfile,
  initiateGitHubOAuth,
  handleGitHubCallback
};
