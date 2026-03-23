import type { Metadata } from 'next';

import { SkillBrowser } from '@/components/sections/SkillBrowser';
import { getAllPluginCards, getAllSkillCards } from '@/db/queries';
import { serializePlugin } from '@/lib/serialize';

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Browse Plugins & Skills',
    description:
      'Browse and search curated plugins and skills for Claude Code, Cowork, and more.',
  };
}

export default async function BrowsePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const typeFilter = typeof params.type === 'string' ? params.type : null;

  const [pluginRows, skillRows] = await Promise.all([
    typeFilter !== 'skill' ? getAllPluginCards() : Promise.resolve([]),
    typeFilter !== 'plugin' ? getAllSkillCards() : Promise.resolve([]),
  ]);

  const serializedPlugins = pluginRows.map((p) => ({
    ...serializePlugin(p),
    skillCount: Number(p.skillCount ?? 0),
  }));

  const serializedSkills = skillRows.map((s) => ({
    ...s,
    createdAt: s.createdAt.toISOString(),
    updatedAt: s.updatedAt.toISOString(),
  }));

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <h1 className="mb-8 text-3xl font-bold tracking-tight">Browse Plugins & Skills</h1>
      <SkillBrowser plugins={serializedPlugins} skills={serializedSkills} />
    </div>
  );
}
