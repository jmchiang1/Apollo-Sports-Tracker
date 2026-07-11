"use client";

import { STATUS_META, STATUS_ORDER } from "@/lib/status";
import type { TaskStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

interface StatusControlProps {
  value: TaskStatus;
  onChange: (status: TaskStatus) => void;
  size?: "sm" | "md";
  className?: string;
}

/** Segmented control for setting a task's status. */
export function StatusControl({
  value,
  onChange,
  size = "md",
  className,
}: StatusControlProps) {
  return (
    <div
      role="radiogroup"
      aria-label="Task status"
      className={cn(
        "inline-flex flex-wrap gap-1 rounded-xl bg-surface-2 p-1 ring-1 ring-inset ring-border-subtle",
        className,
      )}
    >
      {STATUS_ORDER.map((status) => {
        const meta = STATUS_META[status];
        const active = value === status;
        return (
          <button
            key={status}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(status)}
            className={cn(
              "focus-ring rounded-lg font-medium transition-colors",
              size === "sm" ? "px-2.5 py-1 text-xs" : "px-3 py-1.5 text-sm",
              active
                ? meta.active
                : "text-muted hover:bg-surface hover:text-foreground",
            )}
          >
            {size === "sm" ? meta.short : meta.label}
          </button>
        );
      })}
    </div>
  );
}
