import { count, eq, desc, sql, type AnyColumn } from 'drizzle-orm';
import { db } from './index';
import { skills, collections, collectionSkills } from './schema';

export function increment(column: AnyColumn, value = 1) {
  return sql`${column} + ${value}`;
}

export async function getAllSkills() {
  return db.select().from(skills).orderBy(desc(skills.upvoteCount));
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

export async function getRecentSkills(limit = 6) {
  return db
    .select()
    .from(skills)
    .orderBy(desc(skills.createdAt))
    .limit(limit);
}

export async function getFeaturedCollections() {
  return db.select().from(collections).orderBy(collections.name);
}

/** Map of collection id → number of skills in that collection. */
export async function getCollectionSkillCountsByCollectionId() {
  const rows = await db
    .select({
      collectionId: collectionSkills.collectionId,
      count: count(),
    })
    .from(collectionSkills)
    .groupBy(collectionSkills.collectionId);
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

export async function getCollectionSkills(collectionId: number) {
  return db
    .select({
      skill: skills,
      position: collectionSkills.position,
    })
    .from(collectionSkills)
    .innerJoin(skills, eq(collectionSkills.skillId, skills.id))
    .where(eq(collectionSkills.collectionId, collectionId))
    .orderBy(collectionSkills.position);
}

export async function getSkillCollections(skillId: number) {
  return db
    .select({
      collection: collections,
    })
    .from(collectionSkills)
    .innerJoin(
      collections,
      eq(collectionSkills.collectionId, collections.id),
    )
    .where(eq(collectionSkills.skillId, skillId));
}
