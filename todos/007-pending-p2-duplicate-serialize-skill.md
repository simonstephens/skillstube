---
status: pending
priority: p2
issue_id: 007
tags: [code-review, quality]
---

# Duplicate skill serialization

## Problem Statement
`lib/serialize.ts` already provides shared serialization, but some routes reimplement the same logic locally, duplicating behavior and risking inconsistency.

## Findings
- Shared implementation: `lib/serialize.ts`
- Duplicated logic: `app/browse/page.tsx` lines 18–22
- Duplicated logic: `app/collections/[slug]/page.tsx` lines 33–39

## Proposed Solutions
### Option A: Use shared `lib/serialize` everywhere
- Replace local copies with imports from `lib/serialize.ts`.
- Effort: Small

## Acceptance Criteria
- [ ] Browse and collection pages import the shared serializer; inline duplicates removed
- [ ] Serialized shape matches previous behavior (types and runtime output)
- [ ] No new duplicate serialization helpers introduced without updating `lib/serialize.ts`
