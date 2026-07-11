"use client";

import { useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS, isActive } from "./navItems";
import { BrandMark } from "./BrandMark";
import { ResetButton } from "./ResetButton";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { useAppStore } from "@/store/useAppStore";
import { assembleTasks } from "@/store/useAppStore";
import { computeProgress } from "@/lib/progress";
import { cn } from "@/lib/utils";

export function SideNav() {
  const pathname = usePathname();
  const taskState = useAppStore((s) => s.taskState);
  const progress = useMemo(
    () => computeProgress(assembleTasks(taskState)),
    [taskState],
  );

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-border-subtle bg-surface/80 backdrop-blur md:flex">
      <div className="px-5 py-6">
        <Link href="/" className="focus-ring rounded-xl">
          <BrandMark />
        </Link>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {NAV_ITEMS.map((item) => {
          const active = isActive(pathname, item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "focus-ring group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                active
                  ? "bg-accent-soft text-accent-strong"
                  : "text-muted hover:bg-surface-2 hover:text-foreground",
              )}
            >
              {active && (
                <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-accent" />
              )}
              <Icon className="size-[18px]" strokeWidth={active ? 2.4 : 2} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border-subtle px-5 py-5">
        <div className="mb-2 flex items-center justify-between text-xs">
          <span className="font-medium text-muted">Overall</span>
          <span className="font-semibold text-foreground">
            {progress.done}/{progress.total}
          </span>
        </div>
        <ProgressBar value={progress.pct} />
        <div className="mt-4">
          <ResetButton />
        </div>
      </div>
    </aside>
  );
}
