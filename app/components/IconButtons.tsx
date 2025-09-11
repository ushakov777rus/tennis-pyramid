"use client";

import React from "react";

import "./IconButtons.css"

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
