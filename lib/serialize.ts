import type { Skill, SerializedSkill } from '@/db/schema';

export function serializeSkill(skill: Skill): SerializedSkill {
  return {
    ...skill,
    createdAt: skill.createdAt.toISOString(),
    updatedAt: skill.updatedAt.toISOString(),
  };
}
