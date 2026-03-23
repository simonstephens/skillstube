---
status: complete
priority: p2
issue_id: "006"
tags: [code-review, database, data-integrity]
dependencies: []
---

# Review ON DELETE CASCADE on skills.plugin_id

## Problem Statement

`skills.plugin_id` uses `ON DELETE CASCADE`, meaning deleting a plugin row automatically deletes all its child skills. Since `plugin_id` is nullable (skills can be standalone), `ON DELETE SET NULL` would preserve skills as standalone entries instead of destroying them.

**Flagged by:** data-migration-expert

## Findings

Current behavior: deleting plugin "compound-engineering" would silently delete all 45 of its child skills. This is likely unintended — the skills are valuable catalog entries that should survive plugin removal.

## Proposed Solutions

### Option A: Change to ON DELETE SET NULL (Recommended)
- Skills become standalone when their parent plugin is removed
- **Pros:** Preserves data; matches nullable FK semantics
- **Effort:** Small (migration: `ALTER TABLE skills DROP CONSTRAINT ..., ADD CONSTRAINT ... ON DELETE SET NULL`) | **Risk:** Low

### Option B: Keep CASCADE, add admin safeguards
- Accept CASCADE but ensure no accidental plugin deletions via admin/seed
- **Pros:** Clean data model; no orphan skills
- **Effort:** None | **Risk:** Medium (accidental data loss)

## Acceptance Criteria

- [ ] Product decision documented: CASCADE vs SET NULL
- [ ] If SET NULL: migration applied and tested
- [ ] Seed script handles orphaned skills gracefully

## Work Log

| Date | Action | Notes |
|------|--------|-------|
| 2026-03-23 | Created from code review | data-migration-expert flagged |
| 2026-03-23 | Fixed | Changed to ON DELETE SET NULL in schema + migration 0002 |
