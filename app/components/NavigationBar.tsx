"use client";

import Link from "next/link";

import { useState } from "react";

import { UserBadge } from "@/app/components/UserBadge";

import "./NavigationBar.css";

import Image from "next/image";

export function NavigationBar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="page-menu">
      <div className="logo">
        <Link href="/">
          <Image
            src="/logo.png" // положи картинку в public/logo.png
            alt="Логотип"
            width={40} // размеры подгони под макет
            height={40}
            priority
          />
        </Link>
      </div>
      <nav className="nav">
        <Link href="/">Главная</Link>
        <Link href="/tournaments">Турниры</Link>
        <Link href="/rating">Игроки</Link>
        <Link href="/matches">Матчи</Link>
      </nav>
      <UserBadge />
    </header>
  );
}