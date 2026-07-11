"use client";

import { CalendarDays, X } from "lucide-react";
import { GuidanceBlock } from "./GuidanceBlock";
import { NotesField } from "./NotesField";
import { useAppStore } from "@/store/useAppStore";
import type { Task } from "@/lib/types";

export function TaskDetail({ task }: { task: Task }) {
  const setTaskTargetDate = useAppStore((s) => s.setTaskTargetDate);

  return (
    <div className="space-y-6 border-t border-border-subtle px-4 pb-5 pt-5 sm:px-5">
      {/* Target date */}
      <div className="flex flex-wrap items-center gap-2">
        <label
          htmlFor={`date-${task.id}`}
          className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.13em] text-muted"
        >
          <CalendarDays className="size-3.5" />
          Target date
        </label>
        <input
          id={`date-${task.id}`}
          type="date"
          value={task.targetDate ?? ""}
          onChange={(e) =>
            setTaskTargetDate(task.id, e.target.value || undefined)
          }
          className="focus-ring rounded-lg border border-border-subtle bg-surface px-2.5 py-1 text-sm text-foreground"
        />
        {task.targetDate && (
          <button
            type="button"
            onClick={() => setTaskTargetDate(task.id, undefined)}
            className="focus-ring rounded-lg p-1 text-muted transition hover:bg-surface-2 hover:text-foreground"
            aria-label="Clear target date"
          >
            <X className="size-3.5" />
          </button>
        )}
      </div>

      <GuidanceBlock guidance={task.guidance} />

      <NotesField taskId={task.id} value={task.notes} />
    </div>
  );
}
