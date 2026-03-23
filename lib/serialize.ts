import type { Skill, SerializedSkill, Plugin, SerializedPlugin } from '@/db/schema';

export function serializeSkill(skill: Skill): SerializedSkill {
  return {
    ...skill,
    createdAt: skill.createdAt.toISOString(),
    updatedAt: skill.updatedAt.toISOString(),
  };
}

export function serializePlugin(plugin: Plugin): SerializedPlugin {
  return {
    ...plugin,
    createdAt: plugin.createdAt.toISOString(),
    updatedAt: plugin.updatedAt.toISOString(),
  };
}
