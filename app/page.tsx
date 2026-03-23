import type { Metadata } from 'next';

import { CollectionsRow } from '@/components/sections/CollectionsRow';
import { FeaturedPicks } from '@/components/sections/FeaturedPicks';
import { Hero } from '@/components/sections/Hero';
import { JustAdded } from '@/components/sections/JustAdded';
import {
  getAllPluginSlugsAndNames,
  getAllSkillSlugsAndNames,
  getCollectionItemCountsByCollectionId,
  getFeaturedCollections,
  getFeaturedPluginCards,
  getFeaturedSkills,
  getRecentPluginCards,
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

  const [
    allPluginNames,
    allSkillNames,
    featuredPluginRows,
    featuredSkillsRaw,
    recentPluginRows,
    recentSkillsRaw,
    collections,
    itemCountByCollectionId,
  ] = await Promise.all([
    getAllPluginSlugsAndNames(),
    getAllSkillSlugsAndNames(),
    getFeaturedPluginCards(5),
    getFeaturedSkills(5),
    getRecentPluginCards(4),
    getRecentSkills(4),
    getFeaturedCollections(),
    getCollectionItemCountsByCollectionId(),
  ]);

  const featuredItems = [
    ...featuredPluginRows.map((p) => ({
      type: 'plugin' as const,
      data: {
        ...p,
        createdAt: p.createdAt.toISOString(),
        updatedAt: p.updatedAt.toISOString(),
      },
    })),
    ...featuredSkillsRaw.map((s) => ({
      type: 'skill' as const,
      data: serializeSkill(s),
    })),
  ]
    .sort((a, b) => b.data.upvoteCount - a.data.upvoteCount)
    .slice(0, 8);

  const recentItems = [
    ...recentPluginRows.map((p) => ({
      type: 'plugin' as const,
      data: {
        ...p,
        createdAt: p.createdAt.toISOString(),
        updatedAt: p.updatedAt.toISOString(),
      },
    })),
    ...recentSkillsRaw.map((s) => ({
      type: 'skill' as const,
      data: serializeSkill(s),
    })),
  ]
    .sort((a, b) => new Date(b.data.createdAt).getTime() - new Date(a.data.createdAt).getTime())
    .slice(0, 4);

  const collectionCards = collections.map((c) => ({
    id: c.id,
    slug: c.slug,
    name: c.name,
    description: c.description,
    trustTier: c.trustTier,
    itemCount: itemCountByCollectionId.get(c.id) ?? 0,
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
      <FeaturedPicks items={featuredItems} />
      <CollectionsRow collections={collectionCards} />
      <JustAdded items={recentItems} />
    </>
  );
}
