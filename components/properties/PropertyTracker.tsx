"use client";

import { useMemo, useState } from "react";
import { Building2, Plus } from "lucide-react";
import { PropertyCard } from "./PropertyCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { PageSkeleton } from "@/components/ui/Skeleton";
import { annualRent, sortProperties } from "@/lib/property";
import { useAppStore } from "@/store/useAppStore";
import { useHydrated } from "@/store/useTasks";
import { cn } from "@/lib/utils";

type SortKey = "fit" | "rent_asc" | "rent_desc";

const SORTS: { key: SortKey; label: string }[] = [
  { key: "fit", label: "Best fit" },
  { key: "rent_asc", label: "Lowest rent" },
  { key: "rent_desc", label: "Highest rent" },
];

export function PropertyTracker() {
  const properties = useAppStore((s) => s.properties);
  const addProperty = useAppStore((s) => s.addProperty);
  const hydrated = useHydrated();
  const [sort, setSort] = useState<SortKey>("fit");
  const [openId, setOpenId] = useState<string | null>(null);

  const sorted = useMemo(() => {
    if (sort === "fit") return sortProperties(properties);
    const list = [...properties];
    list.sort((a, b) =>
      sort === "rent_asc"
        ? annualRent(a) - annualRent(b)
        : annualRent(b) - annualRent(a),
    );
    return list;
  }, [properties, sort]);

  function handleAdd() {
    const id = addProperty();
    setOpenId(id);
    window.setTimeout(() => {
      document
        .getElementById(`property-${id}`)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 60);
  }

  const addButton = (
    <button
      type="button"
      onClick={handleAdd}
      className="focus-ring inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-accent-contrast shadow-soft transition hover:bg-accent-strong"
    >
      <Plus className="size-4" />
      Add property
    </button>
  );

  if (!hydrated) {
    return (
      <div>
        <PageHeader
          eyebrow="The search pipeline"
          title="Property Tracker"
          description="Log every candidate space, let all-in $/SF and annual rent compute automatically, and rank by fit."
        />
        <PageSkeleton />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        eyebrow="The search pipeline"
        title="Property Tracker"
        description="Log every candidate space, let all-in $/SF and annual rent compute automatically, and rank by fit."
        actions={properties.length > 0 ? addButton : undefined}
      />

      {properties.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border-subtle bg-surface p-10 text-center shadow-soft">
          <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-accent-soft text-accent-strong">
            <Building2 className="size-6" />
          </span>
          <h2 className="mt-4 font-display text-xl font-semibold tracking-tight text-foreground">
            No properties yet
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted">
            Pull candidates from LoopNet or Crexi and your broker&apos;s off-market
            inventory. Each one you add here computes all-in $/SF and annual rent
            so you can rank the shortlist.
          </p>
          <div className="mt-5 flex justify-center">{addButton}</div>
        </div>
      ) : (
        <>
          <div className="mb-4 flex items-center justify-between gap-3">
            <span className="text-sm text-muted">
              {properties.length}{" "}
              {properties.length === 1 ? "property" : "properties"}
            </span>
            <div className="flex items-center gap-1 rounded-xl bg-surface-2 p-1 ring-1 ring-inset ring-border-subtle">
              {SORTS.map((s) => (
                <button
                  key={s.key}
                  type="button"
                  onClick={() => setSort(s.key)}
                  className={cn(
                    "focus-ring rounded-lg px-2.5 py-1 text-xs font-medium transition",
                    sort === s.key
                      ? "bg-surface text-foreground shadow-soft"
                      : "text-muted hover:text-foreground",
                  )}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {sorted.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                open={openId === property.id}
                onToggle={() =>
                  setOpenId((cur) => (cur === property.id ? null : property.id))
                }
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
