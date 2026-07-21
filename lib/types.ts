// Core domain types for the Apollo Sports launch tracker.

export type TaskStatus = "not_started" | "in_progress" | "done" | "blocked" | "na";

export const TASK_STATUSES: TaskStatus[] = [
  "not_started",
  "in_progress",
  "done",
  "blocked",
  "na",
];

export interface TaskGuidance {
  what: string; // one-line description of the task
  nextAction: string; // the single most important next thing to do
  steps: string[]; // ordered sub-steps
  resources?: string[]; // links, phone numbers, contacts, form names
  done: string; // completion criteria — how you know it's finished
  flags?: string[]; // caveats, "verify this", estimate-vs-verified notes
}

/** Static, code-defined definition of a task. Never mutated at runtime. */
export interface TaskSeed {
  id: string; // stable slug, e.g. "llc-publication"
  phaseId: string; // FK to Phase
  title: string;
  guidance: TaskGuidance;
  dependsOn?: string[]; // task ids that should be done first
  initialStatus?: TaskStatus; // seed default (defaults to "not_started")
}

/**
 * A task the user created themselves. Unlike seed tasks (which live in code),
 * the whole definition is persisted.
 */
export interface CustomTask {
  id: string; // "custom-<uuid>"
  phaseId: string;
  title: string;
  what?: string; // optional one-liner
  nextAction?: string; // optional "do this next"
  createdAt: string; // ISO timestamp
}

/** A task definition from either source, with its effective phase applied. */
export interface TaskDef extends TaskSeed {
  isCustom?: boolean;
}

/** User-mutable, persisted state for a single task. */
export interface TaskUserState {
  status: TaskStatus;
  notes: string;
  targetDate?: string; // ISO date
  updatedAt?: string; // ISO timestamp
}

/** A fully-assembled task: definition + user state. Used by the UI. */
export interface Task extends TaskDef {
  status: TaskStatus;
  notes: string;
  targetDate?: string;
  updatedAt?: string;
}

export interface Phase {
  id: string;
  order: number;
  title: string;
  subtitle?: string;
}

export interface CapitalInputs {
  sqft: number;
  buildoutPerSf: number;
  softCostPct: number;
  contingencyPct: number;
  equityPct: number;
  leaseUpfront: number;
  ffe: number;
  preOpening: number;
}

export type ScenarioKey = "low" | "expected" | "high";

export type CapitalState = Record<ScenarioKey, CapitalInputs>;

/** The complete persisted blob. Seed guidance/phases live in code; user data lives here. */
export interface PersistedState {
  version: number;
  taskState: Record<string, TaskUserState>;
  capital: CapitalState;
  /** Tasks the user added themselves. */
  customTasks?: CustomTask[];
  /** phaseId -> ordered task ids. Ids missing here fall back to natural order. */
  taskOrder?: Record<string, string[]>;
  /** taskId -> phaseId, when the user moved a task to a different phase. */
  phaseOverrides?: Record<string, string>;
  updatedAt?: string; // ISO timestamp of the last write (used to merge across devices)
}
