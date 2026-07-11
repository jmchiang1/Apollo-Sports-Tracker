import { ArrowRight, CircleCheck, Link2 } from "lucide-react";
import type { TaskGuidance } from "@/lib/types";
import { RichText } from "./RichText";

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.13em] text-muted">
      {children}
    </div>
  );
}

export function GuidanceBlock({ guidance }: { guidance: TaskGuidance }) {
  return (
    <div className="space-y-6">
      {/* What this is */}
      <div>
        <SectionLabel>What this is</SectionLabel>
        <p className="text-sm leading-relaxed text-foreground/90">
          {guidance.what}
        </p>
      </div>

      {/* Next action — the single most important thing */}
      <div className="rounded-2xl border border-accent/25 bg-accent-tint p-4">
        <SectionLabel>
          <span className="text-accent-strong">Next action</span>
        </SectionLabel>
        <div className="flex items-start gap-2.5">
          <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-accent text-accent-contrast">
            <ArrowRight className="size-3.5" strokeWidth={2.5} />
          </span>
          <p className="text-sm font-medium leading-relaxed text-foreground">
            {guidance.nextAction}
          </p>
        </div>
      </div>

      {/* Steps */}
      {guidance.steps.length > 0 && (
        <div>
          <SectionLabel>Steps</SectionLabel>
          <ol className="space-y-2.5">
            {guidance.steps.map((step, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-accent-soft text-[11px] font-semibold text-accent-strong">
                  {i + 1}
                </span>
                <span className="text-sm leading-relaxed text-foreground/90">
                  <RichText text={step} />
                </span>
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Resources */}
      {guidance.resources && guidance.resources.length > 0 && (
        <div>
          <SectionLabel>Resources</SectionLabel>
          <ul className="space-y-2">
            {guidance.resources.map((res, i) => (
              <li
                key={i}
                className="flex items-start gap-2.5 rounded-xl bg-surface-2 px-3 py-2.5"
              >
                <Link2 className="mt-0.5 size-4 shrink-0 text-muted" />
                <span className="text-sm leading-relaxed text-foreground/90">
                  <RichText text={res} />
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Done when */}
      <div className="flex items-start gap-2.5 rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4">
        <CircleCheck className="mt-0.5 size-5 shrink-0 text-emerald-600" />
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.13em] text-emerald-700">
            Done when
          </div>
          <p className="mt-1 text-sm leading-relaxed text-foreground/90">
            {guidance.done}
          </p>
        </div>
      </div>
    </div>
  );
}
