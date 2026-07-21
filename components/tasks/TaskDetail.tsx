"use client";

import { useState } from "react";
import { CalendarDays, FolderInput, Trash2, X } from "lucide-react";
import { GuidanceBlock } from "./GuidanceBlock";
import { NotesField } from "./NotesField";
import { PHASES } from "@/data/seed";
import { useAppStore } from "@/store/useAppStore";
import type { Task } from "@/lib/types";
import { cn } from "@/lib/utils";

const SORTED_PHASES = [...PHASES].sort((a, b) => a.order - b.order);

const inputClass =
  "focus-ring w-full rounded-lg border border-border-subtle bg-surface px-3 py-2 text-sm text-foreground placeholder:text-muted/60";

/** Title / what / next-action editor, shown only for tasks the user created. */
function CustomTaskEditor({ task }: { task: Task }) {
  const updateCustomTask = useAppStore((s) => s.updateCustomTask);
  return (
    <div className="space-y-3 rounded-2xl border border-accent/25 bg-accent-tint p-4">
      <div className="text-[11px] font-semibold uppercase tracking-[0.13em] text-accent-strong">
        Your task
      </div>
      <label className="block">
        <span className="mb-1 block text-xs font-medium text-muted">Title</span>
        <input
          className={inputClass}
          value={task.title}
          onChange={(e) => updateCustomTask(task.id, { title: e.target.value })}
          placeholder="What needs doing?"
        />
      </label>
      <label className="block">
        <span className="mb-1 block text-xs font-medium text-muted">
          What this is <span className="font-normal">(optional)</span>
        </span>
        <input
          className={inputClass}
          value={task.guidance.what}
          onChange={(e) => updateCustomTask(task.id, { what: e.target.value })}
          placeholder="One line of context"
        />
      </label>
      <label className="block">
        <span className="mb-1 block text-xs font-medium text-muted">
          Next action <span className="font-normal">(optional)</span>
        </span>
        <input
          className={inputClass}
          value={task.guidance.nextAction}
          onChange={(e) =>
            updateCustomTask(task.id, { nextAction: e.target.value })
          }
          placeholder="The single next thing to do"
        />
      </label>
    </div>
  );
}

function DeleteCustomTask({ taskId }: { taskId: string }) {
  const deleteCustomTask = useAppStore((s) => s.deleteCustomTask);
  const [confirming, setConfirming] = useState(false);

  if (confirming) {
    return (
      <div className="flex items-center justify-end gap-2 text-xs">
        <span className="text-rose-700">Delete this task?</span>
        <button
          type="button"
          onClick={() => deleteCustomTask(taskId)}
          className="focus-ring rounded-lg bg-rose-600 px-2.5 py-1 font-medium text-white transition hover:bg-rose-700"
        >
          Delete
        </button>
        <button
          type="button"
          onClick={() => setConfirming(false)}
          className="focus-ring rounded-lg px-2.5 py-1 font-medium text-muted transition hover:text-foreground"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <div className="flex justify-end">
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="focus-ring inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-rose-600 transition hover:bg-rose-50"
      >
        <Trash2 className="size-4" />
        Delete task
      </button>
    </div>
  );
}

export function TaskDetail({ task }: { task: Task }) {
  const setTaskTargetDate = useAppStore((s) => s.setTaskTargetDate);
  const setTaskPhase = useAppStore((s) => s.setTaskPhase);

  return (
    <div className="space-y-6 border-t border-border-subtle px-4 pb-5 pt-5 sm:px-5">
      {/* Target date + phase */}
      <div className="flex flex-wrap items-end gap-x-6 gap-y-3">
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

        <div className="flex flex-wrap items-center gap-2">
          <label
            htmlFor={`phase-${task.id}`}
            className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.13em] text-muted"
          >
            <FolderInput className="size-3.5" />
            Phase
          </label>
          <select
            id={`phase-${task.id}`}
            value={task.phaseId}
            onChange={(e) => setTaskPhase(task.id, e.target.value)}
            className={cn(
              "focus-ring rounded-lg border border-border-subtle bg-surface px-2.5 py-1 text-sm text-foreground",
            )}
          >
            {SORTED_PHASES.map((p) => (
              <option key={p.id} value={p.id}>
                {p.order}. {p.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {task.isCustom ? (
        <CustomTaskEditor task={task} />
      ) : (
        <GuidanceBlock guidance={task.guidance} />
      )}

      <NotesField taskId={task.id} value={task.notes} />

      {task.isCustom && <DeleteCustomTask taskId={task.id} />}
    </div>
  );
}
