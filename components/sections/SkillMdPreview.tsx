import ReactMarkdown from "react-markdown"

import { cn } from "@/lib/utils"

type SkillMdPreviewProps = {
  content: string | null
  githubUrl: string | null
}

const markdownClassName = cn(
  "max-w-none text-sm leading-relaxed text-foreground",
  "[&_h1]:mt-6 [&_h1]:text-xl [&_h1]:font-semibold [&_h1]:tracking-tight [&_h1]:first:mt-0",
  "[&_h2]:mt-5 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:tracking-tight",
  "[&_h3]:mt-4 [&_h3]:text-base [&_h3]:font-semibold",
  "[&_p]:mt-3 [&_p]:text-muted-foreground [&_p]:first:mt-0",
  "[&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2",
  "[&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:text-muted-foreground",
  "[&_ol]:mt-3 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:text-muted-foreground",
  "[&_li]:mt-1",
  "[&_code]:rounded-md [&_code]:bg-muted [&_code]:px-1 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.85em]",
  "[&_pre]:mt-3 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:border [&_pre]:border-border [&_pre]:bg-muted/50 [&_pre]:p-3",
  "[&_pre_code]:bg-transparent [&_pre_code]:p-0",
  "[&_blockquote]:mt-3 [&_blockquote]:border-l-2 [&_blockquote]:border-border [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-muted-foreground"
)

export function SkillMdPreview({ content, githubUrl }: SkillMdPreviewProps) {
  if (content === null) return null

  return (
    <details className="group mt-10 rounded-xl border border-border bg-card">
      <summary className="cursor-pointer list-none px-4 py-3 text-sm font-medium text-foreground marker:hidden [&::-webkit-details-marker]:hidden">
        <span className="underline decoration-muted-foreground/40 underline-offset-2 group-open:no-underline">
          View SKILL.md
        </span>
      </summary>
      <div className="border-t border-border px-4 py-4">
        {githubUrl ? (
          <p className="mb-4 text-sm">
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline underline-offset-2"
            >
              Open repository on GitHub
            </a>
          </p>
        ) : null}
        <div className={markdownClassName}>
          <ReactMarkdown
            components={{
              a: ({ href, children, ...props }) => {
                const external = href?.startsWith("http") ?? false
                return (
                  <a
                    href={href}
                    {...props}
                    target={external ? "_blank" : undefined}
                    rel={external ? "noopener noreferrer" : undefined}
                  >
                    {children}
                  </a>
                )
              },
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
      </div>
    </details>
  )
}
