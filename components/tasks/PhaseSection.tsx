"use client";

import { Check, ChevronDown } from "lucide-react";
import { TaskItem } from "./TaskItem";
import { ProgressBar } from "@/components/ui/ProgressBar";
import type { Progress } from "@/lib/progress";
import type { Phase, Task } from "@/lib/types";
import { cn, formatPct } from "@/lib/utils";

interface PhaseSectionProps {
  phase: Phase;
  progress: Progress;
  visibleTasks: Task[];
  open: boolean;
  onToggle: () => void;
  openTaskId: string | null;
  onToggleTask: (id: string) => void;
  blockedByDepsById: Map<string, string[]>;
}

export function PhaseSection({
  phase,
  progress,
  visibleTasks,
  open,
  onToggle,
  openTaskId,
  onToggleTask,
  blockedByDepsById,
}: PhaseSectionProps) {
  const complete = progress.total > 0 && progress.done === progress.total;

  return (
    <section>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="focus-ring flex w-full items-center gap-3 rounded-xl px-2 py-3 text-left sm:gap-4"
      >
        <span
          className={cn(
            "grid size-9 shrink-0 place-items-center rounded-full text-sm font-semibold",
            complete
              ? "bg-accent text-accent-contrast"
              : "bg-accent-soft text-accent-strong",
          )}
        >
          {complete ? <Check className="size-4" strokeWidth={3} /> : phase.order}
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2.5">
            <h2 className="font-display text-lg font-semibold tracking-tight text-foreground sm:text-xl">
              {phase.title}
            </h2>
            <span className="rounded-full bg-surface-2 px-2 py-0.5 text-xs font-medium text-muted">
              {progress.done}/{progress.total}
            </span>
          </div>
          {phase.subtitle && (
            <p className="mt-0.5 truncate text-sm text-muted">{phase.subtitle}</p>
          )}
        </div>

        <div className="hidden w-28 shrink-0 items-center gap-2 sm:flex">
          <ProgressBar value={progress.pct} className="h-1.5" />
          <span className="w-9 text-right text-xs font-semibold text-muted">
            {formatPct(progress.pct)}
          </span>
        </div>

        <ChevronDown
          className={cn(
            "size-5 shrink-0 text-muted transition-transform duration-200",
            open && "rotate-180",
          )}
        />
      </button>

      <div className="collapsible" data-open={open}>
        <div className="collapsible-inner">
          <ul className="space-y-2 pb-3 pt-1">
            {visibleTasks.length === 0 ? (
              <li className="px-2 py-4 text-sm text-muted">
                No tasks match the current filter in this phase.
              </li>
            ) : (
              visibleTasks.map((task) => (
                <li key={task.id}>
                  <TaskItem
                    task={task}
                    open={openTaskId === task.id}
                    onToggle={() => onToggleTask(task.id)}
                    blockedByDeps={blockedByDepsById.get(task.id)}
                  />
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </section>
  );
}
