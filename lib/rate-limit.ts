const WINDOW_MS = 60 * 60 * 1000; // 1 hour
const MAX_REQUESTS = 10;
const MAX_ENTRIES = 10_000;
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

const requests = new Map<string, number[]>();

if (typeof globalThis !== 'undefined') {
  setInterval(() => {
    const cutoff = Date.now() - WINDOW_MS;
    for (const [ip, timestamps] of requests) {
      const valid = timestamps.filter((t) => t > cutoff);
      if (valid.length === 0) requests.delete(ip);
      else requests.set(ip, valid);
    }
  }, CLEANUP_INTERVAL_MS).unref();
}

export function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const cutoff = now - WINDOW_MS;
  const timestamps = (requests.get(ip) ?? []).filter((t) => t > cutoff);

  if (timestamps.length === 0) {
    requests.delete(ip);
  }

  if (timestamps.length >= MAX_REQUESTS) {
    requests.set(ip, timestamps);
    return true;
  }

  if (requests.size >= MAX_ENTRIES) {
    const oldest = requests.keys().next().value;
    if (oldest) requests.delete(oldest);
  }

  timestamps.push(now);
  requests.set(ip, timestamps);
  return false;
}
