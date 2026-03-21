import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { eq, notInArray, sql } from 'drizzle-orm';
import { skills, collections, collectionSkills } from '../db/schema';
import { skillsData } from '../content/skills';
import { collectionsData } from '../content/collections';
import { z } from 'zod';
import { TRUST_TIERS, AUDIENCES, PLATFORMS, CATEGORIES } from '../lib/types';

const skillSchema = z.object({
  slug: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/),
  name: z.string().min(1),
  author: z.string().min(1),
  authorUrl: z.string().url().nullable().optional(),
  description: z.string().min(1),
  summary: z.string().nullable().optional(),
  trustTier: z.enum(TRUST_TIERS),
  audience: z.enum(AUDIENCES),
  category: z.enum(CATEGORIES),
  riskLevel: z.enum(['low', 'medium', 'high']).nullable().optional(),
  safetySummary: z.string().nullable().optional(),
  githubUrl: z.string().url().nullable().optional(),
  stars: z.number().int().nullable().optional(),
  forks: z.number().int().nullable().optional(),
  lastUpdated: z.string().nullable().optional(),
  license: z.string().nullable().optional(),
  worksWith: z.array(z.enum(PLATFORMS)),
  installInstructions: z.record(z.string(), z.string()),
  tags: z.array(z.string()),
  bestFor: z.string().nullable().optional(),
  skillMdContent: z.string().nullable().optional(),
});

const collectionSchema = z.object({
  slug: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/),
  name: z.string().min(1),
  author: z.string().min(1),
  authorUrl: z.string().url().nullable().optional(),
  description: z.string().min(1),
  editorialContent: z.string().min(1),
  trustTier: z.enum(TRUST_TIERS),
  installAllInstructions: z.string().nullable().optional(),
  imageUrl: z.string().url().nullable().optional(),
  skillSlugs: z.array(z.string()),
});

const MAX_SKILL_MD_SIZE = 50_000;

async function seed() {
  const client = postgres(process.env.DATABASE_URL!, { max: 1 });
  const db = drizzle(client);

  console.log('Validating skill data...');
  for (const s of skillsData) {
    const result = skillSchema.safeParse(s);
    if (!result.success) {
      console.error(`Invalid skill "${s.slug}":`, result.error.format());
      process.exit(1);
    }
  }

  console.log('Validating collection data...');
  for (const c of collectionsData) {
    const result = collectionSchema.safeParse(c);
    if (!result.success) {
      console.error(
        `Invalid collection "${c.slug}":`,
        result.error.format(),
      );
      process.exit(1);
    }
  }

  console.log('Seeding database...');

  await db.transaction(async (tx) => {
    const skillSlugs = skillsData.map((s) => s.slug);
    const collectionSlugs = collectionsData.map((c) => c.slug);

    // Upsert skills (preserve upvote_count on conflict)
    for (const s of skillsData) {
      const content =
        s.skillMdContent && s.skillMdContent.length > MAX_SKILL_MD_SIZE
          ? s.skillMdContent.slice(0, MAX_SKILL_MD_SIZE) +
            '\n\n---\n*Content truncated. [View full content on GitHub](' +
            (s.githubUrl ?? '') +
            ')*'
          : s.skillMdContent;

      await tx
        .insert(skills)
        .values({
          slug: s.slug,
          name: s.name,
          author: s.author,
          authorUrl: s.authorUrl ?? null,
          description: s.description,
          summary: s.summary ?? null,
          trustTier: s.trustTier,
          audience: s.audience,
          category: s.category,
          riskLevel: s.riskLevel ?? null,
          safetySummary: s.safetySummary ?? null,
          githubUrl: s.githubUrl ?? null,
          stars: s.stars ?? null,
          forks: s.forks ?? null,
          lastUpdated: s.lastUpdated ?? null,
          license: s.license ?? null,
          worksWith: s.worksWith,
          installInstructions: s.installInstructions,
          tags: s.tags,
          bestFor: s.bestFor ?? null,
          skillMdContent: content ?? null,
        })
        .onConflictDoUpdate({
          target: skills.slug,
          set: {
            name: sql`EXCLUDED.name`,
            author: sql`EXCLUDED.author`,
            authorUrl: sql`EXCLUDED.author_url`,
            description: sql`EXCLUDED.description`,
            summary: sql`EXCLUDED.summary`,
            trustTier: sql`EXCLUDED.trust_tier`,
            audience: sql`EXCLUDED.audience`,
            category: sql`EXCLUDED.category`,
            riskLevel: sql`EXCLUDED.risk_level`,
            safetySummary: sql`EXCLUDED.safety_summary`,
            githubUrl: sql`EXCLUDED.github_url`,
            stars: sql`EXCLUDED.stars`,
            forks: sql`EXCLUDED.forks`,
            lastUpdated: sql`EXCLUDED.last_updated`,
            license: sql`EXCLUDED.license`,
            worksWith: sql`EXCLUDED.works_with`,
            installInstructions: sql`EXCLUDED.install_instructions`,
            tags: sql`EXCLUDED.tags`,
            bestFor: sql`EXCLUDED.best_for`,
            skillMdContent: sql`EXCLUDED.skill_md_content`,
            updatedAt: sql`now()`,
          },
        });
    }

    // Garbage-collect removed skills
    if (skillSlugs.length > 0) {
      await tx
        .delete(skills)
        .where(notInArray(skills.slug, skillSlugs));
    }

    // Upsert collections
    for (const c of collectionsData) {
      await tx
        .insert(collections)
        .values({
          slug: c.slug,
          name: c.name,
          author: c.author,
          authorUrl: c.authorUrl ?? null,
          description: c.description,
          editorialContent: c.editorialContent,
          trustTier: c.trustTier,
          installAllInstructions: c.installAllInstructions ?? null,
          imageUrl: c.imageUrl ?? null,
        })
        .onConflictDoUpdate({
          target: collections.slug,
          set: {
            name: sql`EXCLUDED.name`,
            author: sql`EXCLUDED.author`,
            authorUrl: sql`EXCLUDED.author_url`,
            description: sql`EXCLUDED.description`,
            editorialContent: sql`EXCLUDED.editorial_content`,
            trustTier: sql`EXCLUDED.trust_tier`,
            installAllInstructions: sql`EXCLUDED.install_all_instructions`,
            imageUrl: sql`EXCLUDED.image_url`,
            updatedAt: sql`now()`,
          },
        });
    }

    // Garbage-collect removed collections
    if (collectionSlugs.length > 0) {
      await tx
        .delete(collections)
        .where(notInArray(collections.slug, collectionSlugs));
    }

    // Resolve collection_skills join table
    // First, clear all existing joins (cascade will handle this, but be explicit)
    await tx.delete(collectionSkills);

    for (const c of collectionsData) {
      const [collection] = await tx
        .select({ id: collections.id })
        .from(collections)
        .where(eq(collections.slug, c.slug))
        .limit(1);

      if (!collection) continue;

      for (let i = 0; i < c.skillSlugs.length; i++) {
        const [skill] = await tx
          .select({ id: skills.id })
          .from(skills)
          .where(eq(skills.slug, c.skillSlugs[i]))
          .limit(1);

        if (!skill) {
          console.warn(
            `Collection "${c.slug}" references unknown skill "${c.skillSlugs[i]}" — skipping`,
          );
          continue;
        }

        await tx.insert(collectionSkills).values({
          collectionId: collection.id,
          skillId: skill.id,
          position: i,
        });
      }
    }
  });

  console.log(
    `Seeded ${skillsData.length} skills and ${collectionsData.length} collections.`,
  );
  await client.end();
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
