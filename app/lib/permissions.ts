// app/lib/permissions.ts
import type { Tournament } from "@/app/models/Tournament";
import { Player } from "../models/Player";

// Минимальный тип юзера, чтобы не тянуть весь контекст
export type MinimalUser = {
  id: number;
  role?: string | null; // "site_admin" и т.п.
};

/** Может ли пользователь удалить турнир */
export function canDeleteTournament(user: MinimalUser | null | undefined, t: Tournament | null | undefined): boolean {
  if (!user || !t) return false;
  if (user.role === "site_admin") return true;
  return user.id === t.creator_id;
}

/** Может ли пользователь редактировать турнир (пример — приравниваем к delete) */
export function canEditTournament(user: MinimalUser | null | undefined, t: Tournament | null | undefined): boolean {
  return canDeleteTournament(user, t);
}

/** Может ли пользователь видеть приватные детали турнира */
export function canViewPrivateTournament(user: MinimalUser | null | undefined, t: Tournament | null | undefined): boolean {
  if (!t) return false;
  if (t.is_public) return true;
  return canEditTournament(user, t);
}

/* маскирование имен */
export function needMask(user: MinimalUser | null | undefined): boolean {
  if (!user) return true;
  if (user.role === "site_admin") 
    return false;
  if (user.role === "tournament_admin") 
    return false;
  return true;
}
