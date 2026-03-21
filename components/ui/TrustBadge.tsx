import { Clock, Shield, ShieldCheck, TriangleAlert, Users } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import type { TrustTier } from "@/lib/types"
import { TRUST_TIER_META } from "@/lib/types"
import { cn } from "@/lib/utils"

function TrustTierIcon({ tier }: { tier: TrustTier }) {
  const iconClass = "size-3 shrink-0"
  switch (tier) {
    case "official":
      return <Shield className={iconClass} aria-hidden />
    case "verified":
      return <ShieldCheck className={iconClass} aria-hidden />
    case "community":
      return <Users className={iconClass} aria-hidden />
    case "unreviewed":
      return <Clock className={iconClass} aria-hidden />
    case "flagged":
      return <TriangleAlert className={iconClass} aria-hidden />
  }
}

type TrustBadgeProps = {
  tier: TrustTier
  className?: string
  showTooltip?: boolean
}

export function TrustBadge({
  tier,
  className,
  showTooltip = true,
}: TrustBadgeProps) {
  const meta = TRUST_TIER_META[tier]

  return (
    <Badge
      variant="outline"
      className={cn(meta.colorClass, className)}
      title={showTooltip ? meta.description : undefined}
    >
      <TrustTierIcon tier={tier} />
      {meta.label}
    </Badge>
  )
}
