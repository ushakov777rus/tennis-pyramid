"use client";

import { ReactNode } from "react";
import { useUser } from "@/app/components/UserContext";
import { Participant } from "@/app/models/Participant";

// ==== Базовый RoleGuard ====

type RoleGuardProps = {
  allowed: string[]; // допустимые роли
  children: ReactNode;
};

export function RoleGuard({ allowed, children }: RoleGuardProps) {
  const { user } = useUser();

  // Пока user не загружен — ничего не показываем
  if (user === null) return null;

  const role = user?.role || "guest";

  return allowed.includes(role) ? <>{children}</> : null;
}

// ==== Обёртки ====

export const SiteAdminOnly = ({ children }: { children: ReactNode }) => (
  <RoleGuard allowed={["site_admin"]}>{children}</RoleGuard>
);

export const TournamentAdminOnly = ({ children }: { children: ReactNode }) => (
  <RoleGuard allowed={["tournament_admin"]}>{children}</RoleGuard>
);

export const AdminOnly = ({ children }: { children: ReactNode }) => (
  <RoleGuard allowed={["site_admin", "tournament_admin"]}>{children}</RoleGuard>
);

export const PlayerOnly = ({ children }: { children: ReactNode }) => (
  <RoleGuard allowed={["player"]}>{children}</RoleGuard>
);

export const GuestOnly = ({ children }: { children: ReactNode }) => (
  <RoleGuard allowed={["guest"]}>{children}</RoleGuard>
);

export const LoggedIn = ({ children }: { children: ReactNode }) => (
  <RoleGuard allowed={["site_admin", "tournament_admin", "player"]}>
    {children}
  </RoleGuard>
);

// ==== Логика прав на просмотр ФИО ====

type Viewer = {
  role?: string;
  player_id?: number | null;
};

export function isGuest(viewer?: Viewer | null) {
  return !viewer?.role || viewer.role === "guest";
}

export function isTournamentParticipant(
  viewer: Viewer | undefined,
  participants: Participant[]
): boolean {
  if (!viewer?.role || !viewer.player_id) return false;
  return participants.some((p) => p.player?.id === viewer.player_id);
}

export function canSeeFullNames(
  viewer: Viewer | undefined,
  participants: Participant[]
): boolean {
  if (!viewer?.role) return false;
  if (viewer.role === "site_admin" || viewer.role === "tournament_admin") return true;
  return isTournamentParticipant(viewer, participants);
}

// ==== Маскирование ====

function maskWord(word: string): string {
  const w = word.trim();
  if (w.length <= 2) return w;
  const first = w[0];
  const last = w[w.length - 1];
  return first + "*".repeat(w.length - 2) + last;
}

export function maskFullName(name: string): string {
  if (!name) return "";
  return name.split(/(\s+|-)/).map((part) => {
    if (/^\s+$/.test(part) || part === "-") return part;
    return maskWord(part);
  }).join("");
}

export function displayName(
  name: string,
  canSee: boolean
): string {
  return canSee ? name : maskFullName(name);
}