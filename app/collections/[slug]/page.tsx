import { getAllCollectionSlugs, getCollectionBySlug, getCollectionSkills } from '@/db/queries';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';

import { CopyButton } from '@/components/ui/CopyButton';
import { SkillCard } from '@/components/ui/SkillCard';
import { TrustBadge } from '@/components/ui/TrustBadge';
import { serializeSkill } from '@/lib/serialize';
import { getSiteUrl, safeJsonLd } from '@/lib/site-url';
import { parseTrustTier } from '@/lib/types';

export const revalidate = 60;
export const dynamicParams = false;

export async function generateStaticParams() {
  const slugs = await getAllCollectionSlugs();
  return slugs.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const collection = await getCollectionBySlug(slug);
  if (!collection) return {};
  return {
    title: collection.name,
    description: collection.description,
    openGraph: {
      title: `${collection.name} | SkillsTube`,
      description: collection.description,
    },
  };
}

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const collection = await getCollectionBySlug(slug);
  if (!collection) notFound();

  const rows = await getCollectionSkills(collection.id);
  const serializedSkills = rows.map(({ skill }) => serializeSkill(skill));
  const origin = getSiteUrl();

  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: collection.name,
    description: collection.description,
    numberOfItems: serializedSkills.length,
    itemListElement: serializedSkills.map((skill, index) => ({
      '@type': 'ListItem',
      position: rows[index]?.position ?? index + 1,
      name: skill.name,
      url: `${origin}/skills/${skill.slug}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(itemListJsonLd) }}
      />
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <header className="border-b border-border pb-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-3">
              <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
                {collection.name}
              </h1>
              <p className="text-muted-foreground">
                {collection.authorUrl ? (
                  <a
                    href={collection.authorUrl}
                    className="text-foreground underline decoration-border underline-offset-4 hover:text-primary"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {collection.author}
                  </a>
                ) : (
                  collection.author
                )}
              </p>
            </div>
            <TrustBadge tier={parseTrustTier(collection.trustTier)} className="w-fit" />
          </div>
        </header>

        <section
          className="prose-editorial mt-10 max-w-none text-[0.95rem] leading-relaxed text-foreground/90 [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary/80 [&_blockquote]:border-l-2 [&_blockquote]:border-border [&_blockquote]:pl-4 [&_blockquote]:text-muted-foreground [&_code]:rounded-md [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.9em] [&_h1]:mt-8 [&_h1]:text-2xl [&_h1]:font-semibold [&_h1]:tracking-tight [&_h1]:first:mt-0 [&_h2]:mt-7 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:tracking-tight [&_h3]:mt-6 [&_h3]:text-lg [&_h3]:font-semibold [&_li]:my-1 [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:my-4 [&_p]:first:mt-0 [&_pre]:my-4 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:border [&_pre]:border-border [&_pre]:bg-muted/50 [&_pre]:p-4 [&_pre]:font-mono [&_pre]:text-sm [&_strong]:font-semibold [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6"
          aria-label="Editorial"
        >
          <ReactMarkdown
            components={{
              a: ({ href, children, ...props }) => {
                if (href && !/^https?:\/\//.test(href) && !href.startsWith('/') && !href.startsWith('#')) {
                  return <span>{children}</span>;
                }
                const external = href?.startsWith('http') ?? false;
                return (
                  <a
                    href={href}
                    {...props}
                    target={external ? '_blank' : undefined}
                    rel={external ? 'noopener noreferrer' : undefined}
                  >
                    {children}
                  </a>
                );
              },
            }}
          >{collection.editorialContent}</ReactMarkdown>
        </section>

        <section className="mt-12" aria-labelledby="collection-skills-heading">
          <h2 id="collection-skills-heading" className="mb-6 text-xl font-semibold tracking-tight">
            Skills in this collection
          </h2>
          <ol className="m-0 grid list-none grid-cols-1 gap-4 p-0 sm:gap-6 md:grid-cols-2">
            {serializedSkills.map((skill) => (
              <li key={skill.id} className="min-w-0">
                <SkillCard skill={skill} />
              </li>
            ))}
          </ol>
        </section>

        {collection.installAllInstructions ? (
          <section className="mt-12 rounded-xl border border-border bg-muted/30 p-6" aria-labelledby="install-all-heading">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <h2 id="install-all-heading" className="text-lg font-semibold tracking-tight">
                Install all
              </h2>
              <CopyButton text={collection.installAllInstructions} />
            </div>
            <pre className="mt-4 overflow-x-auto rounded-lg border border-border bg-background p-4 font-mono text-sm leading-relaxed whitespace-pre-wrap">
              {collection.installAllInstructions}
            </pre>
          </section>
        ) : null}
      </div>
    </>
  );
}
