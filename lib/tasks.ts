import type {
  CustomTask,
  Phase,
  Task,
  TaskDef,
  TaskSeed,
  TaskUserState,
} from "./types";

/** Turn a user-created task into a uniform definition (guidance fields optional). */
export function customToDef(c: CustomTask): TaskDef {
  return {
    id: c.id,
    phaseId: c.phaseId,
    title: c.title,
    isCustom: true,
    guidance: {
      what: c.what ?? "",
      nextAction: c.nextAction ?? "",
      steps: [],
      done: "",
    },
  };
}

/** All task definitions (seed first, then custom), with phase moves applied. */
export function buildDefs(
  seed: TaskSeed[],
  customTasks: CustomTask[] = [],
  phaseOverrides: Record<string, string> = {},
): TaskDef[] {
  const defs: TaskDef[] = seed.map((s) => ({
    ...s,
    phaseId: phaseOverrides[s.id] ?? s.phaseId,
  }));
  for (const c of customTasks) {
    const def = customToDef(c);
    defs.push({ ...def, phaseId: phaseOverrides[c.id] ?? def.phaseId });
  }
  return defs;
}

/**
 * Task ids for one phase in the user's chosen order: the saved order first
 * (with ids that no longer belong to this phase dropped), then anything new
 * appended in natural order. This is what makes app updates that add seed
 * tasks — or tasks moved in from another phase — just work.
 */
export function orderedIdsForPhase(
  phaseId: string,
  defs: TaskDef[],
  taskOrder: Record<string, string[]> = {},
): string[] {
  const natural = defs.filter((d) => d.phaseId === phaseId).map((d) => d.id);
  const valid = new Set(natural);
  const result = (taskOrder[phaseId] ?? []).filter((id) => valid.has(id));
  const seen = new Set(result);
  for (const id of natural) {
    if (!seen.has(id)) result.push(id);
  }
  return result;
}

/** Move an id one slot up or down. Returns a new array (unchanged at the ends). */
export function moveWithin(
  ids: string[],
  id: string,
  dir: "up" | "down",
): string[] {
  const from = ids.indexOf(id);
  if (from === -1) return ids;
  const to = dir === "up" ? from - 1 : from + 1;
  if (to < 0 || to >= ids.length) return ids;
  const next = [...ids];
  [next[from], next[to]] = [next[to], next[from]];
  return next;
}

function withState(
  def: TaskDef,
  taskState: Record<string, TaskUserState>,
): Task {
  const s = taskState[def.id];
  return {
    ...def,
    status: s?.status ?? def.initialStatus ?? "not_started",
    notes: s?.notes ?? "",
    targetDate: s?.targetDate,
    updatedAt: s?.updatedAt,
  };
}

/**
 * The full task list the UI renders: phases in order, tasks within each phase in
 * the user's order, each merged with its persisted state. The resulting array
 * order is what "next up" walks, so reordering changes what surfaces next.
 */
export function assembleFrom(
  seed: TaskSeed[],
  phases: Phase[],
  taskState: Record<string, TaskUserState>,
  customTasks: CustomTask[] = [],
  taskOrder: Record<string, string[]> = {},
  phaseOverrides: Record<string, string> = {},
): Task[] {
  const defs = buildDefs(seed, customTasks, phaseOverrides);
  const byId = new Map(defs.map((d) => [d.id, d]));
  const ordered: Task[] = [];
  const emitted = new Set<string>();

  for (const phase of [...phases].sort((a, b) => a.order - b.order)) {
    for (const id of orderedIdsForPhase(phase.id, defs, taskOrder)) {
      const def = byId.get(id);
      if (!def) continue;
      ordered.push(withState(def, taskState));
      emitted.add(id);
    }
  }

  // Safety net: a task pointing at an unknown phase still shows up.
  for (const def of defs) {
    if (!emitted.has(def.id)) ordered.push(withState(def, taskState));
  }
  return ordered;
}
