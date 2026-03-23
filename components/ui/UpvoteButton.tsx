"use client";

import { ArrowUp, Check, Loader2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import type { UpvoteEntityType } from "@/lib/upvotes";
import {
  addUpvote,
  hasUpvoted,
  removeUpvote,
} from "@/lib/upvotes";
import { cn } from "@/lib/utils";

import { Button } from "./button";

type UpvoteState =
  | "INITIALIZING"
  | "IDLE"
  | "PENDING"
  | "UPVOTED"
  | "ERRORED";

export function UpvoteButton({
  slug,
  initialCount,
  entityType = "skill",
}: {
  slug: string;
  initialCount: number;
  entityType?: UpvoteEntityType;
}) {
  const [state, setState] = useState<UpvoteState>("INITIALIZING");
  const [count, setCount] = useState(initialCount);
  const postAbortRef = useRef<AbortController | null>(null);
  const errorClearTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  useEffect(() => {
    return () => {
      postAbortRef.current?.abort();
      if (errorClearTimeoutRef.current != null) {
        clearTimeout(errorClearTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const ac = new AbortController();
    let cancelled = false;

    async function init() {
      const voted = hasUpvoted(entityType, slug);
      try {
        const res = await fetch(`/api/${entityType === "plugin" ? "plugins" : "skills"}/${slug}/upvote`, {
          signal: ac.signal,
        });
        if (!res.ok) {
          if (!cancelled) {
            setCount(initialCount);
            setState(voted ? "UPVOTED" : "IDLE");
          }
          return;
        }
        const data = (await res.json()) as { upvoteCount?: number };
        if (cancelled) return;
        if (typeof data.upvoteCount === "number") {
          setCount(data.upvoteCount);
        } else {
          setCount(initialCount);
        }
        setState(voted ? "UPVOTED" : "IDLE");
      } catch (e) {
        if (e instanceof Error && e.name === "AbortError") return;
        if (cancelled) return;
        setCount(initialCount);
        setState(voted ? "UPVOTED" : "IDLE");
      }
    }

    void init();
    return () => {
      cancelled = true;
      ac.abort();
    };
  }, [slug, initialCount, entityType]);

  const handleClick = useCallback(async () => {
    if (state !== "IDLE") return;

    setState("PENDING");
    const previousCount = count;
    setCount((c) => c + 1);
    addUpvote(entityType, slug);

    const ac = new AbortController();
    postAbortRef.current = ac;

    const scheduleReturnToIdle = () => {
      if (errorClearTimeoutRef.current != null) {
        clearTimeout(errorClearTimeoutRef.current);
      }
      errorClearTimeoutRef.current = setTimeout(() => {
        errorClearTimeoutRef.current = null;
        setState("IDLE");
      }, 2200);
    };

    try {
      const res = await fetch(`/api/${entityType === "plugin" ? "plugins" : "skills"}/${slug}/upvote`, {
        method: "POST",
        signal: ac.signal,
      });

      if (res.ok) {
        const data = (await res.json()) as { upvoteCount?: number };
        if (typeof data.upvoteCount === "number") {
          setCount(data.upvoteCount);
        }
        setState("UPVOTED");
        return;
      }

      setCount(previousCount);
      removeUpvote(entityType, slug);
      setState("ERRORED");
      scheduleReturnToIdle();
    } catch (e) {
      if (e instanceof Error && e.name === "AbortError") {
        setCount(previousCount);
        removeUpvote(entityType, slug);
        return;
      }
      setCount(previousCount);
      removeUpvote(entityType, slug);
      setState("ERRORED");
      scheduleReturnToIdle();
    } finally {
      if (postAbortRef.current === ac) {
        postAbortRef.current = null;
      }
    }
  }, [state, count, slug, entityType]);

  const disabled =
    state === "INITIALIZING" ||
    state === "PENDING" ||
    state === "UPVOTED" ||
    state === "ERRORED";

  return (
    <div className="inline-flex flex-col items-stretch gap-1">
      <Button
        type="button"
        variant={state === "UPVOTED" ? "default" : "outline"}
        size="xs"
        disabled={disabled}
        onClick={() => void handleClick()}
        className={cn(
          "min-w-[4.25rem]",
          state === "INITIALIZING" && "opacity-60",
          state === "ERRORED" &&
            "border-destructive/50 text-destructive hover:bg-destructive/10",
        )}
        aria-pressed={state === "UPVOTED"}
        aria-busy={state === "PENDING"}
      >
        {state === "INITIALIZING" && (
          <>
            <ArrowUp className="size-3.5 opacity-40" aria-hidden />
            <span className="tabular-nums opacity-60">{count}</span>
          </>
        )}
        {state === "IDLE" && (
          <>
            <ArrowUp className="size-3.5" aria-hidden />
            <span className="tabular-nums">{count}</span>
          </>
        )}
        {state === "PENDING" && (
          <>
            <Loader2 className="size-3.5 animate-spin" aria-hidden />
            <span className="tabular-nums">{count}</span>
          </>
        )}
        {state === "UPVOTED" && (
          <>
            <Check className="size-3.5" aria-hidden />
            <span className="tabular-nums">{count}</span>
          </>
        )}
        {state === "ERRORED" && (
          <span className="text-xs font-medium">Failed</span>
        )}
      </Button>
      {state === "ERRORED" && (
        <p className="text-center text-[10px] text-destructive" role="alert">
          Could not save. Try again.
        </p>
      )}
    </div>
  );
}
