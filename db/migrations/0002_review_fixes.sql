-- Migration: Code review fixes
-- 1. Add index on skills.plugin_id (FK columns are not auto-indexed in PostgreSQL)
-- 2. Change skills.plugin_id from ON DELETE CASCADE to ON DELETE SET NULL

-- 1. Index for plugin_id lookups (used by getPluginSkills, getPluginSkillCount, subqueries)
CREATE INDEX IF NOT EXISTS idx_skills_plugin_id ON skills (plugin_id);

-- 2. Change cascade behavior: deleting a plugin should orphan skills, not destroy them
ALTER TABLE skills DROP CONSTRAINT IF EXISTS skills_plugin_id_plugins_id_fk;
ALTER TABLE skills
  ADD CONSTRAINT skills_plugin_id_plugins_id_fk
  FOREIGN KEY (plugin_id) REFERENCES plugins(id) ON DELETE SET NULL;
