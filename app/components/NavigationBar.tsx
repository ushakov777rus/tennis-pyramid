"use client";

import { UserBadge } from "@/app/components/UserBadge";

import "./NavigationBar.css"; // можно вынести стили отдельно

export function NavigationBar() {
  return (
    <nav className="hero-nav">
      <a href="/">Главная</a>
      <a href="/tournaments">Турниры</a>
      <a href="/rating">Рейтинг</a>
      <a href="/matches">Матчи</a>
      <UserBadge />
    </nav>
  );
}