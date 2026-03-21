"use client"

import { useCallback, useMemo, useState } from "react"

import { CopyButton } from "@/components/ui/CopyButton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Platform } from "@/lib/types"
import { PLATFORM_LABELS, PLATFORMS } from "@/lib/types"

const STORAGE_KEY = "skillstube-platform"

function tabLabel(key: string): string {
  if ((PLATFORMS as readonly string[]).includes(key)) {
    return PLATFORM_LABELS[key as Platform]
  }
  return key
    .split(/[-_]/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ")
}

function readSavedPlatform(keys: string[]): string | null {
  if (typeof window === "undefined" || keys.length === 0) return null
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved && keys.includes(saved)) return saved
  } catch {
    // ignore
  }
  return null
}

type InstallInstructionsProps = {
  instructions: Record<string, string>
}

export function InstallInstructions({ instructions }: InstallInstructionsProps) {
  const platformKeys = useMemo(() => Object.keys(instructions), [instructions])

  const [tab, setTab] = useState<string>(() => {
    const keys = Object.keys(instructions)
    return readSavedPlatform(keys) ?? keys[0] ?? ""
  })

  const value = platformKeys.includes(tab) ? tab : platformKeys[0] ?? ""

  const handleValueChange = useCallback((newValue: string | number | null) => {
    if (newValue === null || typeof newValue === "number") return
    setTab(newValue)
    try {
      localStorage.setItem(STORAGE_KEY, newValue)
    } catch {
      // ignore
    }
  }, [])

  if (platformKeys.length === 0) return null

  return (
    <section aria-labelledby="install-heading" className="mt-10">
      <h2
        id="install-heading"
        className="text-sm font-semibold text-foreground"
      >
        Install
      </h2>
      <Tabs
        value={value}
        onValueChange={handleValueChange}
        className="mt-3"
      >
        <TabsList className="flex-wrap">
          {platformKeys.map((key) => (
            <TabsTrigger key={key} value={key}>
              {tabLabel(key)}
            </TabsTrigger>
          ))}
        </TabsList>
        {platformKeys.map((key) => (
          <TabsContent key={key} value={key} className="mt-4">
            <div className="relative rounded-lg border border-border bg-muted/30">
              <div className="flex items-start justify-end gap-2 border-b border-border px-3 py-2">
                <CopyButton text={instructions[key] ?? ""} />
              </div>
              <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-foreground">
                <code>{instructions[key]}</code>
              </pre>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </section>
  )
}
