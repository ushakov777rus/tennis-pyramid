"use client";
import { useState, useEffect } from "react";
import { LoginModal } from "@/app/components/LoginModal";
import { RegisterModal } from "@/app/components/RegisterModal";
import { UserRole } from "../models/Users";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: "login" | "register"; // 👈 новый параметр
  initialRole?: UserRole.Player | UserRole.TournamentAdmin;
};

export function AuthContainer({ 
    isOpen, 
    onClose, 
    initialMode = "login",
    initialRole: defaultRole = UserRole.Player,
  }: Props) {
  const [mode, setMode] = useState<"login" | "register">(initialMode);

  // если при открытии поменялся initialMode — применим его
  useEffect(() => {
    if (isOpen) setMode(initialMode);
  }, [isOpen, initialMode]);

  const handleClose = () => {
    setMode("login"); // сбрасываем на дефолт
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <LoginModal
        isOpen={isOpen && mode === "login"}
        onClose={handleClose}
        onSwitchToRegister={() => setMode("register")}
      />
      <RegisterModal
        isOpen={isOpen && mode === "register"}
        onClose={handleClose}
        onSwitchToLogin={() => setMode("login")}
        onRegistered={handleClose}
        initialRole={defaultRole}
      />
    </>
  );
}