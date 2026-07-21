"use client";

import { useMemo } from "react";
import Link from "next/link";
import { BrandMark } from "./BrandMark";
import { AccountButton } from "@/components/auth/AccountButton";
import { useTasks } from "@/store/useTasks";
import { computeProgress } from "@/lib/progress";
import { formatPct } from "@/lib/utils";

export function MobileTopBar() {
  const tasks = useTasks();
  const progress = useMemo(() => computeProgress(tasks), [tasks]);

  return (
    <header
      className="sticky top-0 z-20 flex items-center justify-between border-b border-border-subtle bg-background/85 px-4 py-3 backdrop-blur md:hidden"
      style={{ paddingTop: "max(0.75rem, env(safe-area-inset-top))" }}
    >
      <Link href="/" className="focus-ring rounded-xl">
        <BrandMark />
      </Link>
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 rounded-full bg-accent-soft px-3 py-1.5 text-xs font-semibold text-accent-strong">
          {formatPct(progress.pct)}
          <span className="font-normal text-accent-strong/70">
            {progress.done}/{progress.total}
          </span>
        </div>
        <AccountButton placement="topbar" />
      </div>
    </header>
  );
}
