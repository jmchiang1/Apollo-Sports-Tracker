"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import {
  authRedirectUrl,
  getSupabaseClient,
  isSupabaseConfigured,
} from "@/lib/supabase/client";

export type AuthStatus = "disabled" | "loading" | "signed_in" | "signed_out";

interface AuthValue {
  status: AuthStatus;
  email: string | null;
  userId: string | null;
  signIn: (email: string) => Promise<{ ok: boolean; error?: string }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthValue | null>(null);

export function useAuth(): AuthValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<AuthStatus>(
    isSupabaseConfigured ? "loading" : "disabled",
  );

  useEffect(() => {
    const client = getSupabaseClient();
    if (!client) return;
    let active = true;

    client.auth.getSession().then(({ data }) => {
      if (!active) return;
      setUser(data.session?.user ?? null);
      setStatus(data.session ? "signed_in" : "signed_out");
    });

    const { data: sub } = client.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setStatus(session ? "signed_in" : "signed_out");
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const value: AuthValue = {
    status,
    email: user?.email ?? null,
    userId: user?.id ?? null,
    signIn: async (email) => {
      const client = getSupabaseClient();
      if (!client) return { ok: false, error: "Sync is not configured." };
      const { error } = await client.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: authRedirectUrl() },
      });
      return error ? { ok: false, error: error.message } : { ok: true };
    },
    signOut: async () => {
      await getSupabaseClient()?.auth.signOut();
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
