"use client";

import React from "react";
import "./UserCard.css"

export type UserRole = "site_admin" | "tournament_admin" | "player" | "guest";
type Props = {
  fullName: string;
  role?: UserRole | null;
  phone?: string | null;
  email?: string | null;
  whatsapp?: string | null;
  telegram?: string | null;
  className?: string;
};

const BRAND = {
  green: "#ccff66",
  wa: "#25D366",
  tg: "#26A5E4",
  inactive: "rgb(121 121 121)"
};

export function UserCard({
  fullName,
  role = "tournament_admin",
  phone,
  email,
  whatsapp,
  telegram,
  className = "",
}: Props) {
  const waSource = whatsapp || phone || null;

  const telHref = phone ? `tel:+7${phone}` : undefined;
  const mailHref = email ? `mailto:${email.trim()}` : undefined;
  const waHref = waSource ? `https://wa.me/${waSource.replace(/\D/g, "").replace(/^8(\d{10})$/, "7$1")}` : undefined;
  const tgHref = telegram
    ? (telegram.startsWith("http") ? telegram : `https://t.me/${telegram.replace(/^@/, "")}`)
    : undefined;

  return (
    <div className="card">
      <div className="card-row user-card-row">
        <div className="avatar">{(fullName?.[0] ?? "U").toUpperCase()}</div>
        <div className="ucard__text">
          <div className="ucard__role">{roleLabel(role)}</div>
          <div className="ucard__name" title={fullName}>{fullName || "—"}</div>
        </div>
      </div>

      <div className="card-bottom-toolbar">
        <IconLink label="Позвонить" href={telHref} color={telHref ? BRAND.green : BRAND.inactive} inactiveTitle="Телефон не указан">
          {/* phone */}
          <svg viewBox="0 0 24 24"><path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.02-.24 11.36 11.36 0 003.56.57 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h2.5a1 1 0 011 1 11.36 11.36 0 00.57 3.56 1 1 0 01-.24 1.02l-2.2 2.2z"/></svg>
        </IconLink>

        <IconLink label="E-mail" href={mailHref} color={mailHref ? BRAND.green : BRAND.inactive} inactiveTitle="E-mail не указан">
          {/* email */}
          <svg viewBox="0 0 24 24"><path d="M20 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
        </IconLink>

        <IconLink label="WhatsApp" href={waHref} color={waHref ? BRAND.wa : BRAND.inactive} targetBlank inactiveTitle="WhatsApp недоступен">
          {/* wa */}
            <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M20.5 12a8.5 8.5 0 01-12.4 7.5L4 20l.6-3.9A8.5 8.5 0 1120.5 12z"
                    fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
            <path d="M10.2 8.8c-.2.5-.2 1.1 0 1.7.4 1.1 1.5 2.2 2.6 2.6.6.2 1.2.2 1.7 0 .2-.1.5 0 .6.1l1 .9c.2.2.2.6 0 .9-.6.7-1.5 1-2.4 1a6.6 6.6 0 01-6.6-6.6c0-.9.3-1.8 1-2.4.3-.2.7-.2.9 0l.9 1c.1.1.2.4.1.6z"
                    fill="currentColor"/>
            </svg>
        </IconLink>

        <IconLink label="Telegram" href={tgHref} color={tgHref ? BRAND.tg : BRAND.inactive} targetBlank inactiveTitle="Telegram недоступен">
          {/* tg */}
          <svg viewBox="0 0 24 24"><path d="M9.04 15.37l-.38 5.35c.54 0 .77-.23 1.05-.5l2.53-2.43 5.24 3.84c.96.53 1.64.25 1.9-.89l3.44-16.12.01-.01c.31-1.43-.52-1.99-1.45-1.64L1.33 9.67c-1.39.54-1.37 1.33-.24 1.68l5.5 1.72L19.3 6.61c.64-.42 1.22-.19.74.22L9.04 15.37z"/></svg>
        </IconLink>
      </div>
    </div>
  );
}

function roleLabel(r?: UserRole | null) {
  switch (r) {
    case "site_admin": return "Администратор сайта";
    case "tournament_admin": return "Организатор";
    case "player": return "Игрок";
    default: return "Пользователь";
  }
}

type IconProps = {
  href?: string;
  label: string;
  color: string;
  inactiveTitle?: string;
  children: React.ReactNode;
  targetBlank?: boolean;
};

function IconLink({ href, label, color, inactiveTitle, children, targetBlank }: IconProps) {
  const active = Boolean(href);
  if (!active) {
    return (
      <span className="ucard__icon ucard__icon--inactive" title={inactiveTitle ?? `${label} недоступно`} role="img" aria-disabled="true">
        <span className="ucard__svgwrap" style={{ color }}>
          {children}
        </span>
      </span>
    );
  }
  return (
    <a
      href={href}
      className="ucard__icon"
      title={label}
      aria-label={label}
      target={targetBlank ? "_blank" : undefined}
      rel={targetBlank ? "noopener noreferrer" : undefined}
    >
      <span className="ucard__svgwrap" style={{ color }}>
        {children}
      </span>
    </a>
  );
}