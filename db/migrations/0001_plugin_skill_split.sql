-- Migration: Plugin-Skill entity split
-- Creates plugins table, adds plugin_id FK to skills, replaces collection_skills with collection_items

-- 1. Create plugins table
CREATE TABLE IF NOT EXISTS "plugins" (
  "id" serial PRIMARY KEY NOT NULL,
  "slug" text NOT NULL UNIQUE,
  "name" text NOT NULL,
  "author" text NOT NULL,
  "author_url" text,
  "description" text NOT NULL,
  "summary" text,
  "trust_tier" text NOT NULL,
  "audience" text NOT NULL,
  "category" text NOT NULL,
  "github_url" text,
  "stars" integer,
  "forks" integer,
  "last_updated" text,
  "license" text,
  "works_with" jsonb DEFAULT '[]'::jsonb NOT NULL,
  "install_instructions" jsonb DEFAULT '{}'::jsonb NOT NULL,
  "tags" jsonb DEFAULT '[]'::jsonb NOT NULL,
  "best_for" text,
  "featured" integer DEFAULT 0 NOT NULL,
  "upvote_count" integer DEFAULT 0 NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL,
  CONSTRAINT "valid_plugin_trust_tier" CHECK ("trust_tier" IN ('official', 'verified', 'community', 'unreviewed', 'flagged')),
  CONSTRAINT "valid_plugin_audience" CHECK ("audience" IN ('developer', 'non-technical', 'both')),
  CONSTRAINT "valid_plugin_slug" CHECK ("slug" ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  CONSTRAINT "valid_plugin_works_with" CHECK (jsonb_typeof("works_with") = 'array'),
  CONSTRAINT "valid_plugin_tags" CHECK (jsonb_typeof("tags") = 'array'),
  CONSTRAINT "valid_plugin_install_instructions" CHECK (jsonb_typeof("install_instructions") = 'object'),
  CONSTRAINT "plugin_upvote_count_non_negative" CHECK ("upvote_count" >= 0)
);

-- 2. Add new columns to skills table
ALTER TABLE "skills" ADD COLUMN IF NOT EXISTS "plugin_id" integer REFERENCES "plugins"("id") ON DELETE CASCADE;
ALTER TABLE "skills" ADD COLUMN IF NOT EXISTS "featured" integer DEFAULT 0 NOT NULL;
ALTER TABLE "skills" ADD COLUMN IF NOT EXISTS "position" integer;

-- 3. Drop old collection_skills table
DROP TABLE IF EXISTS "collection_skills";

-- 4. Create new collection_items table
CREATE TABLE IF NOT EXISTS "collection_items" (
  "collection_id" integer NOT NULL REFERENCES "collections"("id") ON DELETE CASCADE,
  "plugin_id" integer REFERENCES "plugins"("id") ON DELETE CASCADE,
  "skill_id" integer REFERENCES "skills"("id") ON DELETE CASCADE,
  "position" integer NOT NULL,
  CONSTRAINT "collection_items_pkey" PRIMARY KEY ("collection_id", "position"),
  CONSTRAINT "exactly_one_entity" CHECK (
    ("plugin_id" IS NOT NULL AND "skill_id" IS NULL)
    OR ("plugin_id" IS NULL AND "skill_id" IS NOT NULL)
  )
);
