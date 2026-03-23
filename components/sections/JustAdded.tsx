import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { TrustBadge } from '@/components/ui/TrustBadge';
import type { SerializedPlugin, SerializedSkill } from '@/db/schema';
import type { Platform } from '@/lib/types';
import { PLATFORM_LABELS, parseTrustTier } from '@/lib/types';
import { cn } from '@/lib/utils';

type RecentItem =
  | { type: 'plugin'; data: SerializedPlugin & { skillCount: number } }
  | { type: 'skill'; data: SerializedSkill };

type JustAddedProps = {
  items: RecentItem[];
  className?: string;
};

export function JustAdded({ items, className }: JustAddedProps) {
  if (items.length === 0) return null;

  return (
    <section className={cn('py-14 md:py-16', className)}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-8">
          <h2 className="font-heading text-xl font-bold tracking-tight sm:text-2xl">
            Just Added
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            The latest plugins and skills in the directory.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => {
            const d = item.data;
            const href =
              item.type === 'plugin'
                ? `/plugins/${d.slug}`
                : `/skills/${d.slug}`;

            return (
              <Link
                key={`${item.type}-${d.id}`}
                href={href}
                className={cn(
                  'group flex flex-col gap-2 rounded-xl border border-border/60 bg-card p-4 transition-all',
                  'hover:border-primary/20 hover:shadow-md',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                )}
              >
                <div className="flex items-center gap-2">
                  <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0">
                    New
                  </Badge>
                  <TrustBadge tier={parseTrustTier(d.trustTier)} />
                  <Badge
                    variant="outline"
                    className={cn(
                      'text-[10px]',
                      item.type === 'plugin'
                        ? 'border-primary/20 text-primary'
                        : 'border-muted-foreground/20 text-muted-foreground',
                    )}
                  >
                    {item.type === 'plugin' ? 'Plugin' : 'Skill'}
                  </Badge>
                </div>

                <h3 className="font-heading text-sm font-semibold leading-snug group-hover:text-primary transition-colors">
                  {d.name}
                </h3>

                <p className="text-xs text-muted-foreground">{d.author}</p>

                <p className="line-clamp-2 text-xs leading-relaxed text-foreground/80">
                  {d.description}
                </p>

                <div className="mt-auto flex flex-wrap items-center gap-1.5 pt-1">
                  {d.worksWith.slice(0, 3).map((platform: Platform) => (
                    <Badge key={platform} variant="secondary" className="text-[10px] px-1.5 py-0">
                      {PLATFORM_LABELS[platform]}
                    </Badge>
                  ))}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
