import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { eq, notInArray, sql } from 'drizzle-orm';
import { plugins, skills, collections, collectionItems } from '../db/schema';
import { pluginsData } from '../content/plugins';
import { skillsData } from '../content/skills';
import { collectionsData } from '../content/collections';
import { z } from 'zod';
import { TRUST_TIERS, AUDIENCES, PLATFORMS, CATEGORIES } from '../lib/types';

const pluginSchema = z.object({
  slug: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/),
  name: z.string().min(1),
  author: z.string().min(1),
  authorUrl: z.string().url().nullable().optional(),
  description: z.string().min(1),
  summary: z.string().nullable().optional(),
  trustTier: z.enum(TRUST_TIERS),
  audience: z.enum(AUDIENCES),
  category: z.enum(CATEGORIES),
  githubUrl: z.string().url().nullable().optional(),
  stars: z.number().int().nullable().optional(),
  forks: z.number().int().nullable().optional(),
  lastUpdated: z.string().nullable().optional(),
  license: z.string().nullable().optional(),
  worksWith: z.array(z.enum(PLATFORMS)),
  installInstructions: z.record(z.string(), z.string()),
  tags: z.array(z.string()),
  bestFor: z.string().nullable().optional(),
  featured: z.number().int().min(0).max(1).optional(),
});

const skillSchema = z.object({
  slug: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/),
  pluginSlug: z.string().optional(),
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
  featured: z.number().int().min(0).max(1).optional(),
  position: z.number().int().nullable().optional(),
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
  items: z.array(
    z.object({
      type: z.enum(['plugin', 'skill']),
      slug: z.string(),
    }),
  ),
});

const MAX_SKILL_MD_SIZE = 50_000;

async function seed() {
  const client = postgres(process.env.DATABASE_URL!, { max: 1 });
  const db = drizzle(client);

  console.log('Validating plugin data...');
  for (const p of pluginsData) {
    const result = pluginSchema.safeParse(p);
    if (!result.success) {
      console.error(`Invalid plugin "${p.slug}":`, result.error.format());
      process.exit(1);
    }
  }

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
      console.error(`Invalid collection "${c.slug}":`, result.error.format());
      process.exit(1);
    }
  }

  console.log('Seeding database...');

  await db.transaction(async (tx) => {
    const pluginSlugs = pluginsData.map((p) => p.slug);
    const skillSlugs = skillsData.map((s) => s.slug);
    const collectionSlugs = collectionsData.map((c) => c.slug);

    // Phase A: Upsert plugins (must come before skills due to FK)
    for (const p of pluginsData) {
      await tx
        .insert(plugins)
        .values({
          slug: p.slug,
          name: p.name,
          author: p.author,
          authorUrl: p.authorUrl ?? null,
          description: p.description,
          summary: p.summary ?? null,
          trustTier: p.trustTier,
          audience: p.audience,
          category: p.category,
          githubUrl: p.githubUrl ?? null,
          stars: p.stars ?? null,
          forks: p.forks ?? null,
          lastUpdated: p.lastUpdated ?? null,
          license: p.license ?? null,
          worksWith: p.worksWith,
          installInstructions: p.installInstructions,
          tags: p.tags,
          bestFor: p.bestFor ?? null,
          featured: p.featured ?? 0,
        })
        .onConflictDoUpdate({
          target: plugins.slug,
          set: {
            name: sql`EXCLUDED.name`,
            author: sql`EXCLUDED.author`,
            authorUrl: sql`EXCLUDED.author_url`,
            description: sql`EXCLUDED.description`,
            summary: sql`EXCLUDED.summary`,
            trustTier: sql`EXCLUDED.trust_tier`,
            audience: sql`EXCLUDED.audience`,
            category: sql`EXCLUDED.category`,
            githubUrl: sql`EXCLUDED.github_url`,
            stars: sql`EXCLUDED.stars`,
            forks: sql`EXCLUDED.forks`,
            lastUpdated: sql`EXCLUDED.last_updated`,
            license: sql`EXCLUDED.license`,
            worksWith: sql`EXCLUDED.works_with`,
            installInstructions: sql`EXCLUDED.install_instructions`,
            tags: sql`EXCLUDED.tags`,
            bestFor: sql`EXCLUDED.best_for`,
            featured: sql`EXCLUDED.featured`,
            updatedAt: sql`now()`,
          },
        });
    }

    if (pluginSlugs.length > 0) {
      await tx
        .delete(plugins)
        .where(notInArray(plugins.slug, pluginSlugs));
    }

    // Build plugin slug → id map for FK resolution
    const pluginRows = await tx
      .select({ id: plugins.id, slug: plugins.slug })
      .from(plugins);
    const pluginIdBySlug = new Map(pluginRows.map((r) => [r.slug, r.id]));

    // Phase B: Upsert skills (standalone first, then children with FK)
    for (const s of skillsData) {
      let pluginId: number | null = null;
      if (s.pluginSlug) {
        pluginId = pluginIdBySlug.get(s.pluginSlug) ?? null;
        if (!pluginId) {
          console.warn(
            `Skill "${s.slug}" references unknown plugin "${s.pluginSlug}" — inserting as standalone`,
          );
        }
      }

      const content =
        s.skillMdContent && s.skillMdContent.length > MAX_SKILL_MD_SIZE
          ? s.skillMdContent.slice(0, MAX_SKILL_MD_SIZE) +
            '\n\n---\n*Content truncated.*'
          : s.skillMdContent;

      await tx
        .insert(skills)
        .values({
          slug: s.slug,
          pluginId,
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
          featured: s.featured ?? 0,
          position: s.position ?? null,
        })
        .onConflictDoUpdate({
          target: skills.slug,
          set: {
            pluginId: sql`EXCLUDED.plugin_id`,
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
            featured: sql`EXCLUDED.featured`,
            position: sql`EXCLUDED.position`,
            updatedAt: sql`now()`,
          },
        });
    }

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

    if (collectionSlugs.length > 0) {
      await tx
        .delete(collections)
        .where(notInArray(collections.slug, collectionSlugs));
    }

    // Phase C: Rebuild collection_items from content refs
    await tx.delete(collectionItems);

    // Build skill slug → id map for FK resolution
    const skillRows = await tx
      .select({ id: skills.id, slug: skills.slug })
      .from(skills);
    const skillIdBySlug = new Map(skillRows.map((r) => [r.slug, r.id]));

    for (const c of collectionsData) {
      const [collection] = await tx
        .select({ id: collections.id })
        .from(collections)
        .where(eq(collections.slug, c.slug))
        .limit(1);

      if (!collection) continue;

      for (let i = 0; i < c.items.length; i++) {
        const item = c.items[i];

        if (item.type === 'plugin') {
          const pid = pluginIdBySlug.get(item.slug);
          if (!pid) {
            console.warn(
              `Collection "${c.slug}" references unknown plugin "${item.slug}" — skipping`,
            );
            continue;
          }
          await tx.insert(collectionItems).values({
            collectionId: collection.id,
            pluginId: pid,
            skillId: null,
            position: i,
          });
        } else {
          const sid = skillIdBySlug.get(item.slug);
          if (!sid) {
            console.warn(
              `Collection "${c.slug}" references unknown skill "${item.slug}" — skipping`,
            );
            continue;
          }
          await tx.insert(collectionItems).values({
            collectionId: collection.id,
            pluginId: null,
            skillId: sid,
            position: i,
          });
        }
      }
    }
  });

  console.log(
    `Seeded ${pluginsData.length} plugins, ${skillsData.length} skills, and ${collectionsData.length} collections.`,
  );
  await client.end();
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
