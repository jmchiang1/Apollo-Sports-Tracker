import type { PropertyRow } from "./types";

/** All-in $/SF = base rate + NNN load. */
export function allInPerSf(p: PropertyRow): number {
  return (p.baseRatePerSf ?? 0) + (p.nnnLoadPerSf ?? 0);
}

/** Annual rent = all-in $/SF × square footage. */
export function annualRent(p: PropertyRow): number {
  return allInPerSf(p) * (p.sqft ?? 0);
}

/**
 * Sort properties by fit score desc, then annual rent asc (cheaper first).
 * Rows without a fit score sink to the bottom.
 */
export function sortProperties(rows: PropertyRow[]): PropertyRow[] {
  return [...rows].sort((a, b) => {
    const fitA = a.fitScore ?? -1;
    const fitB = b.fitScore ?? -1;
    if (fitB !== fitA) return fitB - fitA;
    return annualRent(a) - annualRent(b);
  });
}

export const PROPERTY_STATUS_LABELS: Record<
  NonNullable<PropertyRow["status"]>,
  string
> = {
  lead: "Lead",
  requested_info: "Requested info",
  toured: "Toured",
  shortlist: "Shortlist",
  passed: "Passed",
};

export const RATE_TYPE_LABELS: Record<
  NonNullable<PropertyRow["rateType"]>,
  string
> = {
  gross: "Gross",
  nnn: "NNN",
  unknown: "Unknown",
};
