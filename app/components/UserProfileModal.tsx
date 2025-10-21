"use client";

import { useEffect, type MouseEvent as ReactMouseEvent } from "react";

import "./PlayerProfileModal.css";

import { Match } from "@/app/models/Match";
import { Player } from "@/app/models/Player";
import { User } from "@/app/models/Users";

import { UserProfileView, type UserProfileStats } from "./UserProfileView";
import { useDictionary } from "./LanguageProvider";

type UserProfileModalProps = {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  stats?: UserProfileStats;
  matches?: Match[];
  onShowFullHistory?: (player: Player) => void;
  onEditPlayer?: (player: Player) => void;
  onMessage?: (player: Player) => void;
};

export function UserProfileModal({
  isOpen,
  onClose,
  user,
  stats,
  matches = [],
  onShowFullHistory,
  onEditPlayer,
  onMessage,
}: UserProfileModalProps) {
  const { common } = useDictionary();
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !user) return null;

  const handleOverlayClick = (event: ReactMouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) onClose();
  };

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      onClick={handleOverlayClick}
    >
      <div className="modal-content profile-modal slide-in" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="modal-close-btn"
          aria-label={common.close}
          onClick={onClose}
        >
          ✖
        </button>

        <UserProfileView
          user={user}
          stats={stats}
          matches={matches}
          onShowFullHistory={onShowFullHistory}
          onEditPlayer={onEditPlayer}
          onMessage={onMessage}
        />
      </div>
    </div>
  );
}
