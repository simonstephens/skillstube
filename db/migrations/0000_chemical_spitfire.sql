CREATE TABLE "collection_skills" (
	"collection_id" integer NOT NULL,
	"skill_id" integer NOT NULL,
	"position" integer NOT NULL,
	CONSTRAINT "collection_skills_collection_id_skill_id_pk" PRIMARY KEY("collection_id","skill_id")
);
--> statement-breakpoint
CREATE TABLE "collections" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"author" text NOT NULL,
	"author_url" text,
	"description" text NOT NULL,
	"editorial_content" text NOT NULL,
	"trust_tier" text NOT NULL,
	"install_all_instructions" text,
	"image_url" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "collections_slug_unique" UNIQUE("slug"),
	CONSTRAINT "valid_collection_trust_tier" CHECK ("collections"."trust_tier" IN ('official', 'verified', 'community', 'unreviewed', 'flagged')),
	CONSTRAINT "valid_collection_slug" CHECK ("collections"."slug" ~ '^[a-z0-9]+(-[a-z0-9]+)*$')
);
--> statement-breakpoint
CREATE TABLE "skills" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"author" text NOT NULL,
	"author_url" text,
	"description" text NOT NULL,
	"summary" text,
	"trust_tier" text NOT NULL,
	"audience" text NOT NULL,
	"category" text NOT NULL,
	"risk_level" text,
	"safety_summary" text,
	"github_url" text,
	"stars" integer,
	"forks" integer,
	"last_updated" text,
	"license" text,
	"works_with" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"install_instructions" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"tags" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"best_for" text,
	"skill_md_content" text,
	"upvote_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "skills_slug_unique" UNIQUE("slug"),
	CONSTRAINT "valid_trust_tier" CHECK ("skills"."trust_tier" IN ('official', 'verified', 'community', 'unreviewed', 'flagged')),
	CONSTRAINT "valid_audience" CHECK ("skills"."audience" IN ('developer', 'non-technical', 'both')),
	CONSTRAINT "valid_risk_level" CHECK ("skills"."risk_level" IS NULL OR "skills"."risk_level" IN ('low', 'medium', 'high')),
	CONSTRAINT "valid_slug" CHECK ("skills"."slug" ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
	CONSTRAINT "valid_works_with" CHECK (jsonb_typeof("skills"."works_with") = 'array'),
	CONSTRAINT "valid_tags" CHECK (jsonb_typeof("skills"."tags") = 'array'),
	CONSTRAINT "valid_install_instructions" CHECK (jsonb_typeof("skills"."install_instructions") = 'object'),
	CONSTRAINT "upvote_count_non_negative" CHECK ("skills"."upvote_count" >= 0)
);
--> statement-breakpoint
ALTER TABLE "collection_skills" ADD CONSTRAINT "collection_skills_collection_id_collections_id_fk" FOREIGN KEY ("collection_id") REFERENCES "public"."collections"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "collection_skills" ADD CONSTRAINT "collection_skills_skill_id_skills_id_fk" FOREIGN KEY ("skill_id") REFERENCES "public"."skills"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "collection_position_idx" ON "collection_skills" USING btree ("collection_id","position");