import { eq, sql } from 'drizzle-orm';

import { db } from '@/db';
import { skills } from '@/db/schema';
import { isRateLimited } from '@/lib/rate-limit';
import { clientIp, isValidOrigin, jsonResponse, SLUG_RE } from '@/lib/api/upvote';

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
  if (!isValidOrigin(request)) {
    return jsonResponse({ error: 'Forbidden' }, 403);
  }

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
