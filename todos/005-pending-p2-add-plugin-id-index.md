---
status: complete
priority: p2
issue_id: "005"
tags: [code-review, performance, database]
dependencies: []
---

# Add Index on skills.plugin_id

## Problem Statement

PostgreSQL does not automatically create an index on FK columns. `skills.plugin_id` is used in multiple queries (`getPluginSkills`, `getPluginSkillCount`, correlated subquery in `getAllPluginCards`) but has no index. Without it, these queries do sequential scans on the skills table.

**Flagged by:** performance-oracle

## Proposed Solutions

### Option A: Migration to add index (Recommended)
```sql
CREATE INDEX IF NOT EXISTS idx_skills_plugin_id ON skills (plugin_id);
```
- **Effort:** Tiny | **Risk:** None (non-blocking `CREATE INDEX` on small table)

## Acceptance Criteria

- [ ] Index exists on `skills.plugin_id`
- [ ] `EXPLAIN` on `getPluginSkills` shows index scan

## Work Log

| Date | Action | Notes |
|------|--------|-------|
| 2026-03-23 | Created from code review | performance-oracle flagged |
| 2026-03-23 | Fixed | Added in db/migrations/0002_review_fixes.sql |
