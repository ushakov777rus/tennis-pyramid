"use client";

import { useRef, useState } from "react";

import { ScoreKeyboard, useScoreKeyboardAvailable } from "./ScoreKeyboard";

/**
 * Временный preview-компонент: постоянно показывает клавиатуру ввода счёта
 * на мобильных устройствах, чтобы проверить визуал.
 */
export function MobileScoreKeyboardPreview() {
  const isMobile = useScoreKeyboardAvailable();
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState("");

  if (!isMobile) return null;

  return (
    <ScoreKeyboard
      inputRef={inputRef}
      value={value}
      onChange={setValue}
      onSave={() => setValue("")}
      onCancel={() => setValue("")}
    />
  );
}
