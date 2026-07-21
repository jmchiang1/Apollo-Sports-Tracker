import type { CustomTask, PersistedState } from "./types";

/** Is ISO timestamp `a` strictly newer than `b`? Missing = oldest. */
function isNewer(a?: string, b?: string): boolean {
  if (!a) return false;
  if (!b) return true;
  return a > b; // ISO 8601 strings sort chronologically
}

/**
 * Merge a local and a cloud snapshot without losing edits from either device:
 * each task keeps the entry with the newer `updatedAt`; capital follows the
 * snapshot with the newer top-level timestamp. Used on sign-in and on re-focus.
 */
export function mergePersisted(
  local: PersistedState | null,
  cloud: PersistedState | null,
): PersistedState | null {
  if (!local) return cloud;
  if (!cloud) return local;

  const ids = new Set([
    ...Object.keys(local.taskState),
    ...Object.keys(cloud.taskState),
  ]);
  const taskState: PersistedState["taskState"] = {};
  for (const id of ids) {
    const l = local.taskState[id];
    const c = cloud.taskState[id];
    if (l && c) taskState[id] = isNewer(l.updatedAt, c.updatedAt) ? l : c;
    else taskState[id] = l ?? c;
  }

  const localWins = isNewer(local.updatedAt, cloud.updatedAt);

  // Union custom tasks by id so a task created offline on either device
  // survives; the newer snapshot wins for ids present on both sides.
  const customById = new Map<string, CustomTask>();
  const first = localWins ? cloud.customTasks : local.customTasks;
  const second = localWins ? local.customTasks : cloud.customTasks;
  for (const c of first ?? []) customById.set(c.id, c);
  for (const c of second ?? []) customById.set(c.id, c);

  return {
    version: local.version ?? cloud.version ?? 1,
    taskState,
    capital: localWins ? local.capital : cloud.capital,
    customTasks: [...customById.values()],
    taskOrder: (localWins ? local.taskOrder : cloud.taskOrder) ?? {},
    phaseOverrides: (localWins ? local.phaseOverrides : cloud.phaseOverrides) ?? {},
    updatedAt: localWins ? local.updatedAt : cloud.updatedAt,
  };
}
