"use client";

import { ChevronDown, Lock, NotebookPen } from "lucide-react";
import { StatusDot } from "./StatusBadge";
import { StatusControl } from "./StatusControl";
import { TaskDetail } from "./TaskDetail";
import { useAppStore } from "@/store/useAppStore";
import type { Task } from "@/lib/types";
import { cn, formatDate } from "@/lib/utils";

interface TaskItemProps {
  task: Task;
  open: boolean;
  onToggle: () => void;
  /** Titles of prerequisite tasks that aren't done yet. */
  blockedByDeps?: string[];
}

export function TaskItem({
  task,
  open,
  onToggle,
  blockedByDeps,
}: TaskItemProps) {
  const setTaskStatus = useAppStore((s) => s.setTaskStatus);
  const hasNotes = task.notes.trim().length > 0;
  const locked = (blockedByDeps?.length ?? 0) > 0;

  return (
    <article
      id={`task-${task.id}`}
      className={cn(
        "scroll-mt-20 overflow-hidden rounded-2xl border bg-surface transition-shadow",
        open ? "border-accent/30 shadow-soft" : "border-border-subtle",
      )}
    >
      <div className="flex flex-col gap-2.5 p-3.5 sm:flex-row sm:items-center sm:gap-3 sm:p-4">
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          aria-controls={`detail-${task.id}`}
          className="focus-ring flex min-w-0 flex-1 items-center gap-3 rounded-lg text-left"
        >
          <StatusDot status={task.status} />
          <span className="min-w-0 flex-1">
            <span
              className={cn(
                "block truncate font-medium leading-snug text-foreground",
                task.status === "done" && "text-muted line-through decoration-1",
                task.status === "na" && "text-muted line-through decoration-1",
              )}
            >
              {task.title}
            </span>
            {(hasNotes || task.targetDate || locked) && (
              <span className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
                {hasNotes && (
                  <span className="inline-flex items-center gap-1">
                    <NotebookPen className="size-3" />
                    Notes
                  </span>
                )}
                {task.targetDate && (
                  <span className="inline-flex items-center gap-1">
                    {formatDate(task.targetDate)}
                  </span>
                )}
                {locked && (
                  <span className="inline-flex items-center gap-1 text-amber-600">
                    <Lock className="size-3" />
                    Waiting on {blockedByDeps!.join(", ")}
                  </span>
                )}
              </span>
            )}
          </span>
          <ChevronDown
            className={cn(
              "size-4 shrink-0 text-muted transition-transform duration-200 sm:hidden",
              open && "rotate-180",
            )}
          />
        </button>

        <StatusControl
          value={task.status}
          onChange={(s) => setTaskStatus(task.id, s)}
          size="sm"
          className="shrink-0"
        />

        <button
          type="button"
          onClick={onToggle}
          aria-hidden
          tabIndex={-1}
          className="hidden shrink-0 rounded-lg p-1 text-muted transition hover:bg-surface-2 hover:text-foreground sm:block"
        >
          <ChevronDown
            className={cn(
              "size-4 transition-transform duration-200",
              open && "rotate-180",
            )}
          />
        </button>
      </div>

      <div
        className="collapsible"
        data-open={open}
        id={`detail-${task.id}`}
        inert={!open}
      >
        <div className="collapsible-inner">
          <TaskDetail task={task} />
        </div>
      </div>
    </article>
  );
}
