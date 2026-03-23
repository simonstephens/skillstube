import Link from 'next/link';
import { ArrowUp, Star } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { TrustBadge } from '@/components/ui/TrustBadge';
import { Card, CardContent } from '@/components/ui/card';
import type { SerializedPlugin, SerializedSkill } from '@/db/schema';
import type { Platform } from '@/lib/types';
import { PLATFORM_LABELS, parseTrustTier, TRUST_TIER_META } from '@/lib/types';
import { cn } from '@/lib/utils';

type FeaturedItem =
  | { type: 'plugin'; data: SerializedPlugin & { skillCount: number } }
  | { type: 'skill'; data: SerializedSkill };

type FeaturedPicksProps = {
  items: FeaturedItem[];
  className?: string;
};

function getTrustBorderClass(trustTier: string): string {
  const tier = parseTrustTier(trustTier);
  if (tier === 'official' || tier === 'verified') {
    return 'border-l-2 border-l-trust-verified';
  }
  return '';
}

function FeaturedCard({ item, featured }: { item: FeaturedItem; featured?: boolean }) {
  const d = item.data;
  const href = item.type === 'plugin' ? `/plugins/${d.slug}` : `/skills/${d.slug}`;
  const trustBorder = getTrustBorderClass(d.trustTier);

  return (
    <Link
      href={href}
      className={cn(
        'group block rounded-xl outline-none transition-all',
        'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
      )}
    >
      <Card
        className={cn(
          'h-full border border-border/50 shadow-sm transition-all',
          'group-hover:border-primary/20 group-hover:shadow-lg',
          trustBorder,
        )}
      >
        <CardContent className={cn('flex flex-col gap-3', featured ? 'pt-5 pb-5' : 'pt-4')}>
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <TrustBadge tier={parseTrustTier(d.trustTier)} />
              <Badge
                variant="outline"
                className={cn(
                  'text-xs',
                  item.type === 'plugin'
                    ? 'border-primary/30 text-primary'
                    : 'border-muted-foreground/30 text-muted-foreground',
                )}
              >
                {item.type === 'plugin' ? 'Plugin' : 'Skill'}
              </Badge>
            </div>
            {d.upvoteCount > 0 ? (
              <span
                className="inline-flex shrink-0 items-center gap-0.5 text-xs font-medium text-muted-foreground"
                aria-label={`${d.upvoteCount} upvotes`}
              >
                <ArrowUp className="size-3.5" aria-hidden />
                {d.upvoteCount}
              </span>
            ) : null}
          </div>

          <h3 className={cn('font-heading font-semibold leading-snug', featured ? 'text-xl' : 'text-lg')}>
            {d.name}
          </h3>

          <div className="text-sm text-muted-foreground">{d.author}</div>

          <p className={cn('text-sm leading-relaxed text-foreground/80', featured ? 'line-clamp-3' : 'line-clamp-2')}>
            {featured && d.summary ? d.summary : d.description}
          </p>

          {item.type === 'plugin' && 'skillCount' in item.data ? (
            <p className="text-xs text-muted-foreground">
              {item.data.skillCount} {item.data.skillCount === 1 ? 'skill' : 'skills'}
            </p>
          ) : null}

          <div className="mt-auto flex flex-wrap items-center gap-2 pt-1">
            {d.worksWith.map((platform: Platform) => (
              <Badge key={platform} variant="secondary" className="text-xs">
                {PLATFORM_LABELS[platform]}
              </Badge>
            ))}
            {typeof d.stars === 'number' && d.stars > 0 ? (
              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                <Star className="size-3.5 fill-amber-400 text-amber-500" aria-hidden />
                {d.stars.toLocaleString()}
              </span>
            ) : null}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export function FeaturedPicks({ items, className }: FeaturedPicksProps) {
  if (items.length === 0) return null;

  const hero = items.slice(0, 2);
  const rest = items.slice(2);

  return (
    <section className={cn('bg-gradient-to-b from-muted/40 to-transparent py-16 md:py-20', className)}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-10">
          <h2 className="font-heading text-2xl font-bold tracking-tight sm:text-3xl">
            Featured
          </h2>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Hand-picked plugins and skills, reviewed for quality and safety.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 md:gap-6">
          {hero.map((item) => (
            <FeaturedCard key={`${item.type}-${item.data.id}`} item={item} featured />
          ))}
        </div>

        {rest.length > 0 ? (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 md:mt-6 md:gap-6 lg:grid-cols-3">
            {rest.map((item) => (
              <FeaturedCard key={`${item.type}-${item.data.id}`} item={item} />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
