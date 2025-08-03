"use client";

import { ReactNode, useEffect, useState } from "react";

type User = {
  id: number;
  role: string;
  name: string;
};

type RoleGuardProps = {
  allowed: string[]; // роли, которым разрешено
  children: ReactNode;
};

export function RoleGuard({ allowed, children }: RoleGuardProps) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    async function loadUser() {
      const res = await fetch("/api/me");
      const data = await res.json();
      if (data.loggedIn) setUser(data.user);
    }
    loadUser();
  }, []);

  if (!user) return null; // пока грузим — ничего не показываем

  return allowed.includes(user.role) ? <>{children}</> : null;
}

export const SiteAdminOnly = ({ children }: { children: ReactNode }) => (
  <RoleGuard allowed={["site_admin"]}>{children}</RoleGuard>
);

export const TournamentAdminOnly = ({ children }: { children: ReactNode }) => (
  <RoleGuard allowed={["tournament_admin"]}>{children}</RoleGuard>
);

export const AdminOnly = ({ children }: { children: ReactNode }) => (
  <RoleGuard allowed={["site_admin", "tournament_admin"]}>{children}</RoleGuard>
);