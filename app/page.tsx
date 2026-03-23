import type { Metadata } from 'next';

import { BrowseByAudience } from '@/components/sections/BrowseByAudience';
import { BrowseByCategory } from '@/components/sections/BrowseByCategory';
import { FeaturedPlugins } from '@/components/sections/FeaturedPlugins';
import { FeaturedSkills } from '@/components/sections/FeaturedSkills';
import { FeaturedStacks } from '@/components/sections/FeaturedStacks';
import { Hero } from '@/components/sections/Hero';
import { RecentlyAdded } from '@/components/sections/RecentlyAdded';
import {
  getAllPluginSlugsAndNames,
  getAllSkillSlugsAndNames,
  getCollectionItemCountsByCollectionId,
  getFeaturedCollections,
  getFeaturedPlugins,
  getFeaturedSkills,
  getPluginSkillCount,
  getRecentSkills,
} from '@/db/queries';
import { serializePlugin, serializeSkill } from '@/lib/serialize';
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

  const [
    allPluginNames,
    allSkillNames,
    featuredPluginsRaw,
    featuredSkillsRaw,
    recentSkills,
    collections,
    itemCountByCollectionId,
  ] = await Promise.all([
    getAllPluginSlugsAndNames(),
    getAllSkillSlugsAndNames(),
    getFeaturedPlugins(6),
    getFeaturedSkills(4),
    getRecentSkills(6),
    getFeaturedCollections(),
    getCollectionItemCountsByCollectionId(),
  ]);

  const featuredPlugins = await Promise.all(
    featuredPluginsRaw.map(async (p) => ({
      ...serializePlugin(p),
      skillCount: await getPluginSkillCount(p.id),
    })),
  );

  const featuredSkills = featuredSkillsRaw.map(serializeSkill);
  const serializedRecent = recentSkills.map(serializeSkill);

  const collectionCards = collections.map((c) => ({
    id: c.id,
    slug: c.slug,
    name: c.name,
    description: c.description,
    trustTier: c.trustTier,
    skillCount: itemCountByCollectionId.get(c.id) ?? 0,
  }));

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'SkillsTube',
    description: PAGE_DESCRIPTION,
    url: baseUrl,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: allPluginNames.length + allSkillNames.length,
      itemListElement: [
        ...allPluginNames.map((plugin, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: plugin.name,
          url: `${baseUrl}/plugins/${plugin.slug}`,
        })),
        ...allSkillNames.map((skill, index) => ({
          '@type': 'ListItem',
          position: allPluginNames.length + index + 1,
          name: skill.name,
          url: `${baseUrl}/skills/${skill.slug}`,
        })),
      ],
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }}
      />

      <Hero />
      <FeaturedPlugins plugins={featuredPlugins} />
      <FeaturedSkills skills={featuredSkills} />
      <FeaturedStacks collections={collectionCards} />
      <BrowseByAudience />
      <BrowseByCategory />
      <RecentlyAdded skills={serializedRecent} />
    </>
  );
}
