import {
  pgTable,
  serial,
  text,
  integer,
  jsonb,
  timestamp,
  primaryKey,
  check,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import type { Platform } from '@/lib/types';

export const plugins = pgTable(
  'plugins',
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
    featured: integer('featured').notNull().default(0),
    upvoteCount: integer('upvote_count').notNull().default(0),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => [
    check(
      'valid_plugin_trust_tier',
      sql`${table.trustTier} IN ('official', 'verified', 'community', 'unreviewed', 'flagged')`,
    ),
    check(
      'valid_plugin_audience',
      sql`${table.audience} IN ('developer', 'non-technical', 'both')`,
    ),
    check(
      'valid_plugin_slug',
      sql`${table.slug} ~ '^[a-z0-9]+(-[a-z0-9]+)*$'`,
    ),
    check(
      'valid_plugin_works_with',
      sql`jsonb_typeof(${table.worksWith}) = 'array'`,
    ),
    check(
      'valid_plugin_tags',
      sql`jsonb_typeof(${table.tags}) = 'array'`,
    ),
    check(
      'valid_plugin_install_instructions',
      sql`jsonb_typeof(${table.installInstructions}) = 'object'`,
    ),
    check(
      'plugin_upvote_count_non_negative',
      sql`${table.upvoteCount} >= 0`,
    ),
  ],
);

export const skills = pgTable(
  'skills',
  {
    id: serial('id').primaryKey(),
    slug: text('slug').notNull().unique(),
    pluginId: integer('plugin_id').references(() => plugins.id, {
      onDelete: 'cascade',
    }),
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
    featured: integer('featured').notNull().default(0),
    position: integer('position'),
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

export const collectionItems = pgTable(
  'collection_items',
  {
    collectionId: integer('collection_id')
      .notNull()
      .references(() => collections.id, { onDelete: 'cascade' }),
    pluginId: integer('plugin_id').references(() => plugins.id, {
      onDelete: 'cascade',
    }),
    skillId: integer('skill_id').references(() => skills.id, {
      onDelete: 'cascade',
    }),
    position: integer('position').notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.collectionId, table.position] }),
    check(
      'exactly_one_entity',
      sql`(${table.pluginId} IS NOT NULL AND ${table.skillId} IS NULL)
       OR (${table.pluginId} IS NULL AND ${table.skillId} IS NOT NULL)`,
    ),
  ],
);

// Plugin types
export type Plugin = typeof plugins.$inferSelect;
export type NewPlugin = typeof plugins.$inferInsert;
export type PluginSeed = Omit<
  NewPlugin,
  'id' | 'createdAt' | 'updatedAt' | 'upvoteCount'
>;

export type SerializedPlugin = Omit<Plugin, 'createdAt' | 'updatedAt'> & {
  createdAt: string;
  updatedAt: string;
};

// Skill types
export type Skill = typeof skills.$inferSelect;
export type NewSkill = typeof skills.$inferInsert;
export type SkillSeed = Omit<
  NewSkill,
  'id' | 'createdAt' | 'updatedAt' | 'upvoteCount'
>;

export type SerializedSkill = Omit<Skill, 'createdAt' | 'updatedAt'> & {
  createdAt: string;
  updatedAt: string;
};

// Collection types
export type Collection = typeof collections.$inferSelect;
export type NewCollection = typeof collections.$inferInsert;
export type CollectionSeed = Omit<
  NewCollection,
  'id' | 'createdAt' | 'updatedAt'
>;
