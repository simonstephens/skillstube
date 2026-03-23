---
status: complete
priority: p2
issue_id: "004"
tags: [code-review, typescript, type-safety]
dependencies: []
---

# Browse Page: Remove Unsafe `as` Type Casts

## Problem Statement

`app/browse/page.tsx` uses manual `as` casts after `map` + `toISOString()` instead of using the existing `serializePlugin` / `serializeSkill` helpers. This hides shape drift if the schema or query changes.

**Flagged by:** kieran-typescript-reviewer (P2-6)

## Findings

```typescript
// Current (unsafe)
const serializedPlugins = pluginRows.map((p) => ({
  ...p,
  createdAt: p.createdAt.toISOString(),
  updatedAt: p.updatedAt.toISOString(),
})) as Array<SerializedPlugin & { skillCount: number }>;
```

The `as` cast suppresses type checking. If `getAllPluginCards` returns a different shape than `SerializedPlugin`, the compiler won't catch it.

## Proposed Solutions

### Option A: Use serialization helpers (Recommended)
- Use `serializePlugin` / `serializeSkill` from `lib/serialize.ts`
- Handle the extra `skillCount` field explicitly
- **Effort:** Small | **Risk:** Low

## Acceptance Criteria

- [ ] No `as` type casts in `app/browse/page.tsx`
- [ ] Serialization uses shared helpers from `lib/serialize.ts`
- [ ] TypeScript compiles without errors

## Work Log

| Date | Action | Notes |
|------|--------|-------|
| 2026-03-23 | Created from code review | kieran-typescript-reviewer flagged |
| 2026-03-23 | Fixed | Removed all `as` casts; added SkillCardData type; updated getAllPluginCards to use getTableColumns; SkillCard/SkillBrowser use proper narrow types |
