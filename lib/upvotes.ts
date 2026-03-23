const STORAGE_KEY = 'skillstube-upvoted';

export type UpvoteEntityType = 'plugin' | 'skill';

function isStringArray(value: unknown): value is string[] {
  return (
    Array.isArray(value) && value.every((item) => typeof item === 'string')
  );
}

function keyFor(entityType: UpvoteEntityType, slug: string): string {
  return `${entityType}:${slug}`;
}

function hasEntityPrefix(entry: string): boolean {
  return entry.startsWith('skill:') || entry.startsWith('plugin:');
}

function normalizeEntry(entry: string): string {
  return hasEntityPrefix(entry) ? entry : keyFor('skill', entry);
}

function normalizeStoredSlugs(slugs: string[]): string[] {
  return slugs.map(normalizeEntry);
}

function needsPrefixMigration(slugs: string[]): boolean {
  return slugs.some((s) => !hasEntityPrefix(s));
}

export function getUpvotedSlugs(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw == null) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!isStringArray(parsed)) return [];
    const normalized = normalizeStoredSlugs(parsed);
    if (needsPrefixMigration(parsed)) {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
      } catch {
        /* ignore write failures */
      }
    }
    return normalized;
  } catch {
    return [];
  }
}

export function hasUpvoted(entityType: UpvoteEntityType, slug: string): boolean {
  const key = keyFor(entityType, slug);
  return getUpvotedSlugs().includes(key);
}

export function addUpvote(entityType: UpvoteEntityType, slug: string): void {
  if (typeof window === 'undefined') return;
  try {
    const key = keyFor(entityType, slug);
    const next = [...new Set([...getUpvotedSlugs(), key])];
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch (e) {
    if (
      e instanceof DOMException &&
      e.name === 'QuotaExceededError'
    ) {
      return;
    }
  }
}

export function removeUpvote(entityType: UpvoteEntityType, slug: string): void {
  if (typeof window === 'undefined') return;
  try {
    const key = keyFor(entityType, slug);
    const next = getUpvotedSlugs().filter((s) => s !== key);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* ignore */
  }
}
