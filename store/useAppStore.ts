"use client";

import { create } from "zustand";
import { DEFAULT_CAPITAL, PHASES, TASK_SEED } from "@/data/seed";
import { getStorage } from "@/lib/storage";
import {
  assembleFrom,
  buildDefs,
  moveWithin,
  orderedIdsForPhase,
} from "@/lib/tasks";
import type {
  CapitalInputs,
  CapitalState,
  CustomTask,
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

function newCustomId(): string {
  const rand =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
  return `custom-${rand}`;
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
 * clobbered; stored ids that belong to neither the seed nor a custom task are
 * dropped.
 */
function mergeTaskState(
  stored: Record<string, TaskUserState> | undefined,
  customIds: string[] = [],
): Record<string, TaskUserState> {
  const base = seedTaskState();
  const merged: Record<string, TaskUserState> = {};
  for (const id of Object.keys(base)) {
    merged[id] = stored?.[id] ? { ...base[id], ...stored[id] } : base[id];
  }
  for (const id of customIds) {
    merged[id] = stored?.[id] ?? { status: "not_started", notes: "" };
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

interface AppStore {
  hydrated: boolean;
  taskState: Record<string, TaskUserState>;
  capital: CapitalState;
  customTasks: CustomTask[];
  taskOrder: Record<string, string[]>;
  phaseOverrides: Record<string, string>;

  hydrate: () => Promise<void>;
  setTaskStatus: (id: string, status: TaskStatus) => void;
  setTaskNotes: (id: string, notes: string) => void;
  setTaskTargetDate: (id: string, date: string | undefined) => void;
  setCapitalField: (
    scenario: ScenarioKey,
    field: keyof CapitalInputs,
    value: number,
  ) => void;

  /** Add a task of your own to a phase. Returns its new id. */
  addCustomTask: (
    phaseId: string,
    title: string,
    extra?: { what?: string; nextAction?: string },
  ) => string;
  updateCustomTask: (
    id: string,
    patch: Partial<Pick<CustomTask, "title" | "what" | "nextAction">>,
  ) => void;
  deleteCustomTask: (id: string) => void;
  /** Move a task one slot up or down within its phase. */
  moveTask: (id: string, dir: "up" | "down") => void;
  /** Move any task (seed or custom) to a different phase. */
  setTaskPhase: (id: string, phaseId: string) => void;

  resetAll: () => void;
  /** Replace state from a (merged) snapshot — used by the cloud sync engine. */
  applySnapshot: (snapshot: PersistedState) => void;
}

/** Assemble the ordered UI task list from the current store state. */
export function assembleFromState(state: {
  taskState: Record<string, TaskUserState>;
  customTasks: CustomTask[];
  taskOrder: Record<string, string[]>;
  phaseOverrides: Record<string, string>;
}): Task[] {
  return assembleFrom(
    TASK_SEED,
    PHASES,
    state.taskState,
    state.customTasks,
    state.taskOrder,
    state.phaseOverrides,
  );
}

/** The phase a task belongs to before any user move. */
function basePhaseOf(id: string, customTasks: CustomTask[]): string | undefined {
  return (
    TASK_SEED.find((t) => t.id === id)?.phaseId ??
    customTasks.find((c) => c.id === id)?.phaseId
  );
}

// Debounced persistence so rapid edits (typing notes) don't thrash storage.
let saveTimer: ReturnType<typeof setTimeout> | null = null;
function scheduleSave() {
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    void storage.save(currentPersisted());
  }, 250);
}

export const useAppStore = create<AppStore>((set, get) => ({
  hydrated: false,
  taskState: seedTaskState(),
  capital: structuredClone(DEFAULT_CAPITAL),
  customTasks: [],
  taskOrder: {},
  phaseOverrides: {},

  hydrate: async () => {
    if (get().hydrated) return;
    const loaded = await storage.load();
    const customTasks = loaded?.customTasks ?? [];
    set({
      taskState: mergeTaskState(
        loaded?.taskState,
        customTasks.map((c) => c.id),
      ),
      capital: mergeCapital(loaded?.capital),
      customTasks,
      taskOrder: loaded?.taskOrder ?? {},
      phaseOverrides: loaded?.phaseOverrides ?? {},
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
    scheduleSave();
  },

  setTaskNotes: (id, notes) => {
    set((state) => ({
      taskState: {
        ...state.taskState,
        [id]: { ...state.taskState[id], notes, updatedAt: nowIso() },
      },
    }));
    scheduleSave();
  },

  setTaskTargetDate: (id, date) => {
    set((state) => ({
      taskState: {
        ...state.taskState,
        [id]: { ...state.taskState[id], targetDate: date, updatedAt: nowIso() },
      },
    }));
    scheduleSave();
  },

  setCapitalField: (scenario, field, value) => {
    set((state) => ({
      capital: {
        ...state.capital,
        [scenario]: { ...state.capital[scenario], [field]: value },
      },
    }));
    scheduleSave();
  },

  addCustomTask: (phaseId, title, extra) => {
    const id = newCustomId();
    const task: CustomTask = {
      id,
      phaseId,
      title: title.trim() || "Untitled task",
      what: extra?.what?.trim() || undefined,
      nextAction: extra?.nextAction?.trim() || undefined,
      createdAt: nowIso(),
    };
    set((state) => ({
      customTasks: [...state.customTasks, task],
      taskState: {
        ...state.taskState,
        [id]: { status: "not_started", notes: "", updatedAt: nowIso() },
      },
    }));
    scheduleSave();
    return id;
  },

  updateCustomTask: (id, patch) => {
    set((state) => ({
      customTasks: state.customTasks.map((c) =>
        c.id === id
          ? {
              ...c,
              ...patch,
              title: patch.title !== undefined ? patch.title : c.title,
            }
          : c,
      ),
      taskState: {
        ...state.taskState,
        [id]: { ...state.taskState[id], updatedAt: nowIso() },
      },
    }));
    scheduleSave();
  },

  deleteCustomTask: (id) => {
    set((state) => {
      const taskState = { ...state.taskState };
      delete taskState[id];
      const phaseOverrides = { ...state.phaseOverrides };
      delete phaseOverrides[id];
      const taskOrder: Record<string, string[]> = {};
      for (const [phaseId, ids] of Object.entries(state.taskOrder)) {
        taskOrder[phaseId] = ids.filter((x) => x !== id);
      }
      return {
        customTasks: state.customTasks.filter((c) => c.id !== id),
        taskState,
        phaseOverrides,
        taskOrder,
      };
    });
    scheduleSave();
  },

  moveTask: (id, dir) => {
    const { customTasks, taskOrder, phaseOverrides } = get();
    const defs = buildDefs(TASK_SEED, customTasks, phaseOverrides);
    const def = defs.find((d) => d.id === id);
    if (!def) return;
    const current = orderedIdsForPhase(def.phaseId, defs, taskOrder);
    const next = moveWithin(current, id, dir);
    if (next === current) return; // already at the top/bottom
    set({ taskOrder: { ...taskOrder, [def.phaseId]: next } });
    scheduleSave();
  },

  setTaskPhase: (id, phaseId) => {
    set((state) => {
      const phaseOverrides = { ...state.phaseOverrides };
      if (basePhaseOf(id, state.customTasks) === phaseId) {
        delete phaseOverrides[id]; // back home — no override needed
      } else {
        phaseOverrides[id] = phaseId;
      }
      return { phaseOverrides };
    });
    scheduleSave();
  },

  resetAll: () => {
    set({
      taskState: seedTaskState(),
      capital: structuredClone(DEFAULT_CAPITAL),
      customTasks: [],
      taskOrder: {},
      phaseOverrides: {},
    });
    scheduleSave();
  },

  applySnapshot: (snapshot) => {
    const customTasks = snapshot.customTasks ?? [];
    set({
      taskState: mergeTaskState(
        snapshot.taskState,
        customTasks.map((c) => c.id),
      ),
      capital: mergeCapital(snapshot.capital),
      customTasks,
      taskOrder: snapshot.taskOrder ?? {},
      phaseOverrides: snapshot.phaseOverrides ?? {},
    });
    scheduleSave();
  },
}));

/** Current in-memory state as a persistable blob (for the cloud sync engine). */
export function currentPersisted(): PersistedState {
  const { taskState, capital, customTasks, taskOrder, phaseOverrides } =
    useAppStore.getState();
  return {
    version: STORAGE_VERSION,
    taskState,
    capital,
    customTasks,
    taskOrder,
    phaseOverrides,
    updatedAt: nowIso(),
  };
}
