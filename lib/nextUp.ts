import type { Phase, Task, TaskStatus } from "./types";

/**
 * A task's dependencies are satisfied when every task it dependsOn is either
 * "done" or "na". Missing dependency ids are treated as satisfied so a typo in
 * the seed can never permanently block the pipeline.
 */
export function dependenciesMet(
  task: Task,
  statusById: Map<string, TaskStatus>,
): boolean {
  if (!task.dependsOn || task.dependsOn.length === 0) return true;
  return task.dependsOn.every((depId) => {
    const s = statusById.get(depId);
    if (s === undefined) return true;
    return s === "done" || s === "na";
  });
}

/** A task is actionable if it still needs doing and nothing blocks it. */
export function isActionable(
  task: Task,
  statusById: Map<string, TaskStatus>,
): boolean {
  if (task.status !== "not_started" && task.status !== "in_progress") {
    return false;
  }
  return dependenciesMet(task, statusById);
}

/**
 * Pick the single highest-priority actionable task (build spec §6).
 *   1. Only not_started / in_progress tasks.
 *   2. Exclude tasks whose dependencies aren't done (or na).
 *   3. Prefer in_progress over not_started.
 *   4. Ties break by phase order, then array order within the phase.
 *
 * `tasks` is expected in seed order (phase order, then within-phase order).
 */
export function pickNextUp(tasks: Task[], phases: Phase[]): Task | null {
  const statusById = new Map(tasks.map((t) => [t.id, t.status]));
  const phaseOrder = new Map(phases.map((p) => [p.id, p.order]));

  const candidates = tasks
    .map((task, index) => ({ task, index }))
    .filter(({ task }) => isActionable(task, statusById));

  if (candidates.length === 0) return null;

  candidates.sort((a, b) => {
    // 3. in_progress before not_started
    const aInProg = a.task.status === "in_progress" ? 0 : 1;
    const bInProg = b.task.status === "in_progress" ? 0 : 1;
    if (aInProg !== bInProg) return aInProg - bInProg;

    // 4a. lowest phase order
    const aPhase = phaseOrder.get(a.task.phaseId) ?? Number.MAX_SAFE_INTEGER;
    const bPhase = phaseOrder.get(b.task.phaseId) ?? Number.MAX_SAFE_INTEGER;
    if (aPhase !== bPhase) return aPhase - bPhase;

    // 4b. seed / array order
    return a.index - b.index;
  });

  return candidates[0].task;
}
