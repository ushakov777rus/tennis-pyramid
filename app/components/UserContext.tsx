"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { log } from "../lib/logger";

type User = { id: number; name: string; role: string, player_id: number } | null;

const UserContext = createContext<{
  user: User;
  setUser: (u: User) => void;
}>({ user: null, setUser: () => {} });

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null);

  // ✅ при монтировании проверяем /api/me
  useEffect(() => {
    log.info("UserProvider mounted ✅");
    async function loadUser() {
      try {
        const res = await fetch("/api/me");
        const data = await res.json();
        if (data.loggedIn) {
          log.info("Пользователь залогинен", data.user);
          setUser(data.user);
        } else {
          log.info("Пользователь НЕ залогинен");
          setUser(null);
        }
      } catch (err) {
        log.error("Ошибка загрузки user:", err);
      }
    }

    loadUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);