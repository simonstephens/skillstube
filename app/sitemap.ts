import type { MetadataRoute } from 'next';
import {
  getAllCollectionSlugs,
  getAllPluginSlugs,
  getAllSkillSlugs,
} from '@/db/queries';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://skillstube.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [pluginSlugs, skillSlugs, collectionSlugs] = await Promise.all([
    getAllPluginSlugs(),
    getAllSkillSlugs(),
    getAllCollectionSlugs(),
  ]);

  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/browse`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
  ];

  const pluginRoutes: MetadataRoute.Sitemap = pluginSlugs.map(({ slug }) => ({
    url: `${BASE_URL}/plugins/${slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const skillRoutes: MetadataRoute.Sitemap = skillSlugs.map(({ slug }) => ({
    url: `${BASE_URL}/skills/${slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const collectionRoutes: MetadataRoute.Sitemap = collectionSlugs.map(
    ({ slug }) => ({
      url: `${BASE_URL}/collections/${slug}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }),
  );

  return [...staticRoutes, ...pluginRoutes, ...skillRoutes, ...collectionRoutes];
}
