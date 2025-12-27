"use client";

import React, { useMemo } from "react";
import "./UserCard.css"
import { UserRole } from "../models/Users";
import { useDictionary } from "./LanguageProvider";
import { EmailIconLink, PhoneIconLink, TelegramIconLink, WhatsAppIconLink } from "./controls/IconButtons"; // контакты вынесены в общий модуль

type Props = {
  fullName: string;
  role: UserRole | null;
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
  role,
  phone,
  email,
  whatsapp,
  telegram,
  className = "",
}: Props) {
  const waSource = whatsapp || phone || null;
  const { userCard, users } = useDictionary();
  const unavailable = useMemo(
    () => (label: string) => userCard.unavailable.replace("{label}", label),
    [userCard.unavailable]
  );

  const telHref = phone ? `tel:+7${phone}` : undefined;
  const mailHref = email ? `mailto:${email.trim()}` : undefined;
  const waHref = waSource ? `https://wa.me/${waSource.replace(/\D/g, "").replace(/^8(\d{10})$/, "7$1")}` : undefined;
  const tgHref = telegram
    ? (telegram.startsWith("http") ? telegram : `https://t.me/${telegram.replace(/^@/, "")}`)
    : undefined;
  const roleName = useMemo(() => {
    switch (role) {
      case UserRole.SiteAdmin:
        return users.roles.siteAdmin;
      case UserRole.TournamentAdmin:
        return users.roles.tournamentAdmin;
      case UserRole.Player:
        return users.roles.player;
      default:
        return users.roles.guest;
    }
  }, [role, users.roles]);

  return (
    <div className={`card ${className}`.trim()}>
      <div className="card-row user-card-row">
        <div className="avatar">{(fullName?.[0] ?? "U").toUpperCase()}</div>
        <div className="ucard__text">
          <div className="ucard__role">{roleName}</div>
          <div className="ucard__name" title={fullName}>{fullName || "—"}</div>
        </div>
      </div>

      <div className="card-bottom-toolbar">
        <PhoneIconLink
          label={userCard.call}
          href={telHref}
          color={telHref ? BRAND.green : BRAND.inactive}
          inactiveTitle={userCard.phoneMissing || unavailable(userCard.call)}
        />

        <EmailIconLink
          label={userCard.email}
          href={mailHref}
          color={mailHref ? BRAND.green : BRAND.inactive}
          inactiveTitle={userCard.emailMissing || unavailable(userCard.email)}
        />

        <WhatsAppIconLink
          label={userCard.whatsapp}
          href={waHref}
          color={waHref ? BRAND.wa : BRAND.inactive}
          targetBlank
          inactiveTitle={userCard.whatsappMissing || unavailable(userCard.whatsapp)}
        />

        <TelegramIconLink
          label={userCard.telegram}
          href={tgHref}
          color={tgHref ? BRAND.tg : BRAND.inactive}
          targetBlank
          inactiveTitle={userCard.telegramMissing || unavailable(userCard.telegram)}
        />
      </div>
    </div>
  );
}
