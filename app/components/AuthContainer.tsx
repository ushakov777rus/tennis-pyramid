"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LoginModal } from "@/app/components/LoginModal";
import { RegisterModal } from "@/app/components/RegisterModal";
import { UserRole } from "../models/Users";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: "login" | "register";
  initialRole?: UserRole.Player | UserRole.TournamentAdmin;
};

export function AuthContainer({ 
    isOpen, 
    onClose, 
    initialMode = "login",
    initialRole: defaultRole = UserRole.Player,
  }: Props) {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">(initialMode);

  useEffect(() => {
    if (isOpen) setMode(initialMode);
  }, [isOpen, initialMode]);

  const handleClose = (role?: UserRole) => {
    setMode("login");
    onClose();

    console.log("AuthContainer.handleClose", role);

    if (role === UserRole.Player) {
      router.push("/player");
    } else if (role === UserRole.TournamentAdmin) {
      router.push("/tadmin");
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <LoginModal
        isOpen={isOpen && mode === "login"}
        onClose={() => handleClose()}  // 👈 если просто закрыли без логина
        onSwitchToRegister={() => setMode("register")}
        onLoggedIn={(role) => handleClose(role)} // 👈 новый колбэк
      />
      <RegisterModal
        isOpen={isOpen && mode === "register"}
        onClose={() => handleClose()}
        onSwitchToLogin={() => setMode("login")}
        onRegistered={(role) => handleClose(role)} // 👈 роль прилетает при регистрации
        initialRole={defaultRole}
      />
    </>
  );
}