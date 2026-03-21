import {
  pgTable,
  serial,
  text,
  integer,
  jsonb,
  timestamp,
  primaryKey,
  uniqueIndex,
  check,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import type { Platform } from '@/lib/types';

export const skills = pgTable(
  'skills',
  {
    id: serial('id').primaryKey(),
    slug: text('slug').notNull().unique(),
    name: text('name').notNull(),
    author: text('author').notNull(),
    authorUrl: text('author_url'),
    description: text('description').notNull(),
    summary: text('summary'),
    trustTier: text('trust_tier').notNull(),
    audience: text('audience').notNull(),
    category: text('category').notNull(),
    riskLevel: text('risk_level'),
    safetySummary: text('safety_summary'),
    githubUrl: text('github_url'),
    stars: integer('stars'),
    forks: integer('forks'),
    lastUpdated: text('last_updated'),
    license: text('license'),
    worksWith: jsonb('works_with').$type<Platform[]>().notNull().default([]),
    installInstructions: jsonb('install_instructions')
      .$type<Record<string, string>>()
      .notNull()
      .default({}),
    tags: jsonb('tags').$type<string[]>().notNull().default([]),
    bestFor: text('best_for'),
    skillMdContent: text('skill_md_content'),
    upvoteCount: integer('upvote_count').notNull().default(0),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => [
    check(
      'valid_trust_tier',
      sql`${table.trustTier} IN ('official', 'verified', 'community', 'unreviewed', 'flagged')`,
    ),
    check(
      'valid_audience',
      sql`${table.audience} IN ('developer', 'non-technical', 'both')`,
    ),
    check(
      'valid_risk_level',
      sql`${table.riskLevel} IS NULL OR ${table.riskLevel} IN ('low', 'medium', 'high')`,
    ),
    check('valid_slug', sql`${table.slug} ~ '^[a-z0-9]+(-[a-z0-9]+)*$'`),
    check(
      'valid_works_with',
      sql`jsonb_typeof(${table.worksWith}) = 'array'`,
    ),
    check(
      'valid_tags',
      sql`jsonb_typeof(${table.tags}) = 'array'`,
    ),
    check(
      'valid_install_instructions',
      sql`jsonb_typeof(${table.installInstructions}) = 'object'`,
    ),
    check(
      'upvote_count_non_negative',
      sql`${table.upvoteCount} >= 0`,
    ),
  ],
);

export const collections = pgTable(
  'collections',
  {
    id: serial('id').primaryKey(),
    slug: text('slug').notNull().unique(),
    name: text('name').notNull(),
    author: text('author').notNull(),
    authorUrl: text('author_url'),
    description: text('description').notNull(),
    editorialContent: text('editorial_content').notNull(),
    trustTier: text('trust_tier').notNull(),
    installAllInstructions: text('install_all_instructions'),
    imageUrl: text('image_url'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => [
    check(
      'valid_collection_trust_tier',
      sql`${table.trustTier} IN ('official', 'verified', 'community', 'unreviewed', 'flagged')`,
    ),
    check(
      'valid_collection_slug',
      sql`${table.slug} ~ '^[a-z0-9]+(-[a-z0-9]+)*$'`,
    ),
  ],
);

export const collectionSkills = pgTable(
  'collection_skills',
  {
    collectionId: integer('collection_id')
      .notNull()
      .references(() => collections.id, { onDelete: 'cascade' }),
    skillId: integer('skill_id')
      .notNull()
      .references(() => skills.id, { onDelete: 'cascade' }),
    position: integer('position').notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.collectionId, table.skillId] }),
    uniqueIndex('collection_position_idx').on(
      table.collectionId,
      table.position,
    ),
  ],
);

export type Skill = typeof skills.$inferSelect;
export type NewSkill = typeof skills.$inferInsert;
export type SkillSeed = Omit<
  NewSkill,
  'id' | 'createdAt' | 'updatedAt' | 'upvoteCount'
>;

export type Collection = typeof collections.$inferSelect;
export type NewCollection = typeof collections.$inferInsert;
export type CollectionSeed = Omit<
  NewCollection,
  'id' | 'createdAt' | 'updatedAt'
>;

export type SerializedSkill = Omit<Skill, 'createdAt' | 'updatedAt'> & {
  createdAt: string;
  updatedAt: string;
};
