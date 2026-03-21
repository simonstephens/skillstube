---
status: pending
priority: p2
issue_id: 009
tags: [code-review, security]
---

# `javascript:` links in react-markdown content

## Problem Statement
`react-markdown` can render `javascript:` URLs as normal clickable links in `SkillMdPreview` and collection editorial markdown, enabling unsafe navigation when users follow links.

## Findings
- Custom link rendering does not restrict protocols in markdown-derived `href` values.
- Affected surfaces: `SkillMdPreview` and collection page editorial content.

## Proposed Solutions
### Option A: Protocol allowlist on custom `a` component
- In the custom `a` renderer, only allow `http:`, `https:`, path-relative (`/...`), and in-page (`#...`) targets; strip, neutralize, or render plain text for disallowed schemes (including `javascript:`).
- Effort: Small

## Acceptance Criteria
- [ ] `javascript:`, `data:`, and other disallowed schemes are not emitted as navigable links
- [ ] `http(s)`, same-site paths, and hash-only anchors still work as expected
- [ ] Behavior is covered for both skill preview and collection editorial markdown
