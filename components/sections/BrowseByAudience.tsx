import Link from 'next/link';
import { Code2, Sparkles } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type BrowseByAudienceProps = {
  className?: string;
};

export function BrowseByAudience({ className }: BrowseByAudienceProps) {
  return (
    <section className={cn('py-16 md:py-24', className)}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-10 md:mb-12">
          <h2 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
            Browse by audience
          </h2>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Pick the path that matches how you work.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 md:gap-6">
          <Link
            href="/browse?audience=developer"
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
              <CardContent className="flex flex-col gap-4 pt-6 sm:flex-row sm:items-start sm:gap-6">
                <div
                  className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary"
                  aria-hidden
                >
                  <Code2 className="size-6" />
                </div>
                <div className="min-w-0 flex-1 space-y-2">
                  <h3 className="text-lg font-semibold group-hover:text-primary">
                    For Developers
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    Deep workflows, repos, and tooling — skills tuned for
                    shipping code and automating engineering work.
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link
            href="/browse?audience=non-technical"
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
              <CardContent className="flex flex-col gap-4 pt-6 sm:flex-row sm:items-start sm:gap-6">
                <div
                  className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary"
                  aria-hidden
                >
                  <Sparkles className="size-6" />
                </div>
                <div className="min-w-0 flex-1 space-y-2">
                  <h3 className="text-lg font-semibold group-hover:text-primary">
                    For Non-Technical Users
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    Clear, approachable skills for docs, research, and everyday
                    tasks — without the jargon.
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </section>
  );
}
