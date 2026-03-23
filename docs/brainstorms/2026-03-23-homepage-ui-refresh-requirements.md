---
date: 2026-03-23
topic: homepage-ui-refresh
---

# Homepage & UI Refresh

## Problem Frame

SkillsTube's homepage and navigation work but feel generic — indistinguishable from a default shadcn template. The information architecture is solid, but the homepage has too many low-value sections (browse-by-category, browse-by-audience, separate featured plugins/skills), the nav doesn't match the site's actual structure, and the visual design lacks personality. For a discovery-oriented curated directory, the homepage should make finding great tools feel effortless and the site should have a memorable editorial identity.

## Requirements

### Navigation

- R1. Replace current nav links with three simple links: **Plugins** (`/browse?type=plugin`), **Skills** (`/browse?type=skill`), **Collections** (`/collections`). Remove the generic "Browse" link and audience-specific links from nav.
- R2. Keep the search affordance in the header (right side). It should link to or redirect to `/browse` with focus on the search input.

### Hero

- R3. Replace the passive hero tagline + CTA button with a **functional search bar** that submits to `/browse?q=...`. This is the primary entry point for a discovery hub.
- R4. Keep the hero compact — headline, one-line subtitle, and search bar. No large illustrations or decorative padding.

### Homepage Sections

- R5. Replace the separate "Featured Plugins" and "Featured Skills" sections with a single **"Featured"** section showing a mixed grid of 6-8 top picks (plugins and skills together).
- R6. Add a **"Collections"** row below featured — compact horizontal cards linking to collection detail pages. Visually distinct from the featured grid.
- R7. Add a **"Just Added"** strip at the bottom showing 3-4 newest items with "New" badges. Compact, single-row layout.
- R8. Remove from homepage: "Browse by Category", "Browse by Audience", "Browse All Skills" CTA, and the separate "Recently Added" grid section.

### Collections

- R9. Create a lightweight `/collections` listing page — simple grid of collection cards with name, description, trust tier, and item count. No filtering needed.
- R10. Keep existing collection detail pages (`/collections/[slug]`) unchanged — the editorial markdown content is a key differentiator.

### Browse Page

- R11. Add a prominent **"Sort by: Recently Added"** option to the browse page. The `sort` URL param already exists in SkillBrowser; this just needs to be more visible/accessible.

### Visual Identity — Editorial Modern

- R12. Replace Geist for headings with a **distinctive geometric/editorial sans-serif** (e.g., Satoshi, Plus Jakarta Sans, or similar from Google Fonts). Keep Geist or a clean body font for body text.
- R13. Add **subtle gradients or tinted backgrounds** to alternate homepage sections, creating visual rhythm (e.g., white → soft blue-gray → white → soft warm gray).
- R14. Vary card presentation across sections — featured cards should be larger/richer than the compact "just added" items. Visual hierarchy through size and density, not just content.
- R15. Strengthen **trust tier visual differentiation** on cards — verified/official items should feel visually elevated compared to community submissions (e.g., subtle border accent, badge prominence, or background tint).
- R16. Add **typographic hierarchy** — large bold section headlines, tighter spacing, editorial-quality type sizing. Move away from uniform `text-3xl font-bold` everywhere.
- R17. Overall aesthetic: clean, bright, modern editorial. Reference quality: Vercel/Linear marketing pages. No dark mode for now. Light theme with purposeful color accents.

## Success Criteria

- Homepage loads with three distinct visual sections below the hero (featured, collections, just added) — each immediately distinguishable by layout and treatment.
- A first-time visitor can search from the hero and find a relevant plugin/skill within 5 seconds.
- The site feels visually memorable and editorially curated, not like a default template.
- Navigation is self-explanatory: three clear destinations (Plugins, Skills, Collections) plus search.
- Return visitors can quickly spot new additions via the "Just Added" strip or sort-by-recent on browse.

## Scope Boundaries

- No dark mode implementation
- No changes to plugin/skill/collection detail pages (beyond what R10 preserves)
- No changes to the browse page filtering logic (only sort visibility per R11)
- No new data models or schema changes — working with existing queries
- No authentication, user accounts, or personalization
- Collections listing page is simple grid — no filtering, pagination, or search

## Key Decisions

- **Discovery hub over showcase**: Homepage optimized for fast finding, not editorial storytelling (that lives in collection detail pages)
- **Simple nav over dropdowns**: Three plain links + search. Audience/category filtering stays on the browse page where it already works well.
- **Mixed featured section**: Plugins and skills in one grid — the entity type distinction matters less to users than quality.
- **Keep collections**: Editorial content in collection details is a genuine differentiator. Lightweight listing page makes nav coherent.
- **Editorial modern visual direction**: Distinctive heading font, alternating section backgrounds, varied card sizes. Vercel/Linear quality bar.

## Outstanding Questions

### Deferred to Planning

- [Affects R12][Needs research] Which specific Google Fonts heading font best fits the editorial modern direction while pairing well with the body font?
- [Affects R3][Technical] Should the hero search bar be a real `<input>` with form submission, or a styled link that redirects to `/browse` and auto-focuses the existing search input there?
- [Affects R5][Technical] How to query a mixed list of featured plugins + skills ordered by a combined ranking — may need a new query or merge logic in the server component.
- [Affects R13][Technical] Best approach for alternating section backgrounds in Tailwind v4 — CSS variables, wrapper divs, or section-level utility classes.

## Next Steps

→ `/ce:plan` for structured implementation planning
