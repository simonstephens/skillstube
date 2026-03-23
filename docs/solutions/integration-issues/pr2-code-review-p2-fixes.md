---
title: "PR #2 Code Review — Six P2 Remediations (N+1, CSRF, SSR Parity, Types, FK Index, CASCADE)"
date: 2026-03-23
category: integration-issues
tags:
  - nextjs-15
  - drizzle-orm
  - postgresql
  - n-plus-one
  - csrf
  - origin-validation
  - ssr
  - type-safety
  - migrations
  - foreign-keys
  - code-review
severity: p2
component:
  - db/queries.ts
  - app/api/*/upvote
  - app/browse/page.tsx
  - db/schema.ts
  - db/migrations
symptoms:
  - Extra round-trips on homepage/collection paths (per-row queries in loop)
  - POST upvote endpoints accepted cross-origin requests
  - /browse?type=plugin did not server-render filtered results
  - Unsafe `as` type casts hiding shape mismatches
  - Missing index on skills.plugin_id FK column
  - ON DELETE CASCADE destroying child skills when plugin deleted
related_issues:
  - "PR #2: feat: Plugin-Skill entity split with real curated content"
  - "docs/solutions/security-issues/rate-limit-host-header-xss-hsts-hardening.md"
---

# PR #2 Code Review — Six P2 Remediations

Multi-agent code review of the Plugin–Skill entity split identified six P2 findings across performance, security, architecture, and data integrity. All were fixed before merge.

## Investigation Steps

1. **Query tracing** — Counted DB round-trips in `getCollectionItems()`, homepage featured plugins, and collection page skill counts. Identified per-row resolution patterns and redundant count queries.
2. **Public POST surfaces** — Reviewed both upvote API routes for cross-origin protection. Found unauthenticated POSTs with no Origin validation.
3. **SSR vs client filtering** — Compared HTML output of `/browse?type=plugin` (server-rendered) against what the client component showed after hydration. Server ignored `searchParams`.
4. **Type boundary audit** — Inspected browse page serialization and found `as SerializedPlugin[]` / `as SerializedSkill[]` casts hiding mismatches between query return shapes and component prop types.
5. **Schema review** — Checked `skills.plugin_id` FK for indexes (none), reviewed `ON DELETE CASCADE` implications for curated content model.

## Root Cause Analysis

| Finding | Root Cause |
|---------|-----------|
| N+1 queries | `getCollectionItems()` fetched rows then issued one SELECT per row. Homepage/collection pages called `getPluginSkillCount()` per plugin. Plugin detail page ran a redundant count query alongside the full skill list. |
| No CSRF | POST upvote endpoints were unauthenticated and accepted requests from any origin. No Origin/Referer check, no CSRF token. |
| Browse SSR gap | `BrowsePage` didn't accept `searchParams` prop. All filtering ran client-side in `SkillBrowser` via `useSearchParams()`. Static generation meant URL params had no effect on server HTML. |
| Unsafe casts | Manual date serialization followed by `as` casts suppressed TypeScript errors. `getAllSkillCards()` returns a subset of Skill fields, but components declared `SerializedSkill` (full type). |
| Missing index | PostgreSQL does not auto-create indexes on FK columns. `skills.plugin_id` was used in joins, subqueries, and WHERE clauses without one. |
| CASCADE policy | `ON DELETE CASCADE` on `skills.plugin_id` meant deleting a plugin silently destroyed all its child skills — inappropriate for curated content that should survive parent removal. |

## Working Solution

### 1. N+1 → Batch Resolution (db/queries.ts)

**Pattern: Collect IDs, batch resolve with `inArray`, merge via Map.**

```typescript
// Before: N+1 — one query per collection item
for (const row of rows) {
  if (row.pluginId) {
    const [plugin] = await db.select().from(plugins).where(eq(plugins.id, row.pluginId)).limit(1);
    // ...
  }
}

// After: 3 queries total regardless of collection size
const pluginIds = rows.filter(r => r.pluginId != null).map(r => r.pluginId!);
const skillIds = rows.filter(r => r.skillId != null).map(r => r.skillId!);

const [pluginMap, skillMap] = await Promise.all([
  pluginIds.length > 0
    ? db.select().from(plugins).where(inArray(plugins.id, pluginIds))
        .then(ps => new Map(ps.map(p => [p.id, p])))
    : Promise.resolve(new Map()),
  // same for skills
]);
```

**Pattern: `getTableColumns` for DRY selects + embedded subquery.**

```typescript
import { getTableColumns } from 'drizzle-orm';

export async function getAllPluginCards() {
  return db.select({
    ...getTableColumns(plugins),
    skillCount: sql<number>`(
      SELECT COUNT(*) FROM skills WHERE skills.plugin_id = ${plugins.id}
    )`.as('skill_count'),
  }).from(plugins).orderBy(desc(plugins.upvoteCount));
}
```

**Pattern: Batch counts with GROUP BY.**

```typescript
export async function getPluginSkillCounts(pluginIds: number[]) {
  if (pluginIds.length === 0) return new Map<number, number>();
  const rows = await db
    .select({ pluginId: skills.pluginId, count: count() })
    .from(skills)
    .where(inArray(skills.pluginId, pluginIds))
    .groupBy(skills.pluginId);
  return new Map(rows.map(r => [r.pluginId!, Number(r.count)]));
}
```

**Pattern: Use `.length` instead of redundant count query when full list is already loaded.**

### 2. CSRF Origin Check (lib/api/upvote.ts)

Shared module extracted from both upvote routes:

```typescript
export function isValidOrigin(request: Request): boolean {
  const origin = request.headers.get('origin');
  if (!origin) return false;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (siteUrl) {
    try { if (new URL(siteUrl).origin === origin) return true; } catch {}
  }
  if (origin.startsWith('http://localhost:')) return true;
  return false;
}
```

Applied as first guard in POST handlers: `if (!isValidOrigin(request)) return jsonResponse({ error: 'Forbidden' }, 403);`

### 3. Browse SSR Filter Parity (app/browse/page.tsx)

```typescript
// Before: BrowsePage() with no searchParams — always fetched everything
// After: reads searchParams, conditionally fetches
export default async function BrowsePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const typeFilter = typeof params.type === 'string' ? params.type : null;

  const [pluginRows, skillRows] = await Promise.all([
    typeFilter !== 'skill' ? getAllPluginCards() : Promise.resolve([]),
    typeFilter !== 'plugin' ? getAllSkillCards() : Promise.resolve([]),
  ]);
  // ...
}
```

Page becomes `ƒ (Dynamic)` instead of `○ (Static)` — correct for filtered views.

### 4. Type Safety — SkillCardData (db/schema.ts)

```typescript
// Narrow type matching what getAllSkillCards() actually returns
export type SkillCardData = {
  id: number;
  slug: string;
  pluginId: number | null;
  name: string;
  author: string;
  // ... only the fields the card query selects
  createdAt: string;
  updatedAt: string;
};
```

Components updated: `SkillCard` accepts `SkillCardData | SerializedSkill`. `SkillBrowser` uses `SkillCardData[]`. No more `as` casts.

### 5. FK Index (db/migrations/0002_review_fixes.sql)

```sql
CREATE INDEX IF NOT EXISTS idx_skills_plugin_id ON skills (plugin_id);
```

### 6. CASCADE → SET NULL (db/schema.ts + migration)

```typescript
// Drizzle schema
pluginId: integer('plugin_id').references(() => plugins.id, {
  onDelete: 'set null',  // was: 'cascade'
}),
```

```sql
-- Migration
ALTER TABLE skills DROP CONSTRAINT IF EXISTS skills_plugin_id_plugins_id_fk;
ALTER TABLE skills
  ADD CONSTRAINT skills_plugin_id_plugins_id_fk
  FOREIGN KEY (plugin_id) REFERENCES plugins(id) ON DELETE SET NULL;
```

## Prevention Strategies

### Checklist for Future PRs

| Area | Check |
|------|-------|
| **N+1** | Does this path load N items and then query per item? Use batch `inArray` or JOIN. |
| **CSRF** | Does any POST/PUT/DELETE need Origin check? Add to shared helper. |
| **SSR parity** | If it's in the URL query string, does it affect the server render? |
| **Type safety** | Any `as` casts on DB query results? Use proper narrow types instead. |
| **FK index** | New FK column? Add index in the same migration. |
| **Delete policy** | New CASCADE? Document why children should be destroyed vs orphaned. |

### Drizzle-Specific Guidelines

- Use `getTableColumns(table)` spread for card queries that need all columns + extra computed fields
- Prefer `inArray` batch over per-row queries inside loops
- When loading a list and its count, use `.length` not a separate `COUNT(*)` query
- Migration template: FK column + index + explicit `onDelete` rationale

### Next.js 15 App Router

- Every page with URL-driven filters must accept `searchParams: Promise<{...}>` and use it server-side
- `useSearchParams()` alone is insufficient for SSR — it only works after client hydration
- Accept dynamic rendering (`ƒ`) for filtered pages; static (`○`) is for unparameterized views

## Cross-References

- [PR #1 security hardening](../security-issues/rate-limit-host-header-xss-hsts-hardening.md) — related rate limiting and type safety patterns
- [Plugin-Skill entity split plan](../../plans/2026-03-21-001-feat-plugin-skill-entity-split-real-content-plan.md) — original plan that introduced these patterns
- [IA requirements](../../brainstorms/2026-03-21-information-architecture-plugins-skills-requirements.md) — requirements document

## Review Agents Used

Seven specialized agents contributed findings: kieran-typescript-reviewer, code-simplicity-reviewer, security-sentinel, performance-oracle, agent-native-reviewer, data-migration-expert, deployment-verification-agent.
