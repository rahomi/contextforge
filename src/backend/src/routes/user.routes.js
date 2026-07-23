const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { auth } = require('../middleware/auth');

// Public routes
router.post('/register', userController.register);
router.post('/login', userController.login);

// OAuth routes (public - initiate flow)
router.get('/auth/github', userController.initiateGitHubOAuth);
router.get('/auth/github/callback', userController.handleGitHubCallback);

// Protected routes (require auth middleware)
router.post('/logout', auth, userController.logout);
router.get('/me', auth, userController.getProfile);
router.put('/me', auth, userController.updateProfile);

module.exports = router;
