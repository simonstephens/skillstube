const windowMs = 60 * 60 * 1000; // 1 hour
const maxRequests = 10;

const requests = new Map<string, number[]>();

export function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const cutoff = now - windowMs;
  const timestamps = (requests.get(ip) ?? []).filter((t) => t > cutoff);

  if (timestamps.length >= maxRequests) {
    requests.set(ip, timestamps);
    return true;
  }

  timestamps.push(now);
  requests.set(ip, timestamps);
  return false;
}
