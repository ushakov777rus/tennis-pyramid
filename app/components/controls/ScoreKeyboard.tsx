"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import "./ScoreKeyboard.css";

const EXTRA_KEYS = [",", "-"] as const;

export type ScoreKeyboardProps = {
  inputRef: React.RefObject<HTMLInputElement | null>;
  value: string;
  onChange: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
  disabled?: boolean;
};

function useIsMobileViewport(breakpoint = 900) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mq = window.matchMedia(`(max-width: ${breakpoint}px)`);
    const listener = (event: MediaQueryListEvent | MediaQueryList) => {
      setIsMobile("matches" in event ? event.matches : mq.matches);
    };

    listener(mq);
    mq.addEventListener?.("change", listener);
    mq.addListener?.(listener as any);

    return () => {
      mq.removeEventListener?.("change", listener);
      mq.removeListener?.(listener as any);
    };
  }, [breakpoint]);

  return isMobile;
}

export function useScoreKeyboardAvailable(breakpoint = 900) {
  return useIsMobileViewport(breakpoint);
}

export function ScoreKeyboard({ inputRef, value, onChange, onSave, onCancel, disabled = false }: ScoreKeyboardProps) {
  const internalRef = useRef<HTMLInputElement | null>(null);
  const baseGapRef = useRef<number | null>(null);
  const [viewportOffset, setViewportOffset] = useState(0);

  useEffect(() => {
    if (inputRef) {
      inputRef.current = internalRef.current;
    }
  }, [inputRef, value]);

  useEffect(() => {
    const node = internalRef.current;
    if (!node) return;
    node.focus();
    const pos = node.value.length;
    node.setSelectionRange(pos, pos);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const viewport = window.visualViewport;
    if (!viewport) return;

    const update = () => {
      const gap = Math.max(0, window.innerHeight - (viewport.height + viewport.offsetTop));
      if (baseGapRef.current == null || gap < baseGapRef.current) {
        baseGapRef.current = gap;
      }
      const offset = gap - (baseGapRef.current ?? 0);
      setViewportOffset(offset > 0 ? offset : 0);
    };

    update();
    viewport.addEventListener("resize", update);
    viewport.addEventListener("scroll", update);
    return () => {
      viewport.removeEventListener("resize", update);
      viewport.removeEventListener("scroll", update);
    };
  }, []);

  const handleInsert = useCallback(
    (symbol: string) => {
      const node = internalRef.current;
      const start = node?.selectionStart ?? value.length;
      const end = node?.selectionEnd ?? value.length;
      const next = value.slice(0, start) + symbol + value.slice(end);
      onChange(next);
      requestAnimationFrame(() => {
        const focusNode = internalRef.current;
        if (!focusNode) return;
        const pos = start + symbol.length;
        focusNode.focus();
        focusNode.setSelectionRange(pos, pos);
      });
    },
    [onChange, value]
  );

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onChange(event.target.value);
    },
    [onChange]
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter") {
        event.preventDefault();
        if (!disabled) onSave();
      }
      if (event.key === "Escape") {
        event.preventDefault();
        onCancel();
      }
    },
    [disabled, onCancel, onSave]
  );

  const keys = useMemo(() => EXTRA_KEYS, []);

  return (
    <div
      className="score-kb"
      role="dialog"
      aria-label="Редактор счёта"
      style={viewportOffset ? { transform: `translateY(-${viewportOffset}px)` } : undefined}
    >
      <div className="score-kb__formula">
        <span className="score-kb__fx" aria-hidden>
          fx
        </span>
        <input
          ref={internalRef}
          className="score-kb__input"
          value={value}
          onChange={handleChange}
          inputMode="numeric"
          pattern="[0-9\\s,:-]*"
          placeholder="6-4, 4-6, 10-8"
          onKeyDown={handleKeyDown}
        />
        <button
          type="button"
          className="score-kb__action score-kb__action--cancel"
          onClick={onCancel}
          disabled={disabled}
          aria-label="Отмена"
        >
          ✕
        </button>
        <button
          type="button"
          className="score-kb__action score-kb__action--ok"
          onClick={onSave}
          disabled={disabled}
          aria-label="Сохранить"
        >
          ✔
        </button>
      </div>

      <div className="score-kb__keys">
        {keys.map((key) => (
          <button
            key={key}
            type="button"
            className="score-kb__key"
            onClick={() => handleInsert(key)}
            disabled={disabled}
          >
            {key}
          </button>
        ))}
      </div>
    </div>
  );
}
