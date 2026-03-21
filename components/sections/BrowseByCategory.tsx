import Link from 'next/link';

import { CATEGORIES, CATEGORY_LABELS, type Category } from '@/lib/types';
import { cn } from '@/lib/utils';

type BrowseByCategoryProps = {
  className?: string;
};

export function BrowseByCategory({ className }: BrowseByCategoryProps) {
  return (
    <section className={cn('py-16 md:py-24', className)}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-10 md:mb-12">
          <h2 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
            Browse by category
          </h2>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Jump into the topic you care about most.
          </p>
        </div>

        <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {CATEGORIES.map((category: Category) => (
            <li key={category}>
              <Link
                href={`/browse?category=${encodeURIComponent(category)}`}
                className={cn(
                  'flex min-h-[3.25rem] items-center justify-center rounded-xl border border-border/80 bg-card px-4 py-3 text-center text-sm font-medium text-foreground shadow-none transition-all',
                  'hover:border-primary/20 hover:bg-muted/40 hover:text-primary',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                )}
              >
                {CATEGORY_LABELS[category]}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
