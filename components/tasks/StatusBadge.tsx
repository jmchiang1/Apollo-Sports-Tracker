import { Check } from "lucide-react";
import { STATUS_META } from "@/lib/status";
import type { TaskStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

/** Small round status indicator. "Done" shows a check. */
export function StatusDot({
  status,
  className,
}: {
  status: TaskStatus;
  className?: string;
}) {
  if (status === "done") {
    return (
      <span
        className={cn(
          "grid size-4 shrink-0 place-items-center rounded-full bg-emerald-500 text-white",
          className,
        )}
      >
        <Check className="size-2.5" strokeWidth={3.5} />
      </span>
    );
  }
  return (
    <span
      className={cn(
        "size-3 shrink-0 rounded-full ring-2 ring-inset ring-black/5",
        STATUS_META[status].dot,
        className,
      )}
    />
  );
}

/** Soft pill showing the current status with its dot + label. */
export function StatusBadge({
  status,
  className,
}: {
  status: TaskStatus;
  className?: string;
}) {
  const meta = STATUS_META[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset",
        meta.badge,
        status === "na" && "line-through decoration-1",
        className,
      )}
    >
      <span className={cn("size-1.5 rounded-full", meta.dot)} />
      {meta.label}
    </span>
  );
}
