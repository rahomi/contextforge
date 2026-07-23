/**
 * Pluggable AI Provider abstraction.
 *
 * Wraps AI model access (Omniroute, OpenAI, etc.) behind a consistent interface.
 * Current implementation returns stubbed responses — swap for real SDK calls
 * without changing ai.service.js logic.
 *
 * @module ai.provider
 */

const STUB_DELAY_MS = 800; // Simulated network latency
const STUB_MODEL = 'stub-gpt-4';
const EMBEDDING_DIMENSIONS = 1536;

/**
 * Simulates a short delay to mimic real API latency.
 * @param {number} [ms=STUB_DELAY_MS]
 */
function delay(ms = STUB_DELAY_MS) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Picks a random index from an array length.
 * @param {number} length
 * @returns {number}
 */
function randomIndex(length) {
  return Math.floor(Math.random() * length);
}

/**
 * Simulated response templates keyed by detected intent.
 */
function buildStubResponse(messages) {
  // Find the last user message
  const lastUserMsg = [...messages].reverse().find((m) => m.role === 'user');
  const userContent = (lastUserMsg && lastUserMsg.content) || '';

  const lower = userContent.toLowerCase();

  if (lower.includes('explain') || lower.includes('what is') || lower.includes('how does')) {
    return {
      content: `**Analysis Result**\n\nBased on my understanding of the codebase, here's what I found:\n\n1. **Architecture**: The application follows a modular service-controller pattern with Express.js routes.\n2. **Data Flow**: Requests pass through auth middleware → controller → service → model layer.\n3. **Key Components**: The module integrates with existing authentication, repository, and knowledge base systems.\n\nThis approach ensures separation of concerns and maintainability. The codebase uses Sequelize ORM for database operations and follows consistent error handling patterns via the errorHandler middleware.\n\nWould you like me to dive deeper into any specific area?`,
      tokens_used: 145 + Math.floor(Math.random() * 60),
      model: STUB_MODEL
    };
  }

  if (lower.includes('generate') || lower.includes('write') || lower.includes('create') || lower.includes('document')) {
    return {
      content: `**Generated Documentation**\n\n## Module Overview\n\nThis module provides AI-powered assistance for the ContextForge platform. It handles conversation management, message exchange, and intelligent content generation.\n\n## Key Features\n\n- **Conversation Management**: Create, list, update, and soft-delete conversations\n- **Message Exchange**: Send messages and receive AI-generated responses\n- **Content Generation**: Generate documentation, summaries, and code analysis\n- **Semantic Search**: Search across knowledge documents using embeddings\n\n## Usage Examples\n\n\`\`\`javascript\n// Initialize a new conversation\nconst conversation = await aiService.createConversation(userId, {\n  title: 'Code Review: Auth Module',\n  repository_id: repoId\n});\n\n// Send a message\nconst response = await aiService.sendMessage(userId, conversation.id, {\n  content: 'Analyze the authentication flow',\n  role: 'user'\n});\n\`\`\`\n\n## Configuration\n\nThe AI provider is configured via environment variables and supports pluggable backends (Omniroute, OpenAI, etc.).`,
      tokens_used: 215 + Math.floor(Math.random() * 40),
      model: STUB_MODEL
    };
  }

  if (lower.includes('summarize') || lower.includes('summary')) {
    return {
      content: `**Summary**\n\nThe requested content covers the core functionality of the ContextForge AI Assistant module. Key points include:\n\n- **Conversation management** with full CRUD operations and soft-delete support\n- **Message exchange** with role-based messages (user/assistant/system)\n- **AI provider abstraction** for flexible model integration\n- **Embedding support** for semantic search capabilities\n- **Ownership enforcement** ensuring users only access their own data\n\nThis module follows the same patterns as existing modules (repositories, knowledge base) and integrates seamlessly with the auth middleware for route protection.`,
      tokens_used: 128 + Math.floor(Math.random() * 30),
      model: STUB_MODEL
    };
  }

  if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
    return {
      content: `Hello! I'm the ContextForge AI Assistant. I can help you with:\n\n- **Code Analysis**: Understanding and explaining codebases\n- **Documentation Generation**: Creating comprehensive docs\n- **Engineering Support**: Answering technical questions\n- **Code Review**: Analyzing code quality and patterns\n\nHow can I assist you today?`,
      tokens_used: 62 + Math.floor(Math.random() * 20),
      model: STUB_MODEL
    };
  }

  // Default fallback response
  return {
    content: `**Response**\n\nI've analyzed your request regarding "${userContent.slice(0, 100)}". Here are my findings:\n\n1. The ContextForge platform provides robust AI-powered developer productivity tools.\n2. Your request has been processed through the AI assistant pipeline.\n3. The system is operating normally with all services available.\n\nFor more specific assistance, please provide additional details about what you'd like to explore.\n\n*This is a simulated AI response. In production, this would be powered by Omniroute/OpenAI.*`,
    tokens_used: 98 + Math.floor(Math.random() * 40),
    model: STUB_MODEL
  };
}

/**
 * Chat completion: send a list of messages and receive an AI response.
 *
 * @param {Array<{role: string, content: string}>} messages - Message history
 * @param {object} [options={}]
 * @param {string} [options.model] - Model identifier override
 * @param {number} [options.temperature] - Response creativity (0-2)
 * @returns {Promise<{content: string, tokens_used: number, model: string}>}
 */
async function chat(messages, options = {}) {
  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    throw Object.assign(
      new Error('Messages array is required and must not be empty'),
      { name: 'ValidationError' }
    );
  }

  await delay(options.delay || STUB_DELAY_MS);

  return {
    ...buildStubResponse(messages),
    model: options.model || STUB_MODEL
  };
}

/**
 * Text generation without conversation context.
 *
 * @param {string} prompt - The generation prompt
 * @param {object} [options={}]
 * @param {string} [options.model]
 * @param {number} [options.temperature]
 * @returns {Promise<{content: string, tokens_used: number, model: string}>}
 */
async function generate(prompt, options = {}) {
  if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
    throw Object.assign(
      new Error('Prompt is required and must be a non-empty string'),
      { name: 'ValidationError' }
    );
  }

  await delay(options.delay || STUB_DELAY_MS);

  const fakeMessages = [{ role: 'user', content: prompt }];

  return {
    ...buildStubResponse(fakeMessages),
    model: options.model || STUB_MODEL
  };
}

/**
 * Generate an embedding vector for the given text.
 * Returns a mock 1536-dimensional vector (real implementation would call OpenAI / Omniroute).
 *
 * @param {string} text - Text to embed
 * @param {object} [options={}]
 * @param {string} [options.model]
 * @returns {Promise<{vector: number[], model: string, tokens_used: number}>}
 */
async function createEmbedding(text, options = {}) {
  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    throw Object.assign(
      new Error('Text is required for embedding'),
      { name: 'ValidationError' }
    );
  }

  await delay(200);

  // Generate a deterministic-ish mock vector based on text length + random seed
  const seed = text.length;
  const vector = [];

  for (let i = 0; i < EMBEDDING_DIMENSIONS; i++) {
    // Pseudo-random value between -1 and 1 using a simple hash
    const val = Math.sin(seed * (i + 1) * 0.01) * 0.5 + Math.random() * 0.5;
    vector.push(parseFloat(val.toFixed(6)));
  }

  // Normalize the vector (unit length)
  const magnitude = Math.sqrt(vector.reduce((sum, v) => sum + v * v, 0));
  const normalized = vector.map((v) => parseFloat((v / magnitude).toFixed(6)));

  return {
    vector: normalized,
    model: options.model || 'stub-text-embedding-ada-002',
    tokens_used: Math.ceil(text.length / 4)
  };
}

/**
 * Streaming chat completion via AsyncGenerator.
 * Yields chunks of text for Server-Sent Events (SSE).
 *
 * @param {Array<{role: string, content: string}>} messages - Message history
 * @param {object} [options={}]
 * @param {string} [options.model]
 * @returns {AsyncGenerator<{chunk: string, done: boolean}>}
 */
async function* streamChat(messages, options = {}) {
  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    throw Object.assign(
      new Error('Messages array is required and must not be empty'),
      { name: 'ValidationError' }
    );
  }

  const response = buildStubResponse(messages);
  const fullContent = response.content;

  // Simulate streaming by splitting into word-sized chunks with small delays
  const words = fullContent.split(' ');
  const totalChunks = words.length;

  for (let i = 0; i < totalChunks; i++) {
    const chunk = (i === 0 ? '' : ' ') + words[i];
    await delay(30 + Math.floor(Math.random() * 20));

    yield {
      chunk,
      done: false
    };
  }

  // Final metadata chunk
  yield {
    chunk: '',
    done: true,
    metadata: {
      tokens_used: response.tokens_used,
      model: response.model
    }
  };
}

/**
 * Compute cosine similarity between two vectors.
 *
 * @param {number[]} vecA
 * @param {number[]} vecB
 * @returns {number} Similarity score between -1 and 1
 */
function cosineSimilarity(vecA, vecB) {
  if (!vecA || !vecB || vecA.length !== vecB.length) {
    return 0;
  }

  let dotProduct = 0;
  let magA = 0;
  let magB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    magA += vecA[i] * vecA[i];
    magB += vecB[i] * vecB[i];
  }

  const magnitude = Math.sqrt(magA) * Math.sqrt(magB);

  if (magnitude === 0) {
    return 0;
  }

  return dotProduct / magnitude;
}

module.exports = {
  chat,
  generate,
  createEmbedding,
  streamChat,
  cosineSimilarity
};