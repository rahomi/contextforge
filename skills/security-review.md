# Skill: Security Review

## Purpose
Conduct comprehensive security reviews of code, architecture, and configurations to identify vulnerabilities and recommend security improvements.

## When to Use
- Before production deployments
- After security incidents
- When adding new features that handle sensitive data
- For compliance requirements (GDPR, SOC2, etc.)
- During security audits

## Inputs Required
1. **Code Changes** - The code to review
2. **System Architecture** - Context about the system
3. **Security Requirements** - Compliance or policy requirements
4. **Threat Model** (optional) - Known threats and attack vectors

## Process

### Step 1: Threat Modeling
1. **Identify Assets**
   - Sensitive data (PII, credentials, etc.)
   - Critical functionality
   - System resources

2. **Identify Threat Sources**
   - External attackers
   - Malicious users
   - Insider threats
   - Automated attacks

3. **Attack Vectors**
   - Input validation attacks
   - Authentication/Authorization bypass
   - Data leakage
   - Privilege escalation

### Step 2: Code Security Review
1. **Input Validation**
   - SQL injection prevention
   - XSS prevention
   - Command injection prevention
   - Path traversal prevention
   - Deserialization attacks

2. **Authentication & Authorization**
   - Password storage (bcrypt, argon2)
   - Session management
   - Multi-factor authentication
   - Role-based access control
   - Permission checks

3. **Data Protection**
   - Encryption at rest
   - Encryption in transit (TLS)
   - Sensitive data masking
   - Secure data deletion
   - PII handling

4. **API Security**
   - Rate limiting
   - CORS configuration
   - API authentication
   - Input validation
   - Error handling (no sensitive info leakage)

### Step 3: Configuration Review
1. **Server Configuration**
   - HTTPS enforcement
   - Security headers
   - File permissions
   - Service hardening

2. **Database Configuration**
   - Access controls
   - Encryption settings
   - Backup security
   - Query permissions

3. **Dependency Security**
   - Vulnerable dependencies
   - Outdated packages
   - License compliance

### Step 4: Infrastructure Security
1. **Cloud Security**
   - IAM policies
   - Network security groups
   - Storage bucket policies
   - Logging and monitoring

2. **Container Security**
   - Base image security
   - Container scanning
   - Runtime protection
   - Secret management

### Step 5: Security Testing
1. **Static Analysis**
   - Code scanning tools
   - Dependency scanning
   - Secret detection

2. **Dynamic Analysis**
   - Penetration testing
   - Vulnerability scanning
   - fuzz testing

3. **Manual Testing**
   - Business logic flaws
   - Race conditions
   - Authorization bypass

### Step 6: Incident Response
1. **Logging & Monitoring**
   - Security event logging
   - Anomaly detection
   - Alert configuration

2. **Response Procedures**
   - Incident response plan
   - Recovery procedures
   - Communication plan

## Expected Output

### Security Review Report
```markdown
# Security Review: [Application/Feature]

## Executive Summary
[High-level security assessment and risk level]

## Threat Model
[Identified threats and attack vectors]

## Vulnerabilities Found

### Critical
[Immediate security risks]

### High
[Significant security risks]

### Medium
[Moderate security risks]

### Low
[Minor security risks]

## Security Controls Assessment
[Current security measures effectiveness]

## Recommendations

### Immediate Actions
[Critical fixes required]

### Short-term Improvements
[Security enhancements for near future]

### Long-term Strategy
[Security architecture improvements]

## Compliance Status
[Compliance with security standards]

## Testing Results
[Security testing findings]

## Appendix
[Detailed technical findings]
```

## Example Usage

### Pre-deployment Security Review
```markdown
Perform a security review before deploying the authentication system.

Focus on:
1. Password storage and validation
2. Session management
3. API security
4. Input validation
5. Error handling
```

### Feature Security Review
```markdown
Review the new file upload feature for security vulnerabilities.

Consider:
1. File type validation
2. Malware scanning
3. Storage security
4. Access controls
5. Denial of service protection
```

## Security Checklist
- [ ] All inputs validated and sanitized
- [ ] Authentication properly implemented
- [ ] Authorization checks in place
- [ ] Sensitive data encrypted
- [ ] Secure communication (TLS)
- [ ] Proper error handling (no info leakage)
- [ ] Security headers configured
- [ ] Dependencies up to date
- [ ] Logging for security events
- [ ] Rate limiting implemented
- [ ] CORS properly configured
- [ ] Secrets not in code
- [ ] Database access restricted
- [ ] File uploads secured
- [ ] XSS prevention measures
</contents>