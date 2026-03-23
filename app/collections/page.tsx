import type { Metadata } from 'next';
import Link from 'next/link';

import { TrustBadge } from '@/components/ui/TrustBadge';
import { Card, CardContent } from '@/components/ui/card';
import {
  getFeaturedCollections,
  getCollectionItemCountsByCollectionId,
} from '@/db/queries';
import { parseTrustTier } from '@/lib/types';
import { cn } from '@/lib/utils';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Collections',
  description:
    'Curated collections of plugins and skills for common workflows and use cases.',
};

export default async function CollectionsPage() {
  const [collections, itemCountByCollectionId] = await Promise.all([
    getFeaturedCollections(),
    getCollectionItemCountsByCollectionId(),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="mb-10">
        <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
          Collections
        </h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Curated stacks of plugins and skills for common workflows. Each
          collection is hand-picked and explained.
        </p>
      </div>

      {collections.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-muted/30 px-6 py-16 text-center">
          <p className="text-lg font-medium text-foreground">
            No collections yet
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Check back soon — we&apos;re curating collections of the best
            plugins and skills.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {collections.map((c) => {
            const itemCount = itemCountByCollectionId.get(c.id) ?? 0;

            return (
              <Link
                key={c.id}
                href={`/collections/${c.slug}`}
                className={cn(
                  'group block rounded-xl outline-none transition-all',
                  'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                )}
              >
                <Card
                  className={cn(
                    'h-full border border-border/50 shadow-sm transition-all',
                    'group-hover:border-primary/20 group-hover:shadow-lg',
                  )}
                >
                  <CardContent className="flex flex-col gap-3 pt-5">
                    <div className="flex items-center justify-between gap-2">
                      <TrustBadge tier={parseTrustTier(c.trustTier)} />
                      <span className="text-xs font-medium tabular-nums text-muted-foreground">
                        {itemCount} {itemCount === 1 ? 'item' : 'items'}
                      </span>
                    </div>

                    <h2 className="font-heading text-lg font-semibold leading-snug group-hover:text-primary transition-colors">
                      {c.name}
                    </h2>

                    <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                      {c.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
