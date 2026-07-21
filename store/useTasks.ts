"use client";

import { useMemo } from "react";
import { assembleFromState, useAppStore } from "./useAppStore";
import type { Task } from "@/lib/types";

/**
 * Full, assembled task list (seed + custom tasks, in the user's chosen order,
 * merged with persisted state). Memoized on the pieces it depends on.
 */
export function useTasks(): Task[] {
  const taskState = useAppStore((s) => s.taskState);
  const customTasks = useAppStore((s) => s.customTasks);
  const taskOrder = useAppStore((s) => s.taskOrder);
  const phaseOverrides = useAppStore((s) => s.phaseOverrides);
  return useMemo(
    () =>
      assembleFromState({ taskState, customTasks, taskOrder, phaseOverrides }),
    [taskState, customTasks, taskOrder, phaseOverrides],
  );
}

/** True once persisted state has been loaded from storage. */
export function useHydrated(): boolean {
  return useAppStore((s) => s.hydrated);
}
