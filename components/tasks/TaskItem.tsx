"use client";

import {
  ChevronDown,
  ChevronUp,
  GripVertical,
  Lock,
  NotebookPen,
} from "lucide-react";
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
  /** Reorder mode: rows become compact with move up/down controls. */
  reordering?: boolean;
  onMove?: (dir: "up" | "down") => void;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
}

function CustomBadge() {
  return (
    <span className="shrink-0 rounded-full bg-accent-soft px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-accent-strong">
      Yours
    </span>
  );
}

export function TaskItem({
  task,
  open,
  onToggle,
  blockedByDeps,
  reordering,
  onMove,
  canMoveUp,
  canMoveDown,
}: TaskItemProps) {
  const setTaskStatus = useAppStore((s) => s.setTaskStatus);
  const hasNotes = task.notes.trim().length > 0;
  const locked = (blockedByDeps?.length ?? 0) > 0;

  // Compact, drag-free reordering row.
  if (reordering) {
    return (
      <article
        id={`task-${task.id}`}
        className="scroll-mt-20 rounded-2xl border border-border-subtle bg-surface"
      >
        <div className="flex items-center gap-2.5 p-3 sm:gap-3 sm:p-3.5">
          <GripVertical className="size-4 shrink-0 text-muted/60" />
          <StatusDot status={task.status} />
          <span className="min-w-0 flex-1 truncate text-sm font-medium text-foreground">
            {task.title}
          </span>
          {task.isCustom && <CustomBadge />}
          <div className="flex shrink-0 items-center gap-1">
            <button
              type="button"
              onClick={() => onMove?.("up")}
              disabled={!canMoveUp}
              aria-label={`Move ${task.title} up`}
              className="focus-ring rounded-lg border border-border-subtle p-1.5 text-muted transition hover:bg-surface-2 hover:text-foreground disabled:opacity-30 disabled:hover:bg-transparent"
            >
              <ChevronUp className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => onMove?.("down")}
              disabled={!canMoveDown}
              aria-label={`Move ${task.title} down`}
              className="focus-ring rounded-lg border border-border-subtle p-1.5 text-muted transition hover:bg-surface-2 hover:text-foreground disabled:opacity-30 disabled:hover:bg-transparent"
            >
              <ChevronDown className="size-4" />
            </button>
          </div>
        </div>
      </article>
    );
  }

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
            <span className="flex items-center gap-2">
              <span
                className={cn(
                  "min-w-0 truncate font-medium leading-snug text-foreground",
                  (task.status === "done" || task.status === "na") &&
                    "text-muted line-through decoration-1",
                )}
              >
                {task.title}
              </span>
              {task.isCustom && <CustomBadge />}
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
