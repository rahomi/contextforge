# Skill: Testing Strategy

## Purpose
Design and implement comprehensive testing strategies to ensure software quality, reliability, and maintainability.

## When to Use
- Starting a new project
- Adding new features or modules
- Improving test coverage
- Refactoring existing code
- Preparing for production deployments
- Addressing quality issues

## Inputs Required
1. **Codebase** - The application to test
2. **Requirements** - Business and technical requirements
3. **Current Test Status** (if any) - Existing test coverage
4. **Quality Goals** - Desired test coverage and quality metrics
5. **Constraints** - Time, resources, and technical limitations

## Process

### Step 1: Analysis
1. **Code Analysis**
   - Understand the application architecture
   - Identify critical components and workflows
   - Analyze dependencies and integrations

2. **Risk Assessment**
   - Identify high-risk areas
   - Determine business-critical functionality
   - Assess technical complexity

3. **Current Test Assessment**
   - Review existing tests (if any)
   - Identify test gaps
   - Evaluate test quality

### Step 2: Strategy Planning
1. **Test Pyramid**
   - Unit tests (foundation)
   - Integration tests (middle layer)
   - End-to-end tests (top layer)

2. **Test Types**
   - **Unit Tests**: Test individual components in isolation
   - **Integration Tests**: Test component interactions
   - **Feature Tests**: Test complete user workflows
   - **Performance Tests**: Test system performance
   - **Security Tests**: Test security controls

3. **Test Coverage Goals**
   - Define coverage metrics (line, branch, function)
   - Set realistic coverage targets
   - Prioritize critical paths

### Step 3: Test Design
1. **Test Case Design**
   - Test happy paths
   - Test edge cases
   - Test error conditions
   - Test boundary conditions

2. **Test Data Strategy**
   - Test data creation approach
   - Data isolation between tests
   - Cleanup strategies

3. **Mocking Strategy**
   - Identify dependencies to mock
   - Define mock boundaries
   - Balance between mocks and real implementations

### Step 4: Implementation Planning
1. **Test Structure**
   - Organize tests by feature or component
   - Naming conventions
   - Test file organization

2. **Test Environment**
   - Test database setup
   - External service mocking
   - Test configuration management

3. **Test Automation**
   - CI/CD integration
   - Test execution strategy
   - Test reporting

### Step 5: Execution and Monitoring
1. **Test Execution**
   - Regular test runs
   - Test failure analysis
   - Performance monitoring

2. **Quality Metrics**
   - Test coverage tracking
   - Test success rates
   - Defect detection rates

3. **Continuous Improvement**
   - Regular test reviews
   - Test maintenance
   - Test strategy updates

## Expected Output

### Testing Strategy Document
```markdown
# Testing Strategy: [Application/Feature]

## Overview
[High-level testing approach and goals]

## Test Types

### Unit Tests
**Purpose:** Test individual components in isolation.
**Coverage Target:** [Percentage]
**Tools:** [Jest, Vitest, Mocha, etc.]
**Examples:**
- Test service methods
- Test helper functions
- Test business logic

### Integration Tests
**Purpose:** Test component interactions.
**Coverage Target:** [Percentage]
**Tools:** [Supertest/Express Testing, React Testing Library]
**Examples:**
- Test API endpoints
- Test database operations
- Test external service integrations

### Feature Tests
**Purpose:** Test complete user workflows.
**Coverage Target:** [Percentage]
**Tools:** [Playwright, Cypress]
**Examples:**
- Test user registration flow
- Test repository analysis workflow
- Test knowledge base operations

### Performance Tests
**Purpose:** Test system performance and scalability.
**Tools:** [JMeter, k6]
**Examples:**
- Load testing
- Stress testing
- Endurance testing

### Security Tests
**Purpose:** Test security controls.
**Tools:** [OWASP ZAP, SecurityHeaders]
**Examples:**
- Vulnerability scanning
- Penetration testing
- Security configuration checks

## Test Environment
### Development
- SQLite in-memory database
- Mock external services
- Fast execution

### Testing
- PostgreSQL test database
- Partial mocking
- Integration with CI/CD

### Staging
- Production-like environment
- Full integration testing
- Performance testing

## Test Data Strategy
- **Factories:** Use model factories for test data
- **Fixtures:** Use database seeders for specific scenarios
- **Cleanup:** Truncate tables after each test

## Test Automation
### CI/CD Integration
- Run tests on every commit
- Run full suite before deployment
- Fail build on test failures

### Test Reporting
- Coverage reports
- Test result summaries
- Performance metrics

## Test Maintenance
- Regular test reviews
- Update tests with code changes
- Remove obsolete tests
- Improve flaky tests

## Implementation Plan
### Phase 1: Foundation
- Set up testing framework
- Create base test classes
- Implement test utilities

### Phase 2: Unit Tests
- Test service layer
- Test helper functions
- Test business logic

### Phase 3: Integration Tests
- Test API endpoints
- Test database operations
- Test external integrations

### Phase 4: Feature Tests
- Test critical user workflows
- Test edge cases
- Test error scenarios

### Phase 5: Advanced Testing
- Performance testing
- Security testing
- Accessibility testing

## Success Metrics
- Test coverage > 80%
- Test pass rate > 99%
- Test execution time < 5 minutes
- Defect detection rate > 90%
```

## Example Usage

### New Feature Testing Strategy
```markdown
Design a testing strategy for the new AI chat feature.

Consider:
1. Unit tests for chat service
2. Integration tests with AI provider
3. Feature tests for user interaction
4. Performance tests for response time
5. Security tests for data protection
```

### Test Coverage Improvement
```markdown
Create a plan to improve test coverage from 60% to 80%.

Focus on:
1. Critical business logic
2. API endpoints
3. Database operations
4. Error handling
5. Edge cases
```

## Testing Checklist
- [ ] Test strategy defined
- [ ] Test environment configured
- [ ] Test data strategy established
- [ ] Test automation implemented
- [ ] Test coverage metrics tracked
- [ ] Test maintenance plan in place
- [ ] Test documentation complete
- [ ] Team trained on testing practices
</contents>