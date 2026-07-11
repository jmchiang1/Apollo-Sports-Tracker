import type { Task } from "./types";

export interface Progress {
  done: number;
  total: number; // excludes "na" tasks
  pct: number; // 0..1
}

/** Progress over a task list: % of non-"na" tasks marked "done". */
export function computeProgress(tasks: Task[]): Progress {
  const counted = tasks.filter((t) => t.status !== "na");
  const done = counted.filter((t) => t.status === "done").length;
  const total = counted.length;
  return { done, total, pct: total === 0 ? 0 : done / total };
}

export function tasksInPhase(tasks: Task[], phaseId: string): Task[] {
  return tasks.filter((t) => t.phaseId === phaseId);
}
