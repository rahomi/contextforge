const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const knowledgeBaseController = require('../controllers/knowledgeBase.controller');

// Knowledge Base routes — all routes require authentication
router.use(auth);

// Tag management (must come before /:id routes)
router.get('/tags', knowledgeBaseController.listTags);
router.post('/tags', knowledgeBaseController.createTag);
router.put('/tags/:tagId', knowledgeBaseController.updateTag);
router.delete('/tags/:tagId', knowledgeBaseController.removeTag);

// Search (must come before /:id routes)
router.get('/search', knowledgeBaseController.search);

// Document CRUD
router.post('/', knowledgeBaseController.create);
router.get('/', knowledgeBaseController.list);
router.get('/:id', knowledgeBaseController.getById);
router.put('/:id', knowledgeBaseController.update);
router.delete('/:id', knowledgeBaseController.remove);

// Document versioning
router.get('/:id/versions', knowledgeBaseController.listVersions);
router.get('/:id/versions/:versionId', knowledgeBaseController.getVersion);

module.exports = router;
