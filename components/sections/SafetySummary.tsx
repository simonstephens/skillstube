import { cn } from "@/lib/utils"

type SafetySummaryProps = {
  riskLevel: string | null
  safetySummary: string | null
}

const riskStyles: Record<string, { dot: string; label: string }> = {
  low: {
    dot: "bg-green-500",
    label: "Low risk",
  },
  medium: {
    dot: "bg-amber-500",
    label: "Medium risk",
  },
  high: {
    dot: "bg-red-500",
    label: "High risk",
  },
}

export function SafetySummary({ riskLevel, safetySummary }: SafetySummaryProps) {
  if (!riskLevel || !safetySummary) return null

  const meta = riskStyles[riskLevel] ?? {
    dot: "bg-muted-foreground",
    label: riskLevel,
  }

  return (
    <section
      aria-labelledby="safety-summary-heading"
      className="mt-8 rounded-xl border border-border bg-card p-5"
    >
      <h2
        id="safety-summary-heading"
        className="text-sm font-semibold text-foreground"
      >
        Safety
      </h2>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span
          className={cn(
            "inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-2.5 py-0.5 text-xs font-medium"
          )}
        >
          <span
            className={cn("size-2 shrink-0 rounded-full", meta.dot)}
            aria-hidden
          />
          {meta.label}
        </span>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        {safetySummary}
      </p>
    </section>
  )
}
