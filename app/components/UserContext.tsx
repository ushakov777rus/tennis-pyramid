// UserContext.tsx
"use client";

import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { User } from "../models/Users";

type Ctx = {
  user: User | null;
  setUser: (u: User | null) => void;
  loading: boolean;
  refresh: () => Promise<void>;   // <- Promise<void>
  error: string | null;
};

const UserContext = createContext<Ctx>({
  user: null,
  setUser: () => {},
  loading: true,
  refresh: async () => {},
  error: null,
});

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // храним текущий AbortController, чтобы отменять предыдущие запросы
  const inFlight = useRef<AbortController | null>(null);

  const refresh = useCallback(async () => {
    // отменяем предыдущий запрос, если ещё идёт
    inFlight.current?.abort();
    const ac = new AbortController();
    inFlight.current = ac;

    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/me", {
        method: "GET",
        cache: "no-store",
        credentials: "include",
        signal: ac.signal,
      });
      const data = await res.json();
      setUser(data?.loggedIn ? data.user : null);
    } catch (e: any) {
      // если это именно abort — игнорируем
      if (e?.name !== "AbortError") {
        console.error("Ошибка загрузки user:", e);
        setError(e?.message ?? "Не удалось загрузить пользователя");
        setUser(null);
      }
    } finally {
      if (inFlight.current === ac) inFlight.current = null;
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
    return () => {
      // отменим запрос при размонтировании провайдера
      inFlight.current?.abort();
    };
  }, [refresh]);

  return (
    <UserContext.Provider value={{ user, setUser, loading, refresh, error }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);