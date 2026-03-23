---
status: complete
priority: p2
issue_id: "001"
tags: [code-review, performance, database]
dependencies: []
---

# N+1 Query Optimization in Collection & Homepage Queries

## Problem Statement

Multiple queries execute sequentially or per-row where batch queries would suffice. While ISR (60s revalidation) masks the latency for end users, this pattern wastes DB connections and will not scale beyond the current ~15 plugins / 119 skills dataset.

**Flagged by:** performance-oracle, code-simplicity-reviewer, kieran-typescript-reviewer (3 agents converged)

## Findings

### 1. `getCollectionItems()` — N+1 in db/queries.ts (lines ~214–248)
Fetches `collection_items` rows, then issues one `SELECT` per row to resolve each plugin or skill. For a collection with 10 items, that's 11 queries.

### 2. Collection page — sequential `getPluginSkillCount` loop
`app/collections/[slug]/page.tsx` (lines ~51–57) calls `getPluginSkillCount(item.plugin.id)` per plugin in a `for` loop after `getCollectionItems` already returned.

### 3. Homepage — 6x `getPluginSkillCount` for featured plugins
`app/page.tsx` (lines ~73–78) maps `featuredPluginsRaw` through `Promise.all` calling `getPluginSkillCount` per plugin. `getAllPluginCards` already embeds `skillCount` via subquery — same pattern could be used for featured.

### 4. Plugin detail — redundant skill count query
`app/plugins/[slug]/page.tsx` calls both `getPluginSkills(plugin.id)` and `getPluginSkillCount(plugin.id)` in parallel, but `childSkills.length` gives the same value.

## Proposed Solutions

### Option A: Batch resolve in `getCollectionItems` (Recommended)
- Collect distinct `pluginId`s and `skillId`s from rows
- Two `WHERE id IN (...)` queries (one for plugins, one for skills)
- Merge in memory by ID
- **Pros:** Constant 3 queries regardless of collection size; minimal API change
- **Effort:** Small | **Risk:** Low

### Option B: LEFT JOIN from `collection_items`
- Single query joining to both `plugins` and `skills` with nullable columns
- **Pros:** Single round-trip
- **Effort:** Medium (complex result mapping) | **Risk:** Medium

### For homepage/collection skill counts:
- Use `getFeaturedPluginCards(limit)` with embedded `skillCount` subquery (mirrors `getAllPluginCards`)
- Or batch: `SELECT plugin_id, COUNT(*) FROM skills WHERE plugin_id = ANY($1) GROUP BY plugin_id`

### For plugin detail:
- Drop `getPluginSkillCount` call, use `childSkills.length`

## Acceptance Criteria

- [ ] `getCollectionItems` issues ≤ 3 queries regardless of item count
- [ ] Homepage does not call `getPluginSkillCount` per plugin
- [ ] Collection page does not call `getPluginSkillCount` per plugin
- [ ] Plugin detail page does not make redundant count query
- [ ] Build passes; pages render identically

## Work Log

| Date | Action | Notes |
|------|--------|-------|
| 2026-03-23 | Created from code review | 3 agents converged on this finding |
| 2026-03-23 | Fixed | Batch resolve in getCollectionItems (inArray), getFeaturedPluginCards with subquery, batch getPluginSkillCounts, childSkills.length on plugin detail |
