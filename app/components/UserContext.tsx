// app/components/UserContext.tsx
"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";
import { User } from "../models/Users";
import { useDictionary } from "@/app/components/LanguageProvider";

type Ctx = {
  user: User | null;
  setUser: (user: User | null) => void;
  loading: boolean;
  refresh: () => Promise<void>;
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
  const { common } = useDictionary();
  const commonErrors = useMemo(() => (common.errors as Record<string, string> | undefined) ?? {}, [common.errors]);

  const inFlight = useRef<AbortController | null>(null);

  const refresh = useCallback(async () => {
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

      // 401/500 — тоже читаем JSON ради ошибки
      const data = await res.json();

      if (!res.ok) {
        const code = data?.errorCode;
        const key = typeof code === "string" ? code.split(".").pop() ?? code : undefined;
        setError((key && commonErrors[key]) ?? commonErrors.userLoad ?? "Failed to load user");
        setUser(null);
      } else {
        // кладём в контекст модель User c полем player (объект/ null)
        setUser(data?.user ? new User(data.user) : null);
      }
    } catch (e: any) {
      if (e?.name !== "AbortError") {
        console.error("UserProvider: refresh error:", e);
        setError(e?.message ?? "Не удалось загрузить пользователя");
        setUser(null);
      }
    } finally {
      if (inFlight.current === ac) inFlight.current = null;
      setLoading(false);
    }
  }, [commonErrors]);

  useEffect(() => {
    void refresh();
    return () => {
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
