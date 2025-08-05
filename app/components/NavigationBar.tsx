"use client";

import { useState } from "react";
import { UserBadge } from "@/app/components/UserBadge";
import "./NavigationBar.css";

export function NavigationBar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="hero-nav">
      {/* Левая часть: логотип / бургер */}
      <div className="nav-left">
        <button
          className={`burger ${isOpen ? "open" : ""}`}
          onClick={() => setIsOpen(!isOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {/* Основные ссылки */}
      <div className={`nav-links ${isOpen ? "active" : ""}`}>
        <a href="/">Главная</a>
        <a href="/tournaments">Турниры</a>
        <a href="/rating">Рейтинг</a>
        <a href="/matches">Матчи</a>
      </div>

      {/* Справа — юзер */}
      <div className="nav-right">
        <UserBadge />
      </div>
    </nav>
  );
}