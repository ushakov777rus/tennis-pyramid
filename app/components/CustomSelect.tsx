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
  showSearch?: boolean;       // 👈 NEW: показывать поле поиска (по умолчанию true)
};

export function CustomSelect({
  options,
  value = null,
  onChange,
  placeholder = "Выберите...",
  disabled = false,
  className = "",
  maxDropdownHeight = 240,
  showSearch = true,          // 👈 default = true
}: CustomSelectProps) {

  const comboboxRef = useRef<HTMLDivElement | null>(null);
  const listboxRef = useRef<HTMLDivElement | null>(null);

  // 0) Сортируем входящие options по алфавиту один раз (мемо)
  const sortedOptions = useMemo(() => {
    const copy = [...options];
    copy.sort((a, b) => a.label.localeCompare(b.label, undefined, { sensitivity: "base" }));
    return copy;
  }, [options]);

// 1) Фильтрация
  const [query, setQuery] = useState("");
  const normalizedQuery = query.trim().toLowerCase();
  const filteredOptions = useMemo(() => {
    if (!showSearch || !normalizedQuery) return sortedOptions; // 👈 если поиск скрыт — не фильтруем
    return sortedOptions.filter((o) => o.label.toLowerCase().includes(normalizedQuery));
  }, [sortedOptions, normalizedQuery, showSearch]);

  const [open, setOpen] = useState(false);

  // Индексы теперь считаем относительно ОТОБРАЖАЕМОГО (filteredOptions) списка
  const selectedIndex = useMemo(
    () => filteredOptions.findIndex((o) => String(o.value) === String(value)),
    [filteredOptions, value]
  );

  const [activeIndex, setActiveIndex] = useState<number>(() => {
    const idx = filteredOptions.findIndex(
      (o) => String(o.value) === String(value) && !o.disabled
    );
    return idx >= 0 ? idx : filteredOptions.findIndex((o) => !o.disabled);
  });

  // При открытии — авто-сброс запроса (только если поиск включён)
  useEffect(() => {
    if (open && showSearch) setQuery("");
  }, [open, showSearch]);

  // При смене value/фильтра — аккуратно сдвигаем активный
  useEffect(() => {
    if (selectedIndex >= 0 && !filteredOptions[selectedIndex]?.disabled) {
      setActiveIndex(selectedIndex);
    } else {
      const firstEnabled = filteredOptions.findIndex((o) => !o.disabled);
      if (firstEnabled >= 0) setActiveIndex(firstEnabled);
      else setActiveIndex(-1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedIndex, normalizedQuery, filteredOptions.length]);

  const baseId = useId();
  const listboxId = `${baseId}-listbox`;

  // Тайп-а-хэд (оставим — он работает поверх общего списка, но
  // на практике при открытом поиске пользователи печатают в input)
  const typeBufferRef = useRef("");
  const typeTimeoutRef = useRef<number | null>(null);

  const setOpenSafe = (next: boolean) => {
    if (!disabled) setOpen(next);
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

  const commitSelection = (idx: number) => {
    const opt = filteredOptions[idx];
    if (!opt || opt.disabled) return;
    onChange?.(opt.value);
    setOpenSafe(false);
  };

  const moveActive = (dir: 1 | -1) => {
    if (!filteredOptions.length) return;
    let i = activeIndex ?? -1;
    for (let step = 0; step < filteredOptions.length; step++) {
      i = (i + dir + filteredOptions.length) % filteredOptions.length;
      if (!filteredOptions[i].disabled) {
        setActiveIndex(i);
        ensureActiveVisible(i);
        break;
      }
    }
  };

  const goEdge = (edge: "start" | "end") => {
    if (!filteredOptions.length) return;
    if (edge === "start") {
      const i = filteredOptions.findIndex((o) => !o.disabled);
      if (i >= 0) {
        setActiveIndex(i);
        ensureActiveVisible(i);
      }
    } else {
      for (let i = filteredOptions.length - 1; i >= 0; i--) {
        if (!filteredOptions[i].disabled) {
          setActiveIndex(i);
          ensureActiveVisible(i);
          break;
        }
      }
    }
  };

  // Клик/тап вне
  useEffect(() => {
    const onDocPointerDown = (e: PointerEvent) => {
      const t = e.target as Node;
      if (comboboxRef.current?.contains(t)) return;
      if (listboxRef.current?.contains(t)) return;
      setOpen(false);
    };
    document.addEventListener("pointerdown", onDocPointerDown);
    return () => document.removeEventListener("pointerdown", onDocPointerDown);
  }, []);

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;

    // Если открыт дропдаун, но фокус в поле поиска — не перехватываем стрелки
    const activeEl = document.activeElement as HTMLElement | null;
    if (open && activeEl && activeEl.dataset?.role === "cs-search") {
      return;
    }

    switch (e.key) {
      case " ":
      case "Enter": {
        e.preventDefault();
        if (!open) {
          setOpenSafe(true);
          return;
        }
        if (activeIndex != null && activeIndex >= 0) commitSelection(activeIndex);
        return;
      }
      case "ArrowDown":
        e.preventDefault();
        if (!open) setOpenSafe(true);
        else moveActive(1);
        return;
      case "ArrowUp":
        e.preventDefault();
        if (!open) setOpenSafe(true);
        else moveActive(-1);
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

    // Тайп-а-хэд по отфильтрованному списку
    const char = e.key.length === 1 ? e.key : "";
    if (!char.trim()) return;

    if (typeTimeoutRef.current) {
      window.clearTimeout(typeTimeoutRef.current);
    }
    typeBufferRef.current += char.toLowerCase();

    const search = typeBufferRef.current;
    const start = Math.max(activeIndex ?? -1, -1);
    for (let i = 1; i <= filteredOptions.length; i++) {
      const idx = (start + i) % filteredOptions.length;
      const o = filteredOptions[idx];
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

  const labelToShow = useMemo(() => {
    const i = sortedOptions.findIndex((o) => String(o.value) === String(value));
    return i >= 0 ? sortedOptions[i].label : placeholder;
  }, [sortedOptions, value, placeholder]);

  // При открытии — автофокус в поиск и сброс предыдущего запроса
  useEffect(() => {
    if (open) setQuery("");
  }, [open]);

  return (
    <>
      <div
        ref={comboboxRef}
        role="combobox"
        aria-controls={listboxId}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-activedescendant={
          open && activeIndex != null && activeIndex >= 0 ? `${baseId}-opt-${activeIndex}` : undefined
        }
        tabIndex={disabled ? -1 : 0}
        className={`cs-select cs-trigger ${disabled ? "is-disabled" : ""} ${open ? "is-open" : ""} ${className}`}
        onClick={() => setOpenSafe(!open)}
        onKeyDown={onKeyDown}
      >
        <span className={`cs-value ${labelToShow === placeholder ? "is-placeholder" : ""}`}>
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
      {/* Поле поиска — только если showSearch */}
      {showSearch && (
        <div className="cs-search-wrap">
          <input
            data-role="cs-search"
            className="input cs-search"
            type="text"
            autoFocus
            placeholder="Поиск..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                if (activeIndex != null && activeIndex >= 0) commitSelection(activeIndex);
              } else if (e.key === "Escape") {
                e.preventDefault();
                setOpenSafe(false);
              }
            }}
          />
        </div>
      )}



          {/* Список опций */}
          {filteredOptions.length === 0 ? (
            <div className="cs-empty">Ничего не найдено</div>
          ) : (
            filteredOptions.map((o, i) => {
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
                    e.preventDefault();
                    e.stopPropagation();
                    if (!o.disabled) commitSelection(i);
                  }}
                >
                  <span className="cs-option-label">{o.label}</span>
                  {isSelected && <span className="cs-check" aria-hidden>✓</span>}
                </div>
              );
            })
          )}
        </div>
      )}
    </>
  );
}