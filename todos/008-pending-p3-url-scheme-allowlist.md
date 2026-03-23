---
status: pending
priority: p3
issue_id: "008"
tags: [code-review, security]
dependencies: []
---

# URL Scheme Allowlist for href and JSON-LD

## Problem Statement

Plugin and skill pages render `authorUrl` and `githubUrl` in `<a href>` and JSON-LD. React escapes text but not URL schemes — a `javascript:` or `data:` URL in `href` would execute. Currently mitigated by Zod `.url()` validation in the seed script, but direct DB edits or future write paths could bypass this.

**Flagged by:** security-sentinel (P2 from their perspective; P3 given curated-only content model)

## Proposed Solutions

### Option A: Central `assertSafeUrl` helper
```typescript
function assertSafeUrl(url: string | null): string | null {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    if (!['http:', 'https:'].includes(parsed.protocol)) return null;
    return url;
  } catch { return null; }
}
```
Apply before rendering any external URL in `href` or structured data.

## Acceptance Criteria

- [ ] All external URLs pass through scheme validation before `href` rendering
- [ ] `javascript:` URLs are rejected

## Work Log

| Date | Action | Notes |
|------|--------|-------|
| 2026-03-23 | Created from code review | security-sentinel flagged |
