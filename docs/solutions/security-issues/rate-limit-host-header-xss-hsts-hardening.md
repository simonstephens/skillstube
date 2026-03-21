---
title: "SkillsTube PR #1 — multi-agent code review remediation (rate limit bypass, host injection, XSS, ISR, type safety)"
category: security-issues
date: 2026-03-21
tags:
  - next-js-15
  - app-router
  - typescript
  - drizzle-orm
  - railway
  - code-review
  - multi-agent-review
  - rate-limiting
  - x-forwarded-for
  - host-header-injection
  - cache-poisoning
  - memory-leak
  - isr
  - json-ld
  - xss
  - markdown
  - hsts
  - security-headers
  - type-safety
severity: high
components:
  - app/api/skills/[slug]/upvote/route.ts
  - app/page.tsx
  - app/skills/[slug]/page.tsx
  - app/collections/[slug]/page.tsx
  - app/browse/page.tsx
  - lib/rate-limit.ts
  - lib/types.ts
  - lib/site-url.ts
  - lib/serialize.ts
  - components/ui/SkillCard.tsx
  - components/sections/FeaturedStacks.tsx
  - components/sections/SkillBrowser.tsx
  - components/sections/SkillMdPreview.tsx
  - db/queries.ts
  - db/schema.ts
  - next.config.ts
problem_type: code_review_remediation
related_issues:
  - PR-1
---

# Multi-Agent Code Review Hardening — Rate Limit Bypass, Host Injection, XSS, ISR, Type Safety

A multi-agent code review (5 specialized agents: TypeScript reviewer, security sentinel, performance oracle, code simplicity reviewer, agent-native reviewer) was run on the SkillsTube MVP (PR #1). It surfaced 22 deduplicated findings across P1–P3 severities. All 5 P1 critical issues and several P2 important issues were fixed in a single pass across 15 files.

## Investigation Steps

1. **Security review of API routes** — Traced how `clientIp()` derived identity for the upvote rate limiter and how the homepage built canonical/OG URLs.
2. **Header trust model** — Compared client-supplied headers (`X-Forwarded-For`, `Host`, `X-Forwarded-Host`) with what Railway's reverse proxy actually appends.
3. **Caching / rendering audit** — Confirmed that `await headers()` on the homepage forced dynamic rendering and blocked ISR-style revalidation.
4. **Rate limiter lifecycle** — Inspected `lib/rate-limit.ts` for entry growth: pruning inside each key vs. removal of keys from the `Map`.
5. **Type safety audit** — Audited Drizzle-inferred types vs. domain unions (`TrustTier`, `Category`, `Platform`, `Audience`) and counted unsafe `as` casts (6+ locations).
6. **Output encoding** — Checked JSON-LD embedding and markdown link rendering for script breakout and `javascript:` URL schemes.
7. **Hardening pass** — Verified HSTS, dead code, query slimming, browse revalidation.

## Root Cause Analysis

| Area | Root Cause |
|------|------------|
| **Upvote IP** | `clientIp()` extracted the leftmost `X-Forwarded-For` value, which is client-controlled. Spoofing many "IPs" completely bypassed rate limits. |
| **Site URL / homepage** | `app/page.tsx` built the public origin from `Host` / `X-Forwarded-Host` headers, enabling cache/metadata poisoning and forcing the page to be fully dynamic (no ISR). |
| **Rate limit store** | Timestamps were pruned per key, but keys were never removed when empty; the `Map` could grow without bound under distributed traffic. |
| **Trust tier / enums** | `text()` columns inferred as `string`; `as TrustTier` (and similar) hid invalid DB values at compile time — no runtime validation. |
| **JSON-LD injection** | `JSON.stringify()` does not neutralize `<`, so a `</script>` sequence could break out of a `<script>` block. |
| **Markdown links** | `react-markdown` emitted clickable `javascript:` links without a custom guard on the `a` component. |

## Working Solution

### 1. Secure Client IP (Rightmost Forwarded Hop)

The rightmost IP in `X-Forwarded-For` is the one appended by Railway's proxy — not client-controlled.

```typescript
// Before (vulnerable — leftmost is client-spoofable):
const first = forwarded.split(',')[0]?.trim();

// After (secure — rightmost is proxy-appended):
const parts = forwarded.split(',').map((s) => s.trim());
return parts.at(-1) || 'unknown';
```

Also added `slug.length > 128` guard and fixed import to use `server-only` guarded `@/db`.

### 2. Env-Only Site URL + Homepage ISR

Created shared `lib/site-url.ts` — no request headers, no cache poisoning vector:

```typescript
export function getSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL;
  if (fromEnv) return fromEnv.replace(/\/$/, '');
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL.replace(/\/$/, '')}`;
  }
  return 'http://localhost:3000';
}
```

Replaced 3 duplicate implementations across homepage, skill detail, and collection pages. Added `export const revalidate = 60` to homepage and browse page.

### 3. Rate Limiter Eviction + Cap

Added periodic cleanup interval and a max entries safety valve:

```typescript
const MAX_ENTRIES = 10_000;
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000;

setInterval(() => {
  const cutoff = Date.now() - WINDOW_MS;
  for (const [ip, timestamps] of requests) {
    const valid = timestamps.filter((t) => t > cutoff);
    if (valid.length === 0) requests.delete(ip);
    else requests.set(ip, valid);
  }
}, CLEANUP_INTERVAL_MS).unref();
```

Plus immediate delete when a key's array becomes empty and eviction when size exceeds `MAX_ENTRIES`.

### 4. Runtime Type Narrowing (Replace Unsafe Casts)

Created narrowing utilities aligned with const arrays:

```typescript
export function isTrustTier(value: string): value is TrustTier {
  return (TRUST_TIERS as readonly string[]).includes(value);
}
export function parseTrustTier(value: string): TrustTier {
  return isTrustTier(value) ? value : 'unreviewed';
}
```

Same pattern for `isCategory`/`parseCategory`. Guard-only variants (`isPlatform`, `isAudience`) exist for Platform and Audience where safe fallbacks aren't needed. Replaced all `as TrustTier` / `as Category` casts across SkillCard, FeaturedStacks, SkillBrowser, skill detail, and collection pages.

### 5. JSON-LD & Markdown XSS Hardening

Safe JSON-LD serialization:

```typescript
export function safeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}
```

Protocol filtering on markdown links (applied to both `SkillMdPreview` and collection editorial):

```typescript
a: ({ href, children, ...props }) => {
  if (href && !/^https?:\/\//.test(href) && !href.startsWith('/') && !href.startsWith('#')) {
    return <span>{children}</span>;
  }
  const external = href?.startsWith('http') ?? false;
  return (
    <a href={href} {...props}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
    >{children}</a>
  );
}
```

### 6. Bonus Fixes

- **HSTS header** added to `next.config.ts`: `max-age=31536000; includeSubDomains`
- **Browse page ISR**: `export const revalidate = 60`
- **Dead code removed**: `increment()` function, `SerializedCollection` type
- **Deduplicated `serializeSkill`**: collection and browse pages now import from `lib/serialize.ts`
- **Homepage JSON-LD slimmed**: uses `getAllSkillSlugsAndNames()` instead of full `getAllSkills()`

## Prevention Strategies

### Trust Boundaries and Proxy Headers
- Define a single "client IP" helper matching your deployment's proxy chain. Document the trust assumption.
- Build public URLs from environment variables or a configured canonical origin, never from request headers.

### URL and Redirect Safety
- Allowlist URL schemes (`https:`, `/`, `#`) for any user-controlled or DB-sourced `href`.
- Sanitize markdown link rendering with a custom component guard.

### Serialization in HTML
- Never assume `JSON.stringify` is HTML-safe. Escape `<` as `\u003c` for any JSON embedded in `<script>` tags.

### Type Safety at Boundaries
- Validate at boundaries (DB reads, HTTP inputs, env vars) with parse-then-type. Ban `as` for external data.
- Use const arrays as single source of truth, derive types and guards from them.

### Resource Lifecycle
- In-memory `Map`/`Set` keyed by IP or session must have TTL + periodic sweep + max size cap.
- Prefer Redis/Upstash for distributed rate limiting in production.

### Security Headers
- Centralize headers in one place. Include HSTS for HTTPS-only production apps.

### Next.js Rendering Model
- Calling `headers()`, `cookies()`, or `searchParams` in a page forces it dynamic. Split "needs request" logic into small components or route handlers.
- Always set explicit `revalidate` on data-fetching pages.

## Recommended Test Cases

1. **IP spoofing**: `X-Forwarded-For: 1.1.1.1, 2.2.2.2` — assert rate limiter uses the rightmost IP
2. **Host injection**: `Host: evil.test` — assert OG/canonical URLs use configured origin, not the header
3. **Rate limiter bounds**: Simulate 10K+ distinct keys — assert Map size stays bounded
4. **Invalid enums**: DB row with `trustTier: 'garbage'` — assert `parseTrustTier` returns `'unreviewed'`
5. **JSON-LD breakout**: Payload containing `</script>` — assert it's escaped as `\u003cscript>`
6. **Markdown XSS**: `[x](javascript:alert(1))` — assert no clickable `javascript:` link in rendered output
7. **HSTS present**: Production response includes `Strict-Transport-Security`
8. **ISR active**: Homepage and browse responses are statically cached (not re-rendered per request)

## Cross-References

- `docs/plans/2026-03-20-001-feat-skillstube-mvp-beta-plan.md` — Original MVP plan covering architecture, security headers, rate limiting, ISR
- `docs/brainstorms/2026-03-20-skillstube-mvp-requirements.md` — Requirements document with security context
- `todos/001-pending-p1-rate-limiter-ip-spoofing.md` through `todos/015-pending-p2-missing-json-api.md` — Individual review finding todo files
