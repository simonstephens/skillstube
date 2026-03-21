import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function Hero({ className }: { className?: string }) {
  return (
    <section
      className={cn(
        'border-b border-border/60 bg-gradient-to-b from-primary/[0.03] to-transparent',
        className,
      )}
    >
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28 md:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="font-heading text-4xl font-semibold tracking-tight text-foreground sm:text-5xl md:text-6xl md:leading-[1.1]">
            Find skills you can{' '}
            <span className="text-primary">trust</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
            Curated skill stacks for Claude Code, Cowork, and beyond. Every
            skill reviewed for quality and safety.
          </p>
          <div className="mt-10 flex justify-center">
            <Button
              size="lg"
              nativeButton={false}
              render={<Link href="/browse" />}
            >
              Browse All Skills
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
