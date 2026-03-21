import type { SkillSeed } from '@/db/schema';

export const skillsData: SkillSeed[] = [
  {
    slug: 'compound-engineering',
    name: 'Compound Engineering',
    author: 'Every Inc',
    authorUrl: 'https://every.to',
    description:
      'Full workflow toolkit for AI coding agents — plan, brainstorm, review, and ship with structured skill-based workflows.',
    summary:
      'The gold standard for agent-assisted development workflows. Compound Engineering bundles planning, brainstorming, code review, and knowledge compounding into a single cohesive toolkit that dramatically improves how you ship with Claude Code.',
    trustTier: 'official',
    audience: 'both',
    category: 'development',
    riskLevel: 'low',
    safetySummary:
      'Read/write access to project files and git. All operations are local and reversible. No network calls beyond what your project already makes.',
    githubUrl: 'https://github.com/compound-engineering/skills',
    stars: 4820,
    forks: 312,
    lastUpdated: '2026-03-18',
    license: 'MIT',
    worksWith: ['claude-code', 'cursor', 'codex'],
    installInstructions: {
      'Claude Code': 'claude install @compound-engineering/skills',
      Cursor:
        'Add compound-engineering to your Cursor skills directory',
      Codex: 'codex plugin add compound-engineering',
    },
    tags: ['workflow', 'planning', 'code-review', 'knowledge-management', 'brainstorming'],
    bestFor:
      'Teams and solo devs who want a structured, repeatable workflow for AI-assisted development.',
  },
  {
    slug: 'context7',
    name: 'Context7',
    author: 'Upstash',
    authorUrl: 'https://upstash.com',
    description:
      'MCP server that fetches up-to-date library documentation and code examples on demand.',
    summary:
      'Eliminates hallucinated API calls by giving your agent access to real, current documentation. Context7 queries a curated index of popular library docs so your agent writes code against the actual API, not its training data.',
    trustTier: 'verified',
    audience: 'developer',
    category: 'research',
    riskLevel: 'low',
    safetySummary:
      'Read-only network calls to the Context7 documentation API. No file system writes. No credentials required.',
    githubUrl: 'https://github.com/upstash/context7',
    stars: 6340,
    forks: 418,
    lastUpdated: '2026-03-15',
    license: 'Apache-2.0',
    worksWith: ['claude-code', 'cursor', 'codex'],
    installInstructions: {
      'Claude Code': 'claude mcp add context7 -- npx -y @upstash/context7-mcp@latest',
      Cursor: 'Add to MCP config: @upstash/context7-mcp',
      Codex: 'codex mcp add @upstash/context7-mcp',
    },
    tags: ['documentation', 'mcp', 'api-reference', 'libraries'],
    bestFor:
      'Any developer tired of agents hallucinating outdated or nonexistent API methods.',
  },
  {
    slug: 'browser-tools',
    name: 'Browser Tools',
    author: 'Anthropic',
    authorUrl: 'https://anthropic.com',
    description:
      'Browser automation for testing and interacting with web applications directly from your agent.',
    summary:
      'Gives your coding agent a real browser. Navigate pages, click elements, fill forms, take screenshots, and run end-to-end tests — all driven by natural language commands. Essential for frontend development workflows.',
    trustTier: 'verified',
    audience: 'developer',
    category: 'automation',
    riskLevel: 'medium',
    safetySummary:
      'Launches and controls a Chromium browser instance. Can navigate to any URL and interact with page elements. Network access is unrestricted within the browser context.',
    githubUrl: 'https://github.com/anthropics/browser-tools',
    stars: 3150,
    forks: 287,
    lastUpdated: '2026-03-12',
    license: 'MIT',
    worksWith: ['claude-code', 'cursor'],
    installInstructions: {
      'Claude Code': 'claude install @anthropic/browser-tools',
      Cursor: 'Add browser-tools MCP server to Cursor settings',
    },
    tags: ['browser', 'testing', 'e2e', 'automation', 'screenshots'],
    bestFor:
      'Frontend developers who want their agent to visually verify UI changes and run browser-based tests.',
  },
  {
    slug: 'git-worktree',
    name: 'Git Worktree Manager',
    author: 'Compound Engineering',
    authorUrl: 'https://every.to',
    description:
      'Manage git worktrees for isolated parallel development branches without switching contexts.',
    summary:
      'Simplifies git worktree operations into a clean interactive interface. Create, list, switch, and clean up worktrees effortlessly — ideal for running parallel experiments or reviewing PRs without stashing your work.',
    trustTier: 'verified',
    audience: 'developer',
    category: 'devops',
    riskLevel: 'low',
    safetySummary:
      'Runs standard git commands (worktree add/remove/list). All operations are local and reversible. No network access.',
    githubUrl: 'https://github.com/compound-engineering/git-worktree-skill',
    stars: 1240,
    forks: 89,
    lastUpdated: '2026-03-10',
    license: 'MIT',
    worksWith: ['claude-code', 'cursor'],
    installInstructions: {
      'Claude Code': 'claude install @compound-engineering/git-worktree',
      Cursor: 'Add git-worktree skill to Cursor skills directory',
    },
    tags: ['git', 'worktree', 'branching', 'parallel-development'],
    bestFor:
      'Developers who juggle multiple branches and want zero-friction context switching.',
  },
  {
    slug: 'dhh-rails-style',
    name: 'DHH Rails Style',
    author: 'Compound Engineering',
    authorUrl: 'https://every.to',
    description:
      'Write Ruby on Rails code in DHH\'s distinctive 37signals style — REST purity, fat models, thin controllers.',
    summary:
      'Encodes the Rails philosophy directly into your agent\'s output. Every model, controller, and view follows the conventions that DHH, Basecamp, and HEY established — no over-engineering, no JS framework creep, just clean Rails.',
    trustTier: 'verified',
    audience: 'developer',
    category: 'development',
    riskLevel: 'low',
    safetySummary:
      'Style guide only — influences code generation patterns. No file system access beyond normal project writes. No network calls.',
    githubUrl: 'https://github.com/compound-engineering/dhh-rails-style',
    stars: 2870,
    forks: 198,
    lastUpdated: '2026-03-08',
    license: 'MIT',
    worksWith: ['claude-code', 'cursor', 'codex'],
    installInstructions: {
      'Claude Code': 'claude install @compound-engineering/dhh-rails-style',
      Cursor: 'Add dhh-rails-style to .cursor/skills/',
      Codex: 'codex plugin add dhh-rails-style',
    },
    tags: ['rails', 'ruby', 'conventions', 'dhh', 'hotwire'],
    bestFor:
      'Rails developers who want their agent to write idiomatic, convention-over-configuration Ruby.',
  },
  {
    slug: 'andrew-kane-gem-writer',
    name: 'Andrew Kane Gem Writer',
    author: 'Compound Engineering',
    authorUrl: 'https://every.to',
    description:
      'Write production-quality Ruby gems following Andrew Kane\'s proven patterns for clean, minimal library design.',
    summary:
      'Distills the patterns from 100+ popular gems into a skill your agent can follow. Clean APIs, sensible defaults, minimal dependencies, and excellent README templates — the Andrew Kane way.',
    trustTier: 'community',
    audience: 'developer',
    category: 'development',
    riskLevel: 'low',
    safetySummary:
      'Code generation patterns only. Reads and writes project files. No network access or system commands beyond standard gem tooling.',
    githubUrl: 'https://github.com/compound-engineering/andrew-kane-gem-writer',
    stars: 890,
    forks: 62,
    lastUpdated: '2026-02-28',
    license: 'MIT',
    worksWith: ['claude-code', 'cursor'],
    installInstructions: {
      'Claude Code': 'claude install @compound-engineering/andrew-kane-gem-writer',
      Cursor: 'Add andrew-kane-gem-writer skill to .cursor/skills/',
    },
    tags: ['ruby', 'gems', 'library-design', 'open-source'],
    bestFor:
      'Ruby developers building gems who want clean, production-ready library architecture out of the box.',
  },
  {
    slug: 'frontend-design',
    name: 'Frontend Design',
    author: 'Compound Engineering',
    authorUrl: 'https://every.to',
    description:
      'Generate distinctive, production-grade frontend interfaces that avoid generic AI aesthetics.',
    summary:
      'Transforms your agent from a code generator into a design-aware frontend engineer. Every component gets intentional typography, color, spacing, and motion — no more cookie-cutter Bootstrap look-alikes.',
    trustTier: 'verified',
    audience: 'both',
    category: 'design',
    riskLevel: 'low',
    safetySummary:
      'Influences HTML/CSS/JS generation patterns. Standard project file access only. May fetch fonts from Google Fonts CDN.',
    githubUrl: 'https://github.com/compound-engineering/frontend-design-skill',
    stars: 3410,
    forks: 245,
    lastUpdated: '2026-03-14',
    license: 'MIT',
    worksWith: ['claude-code', 'cursor', 'codex'],
    installInstructions: {
      'Claude Code': 'claude install @compound-engineering/frontend-design',
      Cursor: 'Add frontend-design skill to .cursor/skills/',
      Codex: 'codex plugin add frontend-design',
    },
    tags: ['ui', 'css', 'design-systems', 'components', 'typography'],
    bestFor:
      'Anyone building web UIs who wants their agent to produce visually distinctive, polished interfaces.',
  },
  {
    slug: 'dspy-ruby',
    name: 'DSPy.rb',
    author: 'Compound Engineering',
    authorUrl: 'https://every.to',
    description:
      'Build type-safe LLM applications in Ruby with signatures, modules, agents, and prompt optimization.',
    summary:
      'Brings Stanford\'s DSPy framework to the Ruby ecosystem. Define typed signatures, compose modules, build agent loops with tools, and optimize prompts programmatically — all in idiomatic Ruby.',
    trustTier: 'community',
    audience: 'developer',
    category: 'development',
    riskLevel: 'medium',
    safetySummary:
      'Makes API calls to configured LLM providers (OpenAI, Anthropic, etc.). Requires API keys. File access limited to project scope.',
    githubUrl: 'https://github.com/compound-engineering/dspy-ruby',
    stars: 1680,
    forks: 134,
    lastUpdated: '2026-03-06',
    license: 'MIT',
    worksWith: ['claude-code', 'cursor'],
    installInstructions: {
      'Claude Code': 'claude install @compound-engineering/dspy-ruby',
      Cursor: 'Add dspy-ruby skill to .cursor/skills/',
    },
    tags: ['llm', 'ruby', 'ai-framework', 'prompt-engineering', 'agents'],
    bestFor:
      'Ruby developers building LLM-powered features who want structured, testable AI pipelines.',
  },
  {
    slug: 'gemini-imagegen',
    name: 'Gemini Image Generator',
    author: 'Compound Engineering',
    authorUrl: 'https://every.to',
    description:
      'Generate and edit images using Google\'s Gemini API — text-to-image, style transfer, and multi-turn refinement.',
    summary:
      'Gives your agent the ability to create and manipulate images through natural language. Generate logos, mockups, stickers, and product shots with Gemini\'s image model, then iteratively refine them in conversation.',
    trustTier: 'community',
    audience: 'both',
    category: 'design',
    riskLevel: 'medium',
    safetySummary:
      'Sends prompts and images to Google\'s Gemini API. Requires a GEMINI_API_KEY. Generated images are saved locally. No other network access.',
    githubUrl: 'https://github.com/compound-engineering/gemini-imagegen',
    stars: 2210,
    forks: 176,
    lastUpdated: '2026-03-11',
    license: 'MIT',
    worksWith: ['claude-code', 'cursor'],
    installInstructions: {
      'Claude Code': 'claude install @compound-engineering/gemini-imagegen',
      Cursor: 'Add gemini-imagegen skill to .cursor/skills/',
    },
    tags: ['image-generation', 'gemini', 'design', 'ai-art', 'mockups'],
    bestFor:
      'Designers and developers who need quick image assets, mockups, or visual prototypes without leaving their editor.',
  },
  {
    slug: 'proof-editor',
    name: 'Proof Editor',
    author: 'Compound Engineering',
    authorUrl: 'https://every.to',
    description:
      'Create, edit, comment on, and share markdown documents via Proof\'s collaborative web editor.',
    summary:
      'Bridges your coding agent to Proof\'s document platform. Draft specs, write blog posts, or collaborate on docs — all from your terminal. Supports commenting, suggesting edits, and sharing with teammates.',
    trustTier: 'community',
    audience: 'non-technical',
    category: 'documents',
    riskLevel: 'medium',
    safetySummary:
      'Makes authenticated API calls to proofeditor.ai. Reads and writes documents on the Proof platform. Requires Proof account credentials.',
    githubUrl: 'https://github.com/compound-engineering/proof-skill',
    stars: 720,
    forks: 48,
    lastUpdated: '2026-02-25',
    license: 'MIT',
    worksWith: ['claude-code'],
    installInstructions: {
      'Claude Code': 'claude install @compound-engineering/proof-editor',
    },
    tags: ['documents', 'collaboration', 'writing', 'markdown'],
    bestFor:
      'Writers and teams who want to draft and share polished documents without switching tools.',
  },
  {
    slug: 'rclone-uploader',
    name: 'Rclone Uploader',
    author: 'Compound Engineering',
    authorUrl: 'https://every.to',
    description:
      'Upload, sync, and manage files across S3, R2, Backblaze, Google Drive, Dropbox, and 40+ cloud providers.',
    summary:
      'Wraps rclone\'s powerful multi-cloud file management into agent-friendly commands. Upload build artifacts, sync assets, or back up databases to any cloud storage provider with a single natural language request.',
    trustTier: 'community',
    audience: 'developer',
    category: 'automation',
    riskLevel: 'high',
    safetySummary:
      'Reads local files and uploads them to configured cloud storage. Requires rclone installed and configured with provider credentials. Can delete remote files if instructed.',
    githubUrl: 'https://github.com/compound-engineering/rclone-skill',
    stars: 580,
    forks: 41,
    lastUpdated: '2026-02-20',
    license: 'MIT',
    worksWith: ['claude-code'],
    installInstructions: {
      'Claude Code': 'claude install @compound-engineering/rclone-uploader',
    },
    tags: ['cloud-storage', 's3', 'file-sync', 'backups', 'rclone'],
    bestFor:
      'Developers who regularly push files to cloud storage and want to automate uploads from their dev workflow.',
  },
  {
    slug: 'notion-workspace',
    name: 'Notion Workspace',
    author: 'Notion',
    authorUrl: 'https://notion.so',
    description:
      'Full Notion integration MCP — search, create pages, manage databases, and build task boards from your agent.',
    summary:
      'The official Notion MCP server turns your agent into a Notion power user. Query databases, create structured pages, manage tasks, and synthesize research — all without opening a browser tab.',
    trustTier: 'official',
    audience: 'both',
    category: 'productivity',
    riskLevel: 'medium',
    safetySummary:
      'Authenticated access to your Notion workspace via OAuth. Can read, create, and modify pages and databases. Scoped to the permissions you grant during setup.',
    githubUrl: 'https://github.com/makenotion/notion-mcp',
    stars: 5120,
    forks: 390,
    lastUpdated: '2026-03-17',
    license: 'MIT',
    worksWith: ['claude-code', 'cursor', 'codex', 'claude-ai'],
    installInstructions: {
      'Claude Code': 'claude mcp add notion -- npx -y @notionhq/notion-mcp-server',
      Cursor: 'Add @notionhq/notion-mcp-server to MCP config',
      'Claude.ai': 'Enable Notion integration in Claude.ai settings',
    },
    tags: ['notion', 'mcp', 'productivity', 'tasks', 'databases'],
    bestFor:
      'Teams using Notion for project management who want seamless agent integration with their workspace.',
  },
  {
    slug: 'security-audit',
    name: 'Security Audit',
    author: 'Trail of Bits',
    authorUrl: 'https://trailofbits.com',
    description:
      'Automated security review covering OWASP Top 10, dependency vulnerabilities, secrets detection, and auth patterns.',
    summary:
      'Applies Trail of Bits\' security expertise to your codebase via automated scanning. Catches hardcoded secrets, SQL injection vectors, insecure auth patterns, and known CVEs in dependencies before they ship.',
    trustTier: 'verified',
    audience: 'developer',
    category: 'security',
    riskLevel: 'low',
    safetySummary:
      'Read-only analysis of project files. May query public vulnerability databases (NVD, OSV). No file modifications. No credentials sent externally.',
    githubUrl: 'https://github.com/trailofbits/security-audit-skill',
    stars: 3890,
    forks: 267,
    lastUpdated: '2026-03-13',
    license: 'Apache-2.0',
    worksWith: ['claude-code', 'cursor', 'codex'],
    installInstructions: {
      'Claude Code': 'claude install @trailofbits/security-audit',
      Cursor: 'Add security-audit to .cursor/skills/',
      Codex: 'codex plugin add security-audit',
    },
    tags: ['security', 'owasp', 'vulnerability-scanning', 'secrets-detection'],
    bestFor:
      'Security-conscious teams who want automated vulnerability scanning integrated into their development workflow.',
  },
  {
    slug: 'test-runner',
    name: 'Test Runner',
    author: 'DevToolsCo',
    authorUrl: 'https://github.com/devtoolsco',
    description:
      'Intelligent test execution — run affected tests, analyze failures, and suggest fixes automatically.',
    summary:
      'Goes beyond "run all tests" by analyzing your changes to determine which tests are affected, running them in priority order, and providing actionable fix suggestions when they fail. Supports Jest, pytest, RSpec, and Go test.',
    trustTier: 'community',
    audience: 'developer',
    category: 'automation',
    riskLevel: 'low',
    safetySummary:
      'Executes test commands in your project. Read access to source and test files. No network calls beyond what your test suite makes.',
    githubUrl: 'https://github.com/devtoolsco/test-runner-skill',
    stars: 1560,
    forks: 112,
    lastUpdated: '2026-03-09',
    license: 'MIT',
    worksWith: ['claude-code', 'cursor'],
    installInstructions: {
      'Claude Code': 'claude install @devtoolsco/test-runner',
      Cursor: 'Add test-runner skill to .cursor/skills/',
    },
    tags: ['testing', 'ci', 'jest', 'pytest', 'rspec'],
    bestFor:
      'Developers who want smarter test execution that focuses on what changed rather than running everything.',
  },
  {
    slug: 'code-reviewer',
    name: 'Code Reviewer',
    author: 'SourceGraph',
    authorUrl: 'https://sourcegraph.com',
    description:
      'Multi-perspective code review with architecture, performance, security, and style analysis.',
    summary:
      'Runs your code through multiple specialized review lenses — architecture compliance, performance hotspots, security vulnerabilities, and style consistency. Produces structured feedback with severity levels and actionable suggestions.',
    trustTier: 'community',
    audience: 'developer',
    category: 'documents',
    riskLevel: 'low',
    safetySummary:
      'Read-only analysis of project files and git history. No file modifications during review. No external network calls.',
    githubUrl: 'https://github.com/sourcegraph/code-reviewer-skill',
    stars: 2340,
    forks: 189,
    lastUpdated: '2026-03-07',
    license: 'Apache-2.0',
    worksWith: ['claude-code', 'cursor', 'codex'],
    installInstructions: {
      'Claude Code': 'claude install @sourcegraph/code-reviewer',
      Cursor: 'Add code-reviewer skill to .cursor/skills/',
      Codex: 'codex plugin add code-reviewer',
    },
    tags: ['code-review', 'architecture', 'quality', 'best-practices'],
    bestFor:
      'Teams without dedicated reviewers who want thorough, multi-dimensional code review on every PR.',
  },
  {
    slug: 'docker-manager',
    name: 'Docker Manager',
    author: 'ContainerCraft',
    authorUrl: 'https://github.com/containercraft',
    description:
      'Manage Docker containers, images, compose stacks, and volumes through natural language commands.',
    summary:
      'Translates plain English into Docker operations. Build images, manage compose stacks, inspect running containers, clean up dangling resources, and troubleshoot networking — all without memorizing Docker CLI flags.',
    trustTier: 'community',
    audience: 'developer',
    category: 'devops',
    riskLevel: 'high',
    safetySummary:
      'Full access to the Docker daemon via CLI. Can start, stop, and remove containers and images. Can expose ports and mount volumes. Review commands before confirming.',
    githubUrl: 'https://github.com/containercraft/docker-manager-skill',
    stars: 1890,
    forks: 143,
    lastUpdated: '2026-03-05',
    license: 'MIT',
    worksWith: ['claude-code', 'cursor'],
    installInstructions: {
      'Claude Code': 'claude install @containercraft/docker-manager',
      Cursor: 'Add docker-manager skill to .cursor/skills/',
    },
    tags: ['docker', 'containers', 'compose', 'devops', 'infrastructure'],
    bestFor:
      'Developers who work with Docker daily and want faster container management without context-switching.',
  },
  {
    slug: 'api-designer',
    name: 'API Designer',
    author: 'SpecFirst',
    authorUrl: 'https://github.com/specfirst',
    description:
      'Design REST and GraphQL APIs with automatic OpenAPI spec generation, validation, and documentation.',
    summary:
      'Takes an API-first approach to backend development. Describe your endpoints in natural language, get a validated OpenAPI 3.1 spec, auto-generated types, and beautiful documentation — before writing a single route handler.',
    trustTier: 'community',
    audience: 'developer',
    category: 'design',
    riskLevel: 'low',
    safetySummary:
      'Generates specification files and documentation. Standard project file read/write. No network access or external API calls.',
    githubUrl: 'https://github.com/specfirst/api-designer-skill',
    stars: 1340,
    forks: 95,
    lastUpdated: '2026-03-04',
    license: 'MIT',
    worksWith: ['claude-code', 'cursor', 'codex'],
    installInstructions: {
      'Claude Code': 'claude install @specfirst/api-designer',
      Cursor: 'Add api-designer skill to .cursor/skills/',
      Codex: 'codex plugin add api-designer',
    },
    tags: ['api', 'openapi', 'graphql', 'documentation', 'rest'],
    bestFor:
      'Backend developers who want to design APIs spec-first and generate consistent documentation automatically.',
  },
  {
    slug: 'data-pipeline',
    name: 'Data Pipeline',
    author: 'DataForge',
    authorUrl: 'https://github.com/dataforge-tools',
    description:
      'Build, test, and debug ETL pipelines with automatic schema inference and data validation.',
    summary:
      'Helps you construct data pipelines step by step — from source extraction through transformation to loading. Infers schemas automatically, validates data at each stage, and generates monitoring hooks for production reliability.',
    trustTier: 'community',
    audience: 'developer',
    category: 'research',
    riskLevel: 'medium',
    safetySummary:
      'Reads data files and database connection configs. May execute SQL queries against configured databases. Review connection strings before use.',
    githubUrl: 'https://github.com/dataforge-tools/data-pipeline-skill',
    stars: 980,
    forks: 74,
    lastUpdated: '2026-02-27',
    license: 'MIT',
    worksWith: ['claude-code'],
    installInstructions: {
      'Claude Code': 'claude install @dataforge/data-pipeline',
    },
    tags: ['etl', 'data-processing', 'sql', 'validation', 'pipelines'],
    bestFor:
      'Data engineers and backend developers building reliable data pipelines who want schema-aware agent assistance.',
  },
  {
    slug: 'markdown-writer',
    name: 'Markdown Writer',
    author: 'ProseKit',
    authorUrl: 'https://github.com/prosekit',
    description:
      'Create polished markdown documents — READMEs, blog posts, changelogs, and technical docs with consistent formatting.',
    summary:
      'Elevates your agent\'s writing output with structured templates and editorial guidelines. Produces well-formatted READMEs, changelogs, blog posts, and technical documentation that reads like it was written by a human editor.',
    trustTier: 'community',
    audience: 'non-technical',
    category: 'productivity',
    riskLevel: 'low',
    safetySummary:
      'Reads and writes markdown files in your project. No network access. No system commands.',
    githubUrl: 'https://github.com/prosekit/markdown-writer-skill',
    stars: 1120,
    forks: 87,
    lastUpdated: '2026-03-01',
    license: 'MIT',
    worksWith: ['claude-code', 'cursor', 'claude-ai'],
    installInstructions: {
      'Claude Code': 'claude install @prosekit/markdown-writer',
      Cursor: 'Add markdown-writer skill to .cursor/skills/',
      'Claude.ai': 'Enable in Claude.ai skill marketplace',
    },
    tags: ['markdown', 'writing', 'documentation', 'readme', 'changelog'],
    bestFor:
      'Anyone who writes documentation, blog posts, or READMEs and wants consistent, professional formatting.',
  },
  {
    slug: 'performance-profiler',
    name: 'Performance Profiler',
    author: 'PerfLab',
    authorUrl: 'https://github.com/perflab-tools',
    description:
      'Analyze application performance — find bottlenecks, optimize queries, reduce bundle sizes, and improve load times.',
    summary:
      'Systematic performance analysis for web applications. Profiles JavaScript bundles, database queries, API response times, and memory usage, then provides prioritized optimization recommendations with estimated impact.',
    trustTier: 'community',
    audience: 'developer',
    category: 'research',
    riskLevel: 'low',
    safetySummary:
      'Read-only analysis of project files, build output, and profiling data. May run build commands to measure bundle sizes. No external network calls.',
    githubUrl: 'https://github.com/perflab-tools/performance-profiler',
    stars: 1450,
    forks: 108,
    lastUpdated: '2026-03-03',
    license: 'MIT',
    worksWith: ['claude-code', 'cursor'],
    installInstructions: {
      'Claude Code': 'claude install @perflab/performance-profiler',
      Cursor: 'Add performance-profiler skill to .cursor/skills/',
    },
    tags: ['performance', 'profiling', 'optimization', 'bundle-size', 'queries'],
    bestFor:
      'Developers investigating slow pages, large bundles, or sluggish APIs who want data-driven optimization guidance.',
  },
  {
    slug: 'accessibility-checker',
    name: 'Accessibility Checker',
    author: 'A11yFirst',
    authorUrl: 'https://github.com/a11yfirst',
    description:
      'Audit web applications for WCAG compliance — color contrast, ARIA labels, keyboard navigation, and screen reader support.',
    summary:
      'Catches accessibility issues before your users do. Scans components for WCAG 2.2 violations, missing ARIA attributes, insufficient color contrast, and keyboard navigation gaps, with auto-fix suggestions for common problems.',
    trustTier: 'community',
    audience: 'both',
    category: 'security',
    riskLevel: 'low',
    safetySummary:
      'Read-only analysis of HTML, JSX, and CSS files. May run axe-core in browser context if browser tools are available. No external data transmission.',
    githubUrl: 'https://github.com/a11yfirst/accessibility-checker-skill',
    stars: 2080,
    forks: 156,
    lastUpdated: '2026-03-10',
    license: 'MIT',
    worksWith: ['claude-code', 'cursor', 'codex'],
    installInstructions: {
      'Claude Code': 'claude install @a11yfirst/accessibility-checker',
      Cursor: 'Add accessibility-checker skill to .cursor/skills/',
      Codex: 'codex plugin add accessibility-checker',
    },
    tags: ['accessibility', 'wcag', 'a11y', 'aria', 'inclusive-design'],
    bestFor:
      'Frontend teams who want to ship accessible products and catch WCAG violations during development, not after launch.',
  },
  {
    slug: 'deployment-manager',
    name: 'Deployment Manager',
    author: 'ShipIt',
    authorUrl: 'https://github.com/shipit-deploy',
    description:
      'Automate CI/CD deployments — Railway, Vercel, Fly.io, AWS, and custom pipelines with rollback support.',
    summary:
      'Takes the stress out of deployments by providing a unified interface across hosting platforms. Deploy to Railway, Vercel, Fly.io, or AWS with pre-flight checks, environment validation, and one-command rollbacks.',
    trustTier: 'community',
    audience: 'developer',
    category: 'devops',
    riskLevel: 'high',
    safetySummary:
      'Executes deployment commands and CLI tools. Requires platform credentials (API tokens). Can modify production infrastructure. Always review deployment plans before confirming.',
    githubUrl: 'https://github.com/shipit-deploy/deployment-manager-skill',
    stars: 1670,
    forks: 124,
    lastUpdated: '2026-03-02',
    license: 'MIT',
    worksWith: ['claude-code'],
    installInstructions: {
      'Claude Code': 'claude install @shipit/deployment-manager',
    },
    tags: ['deployment', 'ci-cd', 'railway', 'vercel', 'devops'],
    bestFor:
      'Developers who deploy frequently and want automated pre-flight checks and rollback safety nets.',
  },
  {
    slug: 'database-migrator',
    name: 'Database Migrator',
    author: 'SchemaForge',
    authorUrl: 'https://github.com/schemaforge',
    description:
      'Generate, validate, and safely apply database migrations with rollback plans and data integrity checks.',
    summary:
      'Makes database migrations less terrifying. Generates migration files from schema diffs, validates them against production constraints, checks for data loss risks, and provides tested rollback procedures for every change.',
    trustTier: 'community',
    audience: 'developer',
    category: 'devops',
    riskLevel: 'high',
    safetySummary:
      'Generates and can execute database migration files. May connect to databases using configured credentials. Always review generated SQL before applying to production.',
    githubUrl: 'https://github.com/schemaforge/database-migrator-skill',
    stars: 1380,
    forks: 102,
    lastUpdated: '2026-02-26',
    license: 'MIT',
    worksWith: ['claude-code', 'cursor'],
    installInstructions: {
      'Claude Code': 'claude install @schemaforge/database-migrator',
      Cursor: 'Add database-migrator skill to .cursor/skills/',
    },
    tags: ['database', 'migrations', 'schema', 'postgresql', 'rollback'],
    bestFor:
      'Backend developers managing complex schemas who want safe, validated migrations with automatic rollback plans.',
  },
  {
    slug: 'env-manager',
    name: 'Environment Manager',
    author: 'DotEnvPlus',
    authorUrl: 'https://github.com/dotenvplus',
    description:
      'Manage environment variables across .env files — sync, validate, diff, and share configurations safely.',
    summary:
      'Keeps your environment variables organized and in sync. Validates required vars against your codebase, diffs between environments, generates .env.example files, and helps onboard new developers without sharing secrets in Slack.',
    trustTier: 'unreviewed',
    audience: 'developer',
    category: 'security',
    riskLevel: 'medium',
    safetySummary:
      'Reads .env files which may contain secrets. Never transmits values externally. Generates sanitized .env.example files. Review access patterns carefully.',
    githubUrl: 'https://github.com/dotenvplus/env-manager-skill',
    stars: 640,
    forks: 38,
    lastUpdated: '2026-02-18',
    license: 'MIT',
    worksWith: ['claude-code'],
    installInstructions: {
      'Claude Code': 'claude install @dotenvplus/env-manager',
    },
    tags: ['environment', 'dotenv', 'secrets', 'configuration', 'onboarding'],
    bestFor:
      'Teams with complex environment setups who want validation and safe sharing of configuration across developers.',
  },
  {
    slug: 'log-analyzer',
    name: 'Log Analyzer',
    author: 'LogLens',
    authorUrl: 'https://github.com/loglens-dev',
    description:
      'Parse, search, and analyze application logs — find errors, trace requests, and identify patterns.',
    summary:
      'Turns raw log files into actionable insights. Parses structured and unstructured logs, correlates errors across services, identifies recurring patterns, and helps you trace individual requests through your system.',
    trustTier: 'unreviewed',
    audience: 'developer',
    category: 'research',
    riskLevel: 'low',
    safetySummary:
      'Read-only access to log files. Processes data locally. No external network calls. Logs may contain sensitive information — review what files you point it at.',
    githubUrl: 'https://github.com/loglens-dev/log-analyzer-skill',
    stars: 430,
    forks: 29,
    lastUpdated: '2026-02-15',
    license: 'MIT',
    worksWith: ['claude-code'],
    installInstructions: {
      'Claude Code': 'claude install @loglens/log-analyzer',
    },
    tags: ['logging', 'debugging', 'error-tracking', 'observability'],
    bestFor:
      'Developers debugging production issues who want to quickly find patterns and trace errors across log files.',
  },
];
