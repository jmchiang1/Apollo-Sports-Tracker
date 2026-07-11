"use client";

import { useEffect, useRef, useState } from "react";
import { Check, NotebookPen } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";

/**
 * Freeform per-task notes. Autosaves on a debounce while typing, on blur, and
 * on unmount (so collapsing the task never drops an edit).
 */
export function NotesField({
  taskId,
  value: storeValue,
}: {
  taskId: string;
  value: string;
}) {
  const setTaskNotes = useAppStore((s) => s.setTaskNotes);
  const [text, setText] = useState(storeValue);
  const [dirty, setDirty] = useState(false);
  const focused = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Keep refs of the latest values for the unmount flush (updated in an effect,
  // never during render).
  const latest = useRef({ text, dirty, storeValue });
  useEffect(() => {
    latest.current = { text, dirty, storeValue };
  });

  // Resync from the store when not actively editing (e.g. after a reset).
  useEffect(() => {
    if (!focused.current) setText(storeValue);
  }, [storeValue]);

  // Flush any pending edit when the field unmounts.
  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
      const l = latest.current;
      if (l.dirty && l.text !== l.storeValue) setTaskNotes(taskId, l.text);
    };
  }, [setTaskNotes, taskId]);

  function commit(val: string) {
    setTaskNotes(taskId, val);
    setDirty(false);
  }

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const val = e.target.value;
    setText(val);
    setDirty(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => commit(val), 700);
  }

  function handleBlur() {
    focused.current = false;
    if (timer.current) clearTimeout(timer.current);
    if (text !== storeValue) commit(text);
  }

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.13em] text-muted">
          <NotebookPen className="size-3.5" />
          Notes
        </div>
        <span
          className="text-[11px] font-medium text-muted transition-opacity"
          aria-live="polite"
        >
          {dirty ? (
            "Saving…"
          ) : text ? (
            <span className="inline-flex items-center gap-1 text-emerald-600">
              <Check className="size-3" strokeWidth={3} />
              Saved
            </span>
          ) : (
            ""
          )}
        </span>
      </div>
      <textarea
        value={text}
        onChange={handleChange}
        onFocus={() => (focused.current = true)}
        onBlur={handleBlur}
        rows={4}
        placeholder="Jot specifics — who you called, what you're waiting on, numbers, dates…"
        className="focus-ring w-full resize-y rounded-xl border border-border-subtle bg-surface px-3.5 py-3 text-sm leading-relaxed text-foreground placeholder:text-muted/70"
      />
    </div>
  );
}
