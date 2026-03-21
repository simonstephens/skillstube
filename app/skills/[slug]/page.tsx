import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

import { InstallInstructions } from "@/components/sections/InstallInstructions"
import { SafetySummary } from "@/components/sections/SafetySummary"
import { SkillMdPreview } from "@/components/sections/SkillMdPreview"
import { Badge } from "@/components/ui/badge"
import { TrustBadge } from "@/components/ui/TrustBadge"
import { UpvoteButton } from "@/components/ui/UpvoteButton"
import {
  getAllSkillSlugs,
  getSkillBySlug,
  getSkillCollections,
} from "@/db/queries"
import { getSiteUrl, safeJsonLd } from "@/lib/site-url"
import type { Platform } from "@/lib/types"
import { isPlatform, PLATFORM_LABELS, parseTrustTier } from "@/lib/types"

export const revalidate = 60
export const dynamicParams = false

export async function generateStaticParams() {
  const rows = await getAllSkillSlugs()
  return rows.map(({ slug }) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const skill = await getSkillBySlug(slug)
  if (!skill) {
    return { title: "Skill not found" }
  }

  const description = skill.summary ?? skill.description
  const url = `${getSiteUrl()}/skills/${slug}`

  return {
    title: skill.name,
    description,
    openGraph: {
      title: skill.name,
      description,
      url,
      type: "website",
      siteName: "SkillsTube",
    },
    twitter: {
      card: "summary_large_image",
      title: skill.name,
      description,
    },
    alternates: {
      canonical: url,
    },
  }
}

export default async function SkillDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const skill = await getSkillBySlug(slug)
  if (!skill) notFound()

  const collectionsRows = await getSkillCollections(skill.id)
  const tier = parseTrustTier(skill.trustTier)
  const siteUrl = getSiteUrl()
  const pageUrl = `${siteUrl}/skills/${slug}`

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: skill.name,
    description: skill.description,
    url: pageUrl,
    applicationCategory: "DeveloperApplication",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    ...(skill.githubUrl ? { codeRepository: skill.githubUrl } : {}),
    author: {
      "@type": "Person",
      name: skill.author,
      ...(skill.authorUrl ? { url: skill.authorUrl } : {}),
    },
  }

  const hasGithubBlock =
    skill.githubUrl !== null ||
    skill.stars != null ||
    skill.forks != null ||
    skill.lastUpdated != null ||
    skill.license != null

  const platforms = skill.worksWith.filter(isPlatform)

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
              <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                {skill.name}
              </h1>
            </div>
            <p className="text-sm text-muted-foreground">
              By{" "}
              {skill.authorUrl ? (
                <a
                  href={skill.authorUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-foreground underline-offset-2 hover:underline"
                >
                  {skill.author}
                </a>
              ) : (
                <span className="font-medium text-foreground">{skill.author}</span>
              )}
            </p>
          </div>
          <UpvoteButton slug={skill.slug} initialCount={skill.upvoteCount} />
        </header>

        <p className="mt-6 text-base leading-relaxed text-muted-foreground">
          {skill.description}
        </p>

        <SafetySummary
          riskLevel={skill.riskLevel}
          safetySummary={skill.safetySummary}
        />

        {Object.keys(skill.installInstructions).length > 0 ? (
          <InstallInstructions instructions={skill.installInstructions} />
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
              {skill.githubUrl ? (
                <div className="sm:col-span-2">
                  <dt className="text-muted-foreground">Repository</dt>
                  <dd className="mt-1">
                    <a
                      href={skill.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="break-all text-primary underline underline-offset-2"
                    >
                      {skill.githubUrl}
                    </a>
                  </dd>
                </div>
              ) : null}
              {skill.stars != null ? (
                <div>
                  <dt className="text-muted-foreground">Stars</dt>
                  <dd className="mt-1 font-medium tabular-nums text-foreground">
                    {skill.stars.toLocaleString()}
                  </dd>
                </div>
              ) : null}
              {skill.forks != null ? (
                <div>
                  <dt className="text-muted-foreground">Forks</dt>
                  <dd className="mt-1 font-medium tabular-nums text-foreground">
                    {skill.forks.toLocaleString()}
                  </dd>
                </div>
              ) : null}
              {skill.lastUpdated ? (
                <div>
                  <dt className="text-muted-foreground">Last updated</dt>
                  <dd className="mt-1 font-medium text-foreground">
                    {skill.lastUpdated}
                  </dd>
                </div>
              ) : null}
              {skill.license ? (
                <div>
                  <dt className="text-muted-foreground">License</dt>
                  <dd className="mt-1 font-medium text-foreground">
                    {skill.license}
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
                <Link key={collection.id} href={`/collections/${collection.slug}`}>
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

        <SkillMdPreview
          content={skill.skillMdContent}
          githubUrl={skill.githubUrl}
        />
      </article>
    </>
  )
}
