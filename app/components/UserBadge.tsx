// UserBadge.tsx
"use client";

import { useRouter } from "next/navigation";
import { useUser } from "@/app/components/UserContext";
import { useState } from "react";
import { AuthContainer } from "@/app/components/AuthContainer";
import { PlayerProfileModalLoader } from "@/app/components/PlayerProfileModalLoader"; // 👈 новый лоадер
import "./UserBadge.css";

export function UserBadge() {
  const { user, setUser } = useUser();
  const router = useRouter()

  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  async function handleLogout() {
    await fetch("/api/logout", { method: "POST" });
    setUser(null);
    router.replace("/");
  }

  console.log("UserBadge:user", user);

  return (
    <div className="user-badge">
      {user ? (
        <>
          <button
            className="user-info link-like"
            onClick={() => setIsProfileOpen(true)}
          >
            👤 {user.name}
          </button>
          <button onClick={handleLogout} className="user-badge-btn">
            Выйти
          </button>

          {isProfileOpen && (
            <PlayerProfileModalLoader
              isOpen={isProfileOpen}
              onClose={() => setIsProfileOpen(false)}
              userId={user.id}          // 👈 по userId найдём Player в БД
            />
          )}
        </>
      ) : (
        <>
          <button className="user-badge-btn" onClick={() => setIsLoginOpen(true)}>
            Войти
          </button>
          <AuthContainer
            isOpen={isLoginOpen}
            onClose={() => setIsLoginOpen(false)}
          />
        </>
      )}
    </div>
  );
}