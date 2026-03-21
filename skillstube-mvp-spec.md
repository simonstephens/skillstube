# SkillsTube — MVP Product Spec

## One-liner
A curated skills directory for Claude Code and Cowork users that combines editorial curation of top skill stacks with a searchable long-tail catalogue, differentiated by trust/safety scoring.

## Why this exists
- 500K+ skills scattered across GitHub with no quality signal beyond star count
- Existing directories (SkillsMP, agentskill.sh, etc.) are dev-only GitHub scrapers with no curation, no safety verification, and no support for non-technical Cowork users
- Snyk's ToxicSkills audit found 1/3 of community skills have security flaws — nobody is solving trust
- Influencer skill stacks (gstack, Superpowers, PM Skills, etc.) go viral but are hard to discover and compare
- 500K+ Cowork users are completely underserved by existing directories

## Target users
Both developers and non-technical users from day one, in a unified experience:
- **Developers** using Claude Code, Codex CLI, Cursor, Gemini CLI
- **Non-technical users** using Cowork, Claude.ai with skills enabled
- Audience communicated through tags and filtering, not separate UIs

## Core user actions (priority order)
1. **Browse and discover** skills and curated collections (primary — this is a discovery product)
2. **Search** for a specific skill to solve a problem
3. **Compare and evaluate** skills before choosing
4. **Install** a skill via copy-paste instructions

---

## Tech stack
- **Framework:** Next.js (React)
- **Styling:** Tailwind CSS
- **Data:** GitHub API scraping + manual curation JSON/MDX files
- **Database:** Supabase or SQLite (for skill index, upvotes)
- **Hosting:** Vercel
- **Auth:** None for MVP (anonymous upvotes via fingerprint or local storage)

---

## Data sourcing (day one)

### Curated layer (manual, editorial)
Hand-curated JSON/MDX entries for ~20-30 featured stacks and collections:
- **gstack** (Garry Tan / YC) — full dev workflow
- **Superpowers** (Jesse Vincent / obra) — multi-agent dev methodology
- **PM Skills Marketplace** (Paweł Huryn) — product management
- **Web Quality Skills** (Addy Osmani / Chrome) — frontend performance
- **Sentry Security Review** — gold-standard security skill
- **HashiCorp Agent Skills** — Terraform/Packer official
- **Google Workspace CLI** — Gmail, Drive, Calendar, Sheets
- **Anthropic Official Skills** — docx, pdf, pptx, xlsx, etc.
- **OpenAI Official Skills** — Cloudflare deploy, web games
- **Microsoft Azure Skills** — Azure storage, M365, React Flow
- **Vercel Web Interface Guidelines** — web design standards
- **Trail of Bits Security** — CodeQL/Semgrep analysis
- **Composio Awesome Skills** — automation/integration focused
- **VibeSec Skill** — security for vibe coders
- **Antigravity** — largest collection (1,200+ skills, role-based bundles)
- **Frontend Design Skill** (Anthropic) — distinctive UI generation

Each curated entry includes: hand-written summary, trust tier, audience tags, "works with" info, "best for" use case description, and install instructions.

### Long-tail layer (automated, GitHub scraping)
- Scrape repos containing SKILL.md files from GitHub search API
- Pull metadata: stars, forks, last commit date, contributors, licence, SKILL.md frontmatter (name, description)
- Parse SKILL.md content for automated safety analysis
- Sources to index: awesome-claude-skills repos, individual skill repos, plugin marketplaces
- Minimum quality bar for inclusion: valid SKILL.md, at least 1 star, updated within last 6 months
- Run scraper on a schedule (daily or on-demand for MVP)

---

## Trust & safety system (key differentiator)

### Trust tiers (displayed on every skill card)

| Tier | Badge | Criteria |
|------|-------|----------|
| **Official** | ✅ Official | Published by Anthropic, OpenAI, Google, Microsoft, or other platform vendors |
| **Verified** | 🛡️ Verified | From known creators (Garry Tan, Addy Osmani, Sentry, HashiCorp, etc.) OR hand-reviewed by SkillsTube team |
| **Community** | 👥 Community | Meets minimum quality bar: valid SKILL.md, recent commits, no red flags in automated scan |
| **Unreviewed** | ⚠️ Unreviewed | Indexed but not yet evaluated |
| **Flagged** | 🚩 Flagged | Automated scan detected potential issues |

### Automated safety checks (MVP scope)
Run a static analysis script on each indexed SKILL.md that checks for:
- References to environment variables ($ENV, $API_KEY, $ANTHROPIC_API_KEY, etc.)
- Instructions to access external URLs or send data to external endpoints
- Shell commands that could be destructive (rm, curl to unknown domains, etc.)
- Instructions to disable trust verification or bypass permission prompts
- References to credentials, tokens, secrets
- Obfuscated or encoded content

Output per skill:
- **Risk score** (low / medium / high) based on number and severity of flags
- **Human-readable summary** of what the skill can access (e.g. "This skill reads environment variables", "This skill makes network requests")
- **Flag details** for any specific concerns

### Post-MVP safety roadmap
- AI-powered deep analysis of SKILL.md instruction intent
- Actual compatibility testing across Claude Code / Codex / Cursor / Cowork
- "Last verified working" dates with automated re-testing
- Community reporting for broken or malicious skills
- Partnership or alignment with Snyk/Repello for deeper security scanning

---

## Information architecture

### Pages

**1. Homepage**
- Hero section: "Find skills you can trust for Claude Code and Cowork"
- **Featured stacks** — editorial carousel of curated collections (gstack, Superpowers, PM Skills, etc.) with trust badges
- **Browse by audience** — two prominent entry points:
  - "For developers" → Claude Code, Codex, Cursor skills
  - "For everyone" → Cowork, Claude.ai skills
- **Browse by role** — starter packs: PM, Frontend Dev, Security Engineer, Cowork Power User, Freelance Writer, Data Analyst, etc.
- **Browse by category** — Development, Productivity, Security, Documents, Design, DevOps, Research, Automation
- **Trending** — skills with most upvotes or fastest-rising GitHub stars this week
- **Recently added** — latest indexed skills
- Search bar (always visible in nav)

**2. Skill detail page**
- Skill name, author, description (from SKILL.md frontmatter)
- **Trust badge** (prominent, top of page)
- **Safety summary** — what this skill can access, risk score, any flags
- **"Works with" badges** — Claude Code, Codex CLI, Cursor, Cowork, Claude.ai (based on metadata and manual tagging)
- **Audience tag** — Developer / Non-technical / Both
- **GitHub stats** — stars, forks, last updated, contributors, licence
- **Install instructions** — copy-paste commands for each compatible platform, with a "copy" button
- **SKILL.md preview** — collapsible view of the actual skill content
- **Upvote button** — anonymous, no auth required
- **Part of collections** — which curated collections include this skill
- **Similar skills** — other skills in the same category (post-MVP: algorithmic, MVP: manual tags)

**3. Collection page**
- Collection name, author, description
- Editorial write-up: why this collection, who it's for, how the skills work together
- Ordered list of skills in the collection with trust badges and brief descriptions
- "Install all" instructions where applicable (e.g. plugin marketplace commands)
- Workflow diagram if relevant (e.g. gstack's Think → Plan → Build → Review → Test → Ship → Reflect)

**4. Compare page**
- Side-by-side comparison of 2-3 skills
- Columns: trust tier, safety score, GitHub stats, audience, "works with", description, install method
- Accessible from skill detail pages ("Compare with...") or from search results (checkbox + compare button)

**5. Browse/search results page**
- Filter sidebar: audience (Developer / Non-technical / Both), trust tier, category, "works with" platform, sort by (upvotes, stars, recency)
- Card grid layout with: skill name, author, one-line description, trust badge, audience tag, star count, upvote count
- Checkbox on each card for compare functionality

---

## UI & design direction

### Principles
- **Clean, trustworthy, not developer-intimidating.** This is NOT a terminal-aesthetic GitHub scraper. It should feel closer to Product Hunt or a well-designed review site.
- **Trust is visually prominent.** Trust badges and safety scores should be the first thing users notice on every skill card.
- **Browse-first, search-second.** The homepage should invite exploration, not present an empty search box.
- **Unified but tagged.** Developer and non-technical skills live together; audience tags and filters do the separation work.

### Visual direction
- Light, modern, airy. Think Notion's marketing site meets Product Hunt.
- Trust badges use colour: green (Official/Verified), blue (Community), amber (Unreviewed), red (Flagged).
- Skill cards are the core UI unit — used on homepage, search results, collection pages, and compare view.
- Mobile-responsive from day one (many users will discover via Twitter links on phones).

### Skill card anatomy
```
┌─────────────────────────────────────┐
│ 🛡️ Verified          ⬆ 142        │
│                                     │
│ gstack                              │
│ by Garry Tan                        │
│                                     │
│ Turn Claude Code into a full        │
│ engineering team with role-based    │
│ workflow skills.                    │
│                                     │
│ ⭐ 16.2k  ·  Updated 2 days ago    │
│                                     │
│ Claude Code · Cowork                │
│ [Developer]  [Workflow]             │
│                                     │
│ [View] [Compare] [Install ▼]       │
└─────────────────────────────────────┘
```

---

## MVP feature scope summary

### Ship this weekend (must-have)
- [ ] Homepage with featured stacks, browse by role/category/audience
- [ ] Skill detail page with trust badge, safety summary, install instructions, upvote
- [ ] Collection pages for ~10-15 curated collections
- [ ] Search with filters (audience, trust tier, category, platform)
- [ ] Side-by-side compare (2-3 skills)
- [ ] Trust tier badges on all skills (Official, Verified, Community, Unreviewed, Flagged)
- [ ] Automated safety scanning script for SKILL.md red flags
- [ ] "Works with" compatibility badges (from metadata, not tested)
- [ ] Anonymous upvote button (no auth, local/fingerprint based)
- [ ] GitHub scraper to populate long-tail catalogue
- [ ] One-click copy install instructions
- [ ] Mobile-responsive

### Ship week 2
- [ ] Full user reviews (requires auth — email or GitHub OAuth)
- [ ] "Submit a skill" flow for creators
- [ ] Actual compatibility testing across platforms
- [ ] "Last verified working" dates
- [ ] Community reporting (flag broken/malicious skills)
- [ ] Email digest: "new skills this week"
- [ ] Skill creator profiles

### Post-MVP roadmap
- [ ] AI-powered deep safety analysis of SKILL.md content
- [ ] Automated re-testing for skill rot
- [ ] Enterprise tier: curated, compliance-checked skills for teams
- [ ] API for programmatic skill discovery
- [ ] Integration: install skills directly from SkillsTube into Claude Code via CLI
- [ ] Skill composition recommendations ("these skills work well together")

---

## Launch plan
1. **Pre-launch:** Reach out to skill creators (Garry Tan, Jesse Vincent, Paweł Huryn, etc.) to let them know their stacks are featured. Ask for a signal boost.
2. **Launch day:** Post on Twitter/X, Reddit (r/ClaudeAI, r/ChatGPT), Claude Community Discord, Hacker News.
3. **Product Hunt:** Submit within first week.
4. **Ongoing:** Add skills weekly, write editorial "best of" posts, engage with community.

---

## Key metrics to track
- Unique visitors per day/week
- Skills viewed (which skills get the most traffic)
- Upvotes per skill
- Install instruction copies (proxy for actual installs)
- Compare feature usage
- Search queries (what are people looking for that we don't have?)
- Referral sources (Twitter, Reddit, direct, etc.)

---

## Competitive positioning
"SkillsMP has 500K skills. We have the 500 that actually work, and we've verified they're safe."

Quality over quantity. Trust over volume. Curation over scraping.

---

## Open questions for Fred
- Do we want to build automated testing infrastructure for skills? (Aligns with his QA background, could be the long-term moat)
- What's our theory of why Anthropic doesn't just build this themselves?
- Should we eventually own the runtime / provide a hosted environment for skills?
- Is there a B2B play here for enterprise skills management?

---

*Spec created: March 20, 2026*
*Author: Si (with Claude as brainstorming co-founder)*
*Status: Ready for Claude Code planning workflow*
