---
status: pending
priority: p1
issue_id: 001
tags: [code-review, security]
---

# Rate limiter trusts spoofable X-Forwarded-For (leftmost IP)

## Problem Statement
`clientIp()` in the upvote API route trusts the leftmost IP in `X-Forwarded-For`, which is client-controlled. Any attacker can spoof a different IP per request and completely bypass rate limiting.

## Findings
- `app/api/skills/[slug]/upvote/route.ts:9-14` — `clientIp()` uses `parts[0]` (leftmost) from `X-Forwarded-For`; the leftmost value is the original client as claimed by the chain and can be forged before the request reaches the app.

## Proposed Solutions
### Option A: Use proxy-appended IP (rightmost in X-Forwarded-For)
- Implementation: use the last segment after splitting, e.g. `const ip = parts.at(-1)` (Railway’s proxy appends the real client IP).
- Pros: Aligns with Railway’s proxy appending the real client IP; attackers cannot prepend arbitrary values that replace the trusted tail.
- Cons: Requires confirming Railway’s header semantics in docs; if multiple trusted proxies exist, may need a configurable trusted-hop count later.
- Effort: Small

## Acceptance Criteria
- [ ] Rate limiter correctly identifies the real client IP behind the Railway proxy
