"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function FitStars({
  value,
  onChange,
  readOnly,
  size = 18,
}: {
  value?: number;
  onChange?: (v: number | undefined) => void;
  readOnly?: boolean;
  size?: number;
}) {
  const v = value ?? 0;
  return (
    <div className="flex items-center gap-0.5" aria-label={`Fit score ${v} of 5`}>
      {[1, 2, 3, 4, 5].map((n) => {
        const filled = n <= v;
        const star = (
          <Star
            style={{ width: size, height: size }}
            className={cn(
              filled ? "fill-accent text-accent" : "fill-none text-stone-300",
            )}
            strokeWidth={2}
          />
        );
        if (readOnly || !onChange) {
          return <span key={n}>{star}</span>;
        }
        return (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n === v ? undefined : n)}
            aria-label={`Set fit score to ${n}`}
            className="focus-ring rounded p-0.5 transition hover:scale-110"
          >
            {star}
          </button>
        );
      })}
    </div>
  );
}
