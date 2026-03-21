---
status: pending
priority: p2
issue_id: 008
tags: [code-review, security]
---

# JSON-LD script breakout via `JSON.stringify` in `dangerouslySetInnerHTML`

## Problem Statement
Embedding JSON-LD with `JSON.stringify` inside `<script type="application/ld+json">` without escaping can allow `</script>` (and similar sequences) in string values to break out of the script context, which is a classic XSS footgun.

## Findings
- `app/skills/[slug]/page.tsx` line 122
- `app/page.tsx` line 98
- `app/collections/[slug]/page.tsx` line 79

## Proposed Solutions
### Option A: Safe JSON-LD helper
- Add `safeJsonLd()` (or equivalent) that serializes JSON and replaces `<` with `\u003c` (and any other recommended escapes per best practice) before injecting into `dangerouslySetInnerHTML`.
- Effort: Small

## Acceptance Criteria
- [ ] All JSON-LD script tags use the safe helper; raw `JSON.stringify` in those blocks is removed
- [ ] Valid JSON-LD still parses correctly in consumers (search engines, validators)
- [ ] Malicious-looking string values containing `</script>` cannot terminate the script tag
