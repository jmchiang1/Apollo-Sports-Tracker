"use client";

import Link from "next/link";
import { ChevronRight, type LucideIcon } from "lucide-react";
import { StatusDot } from "@/components/tasks/StatusBadge";
import { PHASES } from "@/data/seed";
import type { Task } from "@/lib/types";
import { cn } from "@/lib/utils";

const phaseById = new Map(PHASES.map((p) => [p.id, p]));

export function TaskMiniList({
  title,
  icon: Icon,
  iconClassName,
  tasks,
  emptyMessage,
}: {
  title: string;
  icon: LucideIcon;
  iconClassName?: string;
  tasks: Task[];
  emptyMessage: string;
}) {
  return (
    <div className="rounded-2xl border border-border-subtle bg-surface p-4 shadow-soft sm:p-5">
      <div className="mb-3 flex items-center gap-2">
        <Icon className={cn("size-4", iconClassName)} />
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        <span className="ml-auto rounded-full bg-surface-2 px-2 py-0.5 text-xs font-medium text-muted">
          {tasks.length}
        </span>
      </div>

      {tasks.length === 0 ? (
        <p className="px-1 py-4 text-sm text-muted">{emptyMessage}</p>
      ) : (
        <ul className="-mx-1">
          {tasks.map((task) => {
            const phase = phaseById.get(task.phaseId);
            return (
              <li key={task.id}>
                <Link
                  href={`/roadmap?task=${task.id}`}
                  className="focus-ring group flex items-center gap-3 rounded-xl px-1.5 py-2 transition hover:bg-surface-2"
                >
                  <StatusDot status={task.status} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-foreground">
                      {task.title}
                    </span>
                    {phase && (
                      <span className="text-xs text-muted">
                        Phase {phase.order} · {phase.title}
                      </span>
                    )}
                  </span>
                  <ChevronRight className="size-4 shrink-0 text-muted transition group-hover:translate-x-0.5 group-hover:text-foreground" />
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
