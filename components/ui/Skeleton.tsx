import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn("animate-pulse rounded-xl bg-surface-2", className)}
      aria-hidden
    />
  );
}

/** Generic "loading persisted data" placeholder for a page. */
export function PageSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-56" />
      <Skeleton className="h-4 w-72" />
      <div className="mt-6 space-y-3">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    </div>
  );
}
