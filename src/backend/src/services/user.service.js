const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { User } = require('../models');
const encryptionService = require('./encryption.service');

const SALT_ROUNDS = 12;
const TOKEN_EXPIRY = '24h';

// In-memory store for OAuth states (production would use Redis)
const oauthStateStore = new Map();

/**
 * Extracts safe user data (excludes sensitive fields).
 */
function sanitizeUser(user) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    avatar_url: user.avatar_url,
    github_id: user.github_id,
    preferences: user.preferences,
    last_login_at: user.last_login_at,
    is_active: user.is_active,
    created_at: user.created_at,
    updated_at: user.updated_at
  };
}

/**
 * Generates a JWT for the given user.
 */
function generateToken(user) {
  const payload = {
    userId: user.id,
    email: user.email
  };

  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
}

/**
 * Validates email format.
 */
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Validates password strength (minimum 8 chars, at least 1 letter and 1 number).
 */
function isValidPassword(password) {
  return password && password.length >= 8 && /[a-zA-Z]/.test(password) && /[0-9]/.test(password);
}

/**
 * Register a new user with email, password, and name.
 */
async function register(email, password, name) {
  if (!email || !password || !name) {
    throw Object.assign(
      new Error('Email, password, and name are required'),
      { name: 'ValidationError' }
    );
  }

  if (!isValidEmail(email)) {
    throw Object.assign(
      new Error('Invalid email format'),
      { name: 'ValidationError' }
    );
  }

  if (!isValidPassword(password)) {
    throw Object.assign(
      new Error('Password must be at least 8 characters with at least 1 letter and 1 number'),
      { name: 'ValidationError' }
    );
  }

  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    throw Object.assign(
      new Error('A user with this email already exists'),
      { name: 'ConflictError' }
    );
  }

  const password_hash = await bcrypt.hash(password, SALT_ROUNDS);

  const user = await User.create({
    email,
    name,
    password_hash
  });

  const token = generateToken(user);

  return {
    user: sanitizeUser(user),
    token
  };
}

/**
 * Login with email and password.
 */
async function login(email, password) {
  if (!email || !password) {
    throw Object.assign(
      new Error('Email and password are required'),
      { name: 'ValidationError' }
    );
  }

  const user = await User.findOne({ where: { email, is_active: true } });
  if (!user) {
    throw Object.assign(
      new Error('Invalid email or password'),
      { name: 'UnauthorizedError' }
    );
  }

  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) {
    throw Object.assign(
      new Error('Invalid email or password'),
      { name: 'UnauthorizedError' }
    );
  }

  user.last_login_at = new Date();
  await user.save();

  const token = generateToken(user);

  return {
    user: sanitizeUser(user),
    token
  };
}

/**
 * Logout placeholder.
 */
async function logout(userId) {
  return { message: 'Logged out successfully' };
}

/**
 * Get user profile by ID (safe fields only).
 */
async function getProfile(userId) {
  const user = await User.findByPk(userId);
  if (!user) {
    throw Object.assign(
      new Error('User not found'),
      { name: 'NotFoundError' }
    );
  }

  return sanitizeUser(user);
}

/**
 * Update user profile fields.
 */
async function updateProfile(userId, updates) {
  const user = await User.findByPk(userId);
  if (!user) {
    throw Object.assign(
      new Error('User not found'),
      { name: 'NotFoundError' }
    );
  }

  const allowedFields = ['name', 'avatar_url', 'preferences'];
  const filteredUpdates = {};

  for (const field of allowedFields) {
    if (updates[field] !== undefined) {
      filteredUpdates[field] = updates[field];
    }
  }

  if (Object.keys(filteredUpdates).length === 0) {
    throw Object.assign(
      new Error('No valid fields to update. Allowed: name, avatar_url, preferences'),
      { name: 'ValidationError' }
    );
  }

  if (filteredUpdates.preferences !== undefined) {
    if (typeof filteredUpdates.preferences !== 'object' || Array.isArray(filteredUpdates.preferences)) {
      throw Object.assign(
        new Error('Preferences must be a JSON object'),
        { name: 'ValidationError' }
      );
    }
  }

  await user.update(filteredUpdates);
  return sanitizeUser(user);
}

/**
 * Initiate GitHub OAuth flow.
 */
async function initiateGitHubOAuth() {
  const clientId = process.env.GITHUB_CLIENT_ID;
  if (!clientId) {
    throw Object.assign(
      new Error('GitHub OAuth is not configured'),
      { name: 'ServerError' }
    );
  }

  const state = crypto.randomBytes(32).toString('hex');

  oauthStateStore.set(state, {
    created_at: Date.now()
  });

  for (const [key, value] of oauthStateStore.entries()) {
    if (Date.now() - value.created_at > 600000) {
      oauthStateStore.delete(key);
    }
  }

  const redirectUri = process.env.GITHUB_REDIRECT_URI || 'http://localhost:3001/api/v1/users/auth/github/callback';
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: 'read:user user:email',
    state
  });

  const url = `https://github.com/login/oauth/authorize?${params.toString()}`;

  return { url, state };
}

/**
 * Handle GitHub OAuth callback.
 */
async function handleGitHubCallback(code, state) {
  if (!code || !state) {
    throw Object.assign(
      new Error('Missing code or state parameter'),
      { name: 'ValidationError' }
    );
  }

  const storedState = oauthStateStore.get(state);
  if (!storedState) {
    throw Object.assign(
      new Error('Invalid or expired state parameter'),
      { name: 'UnauthorizedError' }
    );
  }

  if (Date.now() - storedState.created_at > 600000) {
    oauthStateStore.delete(state);
    throw Object.assign(
      new Error('State parameter has expired'),
      { name: 'UnauthorizedError' }
    );
  }

  oauthStateStore.delete(state);

  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw Object.assign(
      new Error('GitHub OAuth is not configured'),
      { name: 'ServerError' }
    );
  }

  let tokenResponse;
  try {
    const params = new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      code
    });

    const response = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      body: params.toString()
    });

    tokenResponse = await response.json();
  } catch (err) {
    throw Object.assign(
      new Error('Failed to exchange code with GitHub'),
      { name: 'ServerError' }
    );
  }

  if (tokenResponse.error) {
    throw Object.assign(
      new Error(`GitHub OAuth error: ${tokenResponse.error_description || tokenResponse.error}`),
      { name: 'UnauthorizedError' }
    );
  }

  const accessToken = tokenResponse.access_token;
  if (!accessToken) {
    throw Object.assign(
      new Error('No access token returned from GitHub'),
      { name: 'ServerError' }
    );
  }

  let githubUser;
  try {
    const response = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`GitHub API responded with ${response.status}`);
    }

    githubUser = await response.json();
  } catch (err) {
    throw Object.assign(
      new Error('Failed to fetch GitHub user info'),
      { name: 'ServerError' }
    );
  }

  const encrypted = encryptionService.encrypt(accessToken);
  const encryptedToken = JSON.stringify(encrypted);

  let user = await User.findOne({
    where: {
      [require('sequelize').Op.or]: [
        { github_id: String(githubUser.id) },
        { email: githubUser.email }
      ]
    }
  });

  if (user) {
    await user.update({
      github_id: String(githubUser.id),
      github_token_encrypted: encryptedToken,
      avatar_url: user.avatar_url || githubUser.avatar_url,
      name: githubUser.name || user.name
    });
  } else {
    const userEmail = githubUser.email || `github-${githubUser.id}@placeholder.contextforge.app`;

    user = await User.create({
      email: userEmail,
      name: githubUser.name || githubUser.login || 'GitHub User',
      avatar_url: githubUser.avatar_url,
      github_id: String(githubUser.id),
      github_token_encrypted: encryptedToken,
      password_hash: null
    });
  }

  const token = generateToken(user);

  return {
    user: sanitizeUser(user),
    token
  };
}

module.exports = {
  register,
  login,
  logout,
  getProfile,
  updateProfile,
  initiateGitHubOAuth,
  handleGitHubCallback
};
