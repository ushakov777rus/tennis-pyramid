"use client";

import React from "react";

import "./IconButtons.css"
// Компонент переносит иконки контактов из UserCard в общий модуль, чтобы переиспользовать и держать логику в одном месте

/**
 * Базовая иконочная кнопка под существующие стили .icon-btn / .danger / .lg
 * - по умолчанию класс "icon-btn"
 * - можно передать модификаторы через className, например: "danger lg"
 */
type IconButtonProps = {
  title: string;
  "aria-label"?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  className?: string; // доп. классы: danger, lg и т.д.
  children: React.ReactNode; // сюда кладём SVG
  type?: "button" | "submit" | "reset";
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export function IconButton({
  title,
  "aria-label": ariaLabel,
  onClick,
  disabled,
  className,
  children,
  type = "button",
}: IconButtonProps) {
  return (
    <button
      type={type}
      className={cx("icon-btn", className)}
      onClick={onClick}
      title={title}
      aria-label={ariaLabel ?? title}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

type IconProps = {
  href?: string;
  label: string;
  color: string;
  inactiveTitle?: string;
  children: React.ReactNode;
  targetBlank?: boolean;
};

// Базовая ссылка-иконка для контактов; экспортируем для специализированных иконок
export function IconLink({ href, label, color, inactiveTitle, children, targetBlank }: IconProps) {
  const active = Boolean(href);
  if (!active) {
    return (
      <span className="ucard__icon ucard__icon--inactive" title={inactiveTitle ?? label} role="img" aria-disabled="true">
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

type ContactIconLinkProps = {
  href?: string;
  label: string;
  inactiveTitle?: string;
  color: string;
  targetBlank?: boolean;
};

// Ссылка на телефон с иконкой трубки
export function PhoneIconLink(props: ContactIconLinkProps) {
  return (
    <IconLink {...props}>
      <svg viewBox="0 0 24 24">
        <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.02-.24 11.36 11.36 0 003.56.57 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h2.5a1 1 0 011 1 11.36 11.36 0 00.57 3.56 1 1 0 01-.24 1.02l-2.2 2.2z" />
      </svg>
    </IconLink>
  );
}

// Ссылка на email с иконкой конверта
export function EmailIconLink(props: ContactIconLinkProps) {
  return (
    <IconLink {...props}>
      <svg viewBox="0 0 24 24">
        <path d="M20 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
      </svg>
    </IconLink>
  );
}

// Ссылка на WhatsApp с фирменной иконкой
export function WhatsAppIconLink(props: ContactIconLinkProps) {
  return (
    <IconLink {...props} targetBlank={props.targetBlank}>
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M20.5 12a8.5 8.5 0 01-12.4 7.5L4 20l.6-3.9A8.5 8.5 0 1120.5 12z"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path
          d="M10.2 8.8c-.2.5-.2 1.1 0 1.7.4 1.1 1.5 2.2 2.6 2.6.6.2 1.2.2 1.7 0 .2-.1.5 0 .6.1l1 .9c.2.2.2.6 0 .9-.6.7-1.5 1-2.4 1a6.6 6.6 0 01-6.6-6.6c0-.9.3-1.8 1-2.4.3-.2.7-.2.9 0l.9 1c.1.1.2.4.1.6z"
          fill="currentColor"
        />
      </svg>
    </IconLink>
  );
}

// Ссылка на Telegram с иконкой самолётика
export function TelegramIconLink(props: ContactIconLinkProps) {
  return (
    <IconLink {...props} targetBlank={props.targetBlank}>
      <svg viewBox="0 0 24 24">
        <path d="M9.04 15.37l-.38 5.35c.54 0 .77-.23 1.05-.5l2.53-2.43 5.24 3.84c.96.53 1.64.25 1.9-.89l3.44-16.12.01-.01c.31-1.43-.52-1.99-1.45-1.64L1.33 9.67c-1.39.54-1.37 1.33-.24 1.68l5.5 1.72L19.3 6.61c.64-.42 1.22-.19.74.22L9.04 15.37z" />
      </svg>
    </IconLink>
  );
}


/* SVG-иконки 24x24, цвет #CF6 */
function IconBase({ children }: { children: React.ReactNode }) {
  return (
    <svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <g
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


/** Кнопка "Сохранить" — круг с галочкой */
export function SaveIconButton(props: Omit<IconButtonProps, "children">) {
  return (
    <IconButton {...props}>
      <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
        <path
          d="M7 12l3 3 7-7"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </IconButton>
  );
}

/** Кнопка "Отмена" — круг с крестиком (по умолчанию добавляю .danger) */
export function CancelIconButton(props: Omit<IconButtonProps, "children">) {
  const merged = cx("danger", props.className);
  return (
    <IconButton {...props} className={merged}>
      <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
        <path
          d="M15 9L9 15M9 9l6 6"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </IconButton>
  );
}

/** Кнопка "Редактировать" */
export function EditIconButton(props: Omit<IconButtonProps, "children">) {
  return (
    <IconButton {...props}>
      <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 20h9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4 12.5-12.5z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </IconButton>
  );
}

/** Кнопка "Удалить" (добавляю .danger по умолчанию) */
export function DeleteIconButton(props: Omit<IconButtonProps, "children">) {
  const merged = cx("danger", props.className);
  return (
    <IconButton {...props} className={merged}>
      <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </IconButton>
  );
}

export function ApplyIconButton(props: Omit<IconButtonProps, "children">) {
  const merged = cx("primary", props.className); // можно задать другой стиль, например "success"
  return (
    <IconButton {...props} className={merged}>
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" fill="none" />
        <path d="M12 8v8M8 12h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </IconButton>
  );
}

export function CommentIconButton(props: Omit<IconButtonProps, "children">) {
  const merged = cx("comment", props.className);
  return (
    <IconButton {...props} className={merged}>
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        aria-hidden="true"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* speech bubble icon */}
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    </IconButton>
  );
}

export function LikeIconButton(props: Omit<IconButtonProps, "children">) {
  const merged = cx("like", props.className);
  return (
    <IconButton {...props} className={merged}>
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        aria-hidden="true"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* иконка лайка (палец вверх) */}
        <path d="M14 9V5a3 3 0 0 0-6 0v4H4v12h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2h-4z" />
        <path d="M22 11h-4" />
      </svg>
    </IconButton>
  );
}

/** Кнопка "Kebab" (⋮) для мобильного меню */
export function KebabIconButton(props: Omit<IconButtonProps, "children">) {
  return (
    <IconButton {...props}>
      <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="5" r="2" fill="currentColor" />
        <circle cx="12" cy="12" r="2" fill="currentColor" />
        <circle cx="12" cy="19" r="2" fill="currentColor" />
      </svg>
    </IconButton>
  );
}

/** Кнопка "Kebab" (⋮) для мобильного меню */
export function CreateTeamIconButton(props: Omit<IconButtonProps, "children">) {
  return (
    <IconButton {...props}>
      {/* users-plus */}
      <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
        {/* Головы */}
        <circle cx="9" cy="8" r="3" fill="none" stroke="currentColor" strokeWidth="2" />
        <circle cx="16.5" cy="9" r="2.5" fill="none" stroke="currentColor" strokeWidth="2" />
        {/* Тела */}
        <path
          d="M4.5 16c0-2.2 2.6-3.5 4.5-3.5S13.5 13.8 13.5 16v1.5H4.5V16z"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M14.5 16.5c0-1.6 1.8-2.6 3-2.6s3 1 3 2.6v1.0"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        {/* Плюсик */}
        <path
          d="M19.5 5.2v3.0M18 6.7h3.0"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </IconButton>
  );
}

type CheckBoxIconButtonProps = Omit<IconButtonProps, "children"> & {
  isSelected?: boolean;
};

/** Кнопка чекбокс с галкой */
export function CheckBoxIconButton({ isSelected, ...rest }: CheckBoxIconButtonProps) {
  return (
    <IconButton {...rest}>
      <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
        <rect
          x="4"
          y="4"
          width="16"
          height="16"
          rx="3"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
        {isSelected && (
          <path
            d="M7 12l3 3 7-7"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
      </svg>
    </IconButton>
  );
}


type CheckBoxIconProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  isSelected: boolean;
};

export function CheckBoxIcon({ isSelected, ...rest }: CheckBoxIconProps) {
  return (
    <button
      type="button"
      className={`icon-btn`}
      {...rest}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
        <rect
          x="4"
          y="4"
          width="16"
          height="16"
          rx="3"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
        {isSelected && (
          <path
            d="M7 12l3 3 7-7"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
      </svg>
    </button>
  );
}

/** Кнопка с иконкой "плюс" */
export function PlusIconButton(props: Omit<IconButtonProps, "children">) {
  return (
    <IconButton {...props}>
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          d="M12 5v14M5 12h14"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </IconButton>
  );
}

export function IconMail() {
  return (
    <IconBase>
      <rect x={3} y={5} width={18} height={14} rx={2} />
      <path d="M3 7l9 6 9-6" />
    </IconBase>
  );
}

export function IconTelegram() {
  return (
    <IconBase>
      <path d="M21 3L3 10.5l6 2 2 6 2.5-3.5 5 3L21 3z" />
    </IconBase>
  );
}

export function IconVK() {
  return (
    <IconBase>
      <path d="M3 7c.2 6.5 3.5 10.3 9.5 10.5h.3v-3.8c2.1.2 3.7 1.7 4.3 3.8H21c-.8-3-3-5-5.3-5.7C18.9 10.8 20 8.9 21 7h-3.6c-.6 1.5-1.8 3.2-3.4 3v-3H11v11h2V10" />
    </IconBase>
  );
}
