import Link from 'next/link';

import { TrustBadge } from '@/components/ui/TrustBadge';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { parseTrustTier } from '@/lib/types';
import { cn } from '@/lib/utils';

export type FeaturedCollectionCard = {
  id: number;
  slug: string;
  name: string;
  description: string;
  trustTier: string;
  skillCount?: number;
};

type FeaturedStacksProps = {
  collections: FeaturedCollectionCard[];
  className?: string;
};

export function FeaturedStacks({ collections, className }: FeaturedStacksProps) {
  if (collections.length === 0) {
    return null;
  }

  return (
    <section className={cn('py-16 md:py-24', className)}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-10 md:mb-12">
          <h2 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
            Featured Collections
          </h2>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Hand-picked stacks you can install and use with confidence.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 lg:gap-6">
          {collections.map((c) => (
            <Link
              key={c.id}
              href={`/collections/${c.slug}`}
              className={cn(
                'group block rounded-xl outline-none transition-all',
                'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
              )}
            >
              <Card
                className={cn(
                  'h-full border border-transparent shadow-none transition-all',
                  'group-hover:border-primary/15 group-hover:shadow-md',
                )}
              >
                <CardHeader className="gap-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <TrustBadge tier={parseTrustTier(c.trustTier)} />
                    {typeof c.skillCount === 'number' ? (
                      <span className="text-xs font-medium tabular-nums text-muted-foreground">
                        {c.skillCount}{' '}
                        {c.skillCount === 1 ? 'skill' : 'skills'}
                      </span>
                    ) : null}
                  </div>
                  <CardTitle className="text-lg font-semibold leading-snug group-hover:text-primary">
                    {c.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                    {c.description}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
