import { eq, sql } from 'drizzle-orm';

import { db } from '@/db';
import { skills } from '@/db/schema';
import { isRateLimited } from '@/lib/rate-limit';

const SLUG_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;

function clientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (!forwarded) return 'unknown';
  const parts = forwarded.split(',').map((s) => s.trim());
  // Rightmost IP is the one appended by the reverse proxy (Railway), not client-controlled
  return parts.at(-1) || 'unknown';
}

function jsonResponse(body: unknown, status: number) {
  return Response.json(body, { status });
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ slug: string }> },
) {
  const { slug } = await context.params;
  if (slug.length > 128 || !SLUG_RE.test(slug)) {
    return jsonResponse({ error: 'Invalid slug' }, 400);
  }

  try {
    const [skill] = await db
      .select({ upvoteCount: skills.upvoteCount })
      .from(skills)
      .where(eq(skills.slug, slug))
      .limit(1);

    if (!skill) {
      return jsonResponse({ error: 'Not found' }, 404);
    }

    return jsonResponse({ upvoteCount: skill.upvoteCount }, 200);
  } catch {
    return jsonResponse({ error: 'Internal server error' }, 500);
  }
}

export async function POST(
  request: Request,
  context: { params: Promise<{ slug: string }> },
) {
  const { slug } = await context.params;
  if (slug.length > 128 || !SLUG_RE.test(slug)) {
    return jsonResponse({ error: 'Invalid slug' }, 400);
  }

  if (isRateLimited(clientIp(request))) {
    return jsonResponse({ error: 'Too many requests' }, 429);
  }

  try {
    const [result] = await db
      .update(skills)
      .set({
        upvoteCount: sql`${skills.upvoteCount} + 1`,
        updatedAt: sql`now()`,
      })
      .where(eq(skills.slug, slug))
      .returning({ upvoteCount: skills.upvoteCount });

    if (!result) {
      return jsonResponse({ error: 'Not found' }, 404);
    }

    return jsonResponse({ upvoteCount: result.upvoteCount }, 200);
  } catch {
    return jsonResponse({ error: 'Internal server error' }, 500);
  }
}
