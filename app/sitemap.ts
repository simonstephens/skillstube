import type { MetadataRoute } from 'next';
import { getAllSkillSlugs, getAllCollectionSlugs } from '@/db/queries';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://skillstube.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [skillSlugs, collectionSlugs] = await Promise.all([
    getAllSkillSlugs(),
    getAllCollectionSlugs(),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/browse`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
  ];

  const skillRoutes: MetadataRoute.Sitemap = skillSlugs.map(({ slug }) => ({
    url: `${BASE_URL}/skills/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const collectionRoutes: MetadataRoute.Sitemap = collectionSlugs.map(
    ({ slug }) => ({
      url: `${BASE_URL}/collections/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }),
  );

  return [...staticRoutes, ...skillRoutes, ...collectionRoutes];
}
