---
review_agents: [kieran-typescript-reviewer, code-simplicity-reviewer, security-sentinel, performance-oracle]
plan_review_agents: [kieran-typescript-reviewer, code-simplicity-reviewer]
---

# Review Context

- Next.js 15 App Router with Server Components and Client Components
- Drizzle ORM with postgres.js driver on Railway Postgres
- shadcn/ui component library with Tailwind CSS v4
- Upvote API is the only dynamic endpoint — extra scrutiny on rate limiting and input validation
- Server-side markdown rendering with react-markdown (no rehype-raw for XSS safety)
- ISR with 60s revalidation — watch for static/dynamic data tension
