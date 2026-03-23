'use client';

import { useRouter } from 'next/navigation';
import { type FormEvent, useState } from 'react';

import { cn } from '@/lib/utils';

export function Hero({ className }: { className?: string }) {
  const router = useRouter();
  const [query, setQuery] = useState('');

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = query.trim();
    router.push(trimmed ? `/browse?q=${encodeURIComponent(trimmed)}` : '/browse');
  }

  return (
    <section
      className={cn(
        'border-b border-border/60 bg-gradient-to-b from-primary/[0.04] via-primary/[0.02] to-transparent',
        className,
      )}
    >
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 md:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="font-heading text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl md:leading-[1.08]">
            Find skills you can{' '}
            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              trust
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Curated plugins and skills for Claude Code, Cowork, and beyond.
          </p>
          <form onSubmit={handleSubmit} className="mx-auto mt-8 max-w-lg">
            <div className="relative">
              <svg
                className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground/60"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="search"
                placeholder="Search plugins and skills..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className={cn(
                  'w-full rounded-xl border border-border bg-background py-3.5 pl-12 pr-4 text-base shadow-sm',
                  'placeholder:text-muted-foreground/50',
                  'focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/20',
                  'transition-shadow hover:shadow-md',
                )}
                autoComplete="off"
              />
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
