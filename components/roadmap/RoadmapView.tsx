"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowUpDown, ChevronsDownUp, ChevronsUpDown } from "lucide-react";
import { PhaseSection } from "@/components/tasks/PhaseSection";
import { PageHeader } from "@/components/ui/PageHeader";
import { PageSkeleton } from "@/components/ui/Skeleton";
import { PHASES } from "@/data/seed";
import { computeProgress } from "@/lib/progress";
import { useHydrated, useTasks } from "@/store/useTasks";
import type { Phase, Task } from "@/lib/types";
import { cn } from "@/lib/utils";

type StatusFilter = "all" | "incomplete" | "in_progress" | "blocked";

const SORTED_PHASES = [...PHASES].sort((a, b) => a.order - b.order);

function firstIncompletePhase(tasks: Task[]): string {
  for (const p of SORTED_PHASES) {
    const incomplete = tasks.some(
      (t) => t.phaseId === p.id && t.status !== "done" && t.status !== "na",
    );
    if (incomplete) return p.id;
  }
  return SORTED_PHASES[0]?.id ?? "";
}

function passesStatus(task: Task, filter: StatusFilter): boolean {
  switch (filter) {
    case "incomplete":
      return task.status !== "done" && task.status !== "na";
    case "in_progress":
      return task.status === "in_progress";
    case "blocked":
      return task.status === "blocked";
    default:
      return true;
  }
}

export function RoadmapView() {
  const tasks = useTasks();
  const hydrated = useHydrated();
  const searchParams = useSearchParams();
  const taskParam = searchParams.get("task");
  const phaseParam = searchParams.get("phase");
  const validPhaseParam = SORTED_PHASES.some((p) => p.id === phaseParam)
    ? (phaseParam as string)
    : null;

  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  // null → defer to the ?phase= param (or "all"); a value means the user chose it.
  const [phaseFilterChoice, setPhaseFilterChoice] = useState<string | null>(null);
  // null → follow the default (first incomplete phase open); otherwise explicit set.
  const [openPhaseIds, setOpenPhaseIds] = useState<Set<string> | null>(null);
  // undefined → defer to ?task= param; null → explicitly closed; string → open.
  const [openTaskChoice, setOpenTaskChoice] = useState<
    string | null | undefined
  >(undefined);
  const [reordering, setReordering] = useState(false);

  // Reordering is only unambiguous against the full, unfiltered list.
  const activeStatusFilter: StatusFilter = reordering ? "all" : statusFilter;
  const phaseFilter = reordering
    ? "all"
    : (phaseFilterChoice ?? validPhaseParam ?? "all");
  const openTaskId =
    openTaskChoice !== undefined ? openTaskChoice : (taskParam ?? null);
  const filterActive = activeStatusFilter !== "all" || phaseFilter !== "all";

  const defaultOpenPhaseId = useMemo(
    () => firstIncompletePhase(tasks),
    [tasks],
  );
  const openTask = tasks.find((t) => t.id === openTaskId);

  const idToTitle = useMemo(
    () => new Map(tasks.map((t) => [t.id, t.title])),
    [tasks],
  );

  const blockedByDepsById = useMemo(() => {
    const statusById = new Map(tasks.map((t) => [t.id, t.status]));
    const map = new Map<string, string[]>();
    for (const t of tasks) {
      if (t.status === "done" || t.status === "na") continue;
      const unmet = (t.dependsOn ?? [])
        .filter((dep) => {
          const s = statusById.get(dep);
          return s !== undefined && s !== "done" && s !== "na";
        })
        .map((dep) => idToTitle.get(dep) ?? dep);
      if (unmet.length) map.set(t.id, unmet);
    }
    return map;
  }, [tasks, idToTitle]);

  const counts = useMemo(
    () => ({
      all: tasks.length,
      incomplete: tasks.filter((t) => t.status !== "done" && t.status !== "na")
        .length,
      in_progress: tasks.filter((t) => t.status === "in_progress").length,
      blocked: tasks.filter((t) => t.status === "blocked").length,
    }),
    [tasks],
  );

  // Scroll a deep-linked task into view once it's rendered (DOM only, no state).
  useEffect(() => {
    if (!taskParam) return;
    const id = window.setTimeout(() => {
      document
        .getElementById(`task-${taskParam}`)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 240);
    return () => window.clearTimeout(id);
  }, [taskParam]);

  if (!hydrated) {
    return (
      <div>
        <PageHeader
          eyebrow="Every task, in order"
          title="Roadmap"
          description="Eight phases from forming the LLC to opening day. Set a status, jot notes, and open any task for exactly what to do next."
        />
        <PageSkeleton />
      </div>
    );
  }

  function isPhaseOpen(phaseId: string): boolean {
    if (filterActive) return true;
    if (openTask?.phaseId === phaseId) return true;
    if (openPhaseIds) return openPhaseIds.has(phaseId);
    return phaseId === defaultOpenPhaseId;
  }

  function togglePhase(id: string) {
    setOpenPhaseIds((prev) => {
      const base = prev ?? new Set([defaultOpenPhaseId]);
      const next = new Set(base);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleTask(id: string) {
    setOpenTaskChoice(openTaskId === id ? null : id);
  }

  const allExpanded =
    openPhaseIds !== null && openPhaseIds.size >= SORTED_PHASES.length;

  const statusFilters: { key: StatusFilter; label: string; count: number }[] = [
    { key: "all", label: "All", count: counts.all },
    { key: "incomplete", label: "Incomplete", count: counts.incomplete },
    { key: "in_progress", label: "In progress", count: counts.in_progress },
    { key: "blocked", label: "Blocked", count: counts.blocked },
  ];

  const renderedPhases = SORTED_PHASES.map((phase: Phase) => {
    const phaseTasks = tasks.filter((t) => t.phaseId === phase.id);
    const visibleTasks = phaseTasks.filter(
      (t) =>
        passesStatus(t, activeStatusFilter) &&
        (phaseFilter === "all" || t.phaseId === phaseFilter),
    );
    return { phase, phaseTasks, visibleTasks };
  }).filter(({ visibleTasks }) => !filterActive || visibleTasks.length > 0);

  return (
    <div>
      <PageHeader
        eyebrow="Every task, in order"
        title="Roadmap"
        description="Eight phases from forming the LLC to opening day. Set a status, jot notes, and open any task for exactly what to do next."
      />

      {/* Filter bar */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="scroll-thin -mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1">
          {statusFilters.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => setStatusFilter(f.key)}
              disabled={reordering}
              className={cn(
                "focus-ring flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium transition disabled:opacity-40",
                statusFilter === f.key
                  ? "bg-accent text-accent-contrast shadow-soft"
                  : "bg-surface text-muted ring-1 ring-inset ring-border-subtle hover:text-foreground",
              )}
            >
              {f.label}
              <span
                className={cn(
                  "rounded-full px-1.5 text-xs tabular-nums",
                  statusFilter === f.key ? "bg-white/20" : "bg-surface-2 text-muted",
                )}
              >
                {f.count}
              </span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <select
            value={phaseFilter}
            onChange={(e) => setPhaseFilterChoice(e.target.value)}
            aria-label="Filter by phase"
            disabled={reordering}
            className="focus-ring rounded-full border border-border-subtle bg-surface px-3.5 py-1.5 text-sm font-medium text-foreground disabled:opacity-40"
          >
            <option value="all">All phases</option>
            {SORTED_PHASES.map((p) => (
              <option key={p.id} value={p.id}>
                {p.order}. {p.title}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => setReordering((r) => !r)}
            aria-pressed={reordering}
            className={cn(
              "focus-ring flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition",
              reordering
                ? "border-accent bg-accent text-accent-contrast shadow-soft"
                : "border-border-subtle bg-surface text-muted hover:text-foreground",
            )}
          >
            <ArrowUpDown className="size-4" />
            {reordering ? "Done" : "Reorder"}
          </button>
          <button
            type="button"
            onClick={() =>
              setOpenPhaseIds(
                allExpanded
                  ? new Set()
                  : new Set(SORTED_PHASES.map((p) => p.id)),
              )
            }
            disabled={filterActive}
            className="focus-ring hidden items-center gap-1.5 rounded-full border border-border-subtle bg-surface px-3 py-1.5 text-sm font-medium text-muted transition hover:text-foreground disabled:opacity-40 sm:flex"
          >
            {allExpanded ? (
              <>
                <ChevronsDownUp className="size-4" /> Collapse
              </>
            ) : (
              <>
                <ChevronsUpDown className="size-4" /> Expand all
              </>
            )}
          </button>
        </div>
      </div>

      {reordering && (
        <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-accent/30 bg-accent-tint px-3.5 py-2.5 text-sm text-foreground/90">
          <ArrowUpDown className="mt-0.5 size-4 shrink-0 text-accent-strong" />
          <p>
            Use the arrows to arrange tasks within a phase. To move a task to a
            different phase, open it and change its <strong>Phase</strong>.
            Filters are paused while reordering.
          </p>
        </div>
      )}

      {/* Phases */}
      <div className="divide-y divide-border-subtle">
        {renderedPhases.map(({ phase, phaseTasks, visibleTasks }) => (
          <div key={phase.id} className="py-2">
            <PhaseSection
              phase={phase}
              progress={computeProgress(phaseTasks)}
              visibleTasks={visibleTasks}
              open={isPhaseOpen(phase.id)}
              onToggle={() => togglePhase(phase.id)}
              openTaskId={openTaskId}
              onToggleTask={toggleTask}
              blockedByDepsById={blockedByDepsById}
              reordering={reordering}
              onTaskAdded={(id) => setOpenTaskChoice(id)}
            />
          </div>
        ))}
        {renderedPhases.length === 0 && (
          <p className="py-10 text-center text-sm text-muted">
            No tasks match this filter.
          </p>
        )}
      </div>
    </div>
  );
}
