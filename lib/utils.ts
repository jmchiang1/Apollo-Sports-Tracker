import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind class names, resolving conflicts. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format a number as USD with no decimals, e.g. 1375080 -> "$1,375,080". */
export function formatUSD(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number.isFinite(n) ? n : 0);
}

/** Compact currency for tight spaces, e.g. 1375080 -> "$1.38M". */
export function formatUSDCompact(n: number): string {
  if (!Number.isFinite(n)) return "$0";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 2,
  }).format(n);
}

export function formatPct(fraction: number): string {
  return `${Math.round(fraction * 100)}%`;
}

/** A short, human date from an ISO string, e.g. "Nov 3, 2026". */
export function formatDate(iso?: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/** Create a URL-friendly id from arbitrary text. */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
