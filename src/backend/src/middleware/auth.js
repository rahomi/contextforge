const jwt = require('jsonwebtoken');
const { User } = require('../models');

/**
 * JWT authentication middleware.
 * Verifies the Bearer token, checks user is active,
 * and attaches req.user = { id, email }.
 */
const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw Object.assign(
        new Error('Missing or invalid authorization header'),
        { name: 'UnauthorizedError' }
      );
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      throw Object.assign(
        new Error('Token not provided'),
        { name: 'UnauthorizedError' }
      );
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        throw Object.assign(
          new Error('Token has expired'),
          { name: 'UnauthorizedError' }
        );
      }
      throw Object.assign(
        new Error('Invalid token'),
        { name: 'UnauthorizedError' }
      );
    }

    // Verify user still exists and is active
    const user = await User.findByPk(decoded.userId, {
      attributes: ['id', 'email', 'is_active']
    });

    if (!user) {
      throw Object.assign(
        new Error('User not found'),
        { name: 'UnauthorizedError' }
      );
    }

    if (!user.is_active) {
      throw Object.assign(
        new Error('Account is deactivated'),
        { name: 'ForbiddenError' }
      );
    }

    // Attach user info to request
    req.user = {
      id: user.id,
      email: user.email
    };

    next();
  } catch (err) {
    next(err);
  }
};

module.exports = { auth };
