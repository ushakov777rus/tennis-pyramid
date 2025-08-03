"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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
    router.push("/login");
  }

  function handleLogin() {
    router.push("/login");
  }

  function handleRegister() {
    router.push("/register"); // страница регистрации
  }

  return (
    <div
      style={{
        position: "fixed",
        top: "10px",
        left: "10px",
        background: "#eee",
        padding: "6px 12px",
        borderRadius: "6px",
        fontSize: "14px",
        display: "flex",
        alignItems: "center",
        gap: "10px",
      }}
    >
      {user ? (
        <>
          👤 {user.name} ({user.role})
          <button onClick={handleLogout} style={{ fontSize: "12px" }}>
            Выйти
          </button>
        </>
      ) : (
        <>
          <button onClick={handleLogin} style={{ fontSize: "12px" }}>
            Войти
          </button>
          <button onClick={handleRegister} style={{ fontSize: "12px" }}>
            Регистрация
          </button>
        </>
      )}
    </div>
  );
}