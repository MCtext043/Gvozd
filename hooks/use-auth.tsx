"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const TOKEN_KEY = "gvozd_admin_token";

type AuthContextValue = {
  token: string | null;
  ready: boolean;
  setToken: (token: string | null) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setTokenState] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      setTokenState(localStorage.getItem(TOKEN_KEY));
    } catch {
      setTokenState(null);
    }
    setReady(true);
  }, []);

  const setToken = useCallback((value: string | null) => {
    setTokenState(value);
    try {
      if (value) localStorage.setItem(TOKEN_KEY, value);
      else localStorage.removeItem(TOKEN_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  const logout = useCallback(() => setToken(null), [setToken]);

  const value = useMemo(
    () => ({ token, ready, setToken, logout }),
    [token, ready, setToken, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth вне AuthProvider");
  return ctx;
}
