# ContextForge - AI Workflow Rules

## Core Principles

### 1. Understand Before Changing
**Rule:** Always understand the existing code before making modifications.

**Implementation:**
- Read related files and documentation first
- Understand the current architecture and patterns
- Identify existing conventions and standards
- Review recent changes to understand context

**Example:**
```markdown
Before modifying the RepositoryController:
1. Read the current controller implementation
2. Check the related models (Repository, RepositoryAnalysis)
3. Review the service layer (RepositoryAnalysisService)
4. Understand the existing API routes
5. Check tests for expected behavior
```

### 2. Create a Plan Before Implementation
**Rule:** Develop a clear implementation plan before writing code.

**Implementation:**
- Break down complex tasks into smaller steps
- Identify potential risks and edge cases
- Consider impact on existing functionality
- Plan for testing and documentation

**Template:**
```markdown
## Implementation Plan: [Feature Name]

### Objective
[What we are trying to achieve]

### Steps
1. [Step 1]
2. [Step 2]
3. [Step 3]

### Considerations
- [Risk 1]
- [Risk 2]
- [Edge Case 1]

### Testing Strategy
- [How to test]
- [What to test]

### Documentation Updates
- [What documentation needs updating]
```

### 3. Ask Questions When Requirements Are Unclear
**Rule:** Seek clarification when requirements are ambiguous or incomplete.

**Implementation:**
- Identify unclear requirements before implementation
- Ask specific questions with options when possible
- Document assumptions if immediate clarification isn't possible
- Use the specification template for new features

**Example Questions:**
```markdown
1. "Should this endpoint return paginated results? If so, what should be the default page size?"
2. "When a repository is deleted, should we also delete associated analyses?"
3. "What is the expected behavior when the AI service is unavailable?"
```

### 4. Prefer Existing Patterns
**Rule:** Follow established patterns and conventions in the codebase.

**Implementation:**
- Study existing implementations for similar features
- Reuse existing components, services, and utilities
- Maintain consistency in naming, structure, and approach
- Avoid introducing new patterns without strong justification

**Reference Points:**
- Existing controllers and their structure
- Service layer patterns
- Frontend component patterns
- Database schema conventions

### 5. Avoid Unnecessary Refactoring
**Rule:** Don't refactor code unless it's directly related to the task.

**Implementation:**
- Stay focused on the current task
- Avoid "clean-up" during feature development
- Create separate refactoring tasks for improvements
- Consider impact on git history and blame

**When Refactoring is Appropriate:**
- When it directly improves the feature being developed
- When it fixes a bug that's causing issues
- When it's part of a planned refactoring initiative
- When code is truly unreadable or unmaintainable

### 6. Explain Important Decisions
**Rule:** Document significant architectural or design decisions.

**Implementation:**
- Create decision records for important choices
- Document pros and cons of alternatives considered
- Include context and reasoning in code comments
- Update architecture documentation when needed

**Decision Record Template:**
```markdown
## Decision: [Title]

### Status
[Proposed | Accepted | Deprecated | Superseded]

### Context
[What is the issue that we're seeing that is motivating this decision?]

### Decision
[What is the change that we're proposing and/or doing?]

### Consequences
[What becomes easier or more difficult to do because of this change?]
```

### 7. Run Tests Before Completing Tasks
**Rule:** Always run tests before considering a task complete.

**Implementation:**
- Run relevant unit tests
- Run integration tests for modified components
- Verify no regressions in existing functionality
- Add tests for new functionality

**Test Commands:**
```bash
# Backend tests
php artisan test

# Frontend tests
npm test

# Specific test files
php artisan test --filter=RepositoryAnalysisTest
npm test -- --testPathPattern=RepositoryCard.test.js
```

## AI Agent Behavior Guidelines

### Communication Style
- Be concise and direct in explanations
- Use technical language appropriate for developers
- Provide code examples when explaining concepts
- Ask clarifying questions before making assumptions

### Code Generation
- Generate code that follows existing patterns
- Include proper error handling
- Add appropriate comments for complex logic
- Follow naming conventions and code standards

### Documentation Generation
- Generate clear and comprehensive documentation
- Include examples and use cases
- Follow documentation standards
- Keep documentation up-to-date with code changes

### Problem Solving
- Break down complex problems into manageable parts
- Consider multiple solutions before choosing one
- Document trade-offs and considerations
- Test solutions thoroughly before implementing

## Workflow Integration

### 1. Context Gathering
Before starting any task:
- Read relevant context files
- Review related code and documentation
- Understand current system state
- Identify dependencies and impacts

### 2. Planning Phase
Create implementation plan:
- Define clear objectives
- Break down into steps
- Identify risks and edge cases
- Plan testing strategy

### 3. Implementation Phase
Execute with quality:
- Write clean, maintainable code
- Follow established patterns
- Include error handling
- Add necessary tests

### 4. Verification Phase
Ensure quality:
- Run all relevant tests
- Verify edge cases
- Check security implications
- Test performance impact

### 5. Documentation Phase
Maintain knowledge:
- Update relevant documentation
- Create decision records if needed
- Update progress tracker
- Document any known issues

## Common Pitfalls to Avoid

### 1. Scope Creep
- Stay focused on the original task
- Avoid adding unnecessary features
- Document ideas for future improvements separately

### 2. Premature Optimization
- Don't optimize without evidence of need
- Measure performance before optimizing
- Consider readability over micro-optimizations

### 3. Over-Engineering
- Keep solutions simple and straightforward
- Avoid unnecessary abstractions
- Choose the right tool for the job

### 4. Ignoring Edge Cases
- Consider error conditions
- Handle empty states
- Account for permission issues
- Consider concurrent operations

### 5. Breaking Changes
- Maintain backward compatibility
- Document breaking changes
- Provide migration paths
- Use feature flags for gradual rollouts

## Success Metrics

### Code Quality
- Consistent coding standards
- Comprehensive test coverage
- Clear documentation
- Maintainable architecture

### Development Velocity
- Reduced time to implement features
- Fewer bugs in production
- Faster onboarding for new developers
- Improved collaboration efficiency

### System Reliability
- Fewer production incidents
- Better error handling
- Improved performance
- Enhanced security posture
</contents>