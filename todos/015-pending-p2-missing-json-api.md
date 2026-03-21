---
status: pending
priority: p2
issue_id: 015
tags: [code-review, architecture]
---

# Missing JSON API for agent and programmatic access

## Problem Statement
Only a small fraction of user-facing capabilities are reachable as structured JSON over HTTP. Skills and collections are primarily exposed through SSR pages, which limits agent-native and programmatic integration despite existing query layers.

## Findings
- Queries already exist in `db/queries.ts`; there is no first-class JSON API for listing skills, skill detail, collections, and collection detail.
- Product/agent value proposition would benefit from stable read APIs.

## Proposed Solutions
### Option A: Read-only REST-style routes
- Add `GET /api/skills`, `GET /api/skills/[slug]`, `GET /api/collections`, `GET /api/collections/[slug]` wired to existing queries, with consistent JSON shapes and error responses.
- Effort: Medium

**Note:** This may be deferred post-MVP but is among the highest-impact improvements for agent-native access.

## Acceptance Criteria
- [ ] Four endpoints exist and return JSON for list and detail cases
- [ ] Responses use stable field names and appropriate HTTP status codes (200, 404, etc.)
- [ ] No sensitive or oversized fields are exposed unintentionally (align with public page data)
- [ ] Basic documentation or examples exist for consumers (if project standards require it)
