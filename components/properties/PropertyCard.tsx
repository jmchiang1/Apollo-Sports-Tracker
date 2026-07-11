"use client";

import { ChevronDown, Trash2 } from "lucide-react";
import { FitStars } from "./FitStars";
import { NumberInput } from "@/components/ui/NumberInput";
import { useAppStore } from "@/store/useAppStore";
import {
  PROPERTY_STATUS_LABELS,
  RATE_TYPE_LABELS,
  allInPerSf,
  annualRent,
} from "@/lib/property";
import type { PropertyRow } from "@/lib/types";
import { cn, formatUSD } from "@/lib/utils";

const inputClass =
  "focus-ring w-full rounded-lg border border-border-subtle bg-surface px-2.5 py-1.5 text-sm text-foreground placeholder:text-muted/60";

const STATUS_PILL: Record<NonNullable<PropertyRow["status"]>, string> = {
  lead: "bg-stone-100 text-stone-600 ring-stone-200",
  requested_info: "bg-amber-100 text-amber-800 ring-amber-200",
  toured: "bg-sky-100 text-sky-800 ring-sky-200",
  shortlist: "bg-emerald-100 text-emerald-800 ring-emerald-200",
  passed: "bg-stone-100 text-stone-400 ring-stone-200 line-through",
};

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-muted">{label}</span>
      {children}
    </label>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-surface-2 px-2.5 py-1.5">
      <div className="text-[10px] font-medium uppercase tracking-wide text-muted">
        {label}
      </div>
      <div className="text-sm font-semibold tabular-nums text-foreground">
        {value}
      </div>
    </div>
  );
}

export function PropertyCard({
  property,
  open,
  onToggle,
}: {
  property: PropertyRow;
  open: boolean;
  onToggle: () => void;
}) {
  const update = useAppStore((s) => s.updateProperty);
  const remove = useAppStore((s) => s.removeProperty);
  const p = property;
  const patch = (patchObj: Partial<PropertyRow>) => update(p.id, patchObj);

  const allIn = allInPerSf(p);
  const rent = annualRent(p);

  return (
    <article
      id={`property-${p.id}`}
      className={cn(
        "scroll-mt-20 overflow-hidden rounded-2xl border bg-surface shadow-soft transition",
        open ? "border-accent/30" : "border-border-subtle",
      )}
    >
      {/* Summary header */}
      <div className="p-4">
        <div className="flex items-start gap-3">
          <button
            type="button"
            onClick={onToggle}
            aria-expanded={open}
            className="focus-ring flex min-w-0 flex-1 items-start gap-3 rounded-lg text-left"
          >
            <ChevronDown
              className={cn(
                "mt-0.5 size-4 shrink-0 text-muted transition-transform duration-200",
                open && "rotate-180",
              )}
            />
            <span className="min-w-0 flex-1">
              <span className="flex flex-wrap items-center gap-2">
                <span className="truncate font-medium text-foreground">
                  {p.address || "Untitled property"}
                </span>
                {p.status && (
                  <span
                    className={cn(
                      "shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset",
                      STATUS_PILL[p.status],
                    )}
                  >
                    {PROPERTY_STATUS_LABELS[p.status]}
                  </span>
                )}
              </span>
              {(p.broker || p.contact) && (
                <span className="mt-0.5 block truncate text-xs text-muted">
                  {[p.broker, p.contact].filter(Boolean).join(" · ")}
                </span>
              )}
            </span>
          </button>
          <FitStars value={p.fitScore} readOnly size={15} />
        </div>

        <div className="mt-3 grid grid-cols-3 gap-2">
          <Stat
            label="Sq ft"
            value={p.sqft ? p.sqft.toLocaleString() : "—"}
          />
          <Stat
            label="All-in $/SF"
            value={allIn ? `$${allIn.toFixed(2)}` : "—"}
          />
          <Stat label="Annual rent" value={rent ? formatUSD(rent) : "—"} />
        </div>
      </div>

      {/* Editable detail */}
      <div className="collapsible" data-open={open}>
        <div className="collapsible-inner">
          <div className="space-y-4 border-t border-border-subtle p-4">
            <Field label="Address">
              <input
                className={inputClass}
                value={p.address}
                onChange={(e) => patch({ address: e.target.value })}
                placeholder="123 Main St, Great Neck, NY"
              />
            </Field>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Field label="Broker">
                <input
                  className={inputClass}
                  value={p.broker}
                  onChange={(e) => patch({ broker: e.target.value })}
                  placeholder="Name / firm"
                />
              </Field>
              <Field label="Contact">
                <input
                  className={inputClass}
                  value={p.contact}
                  onChange={(e) => patch({ contact: e.target.value })}
                  placeholder="Phone / email"
                />
              </Field>

              <Field label="Square footage">
                <NumberInput
                  value={p.sqft ?? 0}
                  onChange={(v) => patch({ sqft: v })}
                  suffix="SF"
                  step={500}
                  className="w-full"
                />
              </Field>
              <Field label="Clear height">
                <NumberInput
                  value={p.clearHeightFt ?? 0}
                  onChange={(v) => patch({ clearHeightFt: v })}
                  suffix="ft"
                  step={1}
                  className="w-full"
                />
              </Field>

              <Field label="Base rate $/SF">
                <NumberInput
                  value={p.baseRatePerSf ?? 0}
                  onChange={(v) => patch({ baseRatePerSf: v })}
                  prefix="$"
                  step={0.5}
                  className="w-full"
                />
              </Field>
              <Field label="Rate type">
                <select
                  className={inputClass}
                  value={p.rateType ?? "unknown"}
                  onChange={(e) =>
                    patch({ rateType: e.target.value as PropertyRow["rateType"] })
                  }
                >
                  {Object.entries(RATE_TYPE_LABELS).map(([k, label]) => (
                    <option key={k} value={k}>
                      {label}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="NNN load $/SF">
                <NumberInput
                  value={p.nnnLoadPerSf ?? 0}
                  onChange={(v) => patch({ nnnLoadPerSf: v })}
                  prefix="$"
                  step={0.5}
                  className="w-full"
                />
              </Field>
              <Field label="Parking spaces">
                <NumberInput
                  value={p.parking ?? 0}
                  onChange={(v) => patch({ parking: v })}
                  step={1}
                  className="w-full"
                />
              </Field>

              <Field label="TI allowance $/SF">
                <NumberInput
                  value={p.tiPerSf ?? 0}
                  onChange={(v) => patch({ tiPerSf: v })}
                  prefix="$"
                  step={1}
                  className="w-full"
                />
              </Field>
              <Field label="Column spacing">
                <input
                  className={inputClass}
                  value={p.columnSpacing ?? ""}
                  onChange={(e) => patch({ columnSpacing: e.target.value })}
                  placeholder="e.g. 40 × 40 ft"
                />
              </Field>

              <Field label="Zoning">
                <input
                  className={inputClass}
                  value={p.zoning ?? ""}
                  onChange={(e) => patch({ zoning: e.target.value })}
                  placeholder="e.g. Light industrial"
                />
              </Field>
              <Field label="Use permitted">
                <input
                  className={inputClass}
                  value={p.usePermitted ?? ""}
                  onChange={(e) => patch({ usePermitted: e.target.value })}
                  placeholder="as-of-right / change-of-use / unknown"
                />
              </Field>

              <Field label="Status">
                <select
                  className={inputClass}
                  value={p.status ?? "lead"}
                  onChange={(e) =>
                    patch({ status: e.target.value as PropertyRow["status"] })
                  }
                >
                  {Object.entries(PROPERTY_STATUS_LABELS).map(([k, label]) => (
                    <option key={k} value={k}>
                      {label}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Fit score">
                <div className="pt-1">
                  <FitStars
                    value={p.fitScore}
                    onChange={(v) => patch({ fitScore: v })}
                  />
                </div>
              </Field>
            </div>

            {/* Derived readout */}
            <div className="flex flex-wrap gap-2 rounded-xl bg-accent-tint px-3 py-2.5 text-sm">
              <span className="text-muted">Computed:</span>
              <span className="font-semibold text-foreground">
                All-in ${allIn.toFixed(2)}/SF
              </span>
              <span className="text-muted">·</span>
              <span className="font-semibold text-accent-strong">
                {formatUSD(rent)}/yr
              </span>
            </div>

            <Field label="Notes">
              <textarea
                className={cn(inputClass, "min-h-20 resize-y leading-relaxed")}
                value={p.notes ?? ""}
                onChange={(e) => patch({ notes: e.target.value })}
                placeholder="Broker follow-ups, condition, red flags…"
              />
            </Field>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => remove(p.id)}
                className="focus-ring inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-rose-600 transition hover:bg-rose-50"
              >
                <Trash2 className="size-4" />
                Delete property
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
