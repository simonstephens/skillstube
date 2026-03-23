export const SLUG_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;

export function clientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (!forwarded) return 'unknown';
  const parts = forwarded.split(',').map((s) => s.trim());
  return parts.at(-1) || 'unknown';
}

export function jsonResponse(body: unknown, status: number) {
  return Response.json(body, { status });
}

export function isValidOrigin(request: Request): boolean {
  const origin = request.headers.get('origin');
  if (!origin) return false;

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (siteUrl) {
    try {
      if (new URL(siteUrl).origin === origin) return true;
    } catch {
      /* invalid NEXT_PUBLIC_SITE_URL */
    }
  }

  if (origin.startsWith('http://localhost:')) return true;

  return false;
}
