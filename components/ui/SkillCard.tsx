import { ArrowUp, Star } from "lucide-react"
import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import type { SerializedSkill, SkillCardData } from "@/db/schema"
import type { Platform } from "@/lib/types"
import { PLATFORM_LABELS, TRUST_TIER_META, parseTrustTier } from "@/lib/types"
import { cn } from "@/lib/utils"

import { TrustBadge } from "./TrustBadge"

type SkillCardProps = {
  skill: SkillCardData | SerializedSkill
}

export function SkillCard({ skill }: SkillCardProps) {
  return (
    <Link
      href={`/skills/${skill.slug}`}
      className={cn(
        "block rounded-xl outline-none transition-all",
        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      )}
    >
      <Card
        className={cn(
          "h-full border border-border/50 shadow-sm transition-all",
          "hover:border-primary/20 hover:shadow-lg",
          (parseTrustTier(skill.trustTier) === 'official' || parseTrustTier(skill.trustTier) === 'verified') &&
            "border-l-2 border-l-trust-verified",
        )}
      >
        <CardContent className="flex flex-col gap-3 pt-4">
          <div className="flex items-start justify-between gap-2">
            <TrustBadge tier={parseTrustTier(skill.trustTier)} />
            {skill.upvoteCount > 0 ? (
              <span
                className="inline-flex shrink-0 items-center gap-0.5 text-xs font-medium text-muted-foreground"
                aria-label={`${skill.upvoteCount} upvotes`}
              >
                <ArrowUp className="size-3.5" aria-hidden />
                {skill.upvoteCount}
              </span>
            ) : null}
          </div>

          <h3 className="font-semibold text-lg leading-snug">{skill.name}</h3>

          <div className="text-sm text-muted-foreground">{skill.author}</div>

          <p className="text-sm leading-snug text-foreground/90 line-clamp-2">
            {skill.description}
          </p>

          <div className="mt-auto flex flex-wrap items-center gap-2 pt-1">
            {skill.worksWith.map((platform: Platform) => (
              <Badge key={platform} variant="secondary" className="text-xs">
                {PLATFORM_LABELS[platform]}
              </Badge>
            ))}
            {typeof skill.stars === "number" && skill.stars > 0 ? (
              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                <Star className="size-3.5 fill-amber-400 text-amber-500" aria-hidden />
                {skill.stars.toLocaleString()}
              </span>
            ) : null}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
