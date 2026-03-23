import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

import { InstallInstructions } from "@/components/sections/InstallInstructions"
import { Badge } from "@/components/ui/badge"
import { TrustBadge } from "@/components/ui/TrustBadge"
import { UpvoteButton } from "@/components/ui/UpvoteButton"
import {
  getAllPluginSlugs,
  getPluginBySlug,
  getPluginCollections,
  getPluginSkillCount,
  getPluginSkills,
} from "@/db/queries"
import { getSiteUrl, safeJsonLd } from "@/lib/site-url"
import type { Platform } from "@/lib/types"
import { isPlatform, PLATFORM_LABELS, parseTrustTier } from "@/lib/types"

export const revalidate = 60
export const dynamicParams = false

export async function generateStaticParams() {
  const rows = await getAllPluginSlugs()
  return rows.map(({ slug }) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const plugin = await getPluginBySlug(slug)
  if (!plugin) {
    return { title: "Plugin not found" }
  }

  const description = plugin.summary ?? plugin.description
  const url = `${getSiteUrl()}/plugins/${slug}`

  return {
    title: plugin.name,
    description,
    openGraph: {
      title: plugin.name,
      description,
      url,
      type: "website",
      siteName: "SkillsTube",
    },
    twitter: {
      card: "summary_large_image",
      title: plugin.name,
      description,
    },
    alternates: {
      canonical: url,
    },
  }
}

export default async function PluginDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const plugin = await getPluginBySlug(slug)
  if (!plugin) notFound()

  const [childSkills, skillCount, collectionsRows] = await Promise.all([
    getPluginSkills(plugin.id),
    getPluginSkillCount(plugin.id),
    getPluginCollections(plugin.id),
  ])

  const tier = parseTrustTier(plugin.trustTier)
  const siteUrl = getSiteUrl()
  const pageUrl = `${siteUrl}/plugins/${slug}`

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: plugin.name,
    description: plugin.description,
    url: pageUrl,
    applicationCategory: "DeveloperApplication",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    ...(plugin.githubUrl ? { codeRepository: plugin.githubUrl } : {}),
    author: {
      "@type": "Person",
      name: plugin.author,
      ...(plugin.authorUrl ? { url: plugin.authorUrl } : {}),
    },
  }

  const hasGithubBlock =
    plugin.githubUrl !== null ||
    plugin.stars != null ||
    plugin.forks != null ||
    plugin.lastUpdated != null ||
    plugin.license != null

  const platforms = plugin.worksWith.filter(isPlatform)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }}
      />
      <article className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <TrustBadge tier={tier} />
              <Badge variant="secondary">Plugin</Badge>
              <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                {plugin.name}
              </h1>
            </div>
            <p className="text-sm text-muted-foreground">
              By{" "}
              {plugin.authorUrl ? (
                <a
                  href={plugin.authorUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-foreground underline-offset-2 hover:underline"
                >
                  {plugin.author}
                </a>
              ) : (
                <span className="font-medium text-foreground">
                  {plugin.author}
                </span>
              )}
              {skillCount > 0 ? (
                <span className="ml-2 text-muted-foreground">
                  &middot; {skillCount}{" "}
                  {skillCount === 1 ? "skill" : "skills"}
                </span>
              ) : null}
            </p>
          </div>
          <UpvoteButton
            slug={plugin.slug}
            initialCount={plugin.upvoteCount}
            entityType="plugin"
          />
        </header>

        <p className="mt-6 text-base leading-relaxed text-muted-foreground">
          {plugin.description}
        </p>

        {plugin.summary ? (
          <p className="mt-4 text-sm leading-relaxed text-foreground/80">
            {plugin.summary}
          </p>
        ) : null}

        {Object.keys(plugin.installInstructions).length > 0 ? (
          <InstallInstructions instructions={plugin.installInstructions} />
        ) : null}

        {childSkills.length > 0 ? (
          <section aria-labelledby="skills-heading" className="mt-10">
            <h2
              id="skills-heading"
              className="text-sm font-semibold text-foreground"
            >
              Included skills
            </h2>
            <ul className="mt-4 divide-y divide-border rounded-xl border border-border">
              {childSkills.map((skill) => (
                <li key={skill.id}>
                  <Link
                    href={`/skills/${skill.slug}`}
                    className="flex flex-col gap-1 px-4 py-3 transition-colors hover:bg-muted/50"
                  >
                    <span className="font-medium text-foreground">
                      {skill.name}
                    </span>
                    <span className="line-clamp-1 text-sm text-muted-foreground">
                      {skill.description}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {hasGithubBlock ? (
          <section
            aria-labelledby="github-heading"
            className="mt-10 rounded-xl border border-border bg-card p-5"
          >
            <h2
              id="github-heading"
              className="text-sm font-semibold text-foreground"
            >
              GitHub
            </h2>
            <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
              {plugin.githubUrl ? (
                <div className="sm:col-span-2">
                  <dt className="text-muted-foreground">Repository</dt>
                  <dd className="mt-1">
                    <a
                      href={plugin.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="break-all text-primary underline underline-offset-2"
                    >
                      {plugin.githubUrl}
                    </a>
                  </dd>
                </div>
              ) : null}
              {plugin.stars != null ? (
                <div>
                  <dt className="text-muted-foreground">Stars</dt>
                  <dd className="mt-1 font-medium tabular-nums text-foreground">
                    {plugin.stars.toLocaleString()}
                  </dd>
                </div>
              ) : null}
              {plugin.forks != null ? (
                <div>
                  <dt className="text-muted-foreground">Forks</dt>
                  <dd className="mt-1 font-medium tabular-nums text-foreground">
                    {plugin.forks.toLocaleString()}
                  </dd>
                </div>
              ) : null}
              {plugin.lastUpdated ? (
                <div>
                  <dt className="text-muted-foreground">Last updated</dt>
                  <dd className="mt-1 font-medium text-foreground">
                    {plugin.lastUpdated}
                  </dd>
                </div>
              ) : null}
              {plugin.license ? (
                <div>
                  <dt className="text-muted-foreground">License</dt>
                  <dd className="mt-1 font-medium text-foreground">
                    {plugin.license}
                  </dd>
                </div>
              ) : null}
            </dl>
          </section>
        ) : null}

        {platforms.length > 0 ? (
          <section aria-labelledby="platforms-heading" className="mt-10">
            <h2
              id="platforms-heading"
              className="text-sm font-semibold text-foreground"
            >
              Works with
            </h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {platforms.map((p) => (
                <Badge key={p} variant="secondary">
                  {PLATFORM_LABELS[p]}
                </Badge>
              ))}
            </div>
          </section>
        ) : null}

        {collectionsRows.length > 0 ? (
          <section aria-labelledby="collections-heading" className="mt-10">
            <h2
              id="collections-heading"
              className="text-sm font-semibold text-foreground"
            >
              Part of
            </h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {collectionsRows.map(({ collection }) => (
                <Link
                  key={collection.id}
                  href={`/collections/${collection.slug}`}
                >
                  <Badge
                    variant="outline"
                    className="cursor-pointer transition-colors hover:bg-muted"
                  >
                    {collection.name}
                  </Badge>
                </Link>
              ))}
            </div>
          </section>
        ) : null}
      </article>
    </>
  )
}
