"use client";

import Link from "next/link";

import "./NavigationBar.css";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useUser } from "../UserContext";
import { IconTelegram } from "./IconButtons";
import { useDictionary, useLanguage } from "../LanguageProvider";
import { stripLocaleFromPath, withLocalePath } from "@/app/i18n/routing";
import { LanguageSwitcher } from "./LanguageSwitcher";

const LOCALE_AWARE_PATHS = new Set(["/", "/clubs", "/tournaments", "/matches", "/rating", "/freetournament", "/about"]);


export function NavigationBar() {
  const { user } = useUser();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const { locale } = useLanguage();
  const dictionary = useDictionary();

  const normalizedPathname = useMemo(() => {
    if (!pathname) return "/";
    const { path } = stripLocaleFromPath(pathname ?? "/");
    return path;
  }, [pathname]);

  function isActive(href: string) {
    if (LOCALE_AWARE_PATHS.has(href)) {
      const target = href === "/" ? "/" : href;
      return normalizedPathname === target || normalizedPathname.startsWith(`${target}/`);
    }
    const currentPath = pathname ?? "/";
    return currentPath === href || currentPath.startsWith(`${href}/`);
  }

  const buildHref = (href: string) => {
    if (!LOCALE_AWARE_PATHS.has(href)) {
      return href;
    }
    return withLocalePath(locale, href);
  };

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
      <div style={{gridColumn: "1/-1", margin: "auto"}}><LanguageSwitcher /></div>
      <div className="header-hamburger">
        <button
          type="button"
          className={`menu-toggle ${menuOpen ? "menu-toggle--open" : ""}`}
          aria-expanded={menuOpen}
          aria-controls="main-nav"
          aria-label={menuOpen ? dictionary.common.menu.close : dictionary.common.menu.open}
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          <span className="menu-toggle__bar" />
          <span className="menu-toggle__bar" />
          <span className="menu-toggle__bar" />
        </button>
      </div>

      <div className="logo">
        <Link
          href={buildHref("/")}
          className="logo-link"
          aria-label={dictionary.navigation.home}
          onClick={() => setMenuOpen(false)}
        >
          <Image
            src="/logo.png" // положи картинку в public/logo.png
            alt={dictionary.app.name}
            width={40} // размеры подгони под макет
            height={40}
            priority
          />
          {hydrated && <span className="logo-text">{dictionary.app.name}</span>}
        </Link>
      </div>

      <nav id="main-nav" className={`nav ${menuOpen ? "nav-open" : ""}`}>
        <Link
          href={buildHref("/")}
          className={isActive("/") ? "active" : ""}
          onClick={() => setMenuOpen(false)}
        >
          {dictionary.navigation.home}
        </Link>
        <Link
          href={buildHref("/clubs")}
          className={isActive("/clubs") ? "active" : ""}
          onClick={() => setMenuOpen(false)}
        >
          {dictionary.navigation.clubs}
        </Link>
        <Link
          href={buildHref("/tournaments")}
          className={isActive("/tournaments") ? "active" : ""}
          onClick={() => setMenuOpen(false)}
        >
          {dictionary.navigation.tournaments}
        </Link>
        <Link
          href={buildHref("/rating")}
          className={isActive("/rating") ? "active" : ""}
          onClick={() => setMenuOpen(false)}
        >
          {dictionary.navigation.rating}
        </Link>
        {/* <Link
          href={buildHref("/matches")}
          className={isActive("/matches") ? "active" : ""}
          onClick={() => setMenuOpen(false)}
        >
          {dictionary.navigation.matches}
        </Link> */}
        <Link
          href={buildHref("/about")}
          className={isActive("/about") ? "active" : ""}
          onClick={() => setMenuOpen(false)}
        >
          {dictionary.navigation.about}
        </Link>
      </nav>

      <div className="header-actions">
        <div className="header-tg">
          <a
            href="https://t.me/honeycuptennis"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-icon"
            aria-label="Telegram"
          >
            <IconTelegram />
          </a>
        </div>
      </div>

    </header>
  );
}
