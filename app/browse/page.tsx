import { Suspense } from 'react';
import type { Metadata } from 'next';

import { SkillBrowser } from '@/components/sections/SkillBrowser';
import { getAllSkills } from '@/db/queries';
import { serializeSkill } from '@/lib/serialize';

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Browse Skills',
    description:
      'Browse and search curated skills for Claude Code, Cowork, and more.',
  };
}

export default async function BrowsePage() {
  const skills = await getAllSkills();
  const serialized = skills.map(serializeSkill);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <h1 className="mb-8 text-3xl font-bold tracking-tight">Browse Skills</h1>
      <Suspense
        fallback={<div className="text-muted-foreground">Loading...</div>}
      >
        <SkillBrowser skills={serialized} />
      </Suspense>
    </div>
  );
}
