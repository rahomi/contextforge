const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const repositoryController = require('../controllers/repository.controller');

// Repository routes — all routes require authentication
router.use(auth);

// Repository CRUD
router.post('/', repositoryController.create);
router.get('/', repositoryController.list);
router.get('/:id', repositoryController.getById);
router.put('/:id', repositoryController.update);
router.delete('/:id', repositoryController.remove);

// Analysis endpoints
router.post('/:id/analyze', repositoryController.triggerAnalysis);
router.get('/:id/analyses', repositoryController.listAnalyses);
router.get('/:id/analyses/:analysisId', repositoryController.getAnalysisById);

// Metrics and stats
router.get('/:id/metrics', repositoryController.getMetrics);
router.get('/:id/stats', repositoryController.getStats);

module.exports = router;
