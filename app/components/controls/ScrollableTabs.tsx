// app/components/ScrollableTabs.tsx
"use client";

import { useEffect, useMemo, useRef } from "react";
import "./ScrollableTabs.css";

export type TabItem = {
  key: string;
  label: string;
  badge?: number | string; // например, количество матчей
};

type Props = {
  items: TabItem[];
  value: string;                  // активный ключ
  onChange: (key: string) => void;
  ariaLabel?: string;
};

export function ScrollableTabs({ items, value, onChange, ariaLabel }: Props) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const activeIndex = useMemo(
    () => Math.max(0, items.findIndex((t) => t.key === value)),
    [items, value]
  );

  // автопрокрутка активного таба в видимую область
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const active = scroller.querySelector<HTMLElement>(
      `[data-key="${items[activeIndex]?.key}"]`
    );
    if (active) {
      const offsetLeft = active.offsetLeft;
      const offsetRight = offsetLeft + active.offsetWidth;
      const viewLeft = scroller.scrollLeft;
      const viewRight = viewLeft + scroller.clientWidth;

      if (offsetLeft < viewLeft) {
        scroller.scrollTo({ left: offsetLeft - 16, behavior: "smooth" });
      } else if (offsetRight > viewRight) {
        scroller.scrollTo({ left: offsetRight - scroller.clientWidth + 16, behavior: "smooth" });
      }
    }
  }, [activeIndex, items]);

  return (
    <nav
      className="tabs-wrap"
      aria-label={ariaLabel ?? "Переключение разделов"}
    >
      <div
        ref={scrollerRef}
        className="tabs-scroll"
        role="tablist"
        aria-orientation="horizontal"
      >
        {items.map((t) => {
          const active = t.key === value;
          return (
            <button
              key={t.key}
              data-key={t.key}
              role="tab"
              aria-selected={active}
              className={`tab-btn ${active ? "is-active" : ""}`}
              onClick={() => onChange(t.key)}
              type="button"
            >
              <span className="tab-label">{t.label}</span>
              {t.badge != null && t.badge !== "" && (
                <span className="tab-badge">{t.badge}</span>
              )}
              {active && <span className="tab-underline" aria-hidden />}
            </button>
          );
        })}
      </div>
    </nav>
  );
}