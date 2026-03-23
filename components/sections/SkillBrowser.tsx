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

import { PluginCard } from '@/components/ui/PluginCard';
import { SkillCard } from '@/components/ui/SkillCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { SerializedPlugin, SkillCardData } from '@/db/schema';
import {
  AUDIENCE_LABELS,
  AUDIENCES,
  CATEGORY_LABELS,
  CATEGORIES,
  ENTITY_TYPE_LABELS,
  PLATFORM_LABELS,
  PLATFORMS,
  TRUST_TIER_META,
  TRUST_TIERS,
  isTrustTier,
  isCategory,
  type Audience,
  type Category,
  type EntityType,
  type Platform,
  type TrustTier,
} from '@/lib/types';
import { cn } from '@/lib/utils';

type SkillBrowserProps = {
  plugins: Array<SerializedPlugin & { skillCount: number }>;
  skills: SkillCardData[];
};

type BrowseItem =
  | { entityType: 'plugin'; data: SerializedPlugin & { skillCount: number } }
  | { entityType: 'skill'; data: SkillCardData };

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

function parseTypeFilter(raw: string | null): EntityType | null {
  if (!raw) return null;
  if (raw === 'plugin' || raw === 'skill') return raw;
  return null;
}

function matchesAudience(item: BrowseItem, filter: Audience | null) {
  if (!filter) return true;
  const audience = item.data.audience;
  if (filter === 'both') return audience === 'both';
  if (filter === 'developer') {
    return audience === 'developer' || audience === 'both';
  }
  if (filter === 'non-technical') {
    return audience === 'non-technical' || audience === 'both';
  }
  return true;
}

function matchesSearch(item: BrowseItem, q: string) {
  const needle = q.trim().toLowerCase();
  if (!needle) return true;
  const d = item.data;
  const hay = [
    d.name,
    d.description,
    d.summary ?? '',
    d.author,
    ...(d.tags ?? []),
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

export function SkillBrowser({ plugins, skills }: SkillBrowserProps) {
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
  const typeFilter = parseTypeFilter(searchParams.get('type'));
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
  const sortMode = sortParam === 'alpha' ? 'alpha' : sortParam === 'recent' ? 'recent' : 'upvotes';

  const allItems: BrowseItem[] = useMemo(() => [
    ...plugins.map((p): BrowseItem => ({ entityType: 'plugin', data: p })),
    ...skills.map((s): BrowseItem => ({ entityType: 'skill', data: s })),
  ], [plugins, skills]);

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
    let list = allItems.filter((item) => {
      if (typeFilter && item.entityType !== typeFilter) return false;
      if (!matchesAudience(item, audienceFilter)) return false;
      if (
        trustFilter.length > 0 &&
        !(isTrustTier(item.data.trustTier) && trustFilter.includes(item.data.trustTier))
      ) {
        return false;
      }
      if (
        categoryFilter.length > 0 &&
        !(isCategory(item.data.category) && categoryFilter.includes(item.data.category))
      ) {
        return false;
      }
      if (platformFilter.length > 0) {
        const works = item.data.worksWith ?? [];
        const hit = platformFilter.some((p) => works.includes(p));
        if (!hit) return false;
      }
      if (!matchesSearch(item, searchInput)) return false;
      return true;
    });

    if (sortMode === 'alpha') {
      list = [...list].sort((a, b) =>
        a.data.name.localeCompare(b.data.name, undefined, { sensitivity: 'base' }),
      );
    } else if (sortMode === 'recent') {
      list = [...list].sort((a, b) => {
        const ta = new Date(a.data.createdAt).getTime();
        const tb = new Date(b.data.createdAt).getTime();
        if (tb !== ta) return tb - ta;
        return a.data.name.localeCompare(b.data.name, undefined, { sensitivity: 'base' });
      });
    } else {
      list = [...list].sort((a, b) => {
        const u = b.data.upvoteCount - a.data.upvoteCount;
        if (u !== 0) return u;
        return a.data.name.localeCompare(b.data.name, undefined, { sensitivity: 'base' });
      });
    }

    return list;
  }, [
    allItems,
    typeFilter,
    audienceFilter,
    trustFilter,
    categoryFilter,
    platformFilter,
    searchInput,
    sortMode,
  ]);

  const hasActiveFilters =
    typeFilter !== null ||
    audienceFilter !== null ||
    trustFilter.length > 0 ||
    categoryFilter.length > 0 ||
    platformFilter.length > 0 ||
    sortMode === 'alpha' ||
    sortMode === 'recent' ||
    (searchParams.get('q') ?? '').length > 0;

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  function clearAll() {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setSearchInput('');
    router.replace('/browse', { scroll: false });
  }

  function setTypeFilter(value: EntityType | null) {
    replaceUrl((p) => {
      if (value === null || (typeFilter === value)) {
        p.delete('type');
      } else {
        p.set('type', value);
      }
    });
  }

  function removeTypeChip() {
    replaceUrl((p) => p.delete('type'));
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

  function setSort(mode: 'upvotes' | 'alpha' | 'recent') {
    replaceUrl((p) => {
      if (mode === 'upvotes') p.delete('sort');
      else p.set('sort', mode);
    });
  }

  const filterPanel = (
    <div className="flex flex-col gap-6">
      <div>
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Type
        </p>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            size="sm"
            variant={typeFilter === null ? 'default' : 'outline'}
            className={cn(typeFilter !== null && 'border-border')}
            onClick={() => setTypeFilter(null)}
          >
            All
          </Button>
          {(['plugin', 'skill'] as const).map((t) => {
            const active = typeFilter === t;
            return (
              <Button
                key={t}
                type="button"
                size="sm"
                variant={active ? 'default' : 'outline'}
                className={cn(!active && 'border-border')}
                onClick={() => setTypeFilter(t)}
              >
                {ENTITY_TYPE_LABELS[t]}s
              </Button>
            );
          })}
        </div>
      </div>

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
            Search plugins and skills
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
            variant={sortMode === 'recent' ? 'default' : 'outline'}
            className={cn(sortMode !== 'recent' && 'border-border')}
            onClick={() => setSort('recent')}
          >
            Recently added
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
                    &ldquo;{searchParams.get('q')}&rdquo;
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
              {typeFilter ? (
                <Badge variant="secondary" className="gap-1 pr-1">
                  {ENTITY_TYPE_LABELS[typeFilter]}s
                  <button
                    type="button"
                    className="rounded p-0.5 hover:bg-muted"
                    aria-label="Remove type filter"
                    onClick={removeTypeChip}
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
              {sortMode === 'recent' ? (
                <Badge variant="secondary" className="gap-1 pr-1">
                  Recently added
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
                No results match your filters
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
              {filtered.map((item) => (
                <li key={`${item.entityType}-${item.data.id}`}>
                  {item.entityType === 'plugin' ? (
                    <PluginCard plugin={item.data} />
                  ) : (
                    <SkillCard skill={item.data} />
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
