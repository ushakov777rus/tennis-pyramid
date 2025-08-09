"use client";
import React, { useEffect, useId, useMemo, useRef, useState } from "react";

type Option = {
  value: string | number;
  label: string;
  disabled?: boolean;
};

type CustomSelectProps = {
  options: Option[];
  value?: string | number | null;
  onChange?: (value: string | number) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  maxDropdownHeight?: number; // px
};

export function CustomSelect({
  options,
  value = null,
  onChange,
  placeholder = "Выберите...",
  disabled = false,
  className = "",
  maxDropdownHeight = 240,
}: CustomSelectProps) {
  const comboboxRef = useRef<HTMLDivElement | null>(null);
  const listboxRef = useRef<HTMLDivElement | null>(null);

  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number>(() => {
    const idx = options.findIndex(
      (o) => String(o.value) === String(value) && !o.disabled
    );
    return idx >= 0 ? idx : options.findIndex((o) => !o.disabled);
  });

  const selectedIndex = useMemo(
    () => options.findIndex((o) => String(o.value) === String(value)),
    [options, value]
  );

  // Следим за сменой value извне — подвинем activeIndex на выбранный
  useEffect(() => {
    if (selectedIndex >= 0 && !options[selectedIndex]?.disabled) {
      setActiveIndex(selectedIndex);
    }
  }, [selectedIndex, options]);

  const baseId = useId();
  const listboxId = `${baseId}-listbox`;

  // Тайп-а-хэд
  const typeBufferRef = useRef("");
  const typeTimeoutRef = useRef<number | null>(null);

  const setOpenSafe = (next: boolean) => {
    if (!disabled) setOpen(next);
  };

  const commitSelection = (idx: number) => {
    const opt = options[idx];
    if (!opt || opt.disabled) return;
    onChange?.(opt.value);
    setOpenSafe(false);
  };

  const moveActive = (dir: 1 | -1) => {
    if (!options.length) return;
    let i = activeIndex ?? -1;
    for (let step = 0; step < options.length; step++) {
      i = (i + dir + options.length) % options.length;
      if (!options[i].disabled) {
        setActiveIndex(i);
        ensureActiveVisible(i);
        break;
      }
    }
  };

  const goEdge = (edge: "start" | "end") => {
    if (!options.length) return;
    const range = edge === "start" ? [0, options.length] : [options.length - 1, -1];
    for (
      let i = range[0];
      edge === "start" ? i < range[1] : i > range[1];
      edge === "start" ? i++ : i--
    ) {
      if (!options[i].disabled) {
        setActiveIndex(i);
        ensureActiveVisible(i);
        break;
      }
    }
  };

  const ensureActiveVisible = (idx: number) => {
    const lb = listboxRef.current;
    if (!lb) return;
    const el = lb.querySelector<HTMLDivElement>(`[data-index="${idx}"]`);
    if (!el) return;
    const lbRect = lb.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    if (elRect.top < lbRect.top) {
      lb.scrollTop -= lbRect.top - elRect.top;
    } else if (elRect.bottom > lbRect.bottom) {
      lb.scrollTop += elRect.bottom - lbRect.bottom;
    }
  };

  // Клик/тап вне: учитываем и триггер, и сам список
  useEffect(() => {
    const onDocPointerDown = (e: PointerEvent) => {
      const t = e.target as Node;
      if (comboboxRef.current?.contains(t)) return;
      if (listboxRef.current?.contains(t)) return;
      setOpen(false);
    };
    // pointerdown — стабильнее на мобильных
    document.addEventListener("pointerdown", onDocPointerDown);
    return () => document.removeEventListener("pointerdown", onDocPointerDown);
  }, []);

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;
    switch (e.key) {
      case " ":
      case "Enter": {
        e.preventDefault();
        if (!open) {
          setOpenSafe(true);
          const idx =
            selectedIndex >= 0 && !options[selectedIndex]?.disabled
              ? selectedIndex
              : options.findIndex((o) => !o.disabled);
          if (idx >= 0) setActiveIndex(idx);
          return;
        }
        if (activeIndex != null) commitSelection(activeIndex);
        return;
      }
      case "ArrowDown":
        e.preventDefault();
        if (!open) {
          setOpenSafe(true);
          const firstIdx = options.findIndex((o) => !o.disabled);
          if (firstIdx >= 0) setActiveIndex(firstIdx);
        } else {
          moveActive(1);
        }
        return;
      case "ArrowUp":
        e.preventDefault();
        if (!open) {
          setOpenSafe(true);
          const lastIdx = [...options].reverse().findIndex((o) => !o.disabled);
          const realIdx = lastIdx >= 0 ? options.length - 1 - lastIdx : -1;
          if (realIdx >= 0) setActiveIndex(realIdx);
        } else {
          moveActive(-1);
        }
        return;
      case "Home":
        e.preventDefault();
        if (open) goEdge("start");
        return;
      case "End":
        e.preventDefault();
        if (open) goEdge("end");
        return;
      case "Escape":
        if (open) {
          e.preventDefault();
          setOpenSafe(false);
        }
        return;
      default:
        break;
    }

    // Тайп-а-хэд
    const char = e.key.length === 1 ? e.key : "";
    if (!char.trim()) return;

    if (typeTimeoutRef.current) {
      window.clearTimeout(typeTimeoutRef.current);
    }
    typeBufferRef.current += char.toLowerCase();

    const search = typeBufferRef.current;
    const start = Math.max(activeIndex ?? -1, -1);
    for (let i = 1; i <= options.length; i++) {
      const idx = (start + i) % options.length;
      const o = options[idx];
      if (!o.disabled && o.label.toLowerCase().startsWith(search)) {
        setActiveIndex(idx);
        if (open) ensureActiveVisible(idx);
        break;
      }
    }

    typeTimeoutRef.current = window.setTimeout(() => {
      typeBufferRef.current = "";
      typeTimeoutRef.current = null;
    }, 700);
  };

  const labelToShow =
    selectedIndex >= 0 ? options[selectedIndex]?.label : placeholder;

  return (
    <>
      <div
        ref={comboboxRef}
        role="combobox"
        aria-controls={listboxId}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-activedescendant={
          open && activeIndex != null ? `${baseId}-opt-${activeIndex}` : undefined
        }
        tabIndex={disabled ? -1 : 0}
        className={`cs-select cs-trigger ${disabled ? "is-disabled" : ""} ${open ? "is-open" : ""} ${className}`}
        onClick={() => setOpenSafe(!open)}
        onKeyDown={onKeyDown}
      >
        <span className={`cs-value ${selectedIndex < 0 ? "is-placeholder" : ""}`}>
          {labelToShow}
        </span>
        <span className="cs-caret" aria-hidden>▾</span>
      </div>

      {open && (
        <div
          ref={listboxRef}
          id={listboxId}
          role="listbox"
          className="card cs-dropdown"
          style={{ maxHeight: `${maxDropdownHeight}px` }}
          onMouseDown={(e) => e.stopPropagation()}
        >
          {options.map((o, i) => {
            const isSelected = i === selectedIndex;
            const isActive = i === activeIndex;
            const cls = [
              "cs-option",
              isSelected ? "is-selected" : "",
              isActive ? "is-active" : "",
              o.disabled ? "is-disabled" : "",
            ]
              .filter(Boolean)
              .join(" ");

            return (
              <div
                key={o.value}
                id={`${baseId}-opt-${i}`}
                data-index={i}
                role="option"
                aria-selected={isSelected}
                aria-disabled={o.disabled || undefined}
                className={cls}
                onMouseEnter={() => !o.disabled && setActiveIndex(i)}
                onMouseDown={(e) => {
                  // Выбираем на mousedown: быстрее и надёжнее на мобильных
                  e.preventDefault();   // не теряем фокус
                  e.stopPropagation();  // не триггерим outside-click
                  if (!o.disabled) commitSelection(i);
                }}
              >
                <span className="cs-option-label">{o.label}</span>
                {isSelected && <span className="cs-check" aria-hidden>✓</span>}
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}