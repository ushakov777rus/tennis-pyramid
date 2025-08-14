"use client";

import React from "react";

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

/** Кнопка "Отмена" — круг с крестиком */
export function CancelIconButton(props: Omit<IconButtonProps, "children">) {
  // чаще всего её рисуют красной, поэтому добавим модификатор danger по умолчанию
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