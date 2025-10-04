"use client";

import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from "react";

import "./ScoreKeyboard.css";

const EXTRA_KEYS = ["-", ","] as const;
const NUMBER_ROWS: Array<Array<string | null>> = [
  ["1", "2", "3"],
  ["4", "5", "6"],
  ["7", "8", "9"],
  [null, "0", "⌫"],
];

export type ScoreKeyboardProps = {
  inputRef: React.RefObject<HTMLElement | null>;
  value: string;
  onChange: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
  disabled?: boolean;
  autoFocus?: boolean;
};

function useIsMobileViewport(breakpoint = 768) {
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

export function ScoreKeyboard({
  inputRef,
  value,
  onChange,
  onSave,
  onCancel,
  disabled = false,
  autoFocus = true,
}: ScoreKeyboardProps) {
  const internalRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!inputRef) return;
    if (autoFocus) {
      inputRef.current = internalRef.current;
    }
  }, [inputRef, autoFocus]);

  useEffect(() => {
    if (!autoFocus) return;
    const node = internalRef.current;
    if (!node) return;
    node.focus();
    const pos = node.value.length;
    node.setSelectionRange(pos, pos);
  }, [autoFocus]);


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

  const handleBackspace = useCallback(() => {
    const node = internalRef.current;
    const start = node?.selectionStart ?? value.length;
    const end = node?.selectionEnd ?? value.length;
    if (start === 0 && end === 0) return;
    let nextValue: string;
    let nextCursor: number;
    if (start === end) {
      nextValue = value.slice(0, start - 1) + value.slice(end);
      nextCursor = Math.max(0, start - 1);
    } else {
      nextValue = value.slice(0, start) + value.slice(end);
      nextCursor = start;
    }
    onChange(nextValue);
    requestAnimationFrame(() => {
      const focusNode = internalRef.current;
      if (!focusNode) return;
      focusNode.focus();
      focusNode.setSelectionRange(nextCursor, nextCursor);
    });
  }, [onChange, value]);

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

  const topKeys = useMemo(() => EXTRA_KEYS, []);
  const numberRows = useMemo(() => NUMBER_ROWS, []);

  return (
    <div
      className="score-kb"
      role="dialog"
      aria-label="Редактор счёта"
      style={undefined}
    >
      <div className="score-kb__formula">
        <span className="score-kb__fx" aria-hidden>
          Счет
        </span>
        <input
          ref={internalRef}
          className="score-kb__input"
          value={value}
          onChange={handleChange}
          inputMode={autoFocus ? "numeric" : undefined}
          pattern="[0-9\\s,:-]*"
          placeholder="6-4, 4-6, 10-8"
          readOnly={!autoFocus}
          onFocus={autoFocus ? undefined : (e) => e.currentTarget.blur()}
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

      <div className="score-kb__extras">
        {topKeys.map((key) => (
          <button
            key={key}
            type="button"
            className="score-kb__extra"
            onClick={() => handleInsert(key)}
            disabled={disabled}
          >
            {key}
          </button>
        ))}
      </div>

      <div className="score-kb__numbers">
        {numberRows.map((row, idx) => (
          <Fragment key={idx}>
            {row.map((key, i) => {
              if (!key) {
                return <span key={`sp-${idx}-${i}`} className="score-kb__spacer" />;
              }
              const isBackspace = key === "⌫";
              return (
                <button
                  key={`${idx}-${i}-${key}`}
                  type="button"
                  className={`score-kb__key ${isBackspace ? "score-kb__key--backspace" : ""}`.trim()}
                  onClick={() => (isBackspace ? handleBackspace() : handleInsert(key))}
                  disabled={disabled}
                  aria-label={isBackspace ? "Удалить" : undefined}
                >
                  {key}
                </button>
              );
            })}
          </Fragment>
        ))}
      </div>
    </div>
  );
}
