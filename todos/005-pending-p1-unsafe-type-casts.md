---
status: done
priority: p1
issue_id: 005
tags: [code-review, typescript]
---

# Unsafe `as TrustTier` (and similar) casts bypass runtime validation

## Problem Statement
`as TrustTier` casts appear in multiple components and pages. If bad data enters the database, TypeScript will not catch it at runtime; invalid values can flow into `TrustBadge` and other UI without narrowing or fallback.

## Findings
- `app/skills/[slug]/page.tsx:85` — `as TrustTier`
- `app/collections/[slug]/page.tsx:103` — `as TrustTier`
- `components/ui/SkillCard.tsx:34` — `as TrustTier`
- `components/sections/FeaturedStacks.tsx:62` — `as TrustTier`
- `components/sections/SkillBrowser.tsx:152,159` — `as TrustTier`
- Reference pattern: `isPlatform()` at `app/skills/[slug]/page.tsx:31` shows the desired narrowing approach.

## Proposed Solutions
### Option A: Shared parsers with safe fallbacks in `lib/types.ts`
- Pros: Single place for valid enums; runtime-safe defaults; matches existing `isPlatform()` style; removes assertion sprawl.
- Cons: Must choose sensible defaults for unknown DB values and document them.
- Effort: Small

## Acceptance Criteria
- [ ] No `as TrustTier`, `as Category`, or `as Audience` casts in the codebase
- [ ] All narrowing uses validator/parser functions (e.g. `parseTrustTier()`, `parseCategory()`, `parseAudience()`) with safe fallbacks
