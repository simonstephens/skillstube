---
date: 2026-03-20
topic: skillstube-mvp
---

# SkillsTube MVP — Weekend Launch

## Problem Frame

500K+ Claude Code / Cowork skills are scattered across GitHub with no quality signal beyond star count. Existing directories are developer-only scrapers with no curation, no safety verification, and no support for non-technical Cowork users. Snyk's ToxicSkills audit found 1/3 of community skills have security flaws — nobody is solving trust.

SkillsTube is a curated skills directory that combines editorial curation of top skill stacks with trust/safety scoring, targeting both developers and non-technical Cowork users.

## Requirements

### Homepage
- R1. Hero section with value prop: "Find skills you can trust for Claude Code and Cowork"
- R2. Featured stacks — editorial carousel/grid of curated collections (gstack, Superpowers, PM Skills, etc.) with trust badges
- R3. Browse by audience — two entry points: "For developers" (Claude Code, Codex, Cursor) and "For everyone" (Cowork, Claude.ai)
- R4. Browse by role — starter packs: PM, Frontend Dev, Security Engineer, Cowork Power User, etc.
- R5. Browse by category — Development, Productivity, Security, Documents, Design, DevOps, Research, Automation
- R6. Recently added section
- R7. Search bar always visible in nav

### Skill Detail Page
- R8. Skill name, author, description
- R9. Trust badge displayed prominently at top (Official / Verified / Community / Unreviewed / Flagged)
- R10. Safety summary — human-written description of what the skill can access, risk level
- R11. "Works with" badges — Claude Code, Codex CLI, Cursor, Cowork, Claude.ai (manually tagged)
- R12. Audience tag — Developer / Non-technical / Both
- R13. GitHub stats — stars, forks, last updated (pulled from curated data, not live API)
- R14. Install instructions with one-click copy button, per compatible platform
- R15. Anonymous upvote button (one per user per skill, tracked via localStorage)
- R16. "Part of collections" — which curated collections include this skill
- R17. SKILL.md preview — collapsible view of actual skill content

### Collection Pages
- R18. Collection name, author, editorial write-up (who it's for, how skills work together)
- R19. Ordered list of skills in the collection with trust badges and brief descriptions
- R20. "Install all" instructions where applicable

### Search & Browse
- R21. Client-side search/filter across all curated skills
- R22. Filter by: audience, trust tier, category, "works with" platform
- R23. Card grid layout with: skill name, author, one-line description, trust badge, audience tag, star count, upvote count

### Trust System
- R24. Five trust tiers displayed on every skill card:
  - Official (green) — published by Anthropic, OpenAI, Google, Microsoft
  - Verified (green) — from known creators OR hand-reviewed by SkillsTube team
  - Community (blue) — meets minimum quality bar
  - Unreviewed (amber) — indexed but not yet evaluated
  - Flagged (red) — potential issues detected
- R25. Trust tier manually assigned for all curated skills (no automated scanning for MVP)

### Content
- R26. 20-30 curated skills and collections at launch, including: gstack, Superpowers, PM Skills Marketplace, Web Quality Skills, Sentry Security Review, HashiCorp Agent Skills, Google Workspace CLI, Anthropic Official Skills, OpenAI Official Skills, Microsoft Azure Skills, Vercel Web Interface Guidelines, Trail of Bits Security, Composio Awesome Skills, VibeSec Skill, Antigravity, Frontend Design Skill
- R27. Each curated entry includes: hand-written summary, trust tier, audience tags, "works with" info, "best for" use case, install instructions

### Upvotes
- R28. Anonymous upvote — no auth required
- R29. One upvote per skill per browser (localStorage tracking)
- R30. Upvote count displayed on skill cards and detail pages
- R31. Upvote persisted in database

### General
- R32. Mobile-responsive from day one
- R33. Visual direction: light, modern, airy — closer to Product Hunt than a terminal aesthetic

## Success Criteria
- Site is live and publicly accessible by end of weekend
- All 20-30 curated skills have editorial content, trust badges, and install instructions
- A non-technical Cowork user can browse, find a relevant skill, and copy install instructions
- A developer can filter by platform and find skills for their tool
- The site looks trustworthy and professional enough to share on Twitter

## Scope Boundaries
- **No GitHub scraper** — long-tail catalogue deferred to week 2
- **No automated safety scanning** — trust tiers manually assigned for curated set
- **No side-by-side compare** — deferred to week 2
- **No user auth** — upvotes are anonymous
- **No reviews or ratings** — deferred to week 2
- **No "submit a skill" flow** — deferred to week 2
- **No email digest** — deferred to week 2
- **No API** — deferred to post-MVP
- **No live GitHub API calls** — star/fork counts are snapshot data in the curated entries

## Key Decisions
- **Railway, not Vercel** — Si already uses Railway for hosting and has Postgres available there
- **Railway Postgres, not Supabase/SQLite** — consistent with existing infra, enables upvotes and future features
- **Curated-only for launch** — 20-30 hand-picked skills, no scraper. Aligns with "quality over quantity" positioning
- **localStorage for upvote anti-abuse** — simplest approach, no fingerprinting library or privacy concerns. Good enough for launch
- **Client-side search** — sufficient for <30 skills, no server-side search infrastructure needed
- **Manual trust assignment** — no automated scanning for MVP; trust tiers hand-assigned for curated set
- **Claude-drafted editorial content** — use AI to draft curated entries, Si reviews and polishes

## Dependencies / Assumptions
- Railway account with Postgres available
- GitHub repos for all listed curated skills are accessible and contain SKILL.md files or equivalent documentation
- The 16 skill stacks listed in the spec are all real, active, and have sufficient public info to write about

## Outstanding Questions

### Deferred to Planning
- [Affects R26][Needs research] Verify all 16 listed skill stacks are real, active, and have enough public info for editorial content
- [Affects R14][Technical] Best approach for platform-specific install instructions (different copy targets per platform)
- [Affects R17][Technical] How to fetch/display SKILL.md content — embed from GitHub or store locally?
- [Affects R1-R33][Technical] Data model: seed curated entries from JSON files into Postgres, or store directly in DB?
- [Affects R21-R22][Technical] Client-side search/filter implementation approach
- [Affects R6][Technical] "Recently added" based on DB insertion date or curated entry date?

## Next Steps
-> `/ce:plan` for structured implementation planning
