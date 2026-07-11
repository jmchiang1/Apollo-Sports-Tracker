import type { CapitalInputs } from "./types";

export interface CapitalResult {
  hardCosts: number;
  softCosts: number;
  contingency: number;
  total: number;
  yourEquity: number;
  financed: number;
}

/**
 * Capital stack formulas (see build spec §10). All figures are ESTIMATES.
 *
 *   hardCosts   = sqft * buildoutPerSf
 *   softCosts   = hardCosts * softCostPct
 *   contingency = (hardCosts + softCosts) * contingencyPct
 *   total       = hardCosts + softCosts + contingency + leaseUpfront + ffe + preOpening
 *   yourEquity  = total * equityPct
 *   financed    = total - yourEquity
 */
export function computeCapital(inputs: CapitalInputs): CapitalResult {
  const hardCosts = inputs.sqft * inputs.buildoutPerSf;
  const softCosts = hardCosts * inputs.softCostPct;
  const contingency = (hardCosts + softCosts) * inputs.contingencyPct;
  const total =
    hardCosts +
    softCosts +
    contingency +
    inputs.leaseUpfront +
    inputs.ffe +
    inputs.preOpening;
  const yourEquity = total * inputs.equityPct;
  const financed = total - yourEquity;

  return { hardCosts, softCosts, contingency, total, yourEquity, financed };
}
