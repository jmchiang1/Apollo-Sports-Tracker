"use client";

import Link from "next/link";
import { ArrowRight, PartyPopper, Sparkles } from "lucide-react";
import { StatusControl } from "@/components/tasks/StatusControl";
import { useAppStore } from "@/store/useAppStore";
import type { Phase, Task } from "@/lib/types";

export function NextUpCard({
  task,
  phase,
}: {
  task: Task | null;
  phase?: Phase;
}) {
  const setTaskStatus = useAppStore((s) => s.setTaskStatus);

  if (!task) {
    return (
      <div className="rounded-3xl border border-emerald-200 bg-emerald-50/60 p-6 shadow-soft sm:p-8">
        <div className="flex items-center gap-2 text-emerald-700">
          <PartyPopper className="size-5" />
          <span className="text-[11px] font-semibold uppercase tracking-[0.16em]">
            All clear
          </span>
        </div>
        <p className="mt-3 font-display text-2xl font-semibold tracking-tight text-foreground">
          Nothing is waiting on you right now.
        </p>
        <p className="mt-2 text-sm text-muted">
          Every actionable task is done, blocked, or waiting on a prerequisite.
          Check the Blocked list below, or mark something in progress to keep
          moving.
        </p>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-3xl border border-accent/30 bg-gradient-to-br from-accent-tint to-surface p-6 shadow-soft-lg sm:p-8">
      <div className="pointer-events-none absolute -right-10 -top-10 size-40 rounded-full bg-accent/10 blur-2xl" />
      <div className="relative">
        <div className="flex items-center gap-2 text-accent-strong">
          <Sparkles className="size-4" />
          <span className="text-[11px] font-semibold uppercase tracking-[0.16em]">
            Next up
          </span>
          {phase && (
            <span className="rounded-full bg-surface/70 px-2 py-0.5 text-[11px] font-medium text-muted ring-1 ring-inset ring-border-subtle">
              Phase {phase.order} · {phase.title}
            </span>
          )}
        </div>

        <h2 className="mt-3 font-display text-2xl font-semibold leading-tight tracking-tight text-foreground sm:text-3xl">
          {task.title}
        </h2>

        <div className="mt-4 flex items-start gap-2.5">
          <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-accent text-accent-contrast">
            <ArrowRight className="size-3.5" strokeWidth={2.5} />
          </span>
          <p className="text-[15px] font-medium leading-relaxed text-foreground">
            {task.guidance.nextAction}
          </p>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <StatusControl
            value={task.status}
            onChange={(s) => setTaskStatus(task.id, s)}
            size="sm"
          />
          <Link
            href={`/roadmap?task=${task.id}`}
            className="focus-ring inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-accent-contrast shadow-soft transition hover:bg-accent-strong"
          >
            Open task
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
