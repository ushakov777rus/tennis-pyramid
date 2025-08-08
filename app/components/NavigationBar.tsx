"use client";

import { useState } from "react";

import { UserBadge } from "@/app/components/UserBadge";

import "./NavigationBar.css";

export function NavigationBar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
      <header className="header">
        <div className="logo">ХЗ</div>
        <nav className="nav">
          <a href="/">Главная</a>
          <a href="/tournaments">Турниры</a>
          <a href="/rating">Рейтинг</a>
          <a href="/matches">Матчи</a>
        </nav>
        <UserBadge />
      </header>
  );
}