# Skill: Documentation Generator

## Purpose
Generate comprehensive, accurate, and well-structured documentation for software projects, APIs, and technical systems.

## When to Use
- Creating or updating README files
- Generating API documentation
- Writing architecture documentation
- Creating onboarding guides
- Documenting technical decisions
- Generating user manuals

## Inputs Required
1. **Source Code** - The code to document
2. **Existing Documentation** (optional) - Current docs to update
3. **Documentation Type** - What kind of documentation needed
4. **Target Audience** - Developers, users, or both
5. **Scope** (optional) - Specific module or feature to document

## Process

### Step 1: Analysis
1. **Code Understanding**
   - Read and understand the codebase
   - Identify key components and their relationships
   - Understand business logic and workflows

2. **Audience Analysis**
   - Determine technical level of readers
   - Identify what they need to accomplish
   - Consider their existing knowledge

3. **Documentation Type Analysis**
   - README: Project overview and quick start
   - API Docs: Endpoints, parameters, responses
   - Architecture: System design and components
   - User Guide: How to use the software
   - Developer Guide: How to contribute/extend

### Step 2: Structure Planning
1. **Outline Creation**
   - Create logical document structure
   - Identify main sections and subsections
   - Plan navigation and cross-references

2. **Content Planning**
   - Determine level of detail needed
   - Plan examples and code samples
   - Identify diagrams and visual aids

### Step 3: Content Generation
1. **Writing Style**
   - Clear and concise language
   - Consistent terminology
   - Active voice where possible
   - Avoid jargon when possible

2. **Code Documentation**
   - Inline comments for complex logic
   - Function/method documentation
   - Class/module documentation
   - Example usage

3. **Visual Documentation**
   - Architecture diagrams
   - Flow charts
   - Sequence diagrams
   - Screenshots (if applicable)

### Step 4: Review and Validation
1. **Accuracy Check**
   - Verify code examples work
   - Ensure information is current
   - Check technical accuracy

2. **Completeness Check**
   - All components documented
   - Edge cases covered
   - Error scenarios documented

3. **Readability Check**
   - Clear and understandable
   - Proper formatting
   - Good navigation

### Step 5: Publication
1. **Format Selection**
   - Markdown for general docs
   - OpenAPI/Swagger for APIs
   - HTML for web documentation
   - PDF for downloadable docs

2. **Distribution**
   - Repository documentation
   - Wiki pages
   - Dedicated documentation site
   - In-app help

## Expected Output

### Documentation Types

#### 1. README Template
```markdown
# Project Name

Brief description of what this project does.

## Features
- Feature 1
- Feature 2
- Feature 3

## Installation
Step-by-step installation instructions.

## Usage
Examples of how to use the project.

## API Reference
Link to detailed API documentation.

## Contributing
Guidelines for contributing.

## License
License information.
```

#### 2. API Documentation Template
```markdown
# API Reference

## Authentication
How to authenticate with the API.

## Endpoints

### GET /api/resource
Description of the endpoint.

**Parameters:**
- `id` (required): The resource ID
- `filter` (optional): Filter criteria

**Response:**
```json
{
  "data": [...],
  "meta": {...}
}
```

**Examples:**
```bash
curl -X GET "https://api.example.com/resource/123"
```
```

#### 3. Architecture Document Template
```markdown
# Architecture Document

## Overview
High-level system architecture.

## Components
### Component A
Description and responsibilities.

### Component B
Description and responsibilities.

## Data Flow
How data moves through the system.

## Design Decisions
Key architectural choices and rationale.

## Future Considerations
Potential changes and improvements.
```

## Example Usage

### README Generation
```markdown
Generate a comprehensive README for this Express/Node.js application.

Include:
1. Project overview
2. Features list
3. Installation steps
4. Usage examples
5. Configuration guide
6. Contributing guidelines
```

### API Documentation
```markdown
Generate OpenAPI documentation for the repository endpoints.

Include:
1. All CRUD operations
2. Authentication requirements
3. Request/response examples
4. Error responses
5. Rate limiting information
```

## Documentation Quality Checklist
- [ ] Clear and concise writing
- [ ] Consistent terminology
- [ ] Proper formatting and structure
- [ ] Working code examples
- [ ] Complete coverage of features
- [ ] Up-to-date information
- [ ] Appropriate level of detail
- [ ] Good navigation and cross-references
- [ ] Visual aids where helpful
- [ ] Proofread for errors
</contents>