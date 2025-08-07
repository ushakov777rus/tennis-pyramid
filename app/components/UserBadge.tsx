"use client";

import { useRouter } from "next/navigation";
import { useUser } from "@/app/components/UserContext";

import { useState } from "react";
import { LoginModal } from "@/app/login/LoginModal";
import "./UserBadge.css";

export function UserBadge() {
  const router = useRouter();
  const { user, setUser } = useUser();
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  async function handleLogout() {
    await fetch("/api/logout", { method: "POST" });
    setUser(null);
    
  }

  function handleRegister() {
    router.push("/register");
  }

  return (
    <div className="user-badge">
      {user ? (
        <>
          <span className="user-info">👤 {user.name}</span>
          <button onClick={handleLogout} className="user-badge-btn">
            Выйти
          </button>
        </>
      ) : (
        <>
          <button className="user-badge-btn" onClick={() => setIsLoginOpen(true)}>
            Войти
          </button>
          <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
        </>
      )}
    </div>
  );
}