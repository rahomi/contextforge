const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const aiController = require('../controllers/ai.controller');

// All AI routes require authentication
router.use(auth);

// Chat & Generation
router.post('/chat', aiController.chat);
router.post('/generate', aiController.generate);

// Conversations CRUD
router.post('/conversations', aiController.createConversation);
router.get('/conversations', aiController.listConversations);
router.get('/conversations/:id', aiController.getConversation);
router.put('/conversations/:id', aiController.updateConversation);
router.delete('/conversations/:id', aiController.removeConversation);

// Messages
router.get('/conversations/:id/messages', aiController.listMessages);
router.post('/conversations/:id/messages', aiController.sendMessage);
router.get('/conversations/:id/messages/:messageId', aiController.getMessage);

// Embeddings & Search
router.post('/embeddings', aiController.createEmbedding);
router.post('/search', aiController.semanticSearch);

module.exports = router;
