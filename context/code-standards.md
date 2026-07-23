# ContextForge - Code Standards

## Naming Conventions

### General Rules
- Use descriptive and meaningful names
- Avoid abbreviations unless they are widely recognized
- Use consistent naming patterns across the codebase

### PHP (Laravel)
- **Classes:** PascalCase (e.g., `RepositoryAnalysisService`)
- **Methods:** camelCase (e.g., `analyzeRepository`)
- **Variables:** snake_case (e.g., `$repository_data`)
- **Constants:** UPPER_SNAKE_CASE (e.g., `MAX_RETRY_ATTEMPTS`)
- **Database Tables:** snake_case, plural (e.g., `repository_analyses`)
- **Database Columns:** snake_case (e.g., `created_at`)

### JavaScript/TypeScript (React)
- **Components:** PascalCase (e.g., `RepositoryCard`)
- **Hooks:** camelCase with `use` prefix (e.g., `useRepositoryAnalysis`)
- **Functions:** camelCase (e.g., `fetchRepositoryData`)
- **Variables:** camelCase (e.g., `repositoryData`)
- **Constants:** UPPER_SNAKE_CASE (e.g., `API_BASE_URL`)
- **Files:** 
  - Components: PascalCase (e.g., `RepositoryCard.jsx`)
  - Hooks: camelCase with `use` prefix (e.g., `useRepositoryAnalysis.js`)
  - Utilities: camelCase (e.g., `formatDate.js`)
  - Styles: kebab-case (e.g., `repository-card.css`)

## Folder Structure

### Backend (Laravel)
```
src/backend/
├── app/
│   ├── Console/          # Artisan commands
│   ├── Exceptions/       # Exception handling
│   ├── Http/
│   │   ├── Controllers/  # API controllers
│   │   ├── Middleware/    # HTTP middleware
│   │   └── Requests/     # Form request validation
│   ├── Models/           # Eloquent models
│   ├── Services/         # Business logic services
│   └── Repositories/     # Data access layer (optional)
├── bootstrap/            # Application bootstrapping
├── config/               # Configuration files
├── database/
│   ├── migrations/       # Database migrations
│   └── seeders/          # Database seeders
├── routes/               # Route definitions
│   ├── api.php          # API routes
│   └── web.php          # Web routes (if needed)
└── tests/                # Tests
    ├── Unit/            # Unit tests
    └── Feature/         # Feature tests
```

### Frontend (React)
```
src/frontend/
├── public/               # Static files
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── common/       # Generic components (Button, Modal, etc.)
│   │   └── features/     # Feature-specific components
│   ├── pages/            # Page components (route-level)
│   ├── hooks/            # Custom React hooks
│   ├── context/          # React context providers
│   ├── services/         # API service functions
│   ├── utils/            # Utility functions
│   ├── types/            # TypeScript type definitions
│   ├── styles/           # Global styles and themes
│   ├── App.js           # Main application component
│   └── index.js         # Application entry point
└── tests/                # Tests
    ├── components/      # Component tests
    ├── hooks/           # Hook tests
    └── pages/           # Page tests
```

## Formatting Rules

### PHP
- Follow PSR-12 coding style
- Use 4 spaces for indentation
- Use blank lines between methods
- Use single blank line after namespace declaration
- Use `declare(strict_types=1);` at the top of files

### JavaScript/TypeScript
- Use ESLint with Airbnb or Prettier configuration
- Use 2 spaces for indentation
- Use single quotes for strings
- Use trailing commas in multi-line arrays/objects
- Use semicolons at the end of statements
- Maximum line length: 100 characters

### CSS/SCSS
- Use BEM naming convention for classes
- Use 2 spaces for indentation
- Use one space before the opening brace
- Use one newline after the closing brace
- Order: Positioning > Box Model > Typography > Visual > Misc

## Error Handling Approach

### Backend
- Use Laravel's exception handling system
- Create custom exceptions for business logic errors
- Return consistent error response format:
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The given data was invalid.",
    "details": {
      "email": ["The email field is required."]
    }
  }
}
```
- Log all exceptions with context
- Use try-catch blocks for external service calls

### Frontend
- Use error boundaries for component errors
- Use try-catch for async operations
- Display user-friendly error messages
- Log errors to monitoring service (Sentry)
- Use toast notifications for non-critical errors

## Testing Standards

### Test Types
1. **Unit Tests** - Test individual functions/methods in isolation
2. **Integration Tests** - Test interactions between components
3. **Feature Tests** - Test complete user workflows
4. **End-to-End Tests** - Test the entire application (future)

### Test Coverage
- Aim for 80%+ code coverage on new features
- Critical paths must have 100% test coverage
- Write tests before fixing bugs (TDD when possible)

### Test Environment
- Use in-memory SQLite for unit tests (fast)
- Use PostgreSQL for feature tests (production-like)
- Mock external services (GitHub API, AI services)
- Use factories for test data generation

### Naming Conventions
- Test files: `*Test.php` (Laravel) or `*.test.js` (Jest)
- Test methods: `test_<method_name>_with_<condition>_should_<expected>`
- Use `@test` annotation in Laravel

## Security Practices

### Authentication & Authorization
- Use Laravel Sanctum for API authentication
- Implement role-based access control (RBAC)
- Use policies for authorization checks
- Never expose sensitive data in API responses

### Input Validation
- Validate all user input on the server
- Use Form Request validation in Laravel
- Sanitize HTML input to prevent XSS
- Use parameterized queries to prevent SQL injection

### API Security
- Implement rate limiting on all endpoints
- Use CSRF protection for web routes
- Set appropriate CORS headers
- Use HTTPS in production
- Validate Content-Type headers

### Data Protection
- Encrypt sensitive data at rest
- Use hashing for passwords (bcrypt)
- Implement proper session management
- Log security-related events
- Follow GDPR principles for user data

### Dependency Management
- Regularly update dependencies
- Use Dependabot or similar tools
- Review security advisories
- Remove unused dependencies

## Code Review Checklist

### Functionality
- [ ] Does the code work as expected?
- [ ] Are all edge cases handled?
- [ ] Is error handling appropriate?

### Code Quality
- [ ] Is the code readable and maintainable?
- [ ] Does it follow coding standards?
- [ ] Are there any code smells?

### Testing
- [ ] Are there adequate tests?
- [ ] Do tests cover edge cases?
- [ ] Are tests readable and maintainable?

### Security
- [ ] Is input validated?
- [ ] Are there any security vulnerabilities?
- [ ] Is sensitive data protected?

### Performance
- [ ] Is the code efficient?
- [ ] Are there any N+1 query problems?
- [ ] Is caching used appropriately?

### Documentation
- [ ] Is code self-documenting?
- [ ] Are complex algorithms explained?
- [ ] Are API changes documented?
</contents>