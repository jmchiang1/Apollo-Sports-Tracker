"use client";

import { create } from "zustand";
import { DEFAULT_CAPITAL, TASK_SEED } from "@/data/seed";
import { getStorage } from "@/lib/storage";
import type {
  CapitalInputs,
  CapitalState,
  PersistedState,
  ScenarioKey,
  Task,
  TaskStatus,
  TaskUserState,
} from "@/lib/types";

const STORAGE_VERSION = 1;
const storage = getStorage();

function nowIso(): string {
  return new Date().toISOString();
}

/** Default per-task user state, seeded from each task's initialStatus. */
function seedTaskState(): Record<string, TaskUserState> {
  const out: Record<string, TaskUserState> = {};
  for (const t of TASK_SEED) {
    out[t.id] = { status: t.initialStatus ?? "not_started", notes: "" };
  }
  return out;
}

/**
 * Merge stored user state over the seed defaults (build spec §3 merge strategy):
 * new seed tasks appear automatically; existing user status/notes are never
 * clobbered; stored ids no longer in the seed are dropped.
 */
function mergeTaskState(
  stored: Record<string, TaskUserState> | undefined,
): Record<string, TaskUserState> {
  const base = seedTaskState();
  if (!stored) return base;
  const merged: Record<string, TaskUserState> = {};
  for (const id of Object.keys(base)) {
    merged[id] = stored[id] ? { ...base[id], ...stored[id] } : base[id];
  }
  return merged;
}

function mergeCapital(stored: CapitalState | undefined): CapitalState {
  if (!stored) return structuredClone(DEFAULT_CAPITAL);
  return {
    low: { ...DEFAULT_CAPITAL.low, ...stored.low },
    expected: { ...DEFAULT_CAPITAL.expected, ...stored.expected },
    high: { ...DEFAULT_CAPITAL.high, ...stored.high },
  };
}

/** Assemble full UI tasks from static seed + persisted user state, in seed order. */
export function assembleTasks(
  taskState: Record<string, TaskUserState>,
): Task[] {
  return TASK_SEED.map((seed) => {
    const s = taskState[seed.id] ?? { status: "not_started", notes: "" };
    return {
      ...seed,
      status: s.status,
      notes: s.notes,
      targetDate: s.targetDate,
      updatedAt: s.updatedAt,
    };
  });
}

interface AppStore {
  hydrated: boolean;
  taskState: Record<string, TaskUserState>;
  capital: CapitalState;

  hydrate: () => Promise<void>;
  setTaskStatus: (id: string, status: TaskStatus) => void;
  setTaskNotes: (id: string, notes: string) => void;
  setTaskTargetDate: (id: string, date: string | undefined) => void;
  setCapitalField: (
    scenario: ScenarioKey,
    field: keyof CapitalInputs,
    value: number,
  ) => void;
  resetAll: () => void;
}

// Debounced persistence so rapid edits (typing notes) don't thrash storage.
let saveTimer: ReturnType<typeof setTimeout> | null = null;
function scheduleSave(get: () => AppStore) {
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    const { taskState, capital } = get();
    const payload: PersistedState = {
      version: STORAGE_VERSION,
      taskState,
      capital,
    };
    void storage.save(payload);
  }, 250);
}

export const useAppStore = create<AppStore>((set, get) => ({
  hydrated: false,
  taskState: seedTaskState(),
  capital: structuredClone(DEFAULT_CAPITAL),

  hydrate: async () => {
    if (get().hydrated) return;
    const loaded = await storage.load();
    set({
      taskState: mergeTaskState(loaded?.taskState),
      capital: mergeCapital(loaded?.capital),
      hydrated: true,
    });
  },

  setTaskStatus: (id, status) => {
    set((state) => ({
      taskState: {
        ...state.taskState,
        [id]: { ...state.taskState[id], status, updatedAt: nowIso() },
      },
    }));
    scheduleSave(get);
  },

  setTaskNotes: (id, notes) => {
    set((state) => ({
      taskState: {
        ...state.taskState,
        [id]: { ...state.taskState[id], notes, updatedAt: nowIso() },
      },
    }));
    scheduleSave(get);
  },

  setTaskTargetDate: (id, date) => {
    set((state) => ({
      taskState: {
        ...state.taskState,
        [id]: { ...state.taskState[id], targetDate: date, updatedAt: nowIso() },
      },
    }));
    scheduleSave(get);
  },

  setCapitalField: (scenario, field, value) => {
    set((state) => ({
      capital: {
        ...state.capital,
        [scenario]: { ...state.capital[scenario], [field]: value },
      },
    }));
    scheduleSave(get);
  },

  resetAll: () => {
    set({
      taskState: seedTaskState(),
      capital: structuredClone(DEFAULT_CAPITAL),
    });
    scheduleSave(get);
  },
}));
