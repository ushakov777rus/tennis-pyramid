// app/components/SideNav.tsx
"use client";

import "./SideNavigationBar.css";

import {
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import Link from "next/link";
import {
  usePathname,
  useRouter,
} from "next/navigation";
import { useUser } from "@/app/components/UserContext";
import {
  roleLabel,
  UserRole,
} from "@/app/models/Users";

/* ===========================
   SVG ИКОНКИ 24x24 (#CF6)
   ---------------------------
   - Преднамеренно лаконичные
   - aria-hidden т.к. рядом есть текст
   - Можно свободно переиспользовать
   =========================== */

function IconBase({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <svg
      className={className}
      width={24}
      height={24}
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      {/* Общий цвет для всех иконок */}
      <g
        fill="#CF6"
        fillRule="evenodd"
        clipRule="evenodd"
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
      <path d="M11.293 2.293a1 1 0 0 1 1.414 0l8 8A1 1 0 0 1 20.999 12H20v8a2 2 0 0 1-2 2h-4a1 1 0 0 1-1-1v-5h-2v5a1 1 0 0 1-1 1H6a2 2 0 0 1-2-2v-8h-.999a1 1 0 0 1-.708-1.707l8-8Z" />
    </IconBase>
  );
}

/** Теннисный мяч: Турниры */
function IconTennis() {
  return (
    <IconBase>
      <path d="M12 2a10 10 0 1 1 0 20A10 10 0 0 1 12 2Zm6.5 3.8c-2.59.32-4.62 1.76-6.22 3.9-1.56 2.07-2.3 4.46-2.58 6.58a8 8 0 0 0 8.8-10.48ZM5.5 18.2c2.59-.32 4.62-1.76 6.22-3.9 1.56-2.07 2.3-4.46 2.58-6.58A8 8 0 0 0 5.5 18.2Z" />
    </IconBase>
  );
}

/** Диаграмма: Рейтинг игроков */
function IconChart() {
  return (
    <IconBase>
      <path d="M3 20a1 1 0 0 1 0-2h18a1 1 0 1 1 0 2H3Zm3-4a1 1 0 0 1-1-1v-6a1 1 0 1 1 2 0v6a1 1 0 0 1-1 1Zm6 0a1 1 0 0 1-1-1V7a1 1 0 1 1 2 0v8a1 1 0 0 1-1 1Zm6 0a1 1 0 0 1-1-1v-3a1 1 0 1 1 2 0v3a1 1 0 0 1-1 1Z" />
    </IconBase>
  );
}

/** Стадион/арена: Клубы */
function IconStadium() {
  return (
    <IconBase>
      <path d="M4 7c0-1.657 3.582-3 8-3s8 1.343 8 3-3.582 3-8 3-8-1.343-8-3Zm16 4.5C19.2 12.445 15.9 13 12 13s-7.2-.555-8-1.5V17c0 1.657 3.582 3 8 3s8-1.343 8-3v-5.5Z" />
      <path d="M6 6V4l4 1v2L6 6Zm8 0V4l4 1v2l-4-1Z" />
    </IconBase>
  );
}

/** Профиль: Мой профиль */
function IconUser() {
  return (
    <IconBase>
      <path d="M12 3a4 4 0 1 1 0 8 4 4 0 0 1 0-8Zm0 10c4.418 0 8 2.239 8 5v2H4v-2c0-2.761 3.582-5 8-5Z" />
    </IconBase>
  );
}

/** Кубок: Админ/клубы */
function IconTrophy() {
  return (
    <IconBase>
      <path d="M18 4h2a2 2 0 0 1 2 2c0 3.314-2.686 6-6 6h-1a5 5 0 0 1-4 0h-1C5.686 12 3 9.314 3 6a2 2 0 0 1 2-2h2V2h11v2Zm-9 12h6v1a3 3 0 0 1-3 3h-0a3 3 0 0 1-3-3v-1Z" />
    </IconBase>
  );
}

/* ===========================
   ОСНОВНОЙ КОМПОНЕНТ SIDENAV
   =========================== */

export function SideNavigationBar() {
  const {
    user,
    setUser,
  } = useUser();

  const router = useRouter();
  const [
    open,
    setOpen,
  ] = useState(false);           // mobile drawer
  const [
    collapsed,
    setCollapsed,
  ] = useState(false);           // desktop collapse
  const [
    isDesktop,
    setIsDesktop,
  ] = useState(false);
  const pathname = usePathname();
  const panelRef = useRef<HTMLDivElement | null>(null);
  const touchStartX = useRef<number | null>(null);

  // кто админ (покажем секцию "Администрирование")
  const isAdmin =
    user?.role === UserRole.SiteAdmin ||
    user?.role === UserRole.TournamentAdmin;

  // Основная навигация (SVG вместо эмодзи)
  const mainNav = [
    {
      href: "/",
      label: "Главная",
      icon: <IconHome />,
    },
    {
      href: "/tournaments",
      label: "Турниры",
      icon: <IconTennis />,
    },
    {
      href: "/rating",
      label: "Рейтинг игроков",
      icon: <IconChart />,
    },
    {
      href: "/clubs",
      label: "Клубы",
      icon: <IconStadium />,
    },
  ];

  const profileNav = [
    {
      href: "/me",
      label: "Профиль",
      icon: <IconUser />,
    },
    // Если понадобится: карточка игрока
    // user ? {
    //   href: `/players/${user.player.id}`,
    //   label: "Моя карточка игрока",
    //   icon: <IconUser />,
    // } : null,
  ].filter(Boolean) as {
    href: string;
    label: string;
    icon: React.ReactNode;
  }[];

  const userNav = isAdmin
    ? [
        {
          href: "/admin",
          label: "Мой клуб",
          icon: <IconTrophy />,
        },
      ]
    : [
        {
          href: "/player",
          label: "Мои клубы",
          icon: <IconTrophy />,
        },
      ];

  // контроль состояния
  const close = useCallback(
    () => setOpen(false),
    [],
  );
  const toggle = useCallback(
    () => setOpen((v) => !v),
    [],
  );
  const toggleCollapsed = useCallback(
    () => setCollapsed((v) => !v),
    [],
  );

  // клавиша Esc закрывает mobile drawer
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [
    close,
  ]);

  // закрываем mobile drawer при смене маршрута
  useEffect(() => {
    close();
  }, [
    pathname,
    close,
  ]);

  // запрет прокрутки фона, когда открыт mobile drawer
  useEffect(() => {
    if (open && !isDesktop) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [
    open,
    isDesktop,
  ]);

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
    <span aria-hidden="true">
      {collapsed ? "▶" : "◀"}
    </span>
  ); // вправо — когда свернуто, влево — когда раскрыто

  async function handleLogout() {
    await fetch(
      "/api/logout",
      { method: "POST" },
    );
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
      {
        !isDesktop &&
        open &&
        (
          <div
            className="drawer-overlay"
            onClick={close}
          />
        )
      }

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
          {
            isDesktop
              ? (
                <button
                  className="collapse-btn"
                  aria-label={collapsed ? "Развернуть меню" : "Свернуть меню"}
                  onClick={toggleCollapsed}
                  type="button"
                >
                  <Chevron />
                </button>
                )
              : (
                <button
                  className="close-btn"
                  aria-label="Закрыть меню"
                  onClick={close}
                  type="button"
                >
                  ×
                </button>
                )
          }

          <div
            style={{
              display: "flex",
            }}
          >
            <div
              className="avatar"
              aria-hidden="true"
            >
              {
                (user.player?.name?.[0] ??
                  user.name?.[0] ??
                  "U").toUpperCase()
              }
            </div>

            {
              !collapsed &&
              (
                <div className="who">
                  <div
                    className="who-name"
                    title={user.name}
                  >
                    {user.name}
                  </div>
                  <div className="who-role">
                    {roleLabel(user.role)}
                  </div>
                </div>
              )
            }
          </div>
        </div>

        {/* Навигация */}
        <div className="drawer-scroll">
          <Section
            title="Администрирование"
            collapsed={collapsed}
          >
            {
              userNav.map((it) => (
                <NavLink
                  key={it.href}
                  href={it.href}
                  icon={it.icon}
                  label={it.label}
                  collapsed={collapsed}
                  onClick={!isDesktop ? close : undefined}
                  active={pathname === it.href}
                />
              ))
            }
          </Section>

          <Section
            title="Мой профиль"
            collapsed={collapsed}
          >
            {
              profileNav.map((it) => (
                <NavLink
                  key={it.href}
                  href={it.href}
                  icon={it.icon}
                  label={it.label}
                  collapsed={collapsed}
                  onClick={!isDesktop ? close : undefined}
                  active={pathname === it.href}
                />
              ))
            }
          </Section>

          <Section
            title="Навигация"
            collapsed={collapsed}
          >
            {
              mainNav.map((it) => (
                <NavLink
                  key={it.href}
                  href={it.href}
                  icon={it.icon}
                  label={it.label}
                  collapsed={collapsed}
                  onClick={!isDesktop ? close : undefined}
                  active={pathname === it.href}
                />
              ))
            }
          </Section>
        </div>

        <div className="drawer-footer">
          <button
            onClick={handleLogout}
            className="user-badge-btn"
          >
            Выйти
          </button>
        </div>
      </nav>
    </>
  );
}

/* ===========================
   Вспомогательные подкомпоненты
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
      className={`drawer-link ${active ? "active" : ""} ${collapsed ? "icon-only" : ""}`}
      href={href}
      onClick={onClick}
    >
      <span
        className="nav-icon"
        aria-hidden="true"
      >
        {icon}
      </span>
      <span className="nav-text">
        {label}
      </span>
    </Link>
  );
}
