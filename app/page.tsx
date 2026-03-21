import type { Metadata } from 'next';

import { BrowseByAudience } from '@/components/sections/BrowseByAudience';
import { BrowseByCategory } from '@/components/sections/BrowseByCategory';
import { FeaturedStacks } from '@/components/sections/FeaturedStacks';
import { Hero } from '@/components/sections/Hero';
import { RecentlyAdded } from '@/components/sections/RecentlyAdded';
import {
  getAllSkillSlugsAndNames,
  getCollectionSkillCountsByCollectionId,
  getFeaturedCollections,
  getRecentSkills,
} from '@/db/queries';
import { serializeSkill } from '@/lib/serialize';
import { getSiteUrl, safeJsonLd } from '@/lib/site-url';

export const revalidate = 60;

const PAGE_DESCRIPTION =
  'Curated skill stacks for Claude Code, Cowork, and beyond. Every skill reviewed for quality and safety.';

export async function generateMetadata(): Promise<Metadata> {
  const metadataBase = new URL(getSiteUrl());

  return {
    metadataBase,
    title: 'Curated skills for Claude Code, Cowork, and beyond',
    description: PAGE_DESCRIPTION,
    openGraph: {
      title: 'SkillsTube — Curated skills for Claude Code & Cowork',
      description: PAGE_DESCRIPTION,
      url: '/',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'SkillsTube — Curated skills for Claude Code & Cowork',
      description: PAGE_DESCRIPTION,
    },
    alternates: {
      canonical: '/',
    },
  };
}

export default async function HomePage() {
  const baseUrl = getSiteUrl();

  const [allSkillNames, recentSkills, collections, skillCountByCollectionId] =
    await Promise.all([
      getAllSkillSlugsAndNames(),
      getRecentSkills(6),
      getFeaturedCollections(),
      getCollectionSkillCountsByCollectionId(),
    ]);

  const serializedRecent = recentSkills.map(serializeSkill);

  const collectionCards = collections.map((c) => ({
    id: c.id,
    slug: c.slug,
    name: c.name,
    description: c.description,
    trustTier: c.trustTier,
    skillCount: skillCountByCollectionId.get(c.id) ?? 0,
  }));

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'SkillsTube',
    description: PAGE_DESCRIPTION,
    url: baseUrl,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: allSkillNames.length,
      itemListElement: allSkillNames.map((skill, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: skill.name,
        url: `${baseUrl}/skills/${skill.slug}`,
      })),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }}
      />

      <Hero />
      <FeaturedStacks collections={collectionCards} />
      <BrowseByAudience />
      <BrowseByCategory />
      <RecentlyAdded skills={serializedRecent} />
    </>
  );
}
