import type { TaskStatus } from "./types";

export interface StatusMeta {
  label: string;
  short: string;
  dot: string; // small round indicator background
  badge: string; // soft pill: bg + text + ring
  active: string; // filled segmented-control button when selected
  bar: string; // progress-bar fill color
}

/**
 * Status palette (build spec §5): grey = not started, amber = in progress,
 * green = done, red = blocked, muted = n/a.
 */
export const STATUS_META: Record<TaskStatus, StatusMeta> = {
  not_started: {
    label: "Not started",
    short: "To do",
    dot: "bg-stone-300",
    badge: "bg-stone-100 text-stone-600 ring-stone-200",
    active: "bg-stone-500 text-white shadow-sm",
    bar: "bg-stone-300",
  },
  in_progress: {
    label: "In progress",
    short: "Doing",
    dot: "bg-amber-400",
    badge: "bg-amber-100 text-amber-800 ring-amber-200",
    active: "bg-amber-500 text-white shadow-sm",
    bar: "bg-amber-400",
  },
  done: {
    label: "Done",
    short: "Done",
    dot: "bg-emerald-500",
    badge: "bg-emerald-100 text-emerald-800 ring-emerald-200",
    active: "bg-emerald-600 text-white shadow-sm",
    bar: "bg-emerald-500",
  },
  blocked: {
    label: "Blocked",
    short: "Blocked",
    dot: "bg-rose-500",
    badge: "bg-rose-100 text-rose-700 ring-rose-200",
    active: "bg-rose-600 text-white shadow-sm",
    bar: "bg-rose-500",
  },
  na: {
    label: "N/A",
    short: "N/A",
    dot: "bg-stone-300",
    badge: "bg-stone-100 text-stone-400 ring-stone-200",
    active: "bg-stone-400 text-white shadow-sm",
    bar: "bg-stone-200",
  },
};

export const STATUS_ORDER: TaskStatus[] = [
  "not_started",
  "in_progress",
  "done",
  "blocked",
  "na",
];
