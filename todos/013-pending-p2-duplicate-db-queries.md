---
status: pending
priority: p2
issue_id: 013
tags: [code-review, performance]
---

# Duplicate DB queries in `generateMetadata` and page

## Problem Statement
`generateMetadata` and the page component both call `getSkillBySlug` / `getCollectionBySlug` independently. Unlike `fetch`, Drizzle does not deduplicate identical queries within a request, so the same row may be loaded twice per navigation.

## Findings
- Skill and collection routes: metadata and page both invoke slug-based getters.

## Proposed Solutions
### Option A: Wrap getters with `React.cache()`
- Wrap `getSkillBySlug`, `getCollectionBySlug`, or thin wrappers around them with `cache()` so repeated calls in the same React render pass share one DB round-trip.
- Effort: Small

## Acceptance Criteria
- [ ] Per-request duplicate slug queries are eliminated (one query per slug per request where applicable)
- [ ] Metadata and page still receive correct data
- [ ] No regression in error handling (404 / not found paths)
