"use client";

import { ReactNode } from "react";
import { useUser } from "@/app/components/UserContext";

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

// Компоненты-обёртки

export const SiteAdminOnly = ({ children }: { children: ReactNode }) => (
  <RoleGuard allowed={["site_admin"]}>{children}</RoleGuard>
);

export const TournamentAdminOnly = ({
  children,
}: {
  children: ReactNode;
}) => <RoleGuard allowed={["tournament_admin"]}>{children}</RoleGuard>;

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