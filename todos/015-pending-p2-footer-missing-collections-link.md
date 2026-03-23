---
status: pending
priority: p2
issue_id: "015"
tags: [code-review, navigation, consistency]
---

# Footer missing Collections link

## Problem Statement
Header nav has Plugins | Skills | Collections, but footer only has "All Plugins & Skills" and GitHub. Footer should include a Collections link for consistency with the new IA.

## Findings
- `components/layout/Header.tsx` has `/collections` in NAV_LINKS
- `components/layout/Footer.tsx` only has `/browse` and GitHub
- Users/agents navigating only via footer miss Collections

## Proposed Solutions
1. Add "Collections" link to footer nav pointing to `/collections`

## Technical Details
- File: `components/layout/Footer.tsx`

## Acceptance Criteria
- [ ] Footer includes a Collections link
- [ ] Footer nav aligns with header destinations
