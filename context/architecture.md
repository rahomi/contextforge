# ContextForge - Architecture

## System Architecture
ContextForge follows a modern three-tier architecture with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────────┐
│                      Client Layer                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐│
│  │   React     │  │  Mobile App │  │   Browser Extension ││
│  │   Web App   │  │  (Future)   │  │      (Future)       ││
│  └─────────────┘  └─────────────┘  └─────────────────────┘│
└─────────────────────────────────────────────────────────────┘
                              │
                              │ REST API / WebSocket
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      API Gateway Layer                      │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐│
│  │  Rate       │  │  Auth       │  │    Request          ││
│  │  Limiting   │  │  Middleware │  │    Validation       ││
│  └─────────────┘  └─────────────┘  └─────────────────────┘│
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Application Layer                       │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐│
│  │  Controllers│  │  Services   │  │    Business Logic   ││
│  └─────────────┘  └─────────────┘  └─────────────────────┘│
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      Data Layer                            │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐│
│  │  PostgreSQL │  │    Redis    │  │    File Storage     ││
│  │  Database   │  │   Cache     │  │      (S3)           ││
│  └─────────────┘  └─────────────┘  └─────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

## Technology Choices

### Backend: Laravel (PHP)
- **Why Laravel?** Mature ecosystem, excellent ORM, built-in authentication, queue system
- **API Style:** RESTful with versioning (v1, v2, etc.)
- **Authentication:** Laravel Sanctum for API tokens + OAuth for third-party
- **Queue System:** Redis/SQS for background jobs (repo analysis, notifications)

### Frontend: React
- **Why React?** Component-based architecture, large ecosystem, TypeScript support
- **State Management:** React Context + useReducer (simple) or Zustand (complex)
- **Routing:** React Router v6
- **UI Library:** Tailwind CSS + Headless UI for accessibility

### Database: PostgreSQL
- **Why PostgreSQL?** Advanced features, full-text search, JSON support, pgvector for semantic search
- **Search:** PostgreSQL full-text search + pgvector for AI embeddings
- **Cache:** Redis for session, queue, and application caching

### AI Integration: Omniroute
- **Model Gateway:** Centralized AI model access (OpenAI, Anthropic, etc.)
- **Embeddings:** For semantic search in knowledge base
- **Streaming:** For real-time AI responses in chat interface

### Infrastructure: Docker + GitHub Actions
- **Containerization:** Docker for development and production consistency
- **CI/CD:** GitHub Actions for testing, building, deployment
- **Hosting:** AWS/Railway/Vercel (depending on requirements)

## Database Design

### Core Tables
```sql
-- Users and Authentication
users (id, email, name, avatar, github_id, ...)
sessions (id, user_id, token, expires_at, ...)

-- Repository Management
repositories (id, user_id, name, full_name, github_url, ...)
repository_analyses (id, repo_id, analysis_type, results_json, ...)
repository_metrics (id, repo_id, metric_type, value, recorded_at, ...)

-- Knowledge Base
knowledge_documents (id, user_id, title, content, category, ...)
tags (id, name, color)
document_tags (document_id, tag_id)
document_versions (id, document_id, content, version, ...)

-- AI Interactions
ai_conversations (id, user_id, repo_id, title, ...)
ai_messages (id, conversation_id, role, content, ...)
ai_embeddings (id, message_id, embedding_vector, ...)

-- Analytics
engineering_activity (id, user_id, repo_id, activity_type, ...)
```

## Application Layers

### 1. Presentation Layer (React)
- Components, pages, hooks, context providers
- State management and API communication
- Responsive design and accessibility

### 2. API Layer (Laravel)
- Controllers for request handling
- Form request validation
- API Resources for response formatting
- Middleware for authentication, rate limiting

### 3. Service Layer
- Business logic encapsulation
- External service integration (GitHub, AI models)
- Data transformation and validation

### 4. Data Layer
- Eloquent models and relationships
- Database migrations and seeders
- Repositories for data access abstraction

### 5. Infrastructure Layer
- Queue jobs for background processing
- Event listeners for system events
- Notifications for user alerts

## External Integrations

### GitHub API
- Repository metadata and analysis
- Commit and PR data
- User authentication (OAuth)
- Webhook support for real-time updates

### AI Services (via Omniroute)
- Code analysis and understanding
- Documentation generation
- Chat completions for AI assistant
- Embeddings for semantic search

### Storage Services
- AWS S3 or similar for file storage
- Image uploads, document attachments

### Monitoring Services
- Sentry for error tracking
- LogRocket for session replay (optional)
- Custom analytics for usage tracking

## Architectural Constraints

### 1. Security First
- All API endpoints require authentication
- Input validation on both client and server
- CSRF protection for web routes
- Rate limiting to prevent abuse

### 2. Performance Requirements
- API responses < 200ms for standard operations
- Background jobs for heavy processing
- Caching for frequently accessed data
- Optimistic UI updates for better UX

### 3. Scalability Considerations
- Stateless API servers (horizontal scaling)
- Database read replicas for analytics
- Queue workers for background processing
- CDN for static assets

### 4. Maintainability
- Clear separation of concerns
- Comprehensive testing (unit, integration, feature)
- Documentation for all major components
- Consistent coding standards

### 5. Extensibility
- Plugin system for future modules
- Webhook support for external integrations
- API versioning for backward compatibility
- Feature flags for gradual rollouts
</contents>