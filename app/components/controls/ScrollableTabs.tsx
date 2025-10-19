// app/components/ScrollableTabs.tsx
"use client";

import { useEffect, useMemo, useRef } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import "./ScrollableTabs.css";
import { useDictionary } from "@/app/components/LanguageProvider";

export type TabItem = {
  key: string;
  label: string;
  badge?: number | string;
};

type Props = {
  items: TabItem[];
  value: string;
  onChange?: (key: string) => void; // сделаем опциональным
  ariaLabel?: string;
  paramName?: string; // имя параметра в URL (по умолчанию 'tab')
};

export function ScrollableTabs({ 
  items, 
  value, 
  onChange, 
  ariaLabel, 
  paramName = "tab" 
}: Props) {
  const { controls } = useDictionary();
  const tabsText = controls.tabs;
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const scrollerRef = useRef<HTMLDivElement>(null);
  
  const activeIndex = useMemo(
    () => Math.max(0, items.findIndex((t) => t.key === value)),
    [items, value]
  );

  // Автоматически синхронизируем URL при изменении вкладки
  const handleTabChange = (key: string) => {
    // Создаем новый URLSearchParams
    const params = new URLSearchParams(searchParams.toString());
    
    params.set(paramName, key);

    // Обновляем URL
    const newUrl = `${pathname}?${params.toString()}`;
    router.push(newUrl, { scroll: false });

    // Вызываем переданный callback если есть
    onChange?.(key);
  };

  // Автопрокрутка активного таба
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
      aria-label={ariaLabel ?? tabsText.ariaLabel}
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
              onClick={() => handleTabChange(t.key)}
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
