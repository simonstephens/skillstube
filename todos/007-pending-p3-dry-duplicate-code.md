---
status: pending
priority: p3
issue_id: "007"
tags: [code-review, quality, dry]
dependencies: []
---

# DRY Opportunities: Deduplicate Parallel Patterns

## Problem Statement

Several components and query patterns are near-duplicates. Not blocking, but increases maintenance surface.

**Flagged by:** code-simplicity-reviewer, kieran-typescript-reviewer

## Findings

### 1. Upvote route duplication
`app/api/plugins/[slug]/upvote/route.ts` and `app/api/skills/[slug]/upvote/route.ts` share identical `SLUG_RE`, `clientIp`, `jsonResponse`, and GET/POST shape. Extract `createUpvoteRoute(table, slugColumn)`.

### 2. FeaturedPlugins / FeaturedSkills
Same section chrome (padding, container, heading, grid, empty check). Could be a shared `FeaturedSection` wrapper.

### 3. PluginCard / SkillCard
~90% the same layout. Could share a `CatalogCard` base or `CardShell` primitives. Low priority — accept as "two products" unless more entity types are planned.

### 4. getAllSkillCards / getStandaloneSkillCards
Identical `.select({...})` object; only difference is the `WHERE` clause. Extract `skillCardColumns` constant.

### 5. Seed Zod schemas
`pluginSchema` and `skillSchema` share many fields (slug, author, trustTier, audience, category, etc.). Extract `catalogBase` schema and `.extend()`.

## Proposed Solutions

**Priority order:** #1 (upvote routes — prevents fix-one-miss-other bugs), #4 (query columns), #5 (Zod), #2 (section wrapper), #3 (card — optional).

## Acceptance Criteria

- [ ] Upvote route logic extracted to shared module
- [ ] No parallel select column objects for skill cards
- [ ] Zod schemas share a base

## Work Log

| Date | Action | Notes |
|------|--------|-------|
| 2026-03-23 | Created from code review | code-simplicity + typescript reviewers |
