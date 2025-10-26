// app/components/SideNav.tsx
"use client";

import "./SideNavigationBar.css";

import {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useUser } from "@/app/components/UserContext";
import { UserRole } from "@/app/models/Users";
import { useDictionary, useLanguage } from "../LanguageProvider";
import { stripLocaleFromPath, withLocalePath } from "@/app/i18n/routing";

/* ===========================
   SVG-иконки 24x24 (#CF6)
   =========================== */

function IconBase({ children }: { children: React.ReactNode }) {
  return (
    <svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <g
        fill="none"
        stroke="#CF6"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {children}
      </g>
    </svg>
  );
}

/** Домик: Главная */
function IconHome() {
  return (
    <IconBase>
      <path d="M3 10L12 3l9 7v10a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1V10Z" />
    </IconBase>
  );
}

/** Мой клуб: ракетка + мячик + человечек */
function IconMyClub() {
  return (
    <IconBase>
      {/* человечек */}
      <circle cx={18} cy={6} r={2} />
      <path d="M18 8v4m-2 0h4" />
      {/* ракетка */}
      <ellipse cx={7} cy={7} rx={3} ry={4} transform="rotate(-20 7 7)" />
      <line x1={9} y1={10} x2={12} y2={20} />
      {/* мячик */}
      <circle cx={15} cy={17} r={2} />
    </IconBase>
  );
}

/** Турниры: кубок */
function IconTrophy() {
  return (
    <IconBase>
      <path d="M8 4h8v2a4 4 0 0 1-8 0V4Z" />
      <path d="M12 10v4" />
      <path d="M9 18h6v2H9z" />
      <path d="M4 6h3v2a3 3 0 0 1-3-3Z" />
      <path d="M20 6h-3v2a3 3 0 0 0 3-3Z" />
    </IconBase>
  );
}

/** Клубы: две ракетки и мячик */
function IconClubs() {
  return (
    <IconBase>
      <ellipse cx={7} cy={7} rx={3} ry={4} transform="rotate(-20 7 7)" />
      <line x1={9} y1={10} x2={13} y2={18} />
      <ellipse cx={17} cy={7} rx={3} ry={4} transform="rotate(20 17 7)" />
      <line x1={15} y1={10} x2={11} y2={18} />
      <circle cx={12} cy={20} r={2} />
    </IconBase>
  );
}

/** Профиль: юзер */
function IconUser() {
  return (
    <IconBase>
      <circle cx={12} cy={7} r={3} />
      <path d="M5 21c0-4 14-4 14 0" />
    </IconBase>
  );
}

/** Рейтинг: диаграмма */
function IconChart() {
  return (
    <IconBase>
      <path d="M3 20h18" />
      <path d="M7 16v-6" />
      <path d="M12 16V7" />
      <path d="M17 16v-3" />
    </IconBase>
  );
}

/* ===========================
   SideNavigationBar
   =========================== */

export function SideNavigationBar() {
  const { user, setUser } = useUser();
  const router = useRouter();
  const [open, setOpen] = useState(false); // mobile drawer
  const [collapsed, setCollapsed] = useState(false); // desktop collapse
  const [isDesktop, setIsDesktop] = useState(false);
  const pathname = usePathname();
  const { locale } = useLanguage();
  const dictionary = useDictionary();
  const { path: normalizedPath } = stripLocaleFromPath((pathname ?? "/"));
  const panelRef = useRef<HTMLDivElement | null>(null);
  const touchStartX = useRef<number | null>(null);

  const isAdmin =
    user?.role === UserRole.SiteAdmin || user?.role === UserRole.TournamentAdmin;

  const mainNav = useMemo(
    () => [
      { path: "/freetournament", label: dictionary.navigation.home, icon: <IconHome />, localized: true },
      { path: "/tournaments", label: dictionary.navigation.tournaments, icon: <IconTrophy />, localized: true },
      { path: "/rating", label: dictionary.navigation.rating, icon: <IconChart />, localized: true },
      { path: "/clubs", label: dictionary.navigation.clubs, icon: <IconClubs />, localized: true },
    ],
    [dictionary],
  );

  const profileNav = useMemo(
    () => [
      { path: "/me", label: dictionary.navigation.profile, icon: <IconUser />, localized: false },
    ],
    [dictionary],
  );

  const userNav = useMemo(
    () =>
      isAdmin
        ? [{ path: "/admin", label: dictionary.sidebar.myClub, icon: <IconMyClub />, localized: true }]
        : [{ path: "/player", label: dictionary.sidebar.myClubs, icon: <IconMyClub />, localized: true }],
    [isAdmin, dictionary],
  );

  const close = useCallback(() => setOpen(false), []);
  const toggle = useCallback(() => setOpen((v) => !v), []);
  const toggleCollapsed = useCallback(() => setCollapsed((v) => !v), []);

  // Esc закрывает drawer
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [close]);

  // закрытие при смене маршрута
  useEffect(() => {
    close();
  }, [pathname, close]);

  // запрет прокрутки фона на mobile
  useEffect(() => {
    if (open && !isDesktop) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [open, isDesktop]);

  // свайп для закрытия
  const onTouchStart = (e: React.TouchEvent) => {
    if (isDesktop) return;
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchMove = (e: React.TouchEvent) => {
    if (isDesktop) return;
    if (touchStartX.current == null) return;
    const dx = e.touches[0].clientX - touchStartX.current;
    if (dx < -60) {
      close();
      touchStartX.current = null;
    }
  };

  // брейкпоинт
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(min-width: 900px)");
    const apply = () => setIsDesktop(mq.matches);
    apply();
    mq.addEventListener?.("change", apply);
    return () => mq.removeEventListener?.("change", apply);
  }, []);

  if (!user) return null;

  const drawerClass = [
    "side-drawer",
    isDesktop ? "desktop" : "mobile",
    isDesktop
      ? collapsed
        ? "collapsed sidenav-collapsed"
        : "expanded sidenav-expanded"
      : open
      ? "open"
      : "",
  ].join(" ");

  const Chevron = () => (
    <span aria-hidden="true">{collapsed ? "▶" : "◀"}</span>
  );

  async function handleLogout() {
    await fetch("/api/logout", { method: "POST" });
    setUser(null);
    router.replace("/");
  }

  return (
    <>
      <button
        className="burger-btn"
        aria-label={open ? dictionary.sidebar.toggleClose : dictionary.sidebar.toggleOpen}
        aria-expanded={open}
        aria-controls="side-drawer"
        onClick={toggle}
      >
        <span />
        <span />
        <span />
      </button>

      {!isDesktop && open && <div className="drawer-overlay" onClick={close} />}

      <nav
        id="side-drawer"
        ref={panelRef}
        className={drawerClass}
        role="dialog"
        aria-modal={!isDesktop}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
      >
        <div className="drawer-header">
          {isDesktop ? (
            <button
              className="collapse-btn"
              aria-label={collapsed ? dictionary.sidebar.expand : dictionary.sidebar.collapse}
              onClick={toggleCollapsed}
              type="button"
            >
              <Chevron />
            </button>
          ) : (
            <button
              className="close-btn"
              aria-label={dictionary.sidebar.toggleClose}
              onClick={close}
              type="button"
            >
              ×
            </button>
          )}
          <div style={{ display: "flex" }}>
            <div className="avatar" aria-hidden="true">
              {(user.player?.name?.[0] ?? user.name?.[0] ?? "U").toUpperCase()}
            </div>
            {!collapsed && (
              <div className="who">
                <div className="who-name" title={user.name}>
                  {user.name}
                </div>
                <div className="who-role">
                  {
                    user.role === UserRole.SiteAdmin
                      ? dictionary.users.roles.siteAdmin
                      : user.role === UserRole.TournamentAdmin
                      ? dictionary.users.roles.tournamentAdmin
                      : user.role === UserRole.Player
                      ? dictionary.users.roles.player
                      : dictionary.users.roles.guest
                  }
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="drawer-scroll">
          <Section title={dictionary.sidebar.sections.admin} collapsed={collapsed}>
            {userNav.map((it) => {
              const href = it.localized ? withLocalePath(locale, it.path) : it.path;
              const active = it.localized
                ? normalizedPath === it.path || normalizedPath.startsWith(`${it.path}/`)
                : (pathname ?? "/") === it.path || (pathname ?? "/").startsWith(`${it.path}/`);
              return (
                <NavLink
                  key={it.path}
                  href={href}
                  icon={it.icon}
                  label={it.label}
                  collapsed={collapsed}
                  onClick={!isDesktop ? close : undefined}
                  active={active}
                />
              );
            })}
          </Section>

          <Section title={dictionary.sidebar.sections.profile} collapsed={collapsed}>
            {profileNav.map((it) => {
              const href = it.localized ? withLocalePath(locale, it.path) : it.path;
              const active = it.localized
                ? normalizedPath === it.path || normalizedPath.startsWith(`${it.path}/`)
                : (pathname ?? "/") === it.path || (pathname ?? "/").startsWith(`${it.path}/`);
              return (
                <NavLink
                  key={it.path}
                  href={href}
                  icon={it.icon}
                  label={it.label}
                  collapsed={collapsed}
                  onClick={!isDesktop ? close : undefined}
                  active={active}
                />
              );
            })}
          </Section>

          <Section title={dictionary.sidebar.sections.navigation} collapsed={collapsed}>
            {mainNav.map((it) => {
              const href = it.localized ? withLocalePath(locale, it.path) : it.path;
              const active = it.localized
                ? normalizedPath === it.path || normalizedPath.startsWith(`${it.path}/`)
                : (pathname ?? "/") === it.path || (pathname ?? "/").startsWith(`${it.path}/`);
              return (
                <NavLink
                  key={it.path}
                  href={href}
                  icon={it.icon}
                  label={it.label}
                  collapsed={collapsed}
                  onClick={!isDesktop ? close : undefined}
                  active={active}
                />
              );
            })}
          </Section>
        </div>

        <div className="drawer-footer">
          <button onClick={handleLogout} className="user-badge-btn">
            {dictionary.sidebar.logout}
          </button>
        </div>
      </nav>
    </>
  );
}

/* ===========================
   Подкомпоненты
   =========================== */

function Section({
  title,
  children,
  collapsed,
}: {
  title: string;
  children: React.ReactNode;
  collapsed: boolean;
}) {
  return (
    <div className="drawer-section">
      <div className={`drawer-caption ${collapsed ? "hidden" : ""}`}>
        {title}
      </div>
      {children}
    </div>
  );
}

function NavLink({
  href,
  icon,
  label,
  collapsed,
  onClick,
  active,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  collapsed: boolean;
  onClick?: () => void;
  active?: boolean;
}) {
  return (
    <Link
      className={`drawer-link ${active ? "active" : ""} ${
        collapsed ? "icon-only" : ""
      }`}
      href={href}
      onClick={onClick}
    >
      <span className="nav-icon" aria-hidden="true">
        {icon}
      </span>
      <span className="nav-text">{label}</span>
    </Link>
  );
}
