"use client";
import { useState } from "react";
import { LoginModal } from "@/app/components/LoginModal";
import { RegisterModal } from "@/app/components/RegisterModal";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export function AuthContainer({ isOpen, onClose }: Props) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const handleClose = () => { setMode("login"); onClose(); };
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
        onRegistered={() => handleClose()}
      />
    </>
  );
}