"use client";

import Link from "next/link";

import { UserBadge } from "@/app/components/UserBadge";

import "./NavigationBar.css";

import Image from "next/image";
import { usePathname } from "next/navigation";

export function NavigationBar() {
  const pathname = usePathname();

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(href + "/");
  }
 
  return (
    <header className="header">
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
        <Link href="/" className={isActive("/") ? "active" : ""}>Главная</Link>
        <Link href="/clubs" className={isActive("/clubs") ? "active" : ""}>Клубы</Link>
        <Link href="/tournaments" className={isActive("/tournaments") ? "active" : ""}>Турниры</Link>
        <Link href="/rating" className={isActive("/rating") ? "active" : ""}>Игроки</Link>
        <Link href="/matches" className={isActive("/matches") ? "active" : ""}>Матчи</Link>
      </nav>
      <UserBadge />
    </header>
  );
}