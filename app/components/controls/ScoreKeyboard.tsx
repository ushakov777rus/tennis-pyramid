"use client";

import { Fragment, useCallback, useEffect, useMemo, useRef, useSyncExternalStore } from "react";

import "./ScoreKeyboard.css";
import { useDictionary } from "@/app/components/LanguageProvider";

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
  dateValue: string;
  commentValue: string; // комментарий к матчу, сохраняемый вместе со счётом
  onChange: (value: string) => void;
  onDateChange: (value: string) => void;
  onCommentChange: (value: string) => void;
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
  dateValue,
  onDateChange,
  commentValue,
  onCommentChange,
  onSave,
  onCancel,
  disabled = false,
  autoFocus = true,
}: ScoreKeyboardProps) {
  const internalRef = useRef<HTMLInputElement | null>(null);
  const mobile = useScoreKeyboardAvailable();
  const { scoreKeyboard: scoreKeyboardText } = useDictionary();

  useEffect(() => {
    if (!inputRef) return;
    if (autoFocus) {
      inputRef.current = internalRef.current;
    }
  }, [inputRef, autoFocus]);

  useEffect(() => {
  const node = internalRef.current;
  if (!node) return;

  // Устанавливаем фокус при монтировании клавиатуры
  node.focus();

  const handleFocusIn = (e: FocusEvent) => {
    // Если фокус ушёл за пределы клавиатуры — вернуть обратно
    if (!e.target || !(e.target instanceof Node)) return;
    if (!node.parentElement?.contains(e.target)) {
      e.stopPropagation();
      node.focus();
    }
  };

  // Подписка на все попытки смены фокуса
  document.addEventListener("focusin", handleFocusIn);
  return () => document.removeEventListener("focusin", handleFocusIn);
}, []);

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
      console.log("handleInsert:");
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
      // На десктопе фильтруем ввод, чтобы разрешить только нужные символы
      if (!mobile) {
        const filteredValue = event.target.value.replace(/[^\d,\s-]/g, '');
        onChange(filteredValue);
      } else {
        onChange(event.target.value);
      }
    },
    [onChange, mobile]
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      console.log("Key pressed:", event.key);
      
      if (event.key === "Enter") {
        event.preventDefault();
        if (!disabled) onSave();
        return;
      }
      
      if (event.key === "Escape") {
        event.preventDefault();
        onCancel();
        return;
      }

      // На десктопе перехватываем ввод и обрабатываем сами
      if (!mobile) {
        if (/[\d,-]/.test(event.key)) {
          event.preventDefault();
          handleInsert(event.key);
        } else if (event.key === "Backspace") {
          event.preventDefault();
          handleBackspace();
        } else if (event.key.length === 1 && !event.ctrlKey && !event.altKey && !event.metaKey) {
          // Блокируем любые другие символы
          event.preventDefault();
        }
      }
    },
    [disabled, onCancel, onSave, mobile, handleInsert, handleBackspace]
  );

  const handlePaste = useCallback(
    (event: React.ClipboardEvent<HTMLInputElement>) => {
      // На десктопе фильтруем вставку
      if (!mobile) {
        event.preventDefault();
        const pastedText = event.clipboardData.getData('text');
        const filteredText = pastedText.replace(/[^\d,\s-]/g, '');
        if (filteredText) {
          handleInsert(filteredText);
        }
      }
    },
    [mobile, handleInsert]
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
      aria-label={scoreKeyboardText.ariaLabel}
      style={undefined}
    >
      <div className="score-kb__participants">
        <div className="score-kb__key">{participantA}</div>
        <div className="score-kb__vs">VS</div>
        <div className="score-kb__key">{participantB}</div>
      </div>

      <div className="score-kb__date">
        <input
          type="date"
          className="score-kb__input"
          value={dateValue}
          onChange={(event) => onDateChange(event.target.value)}
          disabled={disabled}
        />
      </div>
      <div className="score-kb__comment">
        <textarea
          className="score-kb__input score-kb__input--comment"
          placeholder={scoreKeyboardText.commentPlaceholder}
          value={commentValue}
          onChange={(event) => onCommentChange(event.target.value)}
          disabled={disabled}
          rows={3}
        />
      </div>

      <div className="score-kb__formula">
        <span className="score-kb__fx" aria-hidden>
          {scoreKeyboardText.formulaLabel}
        </span>
        <input
          ref={internalRef}
          className="score-kb__input"
          value={value}
          onChange={handleChange}
          onPaste={handlePaste}
          inputMode={mobile ? "numeric" : undefined}
          pattern="[0-9\\s,:-]*"
          placeholder={scoreKeyboardText.scorePlaceholder}
          readOnly={false}
          onFocus={!autoFocus && mobile ? (e) => e.currentTarget.blur() : undefined}
          onKeyDown={handleKeyDown}
        />
        <button
          type="button"
          className="score-kb__action score-kb__action--cancel"
          onClick={onCancel}
          disabled={disabled}
          aria-label={scoreKeyboardText.cancel}
        >
          ✕
        </button>
        <button
          type="button"
          className="score-kb__action score-kb__action--ok"
          onClick={onSave}
          disabled={disabled}
          aria-label={scoreKeyboardText.save}
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
                    aria-label={isBackspace ? scoreKeyboardText.backspace : undefined}
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
