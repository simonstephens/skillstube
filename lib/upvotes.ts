const STORAGE_KEY = 'skillstube-upvoted';

function isStringArray(value: unknown): value is string[] {
  return (
    Array.isArray(value) && value.every((item) => typeof item === 'string')
  );
}

export function getUpvotedSlugs(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw == null) return [];
    const parsed: unknown = JSON.parse(raw);
    return isStringArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function hasUpvoted(slug: string): boolean {
  return getUpvotedSlugs().includes(slug);
}

export function addUpvote(slug: string): void {
  if (typeof window === 'undefined') return;
  try {
    const next = [...new Set([...getUpvotedSlugs(), slug])];
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

export function removeUpvote(slug: string): void {
  if (typeof window === 'undefined') return;
  try {
    const next = getUpvotedSlugs().filter((s) => s !== slug);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* ignore */
  }
}
