"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

declare global {
  interface Window {
    ym?: (...args: any[]) => void;
  }
}

const YM_ID = process.env.NEXT_PUBLIC_YM_ID;

export function YandexMetrikaHit() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!window.ym || !YM_ID) return;
    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "");
    window.ym(Number(YM_ID), "hit", url);
  }, [pathname, searchParams]);

  return null;
}