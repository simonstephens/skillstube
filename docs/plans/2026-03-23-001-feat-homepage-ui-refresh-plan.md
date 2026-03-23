---
title: "feat: Homepage & UI Refresh"
type: feat
status: active
date: 2026-03-23
origin: docs/brainstorms/2026-03-23-homepage-ui-refresh-requirements.md
---

# feat: Homepage & UI Refresh

## Overview

Rework SkillsTube's homepage, navigation, and visual identity from a generic shadcn template into an editorial-quality discovery hub. The homepage gets a functional search bar, a single mixed "Featured" section, a compact collections row, and a "Just Added" strip. Navigation simplifies to three links (Plugins, Skills, Collections) plus search. Visual identity upgrades to a distinctive heading font, alternating section backgrounds, and varied card treatments.

## Problem Statement / Motivation

The current homepage has too many repetitive sections (separate featured plugins/skills, browse-by-audience, browse-by-category) that make it feel like a template. Navigation doesn't match actual site structure. The visual design (default Geist font, uniform card layouts, no section differentiation) is clean but forgettable. For a discovery-oriented curated directory, the homepage should make finding great tools effortless and the site should feel editorially curated, not auto-generated. (see origin: `docs/brainstorms/2026-03-23-homepage-ui-refresh-requirements.md`)

## Proposed Solution

Six implementation phases, each independently shippable:

1. **Typography & Visual Foundation** — new heading font, section background tokens, typographic scale
2. **Navigation Rework** — Header and Footer updated to Plugins | Skills | Collections + search
3. **Hero Rework** — functional search bar replacing passive CTA
4. **Homepage Sections** — new FeaturedPicks, compact CollectionsRow, JustAdded strip; remove old sections
5. **Collections Listing Page** — new `/collections` route
6. **Browse Page Sort** — add "Recently Added" sort option

## Technical Considerations

### Font Selection

Add **Plus Jakarta Sans** (available on Google Fonts) as the heading font. It's a geometric sans-serif with editorial character that pairs well with Geist for body text. Distinctive enough to add personality, clean enough for a trust-focused directory.

- Import via `next/font/google` alongside existing Geist fonts
- Map to `--font-heading` CSS variable (already exists in globals.css but currently points to `--font-sans`)
- Apply via `font-heading` utility class on headings

### Data Layer Changes

**New query: `getRecentItems(limit)`** — Union of recent plugins + skills sorted by `createdAt` desc. Two approaches:

- **Approach A (recommended):** Two separate queries (`getRecentPlugins` + `getRecentSkills`) merged and sorted in the server component. Simple, no schema changes, type-safe.
- **Approach B:** Raw SQL union query. More efficient but harder to type with Drizzle.

**Mixed featured section:** Merge `getFeaturedPlugins` + `getFeaturedSkills` results in the server component, sort by `upvoteCount` desc, take top 8. No new DB query needed.

**R11 sort correction:** The brainstorm doc assumed `sort=recent` already existed in SkillBrowser — it does not. The current sort options are `upvotes` (default) and `alpha`. Must add `recent` as a third sort mode that sorts by `createdAt` desc on the client. This is a logic change, not just visibility. Serialized browse payloads already include `createdAt`.

### Section Backgrounds

Use wrapper `<section>` elements with alternating background utilities:
- Featured: `bg-gradient-to-b from-primary/[0.03] to-transparent` (reuse hero pattern)
- Collections: `bg-muted/30` (soft gray tint)
- Just Added: white (default)

This creates visual rhythm without adding complexity.

### "New" Badge Logic

Items are "new" if `createdAt` is within 14 days of current date. Computed in the server component, passed as a `isNew` boolean prop to cards. No DB changes needed.

### Empty States

Every homepage section handles zero items gracefully:
- Featured (0 items): hide section entirely
- Collections row (0 collections): hide section entirely
- Just Added (0 items): hide section entirely
- `/collections` listing (0 collections): show friendly empty state message

### Footer Alignment

Update Footer "Browse" link to "All Plugins & Skills" pointing to `/browse`, aligning with the new nav taxonomy where "Browse" is no longer a primary nav label.

## Acceptance Criteria

### Phase 1: Typography & Visual Foundation

- [ ] **`app/layout.tsx`** — Import Plus Jakarta Sans via `next/font/google`, add CSS variable `--font-heading-display`
- [ ] **`app/globals.css`** — Map `--font-heading` to the new font variable in `@theme inline` block
- [ ] **`app/globals.css`** — Add section background utility tokens if needed
- [ ] Headings across the site use the new heading font automatically via existing `font-heading` usage
- [ ] Body text remains Geist Sans
- [ ] No visual regressions on existing pages

### Phase 2: Navigation Rework

- [ ] **`components/layout/Header.tsx`** — Replace `NAV_LINKS` with: Plugins (`/browse?type=plugin`), Skills (`/browse?type=skill`), Collections (`/collections`)
- [ ] **`components/layout/Header.tsx`** — Update mobile menu to match new links
- [ ] **`components/layout/Header.tsx`** — Keep search affordance on right side, linking to `/browse`
- [ ] **`components/layout/Footer.tsx`** — Rename "Browse" to "All Plugins & Skills" or similar, keeping `/browse` destination
- [ ] No dead links, all nav items resolve correctly

### Phase 3: Hero Rework

- [ ] **`components/sections/Hero.tsx`** — Replace `<Button>` CTA with a real `<form>` containing an `<input>` search bar
- [ ] Form submits via `router.push('/browse?q=...')` on Enter (client-side navigation, no full page reload)
- [ ] Hero remains compact: headline ("Find skills you can **trust**"), one-line subtitle, search bar
- [ ] Empty submit (no query) navigates to `/browse` without `q` param
- [ ] Hero component becomes a Client Component (needs `useRouter`)
- [ ] Remove the old `<Button>` "Browse All Skills" CTA
- [ ] Search input has appropriate placeholder text and styling consistent with editorial direction

### Phase 4: Homepage Sections

#### 4a. New FeaturedPicks section

- [ ] **`components/sections/FeaturedPicks.tsx`** (new file) — Accepts mixed array of plugins + skills, renders in a responsive grid
- [ ] Cards vary in visual weight: first 2 items get larger cards (span 2 cols on desktop), remaining get standard size
- [ ] Each card shows entity type badge ("Plugin" / "Skill") for scanability
- [ ] Trust tier visually differentiates cards (R15): verified/official cards get a subtle left border accent in the trust color
- [ ] Section has tinted background for visual distinction from hero

#### 4b. Compact CollectionsRow

- [ ] **`components/sections/CollectionsRow.tsx`** (new file) — Horizontal scrollable or compact grid of collection cards
- [ ] Visually distinct from featured grid: `bg-muted/30` background, smaller cards, different layout
- [ ] Each card shows: name, description (truncated), item count
- [ ] Links to `/collections/[slug]`

#### 4c. JustAdded strip

- [ ] **`components/sections/JustAdded.tsx`** (new file) — Compact single row of 3-4 newest items (mixed plugins + skills)
- [ ] "New" badge on each card (items within 14 days of `createdAt`)
- [ ] Compact card variant — smaller than featured cards, emphasizing name + author + "New" badge
- [ ] Links to respective detail pages

#### 4d. Homepage assembly

- [ ] **`app/page.tsx`** — Replace section lineup: `Hero` → `FeaturedPicks` → `CollectionsRow` → `JustAdded`
- [ ] **`app/page.tsx`** — Add data fetching: merge featured plugins + skills; fetch recent plugins + skills
- [ ] **`db/queries.ts`** — Add `getRecentPlugins(limit)` query (mirrors `getRecentSkills`)
- [ ] Remove imports of `FeaturedPlugins`, `FeaturedSkills`, `BrowseByAudience`, `BrowseByCategory`, `RecentlyAdded`
- [ ] Each section handles empty data by not rendering (no broken empty grids)

### Phase 5: Collections Listing Page

- [ ] **`app/collections/page.tsx`** (new file) — Server component, fetches all collections with item counts
- [ ] Renders simple grid of collection cards (reuse card pattern from CollectionsRow or FeaturedStacks)
- [ ] Page title: "Collections", subtitle: "Curated stacks of plugins and skills"
- [ ] Empty state: friendly message when no collections exist
- [ ] `generateMetadata` with appropriate title/description
- [ ] `revalidate = 60` consistent with other pages

### Phase 6: Browse Page Sort Enhancement

- [ ] **`components/sections/SkillBrowser.tsx`** — Add `recent` as third sort mode alongside `upvotes` and `alpha`
- [ ] Parse `sort=recent` from URL params (update `sortMode` logic)
- [ ] Sort filtered results by `createdAt` desc when `sort=recent` (client-side, data already includes `createdAt`)
- [ ] Add "Recently Added" button to the sort controls next to "Most upvoted" and "A–Z"
- [ ] Add chip + removal for `sort=recent` in the active filters bar
- [ ] Update `hasActiveFilters` to recognize `sort=recent`

## Implementation Notes

### Files to create

| File | Purpose |
|------|---------|
| `components/sections/FeaturedPicks.tsx` | Mixed featured grid (plugins + skills) with varied card sizes |
| `components/sections/CollectionsRow.tsx` | Compact collections horizontal row |
| `components/sections/JustAdded.tsx` | Recent items strip with "New" badges |
| `app/collections/page.tsx` | Collections listing page |

### Files to modify

| File | Changes |
|------|---------|
| `app/layout.tsx` | Add Plus Jakarta Sans font import |
| `app/globals.css` | Update `--font-heading` mapping, add section bg tokens if needed |
| `app/page.tsx` | Replace section lineup, update data fetching |
| `components/layout/Header.tsx` | New nav links (Plugins, Skills, Collections) |
| `components/layout/Footer.tsx` | Rename "Browse" link |
| `components/sections/Hero.tsx` | Convert to Client Component with search form |
| `components/sections/SkillBrowser.tsx` | Add `sort=recent` mode |
| `db/queries.ts` | Add `getRecentPlugins` query |

### Files to delete (or leave unused)

| File | Reason |
|------|--------|
| `components/sections/FeaturedPlugins.tsx` | Replaced by FeaturedPicks |
| `components/sections/FeaturedSkills.tsx` | Replaced by FeaturedPicks |
| `components/sections/BrowseByAudience.tsx` | Removed from homepage per R8 |
| `components/sections/BrowseByCategory.tsx` | Removed from homepage per R8 |
| `components/sections/RecentlyAdded.tsx` | Replaced by JustAdded |

### Existing files preserved unchanged

| File | Reason |
|------|--------|
| `app/collections/[slug]/page.tsx` | Collection detail pages stay as-is (R10) |
| `app/plugins/[slug]/page.tsx` | Detail pages out of scope |
| `app/skills/[slug]/page.tsx` | Detail pages out of scope |
| `components/ui/PluginCard.tsx` | Reused in new sections (may get minor trust-tier styling additions) |
| `components/ui/SkillCard.tsx` | Reused in new sections (may get minor trust-tier styling additions) |

### Key technical decisions

1. **Client-side merge for mixed lists** rather than SQL union — simpler, type-safe, avoids schema complexity
2. **Plus Jakarta Sans** via `next/font/google` — zero external requests, self-hosted, good editorial character
3. **14-day "New" badge** computed server-side — no DB changes, no manual toggling
4. **Hero as Client Component** — needed for `useRouter` form submission; minimal JS footprint since it's a single form
5. **Sort=recent is new behavior** — despite brainstorm doc's assumption, this requires implementing a third client-side sort mode on `createdAt` (see origin: `docs/brainstorms/2026-03-23-homepage-ui-refresh-requirements.md`, R11 deferred question)

## Success Metrics

- Homepage renders three distinct visual sections with alternating backgrounds
- First-time visitor can search from hero and reach results within one interaction
- Site looks visually distinct from default shadcn/template aesthetic
- All nav links resolve correctly; no dead links
- "Just Added" strip shows genuinely recent items (by `createdAt`)
- `/collections` page works and is linked from nav

## Dependencies & Risks

- **Plus Jakarta Sans availability** — Well-established Google Font, low risk. Fallback: use existing Geist with increased weight variation.
- **Homepage data fetching** — Adding `getRecentPlugins` is straightforward (mirrors existing `getRecentSkills`). No schema changes.
- **Client-side sort performance** — Browse page already sorts client-side; adding a third mode is trivial. Risk is negligible with current data sizes.
- **Visual subjectivity** — "Editorial modern" is interpretive. Acceptance criteria focus on structural/measurable changes; visual polish may need iteration after initial implementation.

## Sources & References

### Origin

- **Origin document:** [docs/brainstorms/2026-03-23-homepage-ui-refresh-requirements.md](docs/brainstorms/2026-03-23-homepage-ui-refresh-requirements.md) — Key decisions carried forward: discovery hub homepage direction, simple nav (Plugins/Skills/Collections), editorial modern visual direction with distinctive heading font, three homepage sections (featured/collections/just-added), keep collection detail pages + add listing.

### Internal References

- `components/sections/Hero.tsx` — current hero implementation to replace
- `components/sections/SkillBrowser.tsx:484-504` — current sort controls to extend
- `db/queries.ts:169-175` — `getRecentSkills` pattern to mirror for `getRecentPlugins`
- `app/globals.css:12` — existing `--font-heading` variable to remap

### SpecFlow Analysis Findings

- R11 scope correction: "Recently Added" sort requires new `sort=recent` client-side behavior, not just UI visibility change
- R7 data gap: need `getRecentPlugins` query + server-side merge with `getRecentSkills`
- R5 merge: interleave featured plugins + skills by `upvoteCount` desc, take top 8
- Empty states: all homepage sections should hide when empty; `/collections` needs explicit empty state
- Footer "Browse" should be renamed for consistency with nav IA changes
- "New" badge needs time-boxing (14 days from `createdAt`)
