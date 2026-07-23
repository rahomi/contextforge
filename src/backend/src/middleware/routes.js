const express = require('express');
const router = express.Router();

// Import route modules
const repositoryRoutes = require('./repository.routes');
const knowledgeBaseRoutes = require('./knowledgeBase.routes');
const aiRoutes = require('./ai.routes');
const userRoutes = require('./user.routes');

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'api ok' });
});

// API v1 routes
router.use('/v1/repositories', repositoryRoutes);
router.use('/v1/knowledge-base', knowledgeBaseRoutes);
router.use('/v1/ai', aiRoutes);
router.use('/v1/users', userRoutes);

module.exports = router;
</contents>