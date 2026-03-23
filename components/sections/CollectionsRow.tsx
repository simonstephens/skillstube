import Link from 'next/link';

import { TrustBadge } from '@/components/ui/TrustBadge';
import { parseTrustTier } from '@/lib/types';
import { cn } from '@/lib/utils';

export type CollectionCard = {
  id: number;
  slug: string;
  name: string;
  description: string;
  trustTier: string;
  itemCount: number;
};

type CollectionsRowProps = {
  collections: CollectionCard[];
  className?: string;
};

export function CollectionsRow({ collections, className }: CollectionsRowProps) {
  if (collections.length === 0) return null;

  return (
    <section className={cn('bg-muted/30 py-14 md:py-16', className)}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h2 className="font-heading text-xl font-bold tracking-tight sm:text-2xl">
              Collections
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Curated stacks for common workflows.
            </p>
          </div>
          <Link
            href="/collections"
            className="shrink-0 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            View all
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
          {collections.map((c) => (
            <Link
              key={c.id}
              href={`/collections/${c.slug}`}
              className={cn(
                'group flex items-start gap-4 rounded-xl border border-border/60 bg-card p-4 transition-all',
                'hover:border-primary/20 hover:shadow-md',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
              )}
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-heading text-sm font-semibold leading-snug group-hover:text-primary transition-colors">
                    {c.name}
                  </h3>
                  <TrustBadge tier={parseTrustTier(c.trustTier)} />
                </div>
                <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                  {c.description}
                </p>
              </div>
              <span className="shrink-0 rounded-md bg-muted px-2 py-1 text-xs font-medium tabular-nums text-muted-foreground">
                {c.itemCount}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
