"use client";

import { useState } from "react";
import { RotateCcw } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { cn } from "@/lib/utils";

/**
 * Reset all statuses, notes, and capital inputs back to the seed.
 * Two-step inline confirm (no jarring native dialog).
 */
export function ResetButton({ className }: { className?: string }) {
  const resetAll = useAppStore((s) => s.resetAll);
  const [confirming, setConfirming] = useState(false);

  if (confirming) {
    return (
      <div
        className={cn(
          "flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50/70 p-2 text-xs",
          className,
        )}
      >
        <span className="text-rose-700">Reset everything?</span>
        <button
          type="button"
          onClick={() => {
            resetAll();
            setConfirming(false);
          }}
          className="focus-ring rounded-lg bg-rose-600 px-2 py-1 font-medium text-white transition hover:bg-rose-700"
        >
          Reset
        </button>
        <button
          type="button"
          onClick={() => setConfirming(false)}
          className="focus-ring rounded-lg px-2 py-1 font-medium text-muted transition hover:text-foreground"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setConfirming(true)}
      className={cn(
        "focus-ring flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-muted transition hover:bg-surface-2 hover:text-foreground",
        className,
      )}
    >
      <RotateCcw className="size-3.5" />
      Reset to seed data
    </button>
  );
}
