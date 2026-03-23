---
date: 2026-03-21
topic: information-architecture-plugins-skills
---

# Information Architecture: Plugins vs. Skills Entity Split

## Problem Frame

The current data model treats every entry as a flat `Skill` — whether it's a single-purpose tool (like VibeSec) or an entire plugin containing dozens of capabilities (like gstack or Compound Engineering). This creates a confusing browsing experience where a card for "Git Worktree Manager" (one small utility) looks identical to a card for "Compound Engineering" (a 15+ skill toolkit). Users can't tell what they're looking at or compare like-for-like.

Additionally, the original spec listed 16 specific curated entries (gstack, Superpowers, PM Skills, Sentry, HashiCorp, etc.) — none of which made it into the seed data. The current 25 entries are fabricated and don't represent real projects. Both problems need to be fixed together since the content needs to conform to the new data model.

## Requirements

### Data Model

- R1. **Three entity types**: Plugin, Skill, and Collection — each with its own database table.
- R2. **Plugin** = an installable package/repo. Has trust tier, author, install instructions, GitHub stats, description, editorial summary. May contain 1+ child skills.
- R3. **Skill** = a capability. Either belongs to a plugin (parented) or stands alone (independent). Standalone skills have their own trust tier and install instructions. Plugin-parented skills inherit trust tier from their parent plugin.
- R4. **Collection** = editorial grouping. Can reference any mix of plugins and standalone skills.
- R5. A plugin with only one skill is valid — no forced decomposition for simple packages.
- R5a. **Upvotes on both levels**: Users can upvote a plugin as a whole AND upvote individual skills within it. Standalone skills also have upvotes. Browse page sorting uses the entity's own upvote count.

### Pages & Navigation

- R6. **Homepage**: Separate sections for "Featured Plugins" and "Featured Skills" (or similar labeling).
- R7. **Browse/search page**: Unified grid with visual differentiation — plugin cards show a "Plugin" indicator and child skill count; skill cards show as individual items.
- R8. **Plugin detail page** (`/plugins/[slug]`): Richer layout than skill pages. Prominently displays child skills list. In future, supports optional hero images and longer-form editorial copy (think App Store featured apps).
- R9. **Skill detail page** (`/skills/[slug]`): Current layout, adapted for the new model. If the skill belongs to a plugin, link back to the parent plugin.
- R10. **Collection pages**: Continue to work as they do now, but can reference a mix of plugins and standalone skills.
- R10a. **URL structure**: Plugins and skills have separate URL namespaces: `/plugins/[slug]` and `/skills/[slug]`.

### Card Treatment

- R11. Plugin cards in the browse grid are visually distinct from skill cards — show "Plugin" badge and skill count.
- R12. Standalone skill cards look similar to current skill cards.
- R13. Both card types show trust tier, author, and platform badges as they do now.

### Content

- R14. Replace all 25 current fabricated entries with properly modeled real entries from the original spec. The catalog may be smaller in top-level count (16 plugins/skills vs. 25) but richer overall since plugins expose their child skills.
- R15. The 16 spec'd entries must all be represented: gstack (Garry Tan), Superpowers (Jesse Vincent), PM Skills Marketplace (Paweł Huryn), Web Quality Skills (Addy Osmani), Sentry Security Review, HashiCorp Agent Skills, Google Workspace CLI, Anthropic Official Skills, OpenAI Official Skills, Microsoft Azure Skills, Vercel Web Interface Guidelines, Trail of Bits Security, Composio Awesome Skills, VibeSec, Antigravity, Frontend Design Skill (Anthropic).
- R16. Each entry is correctly categorized as a plugin (with child skills enumerated) or a standalone skill.
- R17. Curated editorial content (summaries, trust tiers, audience tags, install instructions) for each entry.

## Success Criteria

- A user browsing the homepage can immediately distinguish between plugins (installable packages) and individual skills
- A user viewing a plugin detail page can see all skills it contains and understand the plugin as a coherent package
- All 16 spec'd entries are present with accurate attribution and correct entity type
- The browse/search page lets users filter and find both plugins and skills in a unified experience
- Collections can contain a mix of plugins and standalone skills

## Scope Boundaries

- No automated GitHub scraping — content is still manually curated
- No hero images for plugins yet — that's a future enhancement (R8 notes this as a future direction)
- Upvotes exist on both plugins and skills (see R5a) — no structural change to the upvote mechanism, just applied to both entity types
- No compare feature — still deferred
- Content accuracy: entries should be based on real, publicly available information about each plugin/skill, not fabricated

## Key Decisions

- **Full entity split over visual-only distinction**: Plugins and skills are different data model entities, not just a "type" field on one table. This gives us the cleanest foundation for future features (hero images, per-skill install instructions, etc.).
- **Hybrid page layout**: Homepage uses separate sections (Featured Plugins, Featured Skills); browse page uses a unified grid with visual differentiation.
- **Replace, don't keep**: Drop all 25 fabricated entries and start fresh with the spec's real entries, properly modeled.
- **Optional plugin parentage for skills**: Skills can stand alone or belong to a plugin. This avoids forcing a parent-child relationship on simple standalone tools.
- **Separate URL namespaces**: `/plugins/[slug]` and `/skills/[slug]` — makes the entity type visible in the URL and avoids slug collisions.
- **Upvotes on both levels**: Users can upvote plugins and individual skills independently.

## Dependencies / Assumptions

- The 16 spec'd stacks are all real, active projects with enough public info to write accurate descriptions
- Migration will require a new schema (plugins table, updated skills table with optional plugin_id FK, updated collection join tables to support both types)

## Outstanding Questions

### Deferred to Planning

- [Affects R1][Technical] Schema design for the plugin-skill relationship — separate `plugins` table with `plugin_id` FK on skills, or a different approach?
- [Affects R7][Technical] How to handle filtering/sorting when plugins and skills coexist in the browse grid — filter by type? unified relevance score?
- [Affects R4][Technical] Collection join table needs to support referencing either a plugin or a skill — polymorphic FK or separate join columns?
- [Affects R14-R16][Needs research] Research each of the 16 spec'd entries to determine correct entity type (plugin vs. standalone skill) and enumerate child skills for plugins
- [Affects R8][Technical] Plugin detail page component structure — reuse SkillDetailPage with conditional sections or build a separate PluginDetailPage?

## Next Steps

-> `/ce:plan` for structured implementation planning
