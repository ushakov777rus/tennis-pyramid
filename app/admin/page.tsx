"use client";

import { useEffect, useState } from "react";

type User = {
  id: number;
  name: string;
  role: string;
};

export default function AdminPage() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    async function loadUser() {
      const res = await fetch("/api/me");
      const data = await res.json();
      if (data.loggedIn) {
        setUser(data.user);
      }
      setLoading(false);
    }
    loadUser();
  }, []);

  if (loading) {
    return <p>Загрузка...</p>;
  }

  if (!user) {
    return <p>❌ Доступ запрещён. Войдите в систему.</p>;
  }

  if (user.role !== "site_admin") {
    return <p>🚫 У вас нет прав для доступа к админке.</p>;
  }

  return (
    <div>
      <h1>👑 Админка</h1>
      <p>Добро пожаловать, {user.name}!</p>
      <p>У вас есть полный доступ к управлению сайтом.</p>
    </div>
  );
}