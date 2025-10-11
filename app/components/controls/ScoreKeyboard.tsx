"use client";

import { Fragment, useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";

import "./ScoreKeyboard.css";

const DYNAMIC_KEY = "__dynamic__" as const;
const NUMBER_ROWS: Array<Array<string>> = [
  ["1", "2", "3"],
  ["4", "5", "6"],
  ["7", "8", "9"],
  [DYNAMIC_KEY, "0", "⌫"],
];

export type ScoreKeyboardProps = {
  inputRef: React.RefObject<HTMLElement | null>;
  participantA: string;
  participantB: string;
  value: string;
  onChange: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
  disabled?: boolean;
  autoFocus?: boolean;
};

export function useScoreKeyboardAvailable(breakpoint = 400) {
  const subscribe = useCallback((callback: () => void) => {
    if (typeof window === "undefined") return () => {};
    
    const mq = window.matchMedia(`(max-width: ${breakpoint}px)`);
    const listener = () => callback();
    
    mq.addEventListener("change", listener);
    return () => mq.removeEventListener("change", listener);
  }, [breakpoint]);

  const getSnapshot = useCallback(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia(`(max-width: ${breakpoint}px)`).matches;
  }, [breakpoint]);

  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}

export function ScoreKeyboard({
  inputRef,
  value,
  participantA,
  participantB,
  onChange,
  onSave,
  onCancel,
  disabled = false,
  autoFocus = true,
}: ScoreKeyboardProps) {
  const internalRef = useRef<HTMLInputElement | null>(null);

  const mobile = useScoreKeyboardAvailable();

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

  const dynamicKey = useMemo(() => {
    const trimmed = value.replace(/\s+$/, "");

    if (!trimmed) {
      return { kind: "hidden" } as const;
    }
    if (trimmed.endsWith(",")) {
      return { kind: "hidden" } as const;
    }

    const numberMatch = trimmed.match(/\d+$/);
    if (!numberMatch) {
      return { kind: "hidden" } as const;
    }

    const rest = trimmed.slice(0, trimmed.length - numberMatch[0].length);
    const precedingMatch = rest.match(/([,-])\s*$/);
    if (!precedingMatch) {
      return { kind: "visible", label: "-", insert: "-" } as const;
    }

    const preceding = precedingMatch[1];

    if (preceding === "-") {
      return { kind: "visible", label: ",", insert: "," } as const;
    }

    if (preceding === ",") {
      return { kind: "visible", label: "-", insert: "-" } as const;
    }

    return { kind: "hidden" } as const;
  }, [value]);
  const numberRows = useMemo(() => NUMBER_ROWS, []);

  return (
    <div
      className="score-kb"
      role="dialog"
      aria-label="Редактор счёта"
      style={undefined}
    >
      <div className="score-kb__participants">
        <div className="score-kb__key">{participantA}</div>
        <div className="score-kb__vs">VS</div>
        <div className="score-kb__key">{participantB}</div>
      </div>

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
          {"\u2713"}
        </button>
      </div>

      {/* Условный рендеринг панели с цифрами */}
      {mobile && (
        <div className="score-kb__numbers">
          {numberRows.map((row, idx) => (
            <Fragment key={idx}>
              {row.map((key, i) => {
                if (key === DYNAMIC_KEY) {
                  return (
                    <button
                      key={`${idx}-${i}-${key}`}
                      type="button"
                      className="score-kb__key score-kb__key--dynamic"
                      onClick={() => {
                        if (dynamicKey.kind === "visible") {
                          handleInsert(dynamicKey.insert);
                        }
                      }}
                      disabled={disabled || dynamicKey.kind !== "visible"}
                      style={
                        dynamicKey.kind === "visible"
                          ? undefined
                          : {
                              visibility: "hidden",
                            }
                      }
                      aria-hidden={dynamicKey.kind === "visible" ? undefined : true}
                      tabIndex={dynamicKey.kind === "visible" ? undefined : -1}
                    >
                      {dynamicKey.kind === "visible" ? dynamicKey.label : ""}
                    </button>
                  );
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
      )}
    </div>
  );
}