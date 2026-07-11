"use client";

import { useState } from "react";
import { Cloud, LogOut, Mail } from "lucide-react";
import { useAuth } from "./AuthProvider";
import { useSyncStore, type SyncStatus } from "@/store/useSyncStore";
import { cn } from "@/lib/utils";

const STATUS_TEXT: Record<SyncStatus, string> = {
  idle: "Sync ready",
  syncing: "Syncing…",
  synced: "Synced",
  error: "Sync error",
};

const STATUS_DOT: Record<SyncStatus, string> = {
  idle: "bg-stone-300",
  syncing: "bg-amber-400 animate-pulse",
  synced: "bg-emerald-500",
  error: "bg-rose-500",
};

function formatTime(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

function SignInPanel({
  signIn,
}: {
  signIn: (email: string) => Promise<{ ok: boolean; error?: string }>;
}) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );
  const [error, setError] = useState<string>();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) return;
    setState("sending");
    const res = await signIn(trimmed);
    if (res.ok) {
      setState("sent");
    } else {
      setError(res.error ?? "Something went wrong.");
      setState("error");
    }
  }

  if (state === "sent") {
    return (
      <div className="text-center">
        <div className="mx-auto grid size-10 place-items-center rounded-full bg-emerald-100 text-emerald-600">
          <Mail className="size-5" />
        </div>
        <p className="mt-3 text-sm font-medium text-foreground">
          Check your email
        </p>
        <p className="mt-1 text-xs leading-relaxed text-muted">
          We sent a magic link to <span className="font-medium">{email}</span>.
          Open it on this device to finish signing in.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit}>
      <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
        <Cloud className="size-4 text-accent-strong" />
        Sync across devices
      </div>
      <p className="mt-1 text-xs leading-relaxed text-muted">
        Enter your email for a magic link — no password. Your progress then
        follows you to any device.
      </p>
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        className="focus-ring mt-3 w-full rounded-lg border border-border-subtle bg-surface px-3 py-2 text-sm text-foreground placeholder:text-muted/60"
      />
      {state === "error" && (
        <p className="mt-2 text-xs text-rose-600">{error}</p>
      )}
      <button
        type="submit"
        disabled={state === "sending"}
        className="focus-ring mt-3 w-full rounded-lg bg-accent px-3 py-2 text-sm font-semibold text-accent-contrast transition hover:bg-accent-strong disabled:opacity-60"
      >
        {state === "sending" ? "Sending…" : "Send magic link"}
      </button>
    </form>
  );
}

function AccountPanel({
  email,
  onSignOut,
}: {
  email: string | null;
  onSignOut: () => void;
}) {
  const status = useSyncStore((s) => s.status);
  const lastSyncedAt = useSyncStore((s) => s.lastSyncedAt);
  return (
    <div>
      <div className="text-[11px] font-semibold uppercase tracking-[0.13em] text-muted">
        Signed in
      </div>
      <div className="mt-1 truncate text-sm font-medium text-foreground">
        {email}
      </div>
      <div className="mt-3 flex items-center gap-2 rounded-lg bg-surface-2 px-3 py-2 text-xs">
        <span className={cn("size-2 rounded-full", STATUS_DOT[status])} />
        <span className="text-foreground">{STATUS_TEXT[status]}</span>
        {lastSyncedAt && status === "synced" && (
          <span className="ml-auto text-muted">{formatTime(lastSyncedAt)}</span>
        )}
      </div>
      <button
        type="button"
        onClick={onSignOut}
        className="focus-ring mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-border-subtle px-3 py-2 text-sm font-medium text-muted transition hover:text-foreground"
      >
        <LogOut className="size-4" />
        Sign out
      </button>
    </div>
  );
}

export function AccountButton({
  placement = "sidebar",
}: {
  placement?: "sidebar" | "topbar";
}) {
  const { status, email, signIn, signOut } = useAuth();
  const syncStatus = useSyncStore((s) => s.status);
  const [open, setOpen] = useState(false);

  if (status === "disabled") return null;
  if (status === "loading") {
    return placement === "sidebar" ? (
      <div className="h-9 w-full animate-pulse rounded-xl bg-surface-2" />
    ) : (
      <div className="size-8 animate-pulse rounded-full bg-surface-2" />
    );
  }

  const signedIn = status === "signed_in";
  const topbar = placement === "topbar";

  return (
    <div className="relative">
      {topbar ? (
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-label="Sync account"
          aria-expanded={open}
          className="focus-ring relative grid size-8 place-items-center rounded-full bg-surface-2 text-muted"
        >
          <Cloud className="size-4" />
          {signedIn && (
            <span
              className={cn(
                "absolute -right-0.5 -top-0.5 size-2.5 rounded-full ring-2 ring-background",
                STATUS_DOT[syncStatus],
              )}
            />
          )}
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className="focus-ring flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-muted transition hover:bg-surface-2 hover:text-foreground"
        >
          <Cloud className="size-3.5" />
          {signedIn ? (
            <>
              <span>{STATUS_TEXT[syncStatus]}</span>
              <span
                className={cn(
                  "ml-auto size-1.5 rounded-full",
                  STATUS_DOT[syncStatus],
                )}
              />
            </>
          ) : (
            <span>Sync across devices</span>
          )}
        </button>
      )}

      {open && (
        <>
          <button
            aria-hidden
            tabIndex={-1}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-40 cursor-default"
          />
          <div
            className={cn(
              "absolute z-50 w-72 rounded-2xl border border-border-subtle bg-surface p-4 shadow-soft-lg",
              topbar ? "right-0 top-full mt-2" : "bottom-full left-0 mb-2",
            )}
          >
            {signedIn ? (
              <AccountPanel
                email={email}
                onSignOut={async () => {
                  await signOut();
                  setOpen(false);
                }}
              />
            ) : (
              <SignInPanel signIn={signIn} />
            )}
          </div>
        </>
      )}
    </div>
  );
}
