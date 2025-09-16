// app/components/SideNav.tsx
"use client";

import "./SideNavigationBar.css";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "@/app/components/UserContext";
import { UserRole } from "@/app/models/Users";
import { useRouter } from "next/navigation";

export function SideNavigationBar() {
  const { user, setUser } = useUser();
  const router = useRouter();
  const [open, setOpen] = useState(false);                // mobile drawer
  const [collapsed, setCollapsed] = useState(false);      // desktop collapse
  const [isDesktop, setIsDesktop] = useState(false);
  const pathname = usePathname();
  const panelRef = useRef<HTMLDivElement | null>(null);
  const touchStartX = useRef<number | null>(null);

  // items с иконками (можно заменить на svg-иконки)
  const isAdmin =
    user?.role === UserRole.SiteAdmin || user?.role === UserRole.TournamentAdmin;

  const mainNav = [
    { href: "/", label: "Главная", icon: "🏠" },
    { href: "/tournaments", label: "Турниры", icon: "🎾" },
    { href: "/rating", label: "Рейтинг игроков", icon: "📈" },
    { href: "/clubs", label: "Клубы", icon: "🏟️" },
  ];
  const profileNav = [
    { href: "/me", label: "Профиль", icon: "👤" },
/*    user
      ? { href: `/players/${user.player.id}`, label: "Моя карточка игрока", icon: "🎫" }
      : null,*/
  ].filter(Boolean) as { href: string; label: string; icon: string }[];

  const adminNav = isAdmin
    ? [
        { href: "/tadmin", label: "Мой клуб", icon: "🏆" },
      ]
    : [];

  const close = useCallback(() => setOpen(false), []);
  const toggle = useCallback(() => setOpen((v) => !v), []);
  const toggleCollapsed = useCallback(() => setCollapsed((v) => !v), []);

  // клавиша Esc закрывает mobile drawer
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [close]);

  // закрываем mobile drawer при смене маршрута
  useEffect(() => {
    close();
  }, [pathname, close]);

  // запрет прокрутки фона, когда открыт mobile drawer
  useEffect(() => {
    if (open && !isDesktop) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [open, isDesktop]);

  // свайп для закрытия (mobile)
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

  // брейкпоинт десктопа
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(min-width: 900px)");
    const apply = () => setIsDesktop(mq.matches);
    apply();
    mq.addEventListener?.("change", apply);
    return () => mq.removeEventListener?.("change", apply);
  }, []);

  // если не залогинен — ничего не рендерим (хуки уже вызваны — безопасно)
  if (!user) return null;

const drawerClass = [
    "side-drawer",
    isDesktop ? "desktop" : "mobile",
    isDesktop
      ? (collapsed ? "collapsed sidenav-collapsed" : "expanded sidenav-expanded")
      : (open ? "open" : ""),
  ].join(" ");

  const Chevron = () => (
    <span aria-hidden="true">{collapsed ? "▶" : "◀"}</span>
  ); // вправо — когда свернуто, влево — когда раскрыто

  async function handleLogout() {
    await fetch("/api/logout", { method: "POST" });
    setUser(null);
    router.replace("/");
  }


  return (
    <>
      {/* Кнопка-бургер (видна только на mobile через CSS) */}
      <button
        className="burger-btn"
        aria-label={open ? "Закрыть меню" : "Открыть меню"}
        aria-expanded={open}
        aria-controls="side-drawer"
        onClick={toggle}
      >
        <span />
        <span />
        <span />
      </button>

      {/* Оверлей только на mobile */}
      {!isDesktop && open && <div className="drawer-overlay" onClick={close} />}

      {/* Боковая панель */}
      <nav
        id="side-drawer"
        ref={panelRef}
        className={drawerClass}
        role="dialog"
        aria-modal={!isDesktop}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
      >
        {/* Хедер */}
        <div className="drawer-header">
            {/* Кнопки управления:
              - на mobile: крестик (стрелка не нужна)
              - на desktop: стрелка сворачивания/разворачивания */}
          {isDesktop ? (
            <button
              className="collapse-btn"
              aria-label={collapsed ? "Развернуть меню" : "Свернуть меню"}
              onClick={toggleCollapsed}
              type="button"
            >
              <Chevron />
            </button>
          ) : (
            <button
              className="close-btn"
              aria-label="Закрыть меню"
              onClick={close}
              type="button"
            >
              ×
            </button>
          )}
          <div style={{display: "flex"}}>
            <div className="avatar" aria-hidden="true">
                {(user.player?.name?.[0] ?? user.name?.[0] ?? "U").toUpperCase()}
            </div>
            {!collapsed && (
            <div className="who">
                <div className="who-name" title={user.name}>
                {user.name}
                </div>
                <div className="who-role">{user.role}</div>
            </div>)
            }
          </div>
        </div>

        {/* Навигация */}
        <div className="drawer-scroll">
          {isAdmin && (
            <Section title="Администрирование" collapsed={collapsed}>
              {adminNav.map((it) => (
                <NavLink
                  key={it.href}
                  href={it.href}
                  icon={it.icon}
                  label={it.label}
                  collapsed={collapsed}
                  onClick={!isDesktop ? close : undefined}
                  active={pathname === it.href}
                />
              ))}
            </Section>
          )}

          <Section title="Мой профиль" collapsed={collapsed}>
            {profileNav.map((it) => (
              <NavLink
                key={it.href}
                href={it.href}
                icon={it.icon}
                label={it.label}
                collapsed={collapsed}
                onClick={!isDesktop ? close : undefined}
                active={pathname === it.href}
              />
            ))}
          </Section>

          <Section title="Навигация" collapsed={collapsed}>
            {mainNav.map((it) => (
              <NavLink
                key={it.href}
                href={it.href}
                icon={it.icon}
                label={it.label}
                collapsed={collapsed}
                onClick={!isDesktop ? close : undefined}
                active={pathname === it.href}
              />
            ))}
          </Section>

        </div>

        <div className="drawer-footer">
          <button onClick={handleLogout} className="user-badge-btn">
            Выйти
          </button>
        </div>
      </nav>
    </>
  );
}

/** Вспомогательные подкомпоненты */

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