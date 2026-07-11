"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface NumberInputProps {
  value: number;
  onChange: (value: number) => void;
  prefix?: string;
  suffix?: string;
  step?: number;
  min?: number;
  max?: number;
  ariaLabel?: string;
  className?: string;
  inputClassName?: string;
}

/**
 * Numeric input that lets the user clear the field while typing (keeps a local
 * string) yet always reports a clean number to the caller.
 */
export function NumberInput({
  value,
  onChange,
  prefix,
  suffix,
  step = 1,
  min = 0,
  max,
  ariaLabel,
  className,
  inputClassName,
}: NumberInputProps) {
  const [text, setText] = useState(String(value));
  const focused = useRef(false);

  useEffect(() => {
    if (!focused.current) setText(String(value));
  }, [value]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value;
    setText(raw);
    if (raw.trim() === "") {
      onChange(0);
      return;
    }
    const parsed = Number(raw);
    if (!Number.isNaN(parsed)) onChange(parsed);
  }

  function handleBlur() {
    focused.current = false;
    setText(String(value));
  }

  return (
    <div
      className={cn(
        "flex items-center rounded-lg border border-border-subtle bg-surface focus-within:ring-2 focus-within:ring-accent",
        className,
      )}
    >
      {prefix && (
        <span className="pl-2.5 text-sm text-muted select-none">{prefix}</span>
      )}
      <input
        type="number"
        inputMode="decimal"
        value={text}
        onChange={handleChange}
        onFocus={() => (focused.current = true)}
        onBlur={handleBlur}
        step={step}
        min={min}
        max={max}
        aria-label={ariaLabel}
        className={cn(
          "w-full bg-transparent px-2.5 py-1.5 text-right text-sm font-medium tabular-nums text-foreground outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none",
          inputClassName,
        )}
      />
      {suffix && (
        <span className="pr-2.5 text-sm text-muted select-none">{suffix}</span>
      )}
    </div>
  );
}
