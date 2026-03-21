'use client';

import { ChevronDown, ChevronUp, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { SkillCard } from '@/components/ui/SkillCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { SerializedSkill } from '@/db/schema';
import {
  AUDIENCE_LABELS,
  AUDIENCES,
  CATEGORY_LABELS,
  CATEGORIES,
  PLATFORM_LABELS,
  PLATFORMS,
  TRUST_TIER_META,
  TRUST_TIERS,
  type Audience,
  type Category,
  type Platform,
  type TrustTier,
} from '@/lib/types';
import { cn } from '@/lib/utils';

type SkillBrowserProps = {
  skills: SerializedSkill[];
};

function parseMultiParam<T extends string>(
  raw: string | null,
  allowed: readonly T[],
): T[] {
  if (!raw) return [];
  const allowedSet = new Set<string>(allowed);
  return raw
    .split(',')
    .map((s) => s.trim())
    .filter((s): s is T => allowedSet.has(s));
}

function parseAudience(raw: string | null): Audience | null {
  if (!raw) return null;
  return (AUDIENCES as readonly string[]).includes(raw)
    ? (raw as Audience)
    : null;
}

function matchesAudience(skill: SerializedSkill, filter: Audience | null) {
  if (!filter) return true;
  if (filter === 'both') return skill.audience === 'both';
  if (filter === 'developer') {
    return skill.audience === 'developer' || skill.audience === 'both';
  }
  if (filter === 'non-technical') {
    return skill.audience === 'non-technical' || skill.audience === 'both';
  }
  return true;
}

function matchesSearch(skill: SerializedSkill, q: string) {
  const needle = q.trim().toLowerCase();
  if (!needle) return true;
  const hay = [
    skill.name,
    skill.description,
    skill.summary ?? '',
    skill.author,
    ...(skill.tags ?? []),
  ]
    .join(' ')
    .toLowerCase();
  return hay.includes(needle);
}

function toggleInList<T extends string>(list: T[], value: T): T[] {
  const has = list.includes(value);
  if (has) return list.filter((x) => x !== value);
  return [...list, value].sort();
}

export function SkillBrowser({ skills }: SkillBrowserProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const qFromUrl = searchParams.get('q') ?? '';
  const [searchInput, setSearchInput] = useState(qFromUrl);

  useEffect(() => { setSearchInput(qFromUrl); }, [qFromUrl]);

  useEffect(
    () => () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    },
    [],
  );

  const audienceFilter = parseAudience(searchParams.get('audience'));
  const trustFilter = parseMultiParam(
    searchParams.get('trust'),
    TRUST_TIERS,
  ) as TrustTier[];
  const categoryFilter = parseMultiParam(
    searchParams.get('category'),
    CATEGORIES,
  ) as Category[];
  const platformFilter = parseMultiParam(
    searchParams.get('platform'),
    PLATFORMS,
  ) as Platform[];
  const sortParam = searchParams.get('sort');
  const sortMode = sortParam === 'alpha' ? 'alpha' : 'upvotes';

  const replaceUrl = useCallback(
    (mutate: (p: URLSearchParams) => void) => {
      const next = new URLSearchParams(searchParams.toString());
      mutate(next);
      const s = next.toString();
      router.replace(s ? `/browse?${s}` : '/browse', { scroll: false });
    },
    [router, searchParams],
  );

  function updateSearchParam(value: string) {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      debounceRef.current = null;
      const params = new URLSearchParams(searchParams.toString());
      const trimmed = value.trim();
      if (trimmed) params.set('q', trimmed);
      else params.delete('q');
      const s = params.toString();
      router.replace(s ? `/browse?${s}` : '/browse', { scroll: false });
    }, 300);
  }

  const filtered = useMemo(() => {
    let list = skills.filter((skill) => {
      if (!matchesAudience(skill, audienceFilter)) return false;
      if (
        trustFilter.length > 0 &&
        !trustFilter.includes(skill.trustTier as TrustTier)
      ) {
        return false;
      }
      if (
        categoryFilter.length > 0 &&
        !categoryFilter.includes(skill.category as Category)
      ) {
        return false;
      }
      if (platformFilter.length > 0) {
        const works = skill.worksWith ?? [];
        const hit = platformFilter.some((p) => works.includes(p));
        if (!hit) return false;
      }
      if (!matchesSearch(skill, searchInput)) return false;
      return true;
    });

    if (sortMode === 'alpha') {
      list = [...list].sort((a, b) =>
        a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }),
      );
    } else {
      list = [...list].sort((a, b) => {
        const u = b.upvoteCount - a.upvoteCount;
        if (u !== 0) return u;
        return a.name.localeCompare(b.name, undefined, { sensitivity: 'base' });
      });
    }

    return list;
  }, [
    skills,
    audienceFilter,
    trustFilter,
    categoryFilter,
    platformFilter,
    searchInput,
    sortMode,
  ]);

  const hasActiveFilters =
    audienceFilter !== null ||
    trustFilter.length > 0 ||
    categoryFilter.length > 0 ||
    platformFilter.length > 0 ||
    sortMode === 'alpha' ||
    (searchParams.get('q') ?? '').length > 0;

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  function clearAll() {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setSearchInput('');
    router.replace('/browse', { scroll: false });
  }

  function removeAudience() {
    replaceUrl((p) => p.delete('audience'));
  }

  function removeTrust(tier: TrustTier) {
    replaceUrl((p) => {
      const next = trustFilter.filter((t) => t !== tier);
      if (next.length) p.set('trust', next.join(','));
      else p.delete('trust');
    });
  }

  function removeCategory(cat: Category) {
    replaceUrl((p) => {
      const next = categoryFilter.filter((c) => c !== cat);
      if (next.length) p.set('category', next.join(','));
      else p.delete('category');
    });
  }

  function removePlatform(plat: Platform) {
    replaceUrl((p) => {
      const next = platformFilter.filter((x) => x !== plat);
      if (next.length) p.set('platform', next.join(','));
      else p.delete('platform');
    });
  }

  function removeSearchChip() {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setSearchInput('');
    replaceUrl((p) => p.delete('q'));
  }

  function removeSortChip() {
    replaceUrl((p) => p.delete('sort'));
  }

  function setAudience(value: Audience) {
    replaceUrl((p) => {
      const current = p.get('audience');
      if (current === value) p.delete('audience');
      else p.set('audience', value);
    });
  }

  function toggleTrust(tier: TrustTier) {
    replaceUrl((p) => {
      const next = toggleInList(trustFilter, tier);
      if (next.length) p.set('trust', next.join(','));
      else p.delete('trust');
    });
  }

  function toggleCategory(cat: Category) {
    replaceUrl((p) => {
      const next = toggleInList(categoryFilter, cat);
      if (next.length) p.set('category', next.join(','));
      else p.delete('category');
    });
  }

  function togglePlatform(plat: Platform) {
    replaceUrl((p) => {
      const next = toggleInList(platformFilter, plat);
      if (next.length) p.set('platform', next.join(','));
      else p.delete('platform');
    });
  }

  function setSort(mode: 'upvotes' | 'alpha') {
    replaceUrl((p) => {
      if (mode === 'upvotes') p.delete('sort');
      else p.set('sort', 'alpha');
    });
  }

  const filterPanel = (
    <div className="flex flex-col gap-6">
      <div>
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Audience
        </p>
        <div className="flex flex-wrap gap-2">
          {AUDIENCES.map((a) => {
            const active = audienceFilter === a;
            return (
              <Button
                key={a}
                type="button"
                size="sm"
                variant={active ? 'default' : 'outline'}
                className={cn(!active && 'border-border')}
                onClick={() => setAudience(a)}
              >
                {AUDIENCE_LABELS[a]}
              </Button>
            );
          })}
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Trust tier
        </p>
        <div className="flex flex-wrap gap-2">
          {TRUST_TIERS.map((tier) => {
            const active = trustFilter.includes(tier);
            return (
              <Button
                key={tier}
                type="button"
                size="sm"
                variant={active ? 'default' : 'outline'}
                className={cn(!active && 'border-border')}
                onClick={() => toggleTrust(tier)}
              >
                {TRUST_TIER_META[tier].label}
              </Button>
            );
          })}
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Category
        </p>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => {
            const active = categoryFilter.includes(cat);
            return (
              <Button
                key={cat}
                type="button"
                size="sm"
                variant={active ? 'default' : 'outline'}
                className={cn(!active && 'border-border')}
                onClick={() => toggleCategory(cat)}
              >
                {CATEGORY_LABELS[cat]}
              </Button>
            );
          })}
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Platform
        </p>
        <div className="flex flex-wrap gap-2">
          {PLATFORMS.map((plat) => {
            const active = platformFilter.includes(plat);
            return (
              <Button
                key={plat}
                type="button"
                size="sm"
                variant={active ? 'default' : 'outline'}
                className={cn(!active && 'border-border')}
                onClick={() => togglePlatform(plat)}
              >
                {PLATFORM_LABELS[plat]}
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-xl flex-1">
          <label htmlFor="browse-search" className="sr-only">
            Search skills
          </label>
          <Input
            id="browse-search"
            type="search"
            placeholder="Search by name, description, tags..."
            value={searchInput}
            onChange={(e) => {
              const v = e.target.value;
              setSearchInput(v);
              updateSearchParam(v);
            }}
            autoComplete="off"
          />
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground">
            Sort
          </span>
          <Button
            type="button"
            size="sm"
            variant={sortMode === 'upvotes' ? 'default' : 'outline'}
            className={cn(sortMode !== 'upvotes' && 'border-border')}
            onClick={() => setSort('upvotes')}
          >
            Most upvoted
          </Button>
          <Button
            type="button"
            size="sm"
            variant={sortMode === 'alpha' ? 'default' : 'outline'}
            className={cn(sortMode !== 'alpha' && 'border-border')}
            onClick={() => setSort('alpha')}
          >
            A–Z
          </Button>
        </div>
      </div>

      <div className="md:hidden">
        <Button
          type="button"
          variant="outline"
          className="w-full justify-between border-border"
          onClick={() => setMobileFiltersOpen((o) => !o)}
          aria-expanded={mobileFiltersOpen}
        >
          <span>Filters</span>
          {mobileFiltersOpen ? (
            <ChevronUp className="size-4" aria-hidden />
          ) : (
            <ChevronDown className="size-4" aria-hidden />
          )}
        </Button>
        {mobileFiltersOpen ? (
          <div className="mt-3 rounded-xl border border-border bg-card p-4">
            {filterPanel}
          </div>
        ) : null}
      </div>

      <div className="flex flex-col gap-8 md:flex-row md:items-start">
        <aside className="hidden w-full shrink-0 md:block md:w-56 lg:w-64">
          <div className="rounded-xl border border-border bg-card p-4">
            {filterPanel}
          </div>
        </aside>
        <div className="min-w-0 flex-1">
          {hasActiveFilters ? (
            <div className="mb-6 flex flex-wrap items-center gap-2">
              {(searchParams.get('q') ?? '').trim() ? (
                <Badge variant="secondary" className="gap-1 pr-1">
                  <span className="max-w-[200px] truncate">
                    “{searchParams.get('q')}”
                  </span>
                  <button
                    type="button"
                    className="rounded p-0.5 hover:bg-muted"
                    aria-label="Remove search filter"
                    onClick={removeSearchChip}
                  >
                    <X className="size-3" />
                  </button>
                </Badge>
              ) : null}
              {audienceFilter ? (
                <Badge variant="secondary" className="gap-1 pr-1">
                  {AUDIENCE_LABELS[audienceFilter]}
                  <button
                    type="button"
                    className="rounded p-0.5 hover:bg-muted"
                    aria-label="Remove audience filter"
                    onClick={removeAudience}
                  >
                    <X className="size-3" />
                  </button>
                </Badge>
              ) : null}
              {trustFilter.map((tier) => (
                <Badge key={tier} variant="secondary" className="gap-1 pr-1">
                  {TRUST_TIER_META[tier].label}
                  <button
                    type="button"
                    className="rounded p-0.5 hover:bg-muted"
                    aria-label={`Remove ${TRUST_TIER_META[tier].label} filter`}
                    onClick={() => removeTrust(tier)}
                  >
                    <X className="size-3" />
                  </button>
                </Badge>
              ))}
              {categoryFilter.map((cat) => (
                <Badge key={cat} variant="secondary" className="gap-1 pr-1">
                  {CATEGORY_LABELS[cat]}
                  <button
                    type="button"
                    className="rounded p-0.5 hover:bg-muted"
                    aria-label={`Remove ${CATEGORY_LABELS[cat]} filter`}
                    onClick={() => removeCategory(cat)}
                  >
                    <X className="size-3" />
                  </button>
                </Badge>
              ))}
              {platformFilter.map((plat) => (
                <Badge key={plat} variant="secondary" className="gap-1 pr-1">
                  {PLATFORM_LABELS[plat]}
                  <button
                    type="button"
                    className="rounded p-0.5 hover:bg-muted"
                    aria-label={`Remove ${PLATFORM_LABELS[plat]} filter`}
                    onClick={() => removePlatform(plat)}
                  >
                    <X className="size-3" />
                  </button>
                </Badge>
              ))}
              {sortMode === 'alpha' ? (
                <Badge variant="secondary" className="gap-1 pr-1">
                  A–Z
                  <button
                    type="button"
                    className="rounded p-0.5 hover:bg-muted"
                    aria-label="Reset sort to most upvoted"
                    onClick={removeSortChip}
                  >
                    <X className="size-3" />
                  </button>
                </Badge>
              ) : null}
              <Link
                href="/browse"
                scroll={false}
                className="inline-flex h-auto items-center px-2 py-0 text-sm font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
              >
                Clear all
              </Link>
            </div>
          ) : null}

          {filtered.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border bg-muted/30 px-6 py-16 text-center">
              <p className="text-lg font-medium text-foreground">
                No skills match your filters
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Try clearing some filters or broadening your search.
              </p>
              <Button
                type="button"
                variant="outline"
                className="mt-6 border-border"
                onClick={clearAll}
              >
                Clear all filters
              </Button>
            </div>
          ) : (
            <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((skill) => (
                <li key={skill.id}>
                  <SkillCard skill={skill} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
