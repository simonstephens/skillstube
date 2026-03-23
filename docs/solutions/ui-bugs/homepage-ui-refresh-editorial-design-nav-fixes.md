---
title: "Homepage and navigation UX refresh — distinct sections, functional hero search, aligned nav (PR #4)"
category: ui-bugs
date: 2026-03-23
problem_type: ui-bugs
component: "homepage, site navigation, footer, sitemap, browse (sort=recent), collections listing"
tags:
  - homepage
  - navigation
  - ui-refresh
  - code-review
  - next-js
  - tailwind
  - editorial-design
  - component-architecture
severity: medium
resolution_time: "~3 hours (brainstorm → plan → implement → review → fix)"
related_pr: 4
---

# Homepage UI Refresh with Editorial Design Direction

## Problem

SkillsTube's homepage was functional but felt like a **default shadcn template** — indistinguishable from any other Next.js starter. Seven repetitive sections (FeaturedPlugins, FeaturedSkills, FeaturedStacks, BrowseByAudience, BrowseByCategory, RecentlyAdded, plus a passive hero) created visual monotony. Navigation reflected internal data model structure (Browse, For Developers, For Non-Technical) rather than how users discover content. Geist-only typography and uniform card sizes offered no visual personality.

**Symptoms:**
- Homepage sections all looked the same — no visual hierarchy or section differentiation
- Navigation links didn't match site structure (no "Collections" link, audience-based links added complexity)
- Hero was passive ("Browse All Skills" CTA button) instead of functional (search)
- No way to sort by "recently added" on the browse page

## Root Cause

**Template fatigue from composition + hierarchy** — the issue wasn't component quality but structural repetition. Many same-shaped sections beat fewer, more distinct ones. Typography was a single font across all text. Card treatment was uniform (`border-transparent shadow-none`). Section backgrounds were all white. Navigation was taxonomy-driven rather than task-driven.

## Investigation

1. **Structured brainstorm** (`/ce:brainstorm`) challenged assumptions — user proposed dropdowns for nav but we landed on simple flat links; user questioned whether collections page was needed and we decided to keep it as a differentiator
2. **Requirements document** captured 17 requirements across nav, hero, homepage sections, collections, browse, and visual identity
3. **Six-phase implementation plan** kept scope traceable: Typography → Nav → Hero → Sections → Collections Page → Browse Sort
4. **Multi-agent code review** (6 agents: TypeScript, simplicity, security, performance, agent-native, learnings) caught 3 P2 issues post-implementation

## Solution

### Architecture changes

**Homepage data loading (`app/page.tsx`):**
- Eight parallel queries via `Promise.all` — no waterfalls
- Featured: merge plugins + skills by `upvoteCount` desc, take top 8
- Recent: merge plugins + skills by `createdAt` desc, take top 4

**Component model:**

| Component | Type | Purpose |
|-----------|------|---------|
| `Hero` | Client Component | Form-based search → `/browse?q=...` via `useRouter` |
| `FeaturedPicks` | Server Component | Mixed plugin/skill grid, first 2 items larger, trust-tier left border |
| `CollectionsRow` | Server Component | Compact cards on `bg-muted/30` background |
| `JustAdded` | Server Component | 4-column strip with "New" badges |
| `SkillBrowser` | Client Component | Added `sort=recent` as third sort mode |

**Data layer (`db/queries.ts`):**
- `getRecentPluginCards()` — mirrors `getRecentSkills` for mixed "Just Added"
- `getFeaturedPluginCards()` — featured plugins with skill count subquery
- `getPluginSkillCounts(pluginIds)` — batched `GROUP BY` replacing N+1 per-card queries

**Visual system:**
- **Plus Jakarta Sans** heading font via `next/font/google` (weights 500–800)
- Alternating section backgrounds: gradient → muted/30 → white
- Trust-tier left border accent on verified/official cards
- Cards: `border-border/50 shadow-sm` → `shadow-lg` on hover

**File churn:** Deleted 6 old sections, created 4 new components + 1 page.

### Code review findings (P2, fixed in follow-up commit)

1. **Hero placeholder accuracy** — Said "Search plugins, skills, and collections..." but `/browse` only searches plugins and skills. Fixed to "Search plugins and skills..."
2. **Sitemap completeness** — `/collections` page missing from `app/sitemap.ts` static routes. Added.
3. **Footer nav consistency** — Header had Plugins | Skills | Collections but footer only had "All Plugins & Skills". Added Collections link to footer.

## Prevention

### New route checklist

When adding a new route, treat these as one atomic change:

| Area | Verify |
|------|--------|
| App Router | Route exists, metadata title/description accurate |
| Header | Primary nav + mobile menu include new link |
| Footer | Mirror header or document why omitted |
| Sitemap | New URL in static routes with appropriate priority |
| Internal links | Cross-links from home, index pages, cards |

**Pattern:** "Route + header + footer + sitemap" as a single checklist item in plan templates.

### UI refresh process

1. **Brainstorm before coding** — challenge assumptions about nav patterns, section count, visual direction
2. **Phase the plan** — numbered phases with exit criteria; no "polish" merged with "routing/SEO"
3. **Copy is a feature** — every placeholder must match actual behavior; flag aspirational text as temporary
4. **Review as a gate** — multi-agent review catches nav/sitemap/copy gaps humans skim over

### Mixed entity sections vs separate

- Prefer **mixed grids** when entities share visual treatment and one fetch returns a unified shape
- Keep **separate components** when data sources, caching, or client boundaries differ
- **Trust-tier border logic** should be a shared helper, not duplicated in 3+ files

### Server → Client Component boundary

- Default to Server Components; push interactivity to the smallest client island
- Before converting: estimate client bundle impact — if only one widget needs hooks, extract the widget
- Document why a file is `'use client'` in the component

## Key Learnings

- **Template fatigue is composition, not quality** — fewer, more distinct sections beat many same-shaped ones
- **Typography is cheap, high-leverage** — one editorial heading font changes perceived quality without fighting a bright/minimal brief
- **Merging entities by ranking key** (upvotes, dates) is a strong pattern when plugins and skills are peer discovery items
- **Nav and copy must track actual behavior** — mismatches erode trust even when visuals improve
- **Multi-agent code review** catches mechanical consistency gaps (sitemap, footer, placeholder accuracy) that single-reviewer fatigue misses

## Related

- [PR #4: Homepage UI refresh](https://github.com/simonstephens/skillstube/pull/4)
- [Requirements: docs/brainstorms/2026-03-23-homepage-ui-refresh-requirements.md](../brainstorms/2026-03-23-homepage-ui-refresh-requirements.md)
- [Plan: docs/plans/2026-03-23-001-feat-homepage-ui-refresh-plan.md](../plans/2026-03-23-001-feat-homepage-ui-refresh-plan.md)
- [PR #2 code review fixes](../solutions/integration-issues/pr2-code-review-p2-fixes.md) — shares themes: types at boundaries, browse/homepage behavior, Next.js App Router patterns
- [Security hardening](../solutions/security-issues/rate-limit-host-header-xss-hsts-hardening.md) — homepage ISR/JSON-LD patterns referenced
