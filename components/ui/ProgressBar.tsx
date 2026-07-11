import { cn } from "@/lib/utils";

interface ProgressBarProps {
  /** 0..1 */
  value: number;
  className?: string;
  fillClassName?: string;
  trackClassName?: string;
}

export function ProgressBar({
  value,
  className,
  fillClassName,
  trackClassName,
}: ProgressBarProps) {
  const pct = Math.max(0, Math.min(1, value)) * 100;
  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(pct)}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn(
        "h-2 w-full overflow-hidden rounded-full bg-surface-2",
        trackClassName,
        className,
      )}
    >
      <div
        className={cn(
          "h-full rounded-full bg-accent transition-[width] duration-500 ease-out",
          fillClassName,
        )}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
