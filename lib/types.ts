export const TRUST_TIERS = [
  'official',
  'verified',
  'community',
  'unreviewed',
  'flagged',
] as const;

export const AUDIENCES = ['developer', 'non-technical', 'both'] as const;

export const PLATFORMS = [
  'claude-code',
  'cowork',
  'cursor',
  'codex',
  'claude-ai',
] as const;

export const CATEGORIES = [
  'development',
  'productivity',
  'security',
  'documents',
  'design',
  'devops',
  'research',
  'automation',
] as const;

export type TrustTier = (typeof TRUST_TIERS)[number];
export type Audience = (typeof AUDIENCES)[number];
export type Platform = (typeof PLATFORMS)[number];
export type Category = (typeof CATEGORIES)[number];

export function isTrustTier(value: string): value is TrustTier {
  return (TRUST_TIERS as readonly string[]).includes(value);
}
export function parseTrustTier(value: string): TrustTier {
  return isTrustTier(value) ? value : 'unreviewed';
}

export function isAudience(value: string): value is Audience {
  return (AUDIENCES as readonly string[]).includes(value);
}

export function isPlatform(value: string): value is Platform {
  return (PLATFORMS as readonly string[]).includes(value);
}

export function isCategory(value: string): value is Category {
  return (CATEGORIES as readonly string[]).includes(value);
}
export function parseCategory(value: string): Category {
  return isCategory(value) ? value : 'development';
}

export const TRUST_TIER_META: Record<
  TrustTier,
  { label: string; description: string; colorClass: string }
> = {
  official: {
    label: 'Official',
    description: 'Published by the platform vendor',
    colorClass: 'bg-trust-official-bg text-trust-official border-trust-official/20',
  },
  verified: {
    label: 'Verified',
    description: 'From a known, trusted creator',
    colorClass: 'bg-trust-verified-bg text-trust-verified border-trust-verified/20',
  },
  community: {
    label: 'Community',
    description: 'Meets our quality bar',
    colorClass: 'bg-trust-community-bg text-trust-community border-trust-community/20',
  },
  unreviewed: {
    label: 'Unreviewed',
    description: 'Not yet reviewed by our team',
    colorClass: 'bg-trust-unreviewed-bg text-trust-unreviewed border-trust-unreviewed/20',
  },
  flagged: {
    label: 'Flagged',
    description: 'Potential safety concerns identified',
    colorClass: 'bg-trust-flagged-bg text-trust-flagged border-trust-flagged/20',
  },
};

export const PLATFORM_LABELS: Record<Platform, string> = {
  'claude-code': 'Claude Code',
  cowork: 'Cowork',
  cursor: 'Cursor',
  codex: 'Codex',
  'claude-ai': 'Claude.ai',
};

export const AUDIENCE_LABELS: Record<Audience, string> = {
  developer: 'Developers',
  'non-technical': 'Non-Technical',
  both: 'Everyone',
};

export const CATEGORY_LABELS: Record<Category, string> = {
  development: 'Development',
  productivity: 'Productivity',
  security: 'Security',
  documents: 'Documents',
  design: 'Design',
  devops: 'DevOps',
  research: 'Research',
  automation: 'Automation',
};

export const ENTITY_TYPES = ['plugin', 'skill'] as const;
export type EntityType = (typeof ENTITY_TYPES)[number];

export const ENTITY_TYPE_LABELS: Record<EntityType, string> = {
  plugin: 'Plugin',
  skill: 'Skill',
};
