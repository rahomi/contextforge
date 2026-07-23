# Skill: Architecture Review

## Purpose
Analyze and review the software architecture of a repository or codebase. Identify architectural patterns, potential issues, and improvement opportunities.

## When to Use
- Starting work on an unfamiliar codebase
- Planning significant refactoring efforts
- Evaluating system design before implementation
- Conducting technical due diligence
- Preparing for scaling or major changes

## Inputs Required
1. **Repository URL or Path** - The codebase to analyze
2. **Scope** (optional) - Specific module or feature to focus on
3. **Focus Areas** (optional) - Particular aspects to examine

## Process

### Step 1: Initial Discovery
1. Read `context/project-overview.md` for project understanding
2. Examine directory structure
3. Identify main technologies and frameworks
4. Review configuration files

### Step 2: Pattern Analysis
1. **Architectural Patterns**
   - MVC, MVVM, Clean Architecture, etc.
   - Layer separation
   - Component organization

2. **Design Patterns**
   - Factory, Strategy, Repository, etc.
   - Dependency injection approach
   - Event handling patterns

3. **Data Flow**
   - Request lifecycle
   - State management
   - Data transformation patterns

### Step 3: Structure Assessment
1. **Module Organization**
   - Cohesion and coupling analysis
   - Dependency direction
   - Interface definitions

2. **Layer Architecture**
   - Presentation layer
   - Business logic layer
   - Data access layer
   - Infrastructure layer

### Step 4: Quality Evaluation
1. **Separation of Concerns**
   - Clear responsibilities
   - Minimal cross-cutting concerns
   - Proper abstraction levels

2. **Extensibility**
   - Plugin/extension points
   - Configuration flexibility
   - API design for integration

3. **Maintainability**
   - Code organization
   - Documentation completeness
   - Testing coverage by layer

### Step 5: Risk Assessment
1. **Technical Debt**
   - Legacy patterns
   - Workarounds and hacks
   - Missing abstractions

2. **Scalability Concerns**
   - Performance bottlenecks
   - Database design issues
   - Caching strategy gaps

3. **Security Considerations**
   - Authentication/authorization patterns
   - Data protection approaches
   - Input validation strategy

## Expected Output

### Architecture Review Report
```markdown
# Architecture Review: [Repository/Module Name]

## Executive Summary
[High-level assessment and key findings]

## Current Architecture
### Patterns Identified
[Architectural and design patterns used]

### Technology Stack
[Technologies, frameworks, and tools]

### Component Structure
[Organization of modules/components]

## Strengths
[Positive architectural aspects]

## Areas for Improvement
[Specific recommendations with priorities]

## Recommendations
### Short-term
[Quick wins and immediate improvements]

### Long-term
[Strategic architectural changes]

## Risk Assessment
[Potential risks and mitigation strategies]

## Appendix
[Detailed diagrams, code examples, etc.]
```

## Example Usage

### For a New Feature
```markdown
I need to add a real-time notification system to this Express/Node.js application.

Please perform an architecture review focusing on:
1. Current event handling patterns
2. Existing queue/workers setup
3. WebSocket integration possibilities
4. Database design for notifications
```

### For Refactoring
```markdown
We want to refactor the repository analysis module.

Please review the current architecture and identify:
1. Current analysis workflow
2. Service layer organization
3. Queue job structure
4. Testing coverage gaps
```

## Quality Checklist
- [ ] Identified main architectural pattern
- [ ] Documented technology choices
- [ ] Assessed separation of concerns
- [ ] Evaluated extensibility points
- [ ] Identified technical debt
- [ ] Provided actionable recommendations
- [ ] Considered security implications
- [ ] Addressed scalability concerns
</contents>