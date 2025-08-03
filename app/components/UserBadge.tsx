"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "./UserBadge.css";

type User = {
  id: number;
  name: string;
  role: string;
};

export function UserBadge() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetch("/api/me");
        const data = await res.json();
        if (data.loggedIn) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error("Ошибка загрузки user:", err);
      }
    }
    loadUser();
  }, []);

  async function handleLogout() {
    await fetch("/api/logout", { method: "POST" });
    router.push("/");
  }

  function handleLogin() {
    router.push("/login");
  }

  function handleRegister() {
    router.push("/register");
  }

  return (
    <div className="user-badge">
      {user ? (
        <>
          <span className="user-info">👤 {user.name} ({user.role})</span>
          <button onClick={handleLogout} className="login-btn">
            Выйти
          </button>
        </>
      ) : (
        <>
          <button onClick={handleLogin} className="login-btn">
            Войти
          </button>
          <button onClick={handleRegister} className="login-btn">
            Регистрация
          </button>
        </>
      )}
    </div>
  );
}