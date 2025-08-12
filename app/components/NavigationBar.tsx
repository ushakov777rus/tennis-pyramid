"use client";

import Link from "next/link";

import { useState } from "react";

import { UserBadge } from "@/app/components/UserBadge";

import "./NavigationBar.css";

export function NavigationBar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
      <header className="header">
        <div className="logo">ХЗ</div>
        <nav className="nav">
          <Link href="/">Главная</Link>
          <Link href="/tournaments">Турниры</Link>
          <Link href="/rating">Рейтинг</Link>
          <Link href="/matches">Матчи</Link>
        </nav>
        <UserBadge />
      </header>
  );
}