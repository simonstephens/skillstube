---
status: done
priority: p2
issue_id: 010
tags: [code-review, security]
---

# Missing `Strict-Transport-Security` header

## Problem Statement
Security headers in `next.config.ts` do not include HSTS, so browsers are not instructed to always use HTTPS for this host (and optionally subdomains), weakening transport security posture.

## Findings
- `next.config.ts` `securityHeaders` (or equivalent) omits `Strict-Transport-Security`.

## Proposed Solutions
### Option A: Add HSTS to security headers
- Add `{ key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' }` (adjust if preload or shorter max-age is preferred for the environment).
- Effort: Small (about 2 minutes)

## Acceptance Criteria
- [ ] Response headers include `Strict-Transport-Security` with the chosen policy in production builds
- [ ] Local/preview behavior documented or gated so dev HTTP workflows are not unintentionally broken (if applicable)
