---
status: pending
priority: p2
issue_id: 014
tags: [code-review, quality]
---

# Dead code: `increment` and `SerializedCollection`

## Problem Statement
Unused exports increase noise, confuse readers, and can trigger unnecessary maintenance or false positives in tooling.

## Findings
- `increment()` in `db/queries.ts` lines 5–7 is never called.
- `SerializedCollection` in `db/schema.ts` lines 147–153 is never imported.

## Proposed Solutions
### Option A: Remove dead code
- Delete `increment` and `SerializedCollection` if there is no planned use; otherwise document and wire them intentionally.
- Effort: Small (about 2 minutes)

## Acceptance Criteria
- [ ] Unused `increment` and `SerializedCollection` are removed or replaced with intentional usage
- [ ] Project builds and types check cleanly with no new unused-export warnings for these symbols
