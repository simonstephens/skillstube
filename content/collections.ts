import type { CollectionSeed } from '@/db/schema';

type CollectionWithSlugs = CollectionSeed & { skillSlugs: string[] };

export const collectionsData: CollectionWithSlugs[] = [
  {
    slug: 'getting-started',
    name: 'Getting Started',
    author: 'SkillsTube',
    authorUrl: null,
    description:
      'Essential skills every new Claude Code user should install first.',
    editorialContent: `If you're just getting started with Claude Code, the sheer number of available skills can feel overwhelming. This collection cuts through the noise and gives you the foundational toolkit that experienced users rely on every day. These are the skills that make Claude Code feel like a superpower rather than just another coding assistant.

Start with **Compound Engineering** for the core workflow patterns, then add **Context7** to give Claude access to up-to-date library documentation. **Browser Tools** lets you test your work directly from the terminal, while **Git Worktree** keeps your branches organized when you're juggling multiple features. Round it out with **Markdown Writer** for documentation and **Env Manager** for keeping your secrets safe.

Together these skills cover the full loop — research, code, test, document, deploy — without requiring deep expertise in any one area. Install them all at once and you'll have a solid foundation to build on as you discover more specialized tools.`,
    trustTier: 'verified',
    installAllInstructions: null,
    imageUrl: null,
    skillSlugs: [
      'compound-engineering',
      'context7',
      'browser-tools',
      'git-worktree',
      'markdown-writer',
      'env-manager',
    ],
  },
  {
    slug: 'rails-developer',
    name: 'Rails Developer',
    author: 'SkillsTube',
    authorUrl: null,
    description:
      'A complete Rails development toolkit with opinionated style and powerful utilities.',
    editorialContent: `Ruby on Rails has always been about convention over configuration, and this collection brings that same philosophy to your AI-assisted workflow. Whether you're building a new app from scratch or maintaining a mature monolith, these skills encode the patterns and practices that make Rails development fast and joyful.

**DHH Rails Style** brings the authentic 37signals aesthetic to your generated code — fat models, thin controllers, Hotwire patterns, and the "clarity over cleverness" ethos. Pair it with **Andrew Kane Gem Writer** when you need to extract shared logic into clean, minimal gems. **DSPy Ruby** opens the door to building LLM-powered features directly in your Rails app with type-safe signatures and modules.

**Database Migrator** handles the nerve-wracking parts of schema changes with safety checks and rollback procedures, and **Code Reviewer** catches issues before they reach production. This is the stack for Rails developers who take their craft seriously.`,
    trustTier: 'verified',
    installAllInstructions: null,
    imageUrl: null,
    skillSlugs: [
      'dhh-rails-style',
      'andrew-kane-gem-writer',
      'dspy-ruby',
      'database-migrator',
      'code-reviewer',
    ],
  },
  {
    slug: 'non-technical-essentials',
    name: 'Non-Technical Essentials',
    author: 'SkillsTube',
    authorUrl: null,
    description:
      'The best skills for non-developers using Cowork to get real work done.',
    editorialContent: `You don't need to be a developer to get massive value from Claude Code and Cowork. This collection is curated for product managers, marketers, founders, writers, and anyone else who wants to harness AI assistance without touching a terminal. Every skill here is designed to work through natural language with minimal configuration.

**Notion Workspace** connects your existing Notion setup so Claude can create pages, query databases, and manage tasks on your behalf. **Proof Editor** lets you collaborate on documents with AI-powered editing and suggestions. **Markdown Writer** handles all your content formatting needs, from blog posts to internal memos.

**Gemini Imagegen** gives you image generation and editing capabilities — perfect for social media assets, quick mockups, or visual brainstorming. **Browser Tools** lets Claude navigate the web for you, filling forms and gathering information. **Rclone Uploader** handles file management across cloud storage services so you never have to wrestle with S3 consoles again.`,
    trustTier: 'verified',
    installAllInstructions: null,
    imageUrl: null,
    skillSlugs: [
      'notion-workspace',
      'proof-editor',
      'markdown-writer',
      'gemini-imagegen',
      'browser-tools',
      'rclone-uploader',
    ],
  },
  {
    slug: 'security-and-quality',
    name: 'Security & Quality',
    author: 'SkillsTube',
    authorUrl: null,
    description:
      'Harden your codebase with security auditing, testing, and thorough code review.',
    editorialContent: `Shipping fast is great until a vulnerability slips through or a regression breaks production. This collection assembles the guardrails that let you move quickly with confidence. Think of it as your automated quality assurance team — always on, never distracted.

**Security Audit** performs OWASP-aligned vulnerability scanning, checking for injection risks, auth issues, hardcoded secrets, and common attack vectors. **Test Runner** ensures your changes don't break existing behavior by managing test suites intelligently. **Code Reviewer** provides multi-perspective analysis that catches logic errors, anti-patterns, and maintainability issues before they compound.

**Performance Profiler** identifies bottlenecks and memory leaks before your users do, while **Accessibility Checker** ensures your interfaces work for everyone. Together these five skills create a quality pipeline that runs alongside your development workflow, not against it.`,
    trustTier: 'verified',
    installAllInstructions: null,
    imageUrl: null,
    skillSlugs: [
      'security-audit',
      'test-runner',
      'code-reviewer',
      'performance-profiler',
      'accessibility-checker',
    ],
  },
  {
    slug: 'devops-toolkit',
    name: 'DevOps Toolkit',
    author: 'SkillsTube',
    authorUrl: null,
    description:
      'Everything you need for deployment, containers, and infrastructure management.',
    editorialContent: `DevOps work is notoriously context-heavy — you need to remember a dozen CLI flags, YAML schemas, and platform-specific quirks. This collection offloads that cognitive burden to Claude so you can focus on architecture decisions instead of syntax.

**Docker Manager** handles container lifecycle from Dockerfile creation to multi-service orchestration with compose. **Deployment Manager** automates the push-to-production pipeline with rollback procedures and health checks. **Env Manager** keeps secrets and configuration variables organized across environments without them ever leaking into version control.

**Log Analyzer** makes sense of production logs by surfacing patterns, errors, and anomalies that would take hours to find manually. Together with **Database Migrator** for safe schema changes in production, this collection covers the full operational lifecycle. Install these before your next deploy and you'll wonder how you managed without them.`,
    trustTier: 'community',
    installAllInstructions: null,
    imageUrl: null,
    skillSlugs: [
      'docker-manager',
      'deployment-manager',
      'env-manager',
      'log-analyzer',
      'database-migrator',
    ],
  },
  {
    slug: 'content-creator',
    name: 'Content Creator',
    author: 'SkillsTube',
    authorUrl: null,
    description:
      'Writing, documents, media generation, and publishing tools for content workflows.',
    editorialContent: `Whether you're writing technical documentation, blog posts, marketing copy, or internal memos, this collection turns Claude into a full-featured content studio. Each skill handles a different stage of the content lifecycle — from drafting to visual assets to publishing.

**Markdown Writer** is the foundation, giving Claude deep fluency in structured document creation with proper formatting, cross-references, and table of contents generation. **Proof Editor** adds collaborative editing with revision tracking and AI-powered suggestions. **Gemini Imagegen** handles visual content — generate hero images, edit photos, create logos with text, or produce social media assets without leaving your workflow.

**Notion Workspace** provides a publishing and organization layer, letting you push finished content directly into your Notion knowledge base with proper metadata and linking. **Rclone Uploader** handles the last mile, syncing media assets to S3, Cloudflare R2, or whatever storage backend your CDN needs.`,
    trustTier: 'community',
    installAllInstructions: null,
    imageUrl: null,
    skillSlugs: [
      'markdown-writer',
      'proof-editor',
      'gemini-imagegen',
      'notion-workspace',
      'rclone-uploader',
    ],
  },
  {
    slug: 'full-stack-web',
    name: 'Full-Stack Web',
    author: 'SkillsTube',
    authorUrl: null,
    description:
      'Frontend, backend, APIs, and testing for modern web application development.',
    editorialContent: `Building a modern web application means juggling frontend components, backend APIs, database schemas, browser testing, and deployment — often in a single sprint. This collection gives Claude the full context it needs to work across the entire stack without losing coherence.

**Frontend Design** generates production-grade UI components with distinctive aesthetics that avoid the generic AI look. **API Designer** ensures your backend endpoints follow REST best practices with proper validation, error handling, and documentation. **Browser Tools** lets you test your work end-to-end by navigating the actual application, clicking buttons, and verifying behavior.

**Database Migrator** handles schema evolution safely as your data model matures, while **Test Runner** keeps your test suite green across both frontend and backend changes. **Context7** ties it all together by giving Claude access to current documentation for whatever frameworks you're using — no more hallucinated API calls to deprecated methods.`,
    trustTier: 'verified',
    installAllInstructions: null,
    imageUrl: null,
    skillSlugs: [
      'frontend-design',
      'api-designer',
      'browser-tools',
      'database-migrator',
      'test-runner',
      'context7',
    ],
  },
  {
    slug: 'data-and-research',
    name: 'Data & Research',
    author: 'SkillsTube',
    authorUrl: null,
    description:
      'Data processing, analysis pipelines, and research tools for data-driven work.',
    editorialContent: `Data work is iterative and messy — you're constantly pulling from APIs, transforming formats, analyzing patterns, and documenting findings. This collection equips Claude with the skills to handle the full data lifecycle, from ingestion to insight.

**Data Pipeline** builds and manages ETL workflows, handling extraction from various sources, transformation logic, and loading into your target systems. **Log Analyzer** applies the same pattern-recognition capabilities to operational data, surfacing anomalies and trends in server logs, application metrics, and event streams.

**Notion Workspace** serves as your research hub, letting you capture findings, link related analyses, and build a searchable knowledge base as you go. **Performance Profiler** helps you optimize the pipelines themselves when processing time becomes a bottleneck. Whether you're building analytics dashboards, running one-off investigations, or maintaining production data systems, this collection has you covered.`,
    trustTier: 'community',
    installAllInstructions: null,
    imageUrl: null,
    skillSlugs: [
      'data-pipeline',
      'log-analyzer',
      'notion-workspace',
      'performance-profiler',
    ],
  },
  {
    slug: 'productivity-power-pack',
    name: 'Productivity Power Pack',
    author: 'SkillsTube',
    authorUrl: null,
    description:
      'Workflow optimization skills that save hours of repetitive work every week.',
    editorialContent: `Some skills don't fit neatly into a technical category — they just make everything faster. This collection is for developers who want to eliminate friction from their daily workflow, spending less time on boilerplate and more time on the work that matters.

**Git Worktree** transforms how you handle parallel work streams, letting you switch between features, hotfixes, and experiments without stashing or losing context. **Compound Engineering** provides the meta-workflow layer — documenting solutions as you find them so your team compounds knowledge over time instead of re-discovering the same fixes.

**Context7** eliminates the documentation lookup tax by giving Claude instant access to current library docs. **Env Manager** removes the constant friction of managing configuration across local, staging, and production environments. **Notion Workspace** connects your project management system directly to your development workflow, turning tasks into code and code into completed tickets without switching tools.`,
    trustTier: 'verified',
    installAllInstructions: null,
    imageUrl: null,
    skillSlugs: [
      'git-worktree',
      'compound-engineering',
      'context7',
      'env-manager',
      'notion-workspace',
    ],
  },
];
