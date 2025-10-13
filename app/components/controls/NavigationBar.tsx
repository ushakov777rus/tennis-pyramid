"use client";

import Link from "next/link";

import "./NavigationBar.css";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useUser } from "../UserContext";


export function NavigationBar() {
  const { user } = useUser();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(href + "/");
  }

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated) {
    return null;
  }

  // Залогинен это меню не нужно
  if (user) return null;
 
  return (
    <header className="header">
      <div className="logo">
        <Link href="/" className="logo-link" aria-label="Главная">
          <Image
            src="/logo.png" // положи картинку в public/logo.png
            alt="Логотип HoneyCup"
            width={40} // размеры подгони под макет
            height={40}
            priority
          />
          {hydrated && <span className="logo-text">HoneyCup</span>}
        </Link>
      </div>
      <button
        type="button"
        className={`menu-toggle ${menuOpen ? "menu-toggle--open" : ""}`}
        aria-expanded={menuOpen}
        aria-controls="main-nav"
        aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"}
        onClick={() => setMenuOpen((prev) => !prev)}
      >
        <span className="menu-toggle__bar" />
        <span className="menu-toggle__bar" />
        <span className="menu-toggle__bar" />
      </button>
      <nav id="main-nav" className={`nav ${menuOpen ? "nav-open" : ""}`}>
        <Link href="/" className={isActive("/") ? "active" : ""} onClick={() => setMenuOpen(false)}>Главная</Link>
        <Link href="/clubs" className={isActive("/clubs") ? "active" : ""} onClick={() => setMenuOpen(false)}>Клубы</Link>
        <Link href="/tournaments" className={isActive("/tournaments") ? "active" : ""} onClick={() => setMenuOpen(false)}>Турниры</Link>
        <Link href="/rating" className={isActive("/rating") ? "active" : ""} onClick={() => setMenuOpen(false)}>Игроки</Link>
        {/* <Link href="/matches" className={isActive("/matches") ? "active" : ""} onClick={() => setMenuOpen(false)}>Матчи</Link>*/}
        <Link href="/about" className={isActive("/about") ? "active" : ""} onClick={() => setMenuOpen(false)}>О проекте</Link>
      </nav>
    </header>
  );
}
