import type { CollectionSeed } from '@/db/schema';

type CollectionItemRef =
  | { type: 'plugin'; slug: string }
  | { type: 'skill'; slug: string };

export type CollectionWithItems = CollectionSeed & { items: CollectionItemRef[] };

export const collectionsData: CollectionWithItems[] = [
  {
    slug: 'getting-started',
    name: 'Getting Started',
    author: 'SkillsTube',
    authorUrl: null,
    description:
      'Essential plugins and skills every new Claude Code user should install first.',
    editorialContent: `If you're just getting started with Claude Code, the sheer number of available skills and plugins can feel overwhelming. This collection cuts through the noise and gives you the foundational toolkit that experienced users rely on every day. These are the tools that make Claude Code feel like a superpower rather than just another coding assistant.

Start with **gstack** for a structured development workflow that takes you from idea to shipped feature in disciplined phases. Add **VibeSec** to catch the security issues that AI-generated code tends to repeat — it's specifically tuned for the patterns agents produce. **Anthropic's Official Skills** handle the document processing that comes up in every project — PDFs, Word docs, spreadsheets, and presentations parsed with structural awareness.

Together these cover the full loop — plan, build, secure, and process documents — without requiring deep expertise in any one area. Install them all at once and you'll have a solid foundation to build on as you discover more specialized tools.`,
    trustTier: 'verified',
    installAllInstructions: null,
    imageUrl: null,
    items: [
      { type: 'plugin', slug: 'compound-engineering' },
      { type: 'plugin', slug: 'gstack' },
      { type: 'skill', slug: 'context7' },
      { type: 'skill', slug: 'vibesec' },
      { type: 'plugin', slug: 'anthropic-official-skills' },
    ],
  },
  {
    slug: 'security-essentials',
    name: 'Security Essentials',
    author: 'SkillsTube',
    authorUrl: null,
    description:
      'Comprehensive security toolkit combining static analysis, runtime-informed review, and AI-code-specific linting.',
    editorialContent: `Shipping fast is great until a vulnerability slips through. This collection assembles the best security tools in the ecosystem, each approaching the problem from a different angle so you get defense in depth rather than redundant scanning.

**Trail of Bits Security** brings world-class expertise with both CodeQL semantic analysis and Semgrep pattern matching — the combination catches everything from subtle taint flow issues to common OWASP vulnerabilities. **Sentry Security Review** takes a different approach entirely, applying production incident intelligence to find the code patterns that actually cause security failures at runtime. **VibeSec** fills the gap that traditional tools miss: the specific vulnerability patterns that AI-generated code produces most frequently.

Together these three tools cover semantic analysis, pattern-based scanning, production-informed review, and AI-specific linting. Run them as part of your regular development workflow and you'll catch issues at the point where they're cheapest to fix — before they ever leave your machine.`,
    trustTier: 'verified',
    installAllInstructions: null,
    imageUrl: null,
    items: [
      { type: 'plugin', slug: 'trail-of-bits-security' },
      { type: 'skill', slug: 'sentry-security-review' },
      { type: 'skill', slug: 'vibesec' },
    ],
  },
  {
    slug: 'enterprise-toolkit',
    name: 'Enterprise Toolkit',
    author: 'SkillsTube',
    authorUrl: null,
    description:
      'Official vendor plugins for enterprise infrastructure, cloud services, and productivity suites.',
    editorialContent: `Enterprise development means working within established ecosystems — HashiCorp for infrastructure, Azure for cloud services, Google Workspace for productivity. This collection brings first-party integrations from the vendors themselves, so you're getting official support rather than community workarounds.

**HashiCorp Agent Skills** provides native Terraform, Packer, and Vault management with the same rigor you'd expect from the team that built those tools. The Terraform skill understands provider schemas and catches misconfigurations before they hit plan. **Microsoft Azure Skills** covers the Azure side with storage management, M365 connectivity for Teams and SharePoint, and visual workflow design with React Flow. **Google Workspace CLI** bridges your terminal to Gmail, Drive, Calendar, and Sheets — particularly powerful for teams that live in the Google ecosystem.

Every plugin in this collection is maintained by the vendor's own engineering team and licensed under Apache-2.0. You're not depending on a community contributor to keep up with API changes — these integrations are built by the same teams shipping the platforms.`,
    trustTier: 'official',
    installAllInstructions: null,
    imageUrl: null,
    items: [
      { type: 'plugin', slug: 'hashicorp-agent-skills' },
      { type: 'plugin', slug: 'microsoft-azure-skills' },
      { type: 'plugin', slug: 'google-workspace-cli' },
    ],
  },
  {
    slug: 'product-management',
    name: 'Product Management',
    author: 'SkillsTube',
    authorUrl: null,
    description:
      'Tools for product managers — PRDs, user stories, sprint planning, roadmaps, and document processing.',
    editorialContent: `Product management is one of the most time-consuming white-collar workflows, and it's ripe for agent assistance. This collection gives PMs a complete toolkit that handles the document-heavy, template-driven work so they can focus on strategy and user insight.

**PM Skills Marketplace** by Paweł Huryn is the centerpiece — a purpose-built suite covering PRD generation, user story writing with proper acceptance criteria, capacity-aware sprint planning, and milestone-based roadmap building. Each skill encodes PM best practices so the output reads like it came from an experienced product leader, not a generic AI template. **Anthropic's Official Skills** complement this perfectly by handling the document processing that PMs deal with constantly — extracting data from Excel reports, parsing PDF research, and pulling content from PowerPoint decks.

Whether you're a technical PM using Claude Code or a non-technical PM on Cowork, this collection covers the full product development lifecycle from research synthesis through sprint execution.`,
    trustTier: 'verified',
    installAllInstructions: null,
    imageUrl: null,
    items: [
      { type: 'plugin', slug: 'pm-skills-marketplace' },
      { type: 'plugin', slug: 'notion-workspace' },
      { type: 'plugin', slug: 'anthropic-official-skills' },
    ],
  },
  {
    slug: 'frontend-excellence',
    name: 'Frontend Excellence',
    author: 'SkillsTube',
    authorUrl: null,
    description:
      'Ship fast, accessible, and beautifully designed web interfaces with performance baked in.',
    editorialContent: `The bar for web interfaces keeps rising, and "it works" hasn't been enough for years. This collection brings together the tools that make your agent produce frontend code that's not just functional but genuinely well-crafted — fast, accessible, and visually distinctive.

**Web Quality Skills** by Addy Osmani covers the measurable dimensions: Core Web Vitals optimization, Lighthouse-style performance auditing, WCAG accessibility compliance, and systematic image optimization. Every recommendation is data-backed with estimated impact. **Vercel's Web Interface Guidelines** handle the design dimension, encoding Vercel's design system principles — spacing scales, type hierarchies, animation timing, and dark mode implementation — into your agent's output. **Anthropic's Frontend Design Skill** goes further by ensuring every component gets an intentional aesthetic direction rather than defaulting to generic AI-generated layouts.

Together these three tools cover performance, accessibility, and design quality. Your agent produces interfaces that score well on Lighthouse, pass WCAG audits, and look like they were built by a design-aware team — not generated by a machine.`,
    trustTier: 'verified',
    installAllInstructions: null,
    imageUrl: null,
    items: [
      { type: 'plugin', slug: 'web-quality-skills' },
      { type: 'skill', slug: 'vercel-web-interface-guidelines' },
      { type: 'skill', slug: 'frontend-design-skill' },
      { type: 'plugin', slug: 'browser-tools' },
    ],
  },
  {
    slug: 'developer-workflow',
    name: 'Developer Workflow',
    author: 'SkillsTube',
    authorUrl: null,
    description:
      'The complete developer setup — structured workflows, power-user capabilities, and cross-platform automation.',
    editorialContent: `Most developers spend more time on workflow overhead than actual coding — context switching, managing integrations, running repetitive tasks, and coordinating across tools. This collection eliminates that friction by giving your agent a comprehensive operational toolkit.

**gstack** provides the macro-level structure: a seven-phase workflow (Think → Plan → Build → Review → Test → Ship → Reflect) that keeps you disciplined about how you approach features. **Superpowers** unlocks the micro-level capabilities: ultra-deep thinking for hard architecture decisions, multi-agent orchestration for parallelizing large tasks, and code review that runs multiple specialized analysis agents simultaneously. Together they give you both the framework and the raw power to ship effectively.

**Composio Awesome Skills** ties it all together by connecting your agent to the external services you use every day — GitHub for PRs and issues, Slack for team communication, Jira for project tracking, and arbitrary APIs for everything else. No more tab-switching between your editor, GitHub, Slack, and Jira — your agent handles the integration layer while you focus on the work itself.`,
    trustTier: 'verified',
    installAllInstructions: null,
    imageUrl: null,
    items: [
      { type: 'plugin', slug: 'compound-engineering' },
      { type: 'plugin', slug: 'gstack' },
      { type: 'plugin', slug: 'superpowers' },
      { type: 'plugin', slug: 'composio-awesome-skills' },
    ],
  },
  {
    slug: 'productivity-and-collaboration',
    name: 'Productivity & Collaboration',
    author: 'SkillsTube',
    authorUrl: null,
    description:
      'Connect your agent to your team\'s productivity tools — Notion workspaces, documentation lookup, and browser-based testing.',
    editorialContent: `Modern development isn't just code — it's tickets, docs, meeting notes, specs, and team communication. This collection bridges the gap between your coding agent and the productivity tools your team actually uses every day.

**Notion Workspace** is the standout: a full integration with 16 MCP tools and 14 workflow skills that let your agent search your workspace, create pages and tasks, capture knowledge from conversations, prepare meeting materials, and turn specs into tracked implementation plans. If your team runs on Notion, this turns your agent into a first-class participant in your project management workflow.

**Context7** solves one of the most frustrating problems in AI-assisted development: hallucinated API calls. By giving your agent real-time access to current library documentation, it writes code against the actual API — not its training data from months ago. Simple to install, dramatic improvement in output quality. **Browser Tools** rounds out the collection by giving your agent visual verification capabilities — take screenshots, profile performance, inspect network requests, and validate that your UI actually looks right.`,
    trustTier: 'verified',
    installAllInstructions: null,
    imageUrl: null,
    items: [
      { type: 'plugin', slug: 'notion-workspace' },
      { type: 'skill', slug: 'context7' },
      { type: 'plugin', slug: 'browser-tools' },
    ],
  },
];
