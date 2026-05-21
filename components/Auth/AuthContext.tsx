import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase, supabaseReady } from '../../lib/supabaseClient';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<{ error?: string }>;
  signUpWithEmail: (email: string, password: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadSession() {
      if (!supabaseReady || !supabase) {
        if (mounted) setLoading(false);
        return;
      }

      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!mounted) return;
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    }

    loadSession();

    const authListener = supabaseReady && supabase
      ? supabase.auth.onAuthStateChange((_event, updatedSession) => {
          if (!mounted) return;
          setSession(updatedSession);
          setUser(updatedSession?.user ?? null);
          setLoading(false);
        })
      : null;

    return () => {
      mounted = false;
      if (authListener && 'data' in authListener) {
        authListener.data.subscription.unsubscribe();
      }
    };
  }, []);

  const signInWithGoogle = async () => {
    if (!supabaseReady || !supabase) return;
    setLoading(true);
    try {
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/properties` : undefined,
        },
      });
    } finally {
      setLoading(false);
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    if (!supabaseReady || !supabase) {
      return { error: 'Authentication is currently unavailable' };
    }

    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);
    return { error: error?.message };
  };

  const signUpWithEmail = async (email: string, password: string) => {
    if (!supabaseReady || !supabase) {
      return { error: 'Authentication is currently unavailable' };
    }

    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: typeof window !== 'undefined' ? `${window.location.origin}/properties` : undefined,
      },
    });
    setLoading(false);
    return { error: error?.message };
  };

  const signOut = async () => {
    if (!supabaseReady || !supabase) return;
    setLoading(true);
    await supabase.auth.signOut();
    setLoading(false);
  };

  const value = useMemo(
    () => ({ user, session, loading, signInWithGoogle, signInWithEmail, signUpWithEmail, signOut }),
    [user, session, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
