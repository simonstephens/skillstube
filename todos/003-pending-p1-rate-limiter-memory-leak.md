---
status: pending
priority: p1
issue_id: 003
tags: [code-review, security, performance]
---

# Rate limiter Map never evicts entries (unbounded memory growth)

## Problem Statement
The in-memory rate limiter uses a `Map<string, number[]>` that never removes stale keys. IPs that requested once and never return still occupy entries forever. Under broad or distributed traffic, the Map grows without bound.

## Findings
- `lib/rate-limit.ts` — entries are keyed by IP (or similar) with timestamp arrays; there is no eviction of keys whose timestamps are all outside the window, nor a maximum map size.

## Proposed Solutions
### Option A: Periodic cleanup + max entries cap
- Pros: Bounds memory; simple to implement alongside existing Map; cleanup interval (e.g. every 5–10 minutes) removes keys with no timestamps in the active window; `MAX_ENTRIES` acts as a safety valve.
- Cons: In-process limiter still doesn’t scale across multiple instances (separate issue); cleanup adds a timer to manage in tests/server lifecycle.
- Effort: Small

## Acceptance Criteria
- [ ] Rate limiter `Map` does not grow unbounded
- [ ] Old entries are cleaned up (e.g. no timestamps within the limit window)
- [ ] Map has a configurable maximum size cap
