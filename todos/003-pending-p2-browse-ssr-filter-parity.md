---
status: complete
priority: p2
issue_id: "003"
tags: [code-review, agent-native, ssr, seo]
dependencies: []
---

# Browse Page: Server-Side Filter Rendering for URL Parity

## Problem Statement

`/browse?type=plugin` is a valid URL but the server does not read `searchParams` — all filtering runs client-side in `SkillBrowser` via `useSearchParams`. For no-JS clients (agents, crawlers, curl), the HTML response is the same unfiltered page regardless of query params.

**Flagged by:** agent-native-reviewer (P1 from their perspective)

## Findings

### 1. `app/browse/page.tsx` ignores `searchParams`
The server component fetches all plugins and skills unconditionally and passes them to the client `SkillBrowser`. Filtering only happens after JS hydration.

### 2. SEO/crawler impact
Search engines indexing `/browse?type=plugin` see the full unfiltered list, reducing the semantic value of these filtered URLs.

### 3. Agent discovery
Agents using `curl` or `fetch` cannot get a filtered view without parsing and filtering the full HTML themselves.

## Proposed Solutions

### Option A: Server-side pre-filter (Recommended)
- Read `searchParams` in the server `page` component
- Apply `type` filter server-side before passing to client
- Client still handles interactive filtering but initial HTML matches URL
- **Pros:** URL = document content; better SEO; agent-friendly
- **Effort:** Small–Medium | **Risk:** Low

### Option B: Accept as SPA shell, document for agents
- Document that `/browse` is a client-side experience
- Point agents to `/sitemap.xml` for discovery
- **Pros:** Zero code change
- **Effort:** None | **Risk:** Low (but misses SEO opportunity)

## Acceptance Criteria

- [ ] `curl '/browse?type=plugin'` returns HTML with only plugin cards
- [ ] Filtered URLs render correct content without JS

## Work Log

| Date | Action | Notes |
|------|--------|-------|
| 2026-03-23 | Created from code review | agent-native-reviewer flagged as P1 |
| 2026-03-23 | Fixed | BrowsePage now reads searchParams; server pre-filters data by type param; /browse is now dynamic (ƒ) instead of static |
