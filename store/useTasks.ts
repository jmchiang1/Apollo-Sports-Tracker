"use client";

import { useMemo } from "react";
import { assembleTasks, useAppStore } from "./useAppStore";
import type { Task } from "@/lib/types";

/** Full, assembled task list (seed + user state), memoized on user state. */
export function useTasks(): Task[] {
  const taskState = useAppStore((s) => s.taskState);
  return useMemo(() => assembleTasks(taskState), [taskState]);
}

/** True once persisted state has been loaded from storage. */
export function useHydrated(): boolean {
  return useAppStore((s) => s.hydrated);
}
