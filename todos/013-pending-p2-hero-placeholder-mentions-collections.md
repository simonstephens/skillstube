---
status: pending
priority: p2
issue_id: "013"
tags: [code-review, ui, accuracy]
---

# Hero search placeholder claims collection search

## Problem Statement
Hero search placeholder says "Search plugins, skills, and collections..." but `/browse` only searches plugins and skills. Collections are not included in the SkillBrowser dataset or filtering logic.

## Findings
- `components/sections/Hero.tsx` placeholder: "Search plugins, skills, and collections..."
- `SkillBrowser` merges `plugins` + `skills` only — no collection data
- Misleading to users and agents that trust the label

## Proposed Solutions
1. **Change placeholder** to "Search plugins and skills..." — 1 line, zero risk
2. **Add collections to browse** — larger scope, separate feature

## Technical Details
- File: `components/sections/Hero.tsx`

## Acceptance Criteria
- [ ] Placeholder text accurately reflects what search covers
