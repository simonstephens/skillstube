---
status: pending
priority: p3
issue_id: "018"
tags: [code-review, dry, ui]
---

# Trust tier border accent logic duplicated in 3 files

## Problem Statement
The "verified/official gets left border accent" logic exists in `FeaturedPicks.tsx` (`getTrustBorderClass`), `PluginCard.tsx`, and `SkillCard.tsx` as inline conditions. Should be a single shared helper.

## Proposed Solutions
1. Add `trustTierAccentClass(tier: TrustTier): string` to `lib/types.ts` and use in all three files

## Technical Details
- `components/sections/FeaturedPicks.tsx` lines 21-27
- `components/ui/PluginCard.tsx` lines 30-31
- `components/ui/SkillCard.tsx` lines 30-31

## Acceptance Criteria
- [ ] Single helper for trust border logic
- [ ] All card components use the shared helper
