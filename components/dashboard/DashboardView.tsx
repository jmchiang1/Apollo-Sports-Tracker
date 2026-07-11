"use client";

import Link from "next/link";
import {
  Ban,
  CircleCheck,
  CircleDashed,
  Clock,
  FileText,
} from "lucide-react";
import { NextUpCard } from "./NextUpCard";
import { TaskMiniList } from "./TaskMiniList";
import { PageHeader } from "@/components/ui/PageHeader";
import { PageSkeleton } from "@/components/ui/Skeleton";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { ResetButton } from "@/components/nav/ResetButton";
import { ENTITY, PHASES } from "@/data/seed";
import { computeProgress } from "@/lib/progress";
import { pickNextUp } from "@/lib/nextUp";
import { useHydrated, useTasks } from "@/store/useTasks";
import { cn, formatDate, formatPct } from "@/lib/utils";

const SORTED_PHASES = [...PHASES].sort((a, b) => a.order - b.order);

function StatTile({
  label,
  value,
  icon: Icon,
  tone,
}: {
  label: string;
  value: number;
  icon: typeof Clock;
  tone: string;
}) {
  return (
    <div className="rounded-2xl border border-border-subtle bg-surface p-4 shadow-soft">
      <div className={cn("flex items-center gap-1.5", tone)}>
        <Icon className="size-4" />
        <span className="text-2xl font-semibold tabular-nums text-foreground">
          {value}
        </span>
      </div>
      <div className="mt-1 text-xs font-medium text-muted">{label}</div>
    </div>
  );
}

function PublicationCard({ done }: { done: boolean }) {
  const deadline = new Date(`${ENTITY.publicationDeadline}T00:00:00`);
  const now = new Date();
  const daysLeft = Math.ceil((deadline.getTime() - now.getTime()) / 86_400_000);
  const urgent = !done && daysLeft <= 30;
  const overdue = !done && daysLeft < 0;

  return (
    <div className="rounded-2xl border border-border-subtle bg-surface p-5 shadow-soft">
      <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
        <FileText className="size-3.5" />
        Publication deadline
      </div>
      <div className="mt-2 flex items-baseline gap-2">
        {done ? (
          <span className="font-display text-2xl font-semibold text-emerald-600">
            Filed
          </span>
        ) : (
          <>
            <span
              className={cn(
                "font-display text-3xl font-semibold tabular-nums",
                overdue
                  ? "text-rose-600"
                  : urgent
                    ? "text-amber-600"
                    : "text-foreground",
              )}
            >
              {overdue ? `${Math.abs(daysLeft)}` : daysLeft}
            </span>
            <span className="text-sm text-muted">
              {overdue ? "days overdue" : "days left"}
            </span>
          </>
        )}
      </div>
      <p className="mt-1 text-xs text-muted">
        Certificate of Publication due by {formatDate(ENTITY.publicationDeadline)}.
      </p>
    </div>
  );
}

export function DashboardView() {
  const tasks = useTasks();
  const hydrated = useHydrated();

  if (!hydrated) {
    return (
      <div>
        <PageHeader
          eyebrow={ENTITY.name}
          title="Launch dashboard"
          description="Where the build stands, and the single most important thing to do next."
        />
        <PageSkeleton />
      </div>
    );
  }

  const overall = computeProgress(tasks);
  const nextUp = pickNextUp(tasks, PHASES);
  const nextPhase = nextUp
    ? SORTED_PHASES.find((p) => p.id === nextUp.phaseId)
    : undefined;
  const inProgress = tasks.filter((t) => t.status === "in_progress");
  const blocked = tasks.filter((t) => t.status === "blocked");
  const doneCount = tasks.filter((t) => t.status === "done").length;
  const remaining = tasks.filter(
    (t) => t.status === "not_started" || t.status === "in_progress",
  ).length;
  const publicationDone =
    tasks.find((t) => t.id === "publication")?.status === "done";

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow={ENTITY.name}
        title="Launch dashboard"
        description="Where the build stands, and the single most important thing to do next."
      />

      <NextUpCard task={nextUp} phase={nextPhase} />

      {/* Progress + stats */}
      <div className="grid gap-4 lg:grid-cols-5">
        <div className="rounded-2xl border border-border-subtle bg-surface p-5 shadow-soft lg:col-span-2">
          <div className="flex items-baseline justify-between">
            <span className="text-sm font-medium text-muted">
              Overall progress
            </span>
            <span className="font-display text-3xl font-semibold tabular-nums text-foreground">
              {formatPct(overall.pct)}
            </span>
          </div>
          <ProgressBar value={overall.pct} className="mt-3 h-2.5" />
          <p className="mt-2 text-xs text-muted">
            {overall.done} of {overall.total} tasks done
            {tasks.length - overall.total > 0 &&
              ` · ${tasks.length - overall.total} marked N/A`}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 lg:col-span-3 lg:grid-cols-4">
          <StatTile
            label="In progress"
            value={inProgress.length}
            icon={Clock}
            tone="text-amber-500"
          />
          <StatTile
            label="Blocked"
            value={blocked.length}
            icon={Ban}
            tone="text-rose-500"
          />
          <StatTile
            label="Done"
            value={doneCount}
            icon={CircleCheck}
            tone="text-emerald-500"
          />
          <StatTile
            label="Remaining"
            value={remaining}
            icon={CircleDashed}
            tone="text-stone-400"
          />
        </div>
      </div>

      {/* Per-phase chips */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">By phase</h2>
          <Link
            href="/roadmap"
            className="focus-ring rounded-lg text-sm font-medium text-accent-strong hover:underline"
          >
            Open roadmap
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {SORTED_PHASES.map((phase) => {
            const p = computeProgress(
              tasks.filter((t) => t.phaseId === phase.id),
            );
            const complete = p.total > 0 && p.done === p.total;
            return (
              <Link
                key={phase.id}
                href={`/roadmap?phase=${phase.id}`}
                className="focus-ring group rounded-2xl border border-border-subtle bg-surface p-4 shadow-soft transition hover:border-accent/30"
              >
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "grid size-6 shrink-0 place-items-center rounded-full text-xs font-semibold",
                      complete
                        ? "bg-accent text-accent-contrast"
                        : "bg-accent-soft text-accent-strong",
                    )}
                  >
                    {phase.order}
                  </span>
                  <span className="truncate text-sm font-medium text-foreground">
                    {phase.title}
                  </span>
                </div>
                <ProgressBar value={p.pct} className="mt-3 h-1.5" />
                <div className="mt-1.5 text-xs text-muted">
                  {p.done}/{p.total} done
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* In progress + Blocked + Publication */}
      <div className="grid gap-4 lg:grid-cols-2">
        <TaskMiniList
          title="In progress"
          icon={Clock}
          iconClassName="text-amber-500"
          tasks={inProgress}
          emptyMessage="Nothing in progress. Pick up the Next up task above."
        />
        <div className="space-y-4">
          <TaskMiniList
            title="Blocked"
            icon={Ban}
            iconClassName="text-rose-500"
            tasks={blocked}
            emptyMessage="Nothing blocked — clear runway."
          />
          <PublicationCard done={publicationDone} />
        </div>
      </div>

      <div className="flex justify-center pt-2 md:hidden">
        <ResetButton />
      </div>
    </div>
  );
}
