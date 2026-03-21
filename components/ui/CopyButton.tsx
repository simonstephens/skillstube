"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { Check, Copy } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

type CopyState = "idle" | "copied" | "failed"

type CopyButtonProps = {
  text: string
  className?: string
}

export function CopyButton({ text, className }: CopyButtonProps) {
  const [state, setState] = useState<CopyState>("idle")
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearTimer = useCallback(() => {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }, [])

  useEffect(() => {
    return () => clearTimer()
  }, [clearTimer])

  const handleClick = async () => {
    clearTimer()
    try {
      await navigator.clipboard.writeText(text)
      setState("copied")
      timeoutRef.current = setTimeout(() => setState("idle"), 2000)
    } catch {
      setState("failed")
      timeoutRef.current = setTimeout(() => setState("idle"), 2000)
    }
  }

  if (state === "copied") {
    return (
      <Button
        type="button"
        variant="outline"
        size="sm"
        className={cn("shrink-0 gap-1.5", className)}
        disabled
        aria-live="polite"
      >
        <Check className="size-4 text-green-600" aria-hidden />
        Copied!
      </Button>
    )
  }

  if (state === "failed") {
    return (
      <Button
        type="button"
        variant="outline"
        size="sm"
        className={cn("shrink-0 gap-1.5", className)}
        onClick={handleClick}
        aria-live="polite"
      >
        <Copy className="size-4" aria-hidden />
        Failed to copy
      </Button>
    )
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="icon-sm"
      className={cn("shrink-0", className)}
      onClick={handleClick}
      aria-label="Copy to clipboard"
    >
      <Copy className="size-4" aria-hidden />
    </Button>
  )
}
