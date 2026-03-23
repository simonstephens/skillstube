---
status: pending
priority: p3
issue_id: "020"
tags: [code-review, performance, fonts]
---

# Plus Jakarta Sans loads 4 font weights — may only need 2

## Problem Statement
`app/layout.tsx` imports Plus Jakarta Sans with weights `['500', '600', '700', '800']`. Headings likely only use 600 (semibold) and 700 (bold). Extra weights add to font payload and affect LCP.

## Proposed Solutions
1. Audit which weights are used in CSS (`font-semibold` = 600, `font-bold` = 700) and remove unused ones

## Technical Details
- File: `app/layout.tsx` line 17-21

## Acceptance Criteria
- [ ] Only actively-used font weights are loaded
