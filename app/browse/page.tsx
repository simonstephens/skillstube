import { Suspense } from 'react';
import type { Metadata } from 'next';

import { SkillBrowser } from '@/components/sections/SkillBrowser';
import { getAllPluginCards, getAllSkillCards } from '@/db/queries';
import type { SerializedPlugin, SerializedSkill } from '@/db/schema';

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Browse Plugins & Skills',
    description:
      'Browse and search curated plugins and skills for Claude Code, Cowork, and more.',
  };
}

export default async function BrowsePage() {
  const [pluginRows, skillRows] = await Promise.all([
    getAllPluginCards(),
    getAllSkillCards(),
  ]);

  const serializedPlugins = pluginRows.map((p) => ({
    ...p,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  })) as Array<SerializedPlugin & { skillCount: number }>;

  const serializedSkills = skillRows.map((s) => ({
    ...s,
    createdAt: s.createdAt.toISOString(),
    updatedAt: s.updatedAt.toISOString(),
  })) as SerializedSkill[];

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <h1 className="mb-8 text-3xl font-bold tracking-tight">Browse Plugins & Skills</h1>
      <Suspense
        fallback={<div className="text-muted-foreground">Loading...</div>}
      >
        <SkillBrowser plugins={serializedPlugins} skills={serializedSkills} />
      </Suspense>
    </div>
  );
}
