"use client";

import { Info } from "lucide-react";
import { NumberInput } from "@/components/ui/NumberInput";
import { PageHeader } from "@/components/ui/PageHeader";
import { PageSkeleton } from "@/components/ui/Skeleton";
import { computeCapital } from "@/lib/capital";
import type { CapitalInputs, ScenarioKey } from "@/lib/types";
import { useAppStore } from "@/store/useAppStore";
import { useHydrated } from "@/store/useTasks";
import { cn, formatUSD } from "@/lib/utils";

const SCENARIOS: { key: ScenarioKey; label: string; hint: string }[] = [
  { key: "low", label: "Low", hint: "Smaller footprint, lean buildout" },
  { key: "expected", label: "Expected", hint: "Most likely case" },
  { key: "high", label: "High", hint: "Larger space, higher spec" },
];

type FieldKind = "sf" | "money" | "percent";
const INPUT_FIELDS: {
  key: keyof CapitalInputs;
  label: string;
  kind: FieldKind;
  step: number;
}[] = [
  { key: "sqft", label: "Square footage", kind: "sf", step: 500 },
  { key: "buildoutPerSf", label: "Buildout $/SF", kind: "money", step: 1 },
  { key: "softCostPct", label: "Soft costs", kind: "percent", step: 1 },
  { key: "contingencyPct", label: "Contingency", kind: "percent", step: 1 },
  { key: "equityPct", label: "Equity injection", kind: "percent", step: 1 },
  { key: "leaseUpfront", label: "Lease upfront", kind: "money", step: 1000 },
  { key: "ffe", label: "FF&E", kind: "money", step: 1000 },
  { key: "preOpening", label: "Pre-opening", kind: "money", step: 5000 },
];

function InputRow({
  scenario,
  field,
}: {
  scenario: ScenarioKey;
  field: (typeof INPUT_FIELDS)[number];
}) {
  const value = useAppStore((s) => s.capital[scenario][field.key]);
  const setCapitalField = useAppStore((s) => s.setCapitalField);
  const isPercent = field.kind === "percent";

  return (
    <div className="flex items-center justify-between gap-3">
      <label className="text-sm text-muted">{field.label}</label>
      <NumberInput
        value={isPercent ? Math.round(value * 1000) / 10 : value}
        onChange={(v) =>
          setCapitalField(scenario, field.key, isPercent ? v / 100 : v)
        }
        prefix={field.kind === "money" ? "$" : undefined}
        suffix={isPercent ? "%" : field.kind === "sf" ? "SF" : undefined}
        step={field.step}
        ariaLabel={`${field.label} (${scenario})`}
        className="w-36 shrink-0"
      />
    </div>
  );
}

function OutputRow({
  label,
  value,
  emphasize,
  tone,
}: {
  label: string;
  value: number;
  emphasize?: boolean;
  tone?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3 py-1.5",
        emphasize && "border-t border-border-subtle pt-2.5",
      )}
    >
      <span
        className={cn(
          "text-sm",
          emphasize ? "font-semibold text-foreground" : "text-muted",
        )}
      >
        {label}
      </span>
      <span
        className={cn(
          "font-semibold tabular-nums",
          emphasize ? "text-base" : "text-sm",
          tone ?? "text-foreground",
        )}
      >
        {formatUSD(value)}
      </span>
    </div>
  );
}

function ScenarioCard({
  scenario,
  label,
  hint,
  featured,
}: {
  scenario: ScenarioKey;
  label: string;
  hint: string;
  featured?: boolean;
}) {
  const inputs = useAppStore((s) => s.capital[scenario]);
  const r = computeCapital(inputs);

  return (
    <div
      className={cn(
        "flex flex-col rounded-2xl border bg-surface p-5 shadow-soft",
        featured ? "border-accent/40 ring-1 ring-accent/20" : "border-border-subtle",
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-display text-xl font-semibold tracking-tight text-foreground">
              {label}
            </h3>
            {featured && (
              <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-accent-contrast">
                Base case
              </span>
            )}
          </div>
          <p className="mt-0.5 text-xs text-muted">{hint}</p>
        </div>
      </div>

      <div className="mt-4 rounded-xl bg-accent-tint p-3 text-center">
        <div className="text-[11px] font-semibold uppercase tracking-[0.13em] text-accent-strong">
          Total project cost · est.
        </div>
        <div className="font-display text-3xl font-semibold tabular-nums text-foreground">
          {formatUSD(r.total)}
        </div>
      </div>

      {/* Editable drivers */}
      <div className="mt-5 space-y-2.5">
        <div className="text-[11px] font-semibold uppercase tracking-[0.13em] text-muted">
          Drivers
        </div>
        {INPUT_FIELDS.map((field) => (
          <InputRow key={field.key} scenario={scenario} field={field} />
        ))}
      </div>

      {/* Computed outputs */}
      <div className="mt-5">
        <div className="mb-1 text-[11px] font-semibold uppercase tracking-[0.13em] text-muted">
          Breakdown · est.
        </div>
        <OutputRow label="Hard costs" value={r.hardCosts} />
        <OutputRow label="Soft costs" value={r.softCosts} />
        <OutputRow label="Contingency" value={r.contingency} />
        <OutputRow label="Total project cost" value={r.total} emphasize />
        <OutputRow
          label="Your equity"
          value={r.yourEquity}
          tone="text-accent-strong"
        />
        <OutputRow
          label="Financed (SBA / loan)"
          value={r.financed}
          tone="text-emerald-600"
        />
      </div>
    </div>
  );
}

export function CapitalCalculator() {
  const hydrated = useHydrated();

  if (!hydrated) {
    return (
      <div>
        <PageHeader
          eyebrow="What it costs to open"
          title="Capital Stack"
          description="Live estimate of total project cost, your equity injection, and the amount to finance — across a Low, Expected, and High scenario."
        />
        <PageSkeleton />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        eyebrow="What it costs to open"
        title="Capital Stack"
        description="Live estimate of total project cost, your equity injection, and the amount to finance — across a Low, Expected, and High scenario. Edit any driver; everything recalculates instantly."
      />

      <div className="mb-6 flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50/70 p-3.5 text-sm text-foreground/90">
        <Info className="mt-0.5 size-4 shrink-0 text-amber-500" />
        <p>
          Every figure here is an <strong>estimate</strong>, not a verified
          quote. A landlord TI allowance (negotiated in the Lease phase) directly
          reduces the buildout line.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {SCENARIOS.map((s) => (
          <ScenarioCard
            key={s.key}
            scenario={s.key}
            label={s.label}
            hint={s.hint}
            featured={s.key === "expected"}
          />
        ))}
      </div>
    </div>
  );
}
