# Skill: Database Design

## Purpose
Design, evaluate, and optimize database schemas, relationships, and data access patterns for applications.

## When to Use
- Starting a new project
- Adding new features with data requirements
- Optimizing database performance
- Refactoring existing database structure
- Planning data migrations
- Evaluating database technology choices

## Inputs Required
1. **Requirements** - Data requirements and business rules
2. **Existing Schema** (if any) - Current database structure
3. **Expected Usage Patterns** - How data will be accessed
4. **Scale Requirements** - Expected data volume and traffic
5. **Technology Constraints** - Database platform limitations

## Process

### Step 1: Requirements Analysis
1. **Data Requirements**
   - What data needs to be stored?
   - What are the data types and constraints?
   - What are the relationships between entities?

2. **Business Rules**
   - What validations are required?
   - What are the access control requirements?
   - What are the data retention policies?

3. **Usage Patterns**
   - What are the most common queries?
   - What are the performance requirements?
   - What are the consistency requirements?

### Step 2: Conceptual Design
1. **Entity Identification**
   - Identify main entities (users, repositories, documents, etc.)
   - Define entity attributes and types
   - Identify primary keys

2. **Relationship Mapping**
   - Define relationships between entities
   - Determine cardinality (one-to-one, one-to-many, many-to-many)
   - Identify foreign keys

3. **Normalization**
   - Apply normalization rules (1NF, 2NF, 3NF)
   - Consider denormalization for performance where needed

### Step 3: Logical Design
1. **Schema Definition**
   - Create table definitions
   - Define columns with appropriate data types
   - Set constraints (NOT NULL, UNIQUE, CHECK)

2. **Index Strategy**
   - Identify primary key indexes
   - Create indexes for frequently queried columns
   - Consider composite indexes for complex queries

3. **View Design**
   - Create views for common queries
   - Consider materialized views for performance

### Step 4: Physical Design
1. **Database Platform Considerations**
   - Platform-specific features (PostgreSQL, MySQL, etc.)
   - Storage engine selection
   - Partitioning strategy (if needed)

2. **Performance Optimization**
   - Query optimization
   - Connection pooling configuration
   - Caching strategy

3. **Security Design**
   - Access control (roles, permissions)
   - Data encryption (at rest, in transit)
   - Audit logging

### Step 5: Migration Planning
1. **Version Control**
   - Design migration strategy
   - Plan for backward compatibility
   - Consider rollback procedures

2. **Data Migration**
   - Plan data transformation
   - Consider data validation
   - Plan for downtime if needed

### Step 6: Documentation
1. **Schema Documentation**
   - Entity-relationship diagrams
   - Table definitions
   - Index documentation

2. **Access Pattern Documentation**
   - Common queries
   - Performance considerations
   - Scaling strategies

## Expected Output

### Database Design Document
```markdown
# Database Design: [Feature/System]

## Overview
[High-level description of the database design]

## Entities and Relationships

### Entity: [Entity Name]
**Purpose:** [What this entity represents]

**Attributes:**
- `id` (primary key)
- `name` (string, required)
- `created_at` (timestamp)

**Relationships:**
- Has many [related entities]
- Belongs to [parent entity]

## Schema Definition

```sql
CREATE TABLE entities (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Indexes

```sql
CREATE INDEX idx_entities_name ON entities(name);
CREATE INDEX idx_entities_created_at ON entities(created_at);
```

## Common Queries

```sql
-- Get entity by name
SELECT * FROM entities WHERE name = ?;

-- Get recent entities
SELECT * FROM entities ORDER BY created_at DESC LIMIT 10;
```

## Performance Considerations
[Query optimization, caching, scaling strategies]

## Security Considerations
[Access control, encryption, auditing]

## Migration Strategy
[How to implement schema changes]
```

## Example Usage

### New Feature Design
```markdown
Design the database schema for the knowledge base feature.

Requirements:
1. Users can create documents with markdown content
2. Documents can be organized with tags
3. Documents have version history
4. Documents can be searched by content and tags
5. Support for categories and related documents
```

### Performance Optimization
```markdown
Optimize the repository analysis queries.

Current issues:
1. Slow queries when fetching repository metrics
2. N+1 queries when loading repository details
3. Slow search across large datasets

Consider:
1. Indexing strategy
2. Query optimization
3. Caching strategy
4. Denormalization if needed
```

## Design Checklist
- [ ] All requirements are covered
- [ ] Normalization is appropriate
- [ ] Indexes are optimized for queries
- [ ] Constraints are properly defined
- [ ] Security considerations are addressed
- [ ] Migration strategy is clear
- [ ] Performance is acceptable
- [ ] Documentation is complete
</contents>