import { count, eq, desc, isNull, sql } from 'drizzle-orm';
import { db } from './index';
import { plugins, skills, collections, collectionItems } from './schema';

// ─── Plugin queries ──────────────────────────────────────────────────────────

export async function getAllPlugins() {
  return db.select().from(plugins).orderBy(desc(plugins.upvoteCount));
}

export async function getAllPluginCards() {
  const rows = await db
    .select({
      id: plugins.id,
      slug: plugins.slug,
      name: plugins.name,
      author: plugins.author,
      authorUrl: plugins.authorUrl,
      description: plugins.description,
      summary: plugins.summary,
      trustTier: plugins.trustTier,
      audience: plugins.audience,
      category: plugins.category,
      worksWith: plugins.worksWith,
      tags: plugins.tags,
      stars: plugins.stars,
      upvoteCount: plugins.upvoteCount,
      bestFor: plugins.bestFor,
      featured: plugins.featured,
      createdAt: plugins.createdAt,
      updatedAt: plugins.updatedAt,
      skillCount: sql<number>`(
        SELECT COUNT(*) FROM skills WHERE skills.plugin_id = ${plugins.id}
      )`.as('skill_count'),
    })
    .from(plugins)
    .orderBy(desc(plugins.upvoteCount));
  return rows;
}

export async function getPluginBySlug(slug: string) {
  const [plugin] = await db
    .select()
    .from(plugins)
    .where(eq(plugins.slug, slug))
    .limit(1);
  return plugin ?? null;
}

export async function getPluginSkills(pluginId: number) {
  return db
    .select()
    .from(skills)
    .where(eq(skills.pluginId, pluginId))
    .orderBy(skills.position);
}

export async function getAllPluginSlugs() {
  return db.select({ slug: plugins.slug }).from(plugins);
}

export async function getAllPluginSlugsAndNames() {
  return db
    .select({ slug: plugins.slug, name: plugins.name })
    .from(plugins);
}

export async function getFeaturedPlugins(limit = 6) {
  return db
    .select()
    .from(plugins)
    .where(eq(plugins.featured, 1))
    .orderBy(desc(plugins.upvoteCount))
    .limit(limit);
}

export async function getPluginSkillCount(pluginId: number) {
  const [row] = await db
    .select({ count: count() })
    .from(skills)
    .where(eq(skills.pluginId, pluginId));
  return Number(row?.count ?? 0);
}

// ─── Skill queries ───────────────────────────────────────────────────────────

export async function getAllSkills() {
  return db.select().from(skills).orderBy(desc(skills.upvoteCount));
}

export async function getAllSkillCards() {
  return db
    .select({
      id: skills.id,
      slug: skills.slug,
      pluginId: skills.pluginId,
      name: skills.name,
      author: skills.author,
      authorUrl: skills.authorUrl,
      description: skills.description,
      summary: skills.summary,
      trustTier: skills.trustTier,
      audience: skills.audience,
      category: skills.category,
      riskLevel: skills.riskLevel,
      worksWith: skills.worksWith,
      tags: skills.tags,
      stars: skills.stars,
      upvoteCount: skills.upvoteCount,
      bestFor: skills.bestFor,
      featured: skills.featured,
      createdAt: skills.createdAt,
      updatedAt: skills.updatedAt,
    })
    .from(skills)
    .orderBy(desc(skills.upvoteCount));
}

export async function getStandaloneSkillCards() {
  return db
    .select({
      id: skills.id,
      slug: skills.slug,
      pluginId: skills.pluginId,
      name: skills.name,
      author: skills.author,
      authorUrl: skills.authorUrl,
      description: skills.description,
      summary: skills.summary,
      trustTier: skills.trustTier,
      audience: skills.audience,
      category: skills.category,
      riskLevel: skills.riskLevel,
      worksWith: skills.worksWith,
      tags: skills.tags,
      stars: skills.stars,
      upvoteCount: skills.upvoteCount,
      bestFor: skills.bestFor,
      featured: skills.featured,
      createdAt: skills.createdAt,
      updatedAt: skills.updatedAt,
    })
    .from(skills)
    .where(isNull(skills.pluginId))
    .orderBy(desc(skills.upvoteCount));
}

export async function getSkillBySlug(slug: string) {
  const [skill] = await db
    .select()
    .from(skills)
    .where(eq(skills.slug, slug))
    .limit(1);
  return skill ?? null;
}

export async function getAllSkillSlugs() {
  return db.select({ slug: skills.slug }).from(skills);
}

export async function getAllSkillSlugsAndNames() {
  return db
    .select({ slug: skills.slug, name: skills.name })
    .from(skills);
}

export async function getRecentSkills(limit = 6) {
  return db
    .select()
    .from(skills)
    .orderBy(desc(skills.createdAt))
    .limit(limit);
}

export async function getFeaturedSkills(limit = 6) {
  return db
    .select()
    .from(skills)
    .where(eq(skills.featured, 1))
    .orderBy(desc(skills.upvoteCount))
    .limit(limit);
}

// ─── Collection queries ──────────────────────────────────────────────────────

export async function getFeaturedCollections() {
  return db.select().from(collections).orderBy(collections.name);
}

export async function getCollectionItemCountsByCollectionId() {
  const rows = await db
    .select({
      collectionId: collectionItems.collectionId,
      count: count(),
    })
    .from(collectionItems)
    .groupBy(collectionItems.collectionId);
  return new Map(rows.map((r) => [r.collectionId, Number(r.count)]));
}

export async function getCollectionBySlug(slug: string) {
  const [collection] = await db
    .select()
    .from(collections)
    .where(eq(collections.slug, slug))
    .limit(1);
  return collection ?? null;
}

export async function getAllCollectionSlugs() {
  return db.select({ slug: collections.slug }).from(collections);
}

export async function getCollectionItems(collectionId: number) {
  const rows = await db
    .select({
      pluginId: collectionItems.pluginId,
      skillId: collectionItems.skillId,
      position: collectionItems.position,
    })
    .from(collectionItems)
    .where(eq(collectionItems.collectionId, collectionId))
    .orderBy(collectionItems.position);

  const result: Array<
    | { type: 'plugin'; plugin: typeof plugins.$inferSelect; position: number }
    | { type: 'skill'; skill: typeof skills.$inferSelect; position: number }
  > = [];

  for (const row of rows) {
    if (row.pluginId) {
      const [plugin] = await db
        .select()
        .from(plugins)
        .where(eq(plugins.id, row.pluginId))
        .limit(1);
      if (plugin) result.push({ type: 'plugin', plugin, position: row.position });
    } else if (row.skillId) {
      const [skill] = await db
        .select()
        .from(skills)
        .where(eq(skills.id, row.skillId))
        .limit(1);
      if (skill) result.push({ type: 'skill', skill, position: row.position });
    }
  }

  return result;
}

export async function getSkillCollections(skillId: number) {
  return db
    .select({ collection: collections })
    .from(collectionItems)
    .innerJoin(collections, eq(collectionItems.collectionId, collections.id))
    .where(eq(collectionItems.skillId, skillId));
}

export async function getPluginCollections(pluginId: number) {
  return db
    .select({ collection: collections })
    .from(collectionItems)
    .innerJoin(collections, eq(collectionItems.collectionId, collections.id))
    .where(eq(collectionItems.pluginId, pluginId));
}
