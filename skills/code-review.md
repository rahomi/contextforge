# Skill: Code Review

## Purpose
Perform comprehensive code reviews focusing on quality, maintainability, security, and adherence to coding standards.

## When to Use
- Reviewing pull requests
- Pre-merge quality checks
- Mentoring and knowledge sharing
- Enforcing coding standards
- Identifying code smells and anti-patterns

## Inputs Required
1. **Code Diff or Changeset** - The code to review
2. **Context Files** - Related documentation and standards
3. **Review Scope** (optional) - Specific aspects to focus on
4. **Review Depth** (optional) - Level of detail required

## Process

### Step 1: Preparation
1. Read `context/code-standards.md` for coding guidelines
2. Understand the change context from PR description
3. Review related code and documentation
4. Identify the change's purpose and goals

### Step 2: Functional Review
1. **Correctness**
   - Does the code do what it's supposed to do?
   - Are all edge cases handled?
   - Are error conditions properly managed?

2. **Logic**
   - Is the algorithm efficient and correct?
   - Are there any logical errors?
   - Is the control flow clear?

### Step 3: Code Quality Review
1. **Readability**
   - Is the code self-documenting?
   - Are names meaningful and consistent?
   - Is the code properly formatted?

2. **Maintainability**
   - Is the code easy to modify?
   - Are there appropriate abstractions?
   - Is there unnecessary complexity?

3. **Structure**
   - Is the code well-organized?
   - Are there proper separations of concerns?
   - Are functions/methods appropriately sized?

### Step 4: Standards Compliance
1. **Coding Standards**
   - Naming conventions
   - Formatting rules
   - File organization

2. **Best Practices**
   - DRY principle
   - SOLID principles
   - YAGNI principle

### Step 5: Security Review
1. **Input Validation**
   - All inputs properly validated?
   - SQL injection prevention
   - XSS prevention

2. **Authentication/Authorization**
   - Proper access controls
   - Permission checks

3. **Data Protection**
   - Sensitive data handling
   - Encryption where needed
   - Logging sensitive information

### Step 6: Performance Review
1. **Efficiency**
   - Algorithm complexity
   - Database query optimization
   - Caching opportunities

2. **Resource Usage**
   - Memory leaks
   - Connection handling
   - File handle management

### Step 7: Testing Review
1. **Test Coverage**
   - Adequate test coverage
   - Edge cases tested
   - Integration tests where needed

2. **Test Quality**
   - Tests are meaningful
   - Tests are maintainable
   - Tests are isolated

## Expected Output

### Code Review Report
```markdown
# Code Review: [PR/Change Description]

## Summary
[High-level assessment]

## Strengths
[Positive aspects of the code]

## Issues Found

### Critical Issues
[Must be fixed before merge]

### Major Issues
[Should be fixed]

### Minor Issues
[Nice to have improvements]

### Suggestions
[Optional enhancements]

## Security Considerations
[Security-related findings]

## Performance Considerations
[Performance-related findings]

## Test Coverage
[Testing-related findings]

## Recommendation
[Approve, Request Changes, or Comment]

## Action Items
[Specific changes to make]
```

## Example Usage

### Pull Request Review
```markdown
Please review this pull request that adds repository analysis features.

Focus on:
1. Service layer organization
2. Error handling patterns
3. Test coverage
4. Security implications
```

### Code Quality Review
```markdown
Review this code for maintainability and readability.

The code should:
1. Follow Node.js/Express best practices
2. Be well-documented
3. Have proper error handling
4. Be testable
```

## Review Checklist
- [ ] Code does what it's supposed to do
- [ ] Follows coding standards
- [ ] Is readable and maintainable
- [ ] Has adequate test coverage
- [ ] Is secure
- [ ] Is performant
- [ ] Has proper documentation
- [ ] No unnecessary complexity
- [ ] Follows SOLID principles
- [ ] Handles errors appropriately
</contents>