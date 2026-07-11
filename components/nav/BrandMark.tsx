import { PawPrint } from "lucide-react";
import { cn } from "@/lib/utils";

/** Apollo wordmark — a warm gold paw nodding to the golden-retriever mascot. */
export function BrandMark({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <span className="grid size-9 place-items-center rounded-xl bg-accent text-accent-contrast shadow-soft">
        <PawPrint className="size-5" strokeWidth={2.25} />
      </span>
      <div className="leading-tight">
        <div className="font-display text-lg font-semibold tracking-tight text-foreground">
          Apollo
        </div>
        <div className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted">
          Launch Cockpit
        </div>
      </div>
    </div>
  );
}
