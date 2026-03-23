# SkillsTube

Curated skills directory for Claude Code and Cowork users.

## Stack

- **Framework:** Next.js 15 (App Router), TypeScript, Tailwind CSS v4
- **ORM:** Drizzle ORM with postgres.js driver
- **Database:** PostgreSQL (Railway)
- **Components:** shadcn/ui (card, badge, button, input, tabs)
- **Hosting:** Railway
- **Package manager:** npm

## Conventions

- `@/*` path alias mapped to project root
- `cn()` utility at `lib/utils.ts` (clsx + tailwind-merge)
- Tailwind v4 CSS-first config: design tokens in `@theme` block in `globals.css`
- Light theme by default
- DB singleton at `db/client.ts`, schema at `db/schema.ts`, server-only guard at `db/index.ts`
- Centralized queries at `db/queries.ts`
- Const arrays for enums in `lib/types.ts` with derived union types
- Content data in `content/plugins.ts`, `content/skills.ts`, and `content/collections.ts`
- Server Components by default; Client Components only for interactive widgets
- `output: 'standalone'` in next.config.ts for Railway

## Commands

- `npm run dev` — start dev server
- `npm run build` — production build (runs migration first)
- `npx drizzle-kit push` — push schema to dev DB
- `npx tsx scripts/seed.ts` — seed database from content files

## File Structure

```
app/
  plugins/[slug]/ — plugin detail page
  skills/[slug]/  — skill detail page
  collections/[slug]/ — collection detail page
  api/            — API routes (upvote endpoints for plugins & skills)
components/
  layout/         — Header, Footer
  sections/       — page-level sections (InstallInstructions, SafetySummary, etc.)
  ui/             — shadcn + custom components (PluginCard, SkillCard, TrustBadge, etc.)
content/          — curated plugin, skill, and collection data
db/               — schema (plugins, skills, collections, collectionItems), client, queries, migrations
lib/              — types, utils, helpers, serialize
scripts/          — seed script
```
