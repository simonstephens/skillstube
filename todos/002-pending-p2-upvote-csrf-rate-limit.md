---
status: complete
priority: p2
issue_id: "002"
tags: [code-review, security, api]
dependencies: []
---

# Upvote API: CSRF Protection & Rate Limiting Improvements

## Problem Statement

The `POST /api/plugins/[slug]/upvote` and `POST /api/skills/[slug]/upvote` endpoints are unauthenticated, state-changing, and lack CSRF protection. Rate limiting is in-memory (resets on deploy, multiplied by instances) and uses a shared `'unknown'` bucket when `x-forwarded-for` is absent.

**Flagged by:** security-sentinel, kieran-typescript-reviewer

## Findings

### 1. CSRF — No token or origin check on POST
A malicious site can drive victim browsers to POST upvotes via form submission. No cookie is required; the attack inflates counts using victim IPs.

### 2. In-memory rate limits — fragile
`lib/rate-limit.ts` stores limits in a `Map` per Node process. Railway deploys reset counters; multiple instances multiply the effective budget. `MAX_ENTRIES` eviction is insertion-order, not LRU.

### 3. `clientIp()` — `'unknown'` shared bucket
When `x-forwarded-for` is missing, all such clients share one rate-limit bucket. Can block legitimate users or be too loose.

### 4. No server-side vote deduplication
`localStorage` prevents re-voting in the UI but is trivially cleared. Server only enforces ~10 POSTs/hour/IP.

## Proposed Solutions

### Option A: Origin/Referer check + custom header (Quick win)
- Verify `Origin` or `Referer` matches the site on POST
- Require a custom header like `X-Requested-With: fetch` (blocks simple form POSTs)
- **Pros:** Minimal code; blocks most drive-by CSRF
- **Effort:** Small | **Risk:** Low

### Option B: Signed CSRF token (Robust)
- Issue a short-lived, SameSite cookie-based token
- Validate on POST
- **Pros:** Standard CSRF protection
- **Effort:** Medium | **Risk:** Low

### Option C: Move rate limit to Redis/Upstash (For scale)
- Persist rate-limit state across deploys and instances
- Use Railway-documented IP headers
- **Pros:** Durable, correct at scale
- **Effort:** Medium (new dependency) | **Risk:** Low

## Acceptance Criteria

- [ ] POST upvote endpoints reject requests without valid origin/custom header
- [ ] Rate limit survives redeploy (or accepted as known limitation with documentation)
- [ ] `unknown` IP bucket does not share limits across unrelated clients

## Work Log

| Date | Action | Notes |
|------|--------|-------|
| 2026-03-23 | Created from code review | security-sentinel flagged CSRF + rate limit |
| 2026-03-23 | Fixed | Added Origin check via shared lib/api/upvote.ts; extracted duplicate helpers (clientIp, jsonResponse, SLUG_RE) |
