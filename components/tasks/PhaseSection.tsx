"use client";

import { useState } from "react";
import { Check, ChevronDown, Plus } from "lucide-react";
import { TaskItem } from "./TaskItem";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { useAppStore } from "@/store/useAppStore";
import type { Progress } from "@/lib/progress";
import type { Phase, Task } from "@/lib/types";
import { cn, formatPct } from "@/lib/utils";

const inputClass =
  "focus-ring w-full rounded-lg border border-border-subtle bg-surface px-3 py-2 text-sm text-foreground placeholder:text-muted/60";

/** Inline "add your own task" form at the foot of a phase. */
function AddTaskForm({
  phaseId,
  onAdded,
}: {
  phaseId: string;
  onAdded?: (id: string) => void;
}) {
  const addCustomTask = useAppStore((s) => s.addCustomTask);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [nextAction, setNextAction] = useState("");

  function reset() {
    setTitle("");
    setNextAction("");
    setOpen(false);
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;
    const id = addCustomTask(phaseId, trimmed, { nextAction });
    reset();
    onAdded?.(id);
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="focus-ring flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-border-subtle px-3 py-2.5 text-sm font-medium text-muted transition hover:border-accent/40 hover:bg-accent-tint/50 hover:text-accent-strong"
      >
        <Plus className="size-4" />
        Add task to this phase
      </button>
    );
  }

  return (
    <form
      onSubmit={submit}
      className="space-y-2.5 rounded-2xl border border-dashed border-accent/40 bg-accent-tint/60 p-3.5"
    >
      <input
        autoFocus
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Task title"
        aria-label="Task title"
        className={inputClass}
      />
      <input
        value={nextAction}
        onChange={(e) => setNextAction(e.target.value)}
        placeholder="Next action (optional)"
        aria-label="Next action"
        className={inputClass}
      />
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={!title.trim()}
          className="focus-ring rounded-lg bg-accent px-3 py-1.5 text-sm font-semibold text-accent-contrast transition hover:bg-accent-strong disabled:opacity-50"
        >
          Add task
        </button>
        <button
          type="button"
          onClick={reset}
          className="focus-ring rounded-lg px-3 py-1.5 text-sm font-medium text-muted transition hover:text-foreground"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

interface PhaseSectionProps {
  phase: Phase;
  progress: Progress;
  visibleTasks: Task[];
  open: boolean;
  onToggle: () => void;
  openTaskId: string | null;
  onToggleTask: (id: string) => void;
  blockedByDepsById: Map<string, string[]>;
  reordering?: boolean;
  onTaskAdded?: (id: string) => void;
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
  reordering,
  onTaskAdded,
}: PhaseSectionProps) {
  const moveTask = useAppStore((s) => s.moveTask);
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

      <div className="collapsible" data-open={open} inert={!open}>
        <div className="collapsible-inner">
          <ul className="space-y-2 pb-3 pt-1">
            {visibleTasks.length === 0 ? (
              <li className="px-2 py-4 text-sm text-muted">
                No tasks match the current filter in this phase.
              </li>
            ) : (
              visibleTasks.map((task, i) => (
                <li key={task.id}>
                  <TaskItem
                    task={task}
                    open={openTaskId === task.id}
                    onToggle={() => onToggleTask(task.id)}
                    blockedByDeps={blockedByDepsById.get(task.id)}
                    reordering={reordering}
                    onMove={(dir) => moveTask(task.id, dir)}
                    canMoveUp={i > 0}
                    canMoveDown={i < visibleTasks.length - 1}
                  />
                </li>
              ))
            )}
            {!reordering && (
              <li className="pt-1">
                <AddTaskForm phaseId={phase.id} onAdded={onTaskAdded} />
              </li>
            )}
          </ul>
        </div>
      </div>
    </section>
  );
}
