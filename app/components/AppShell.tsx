"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";

import { NavigationBar } from "./NavigationBar";
import { SideNavigationBar } from "./controls/SideNavigationBar";
import { GuestIntroSlider } from "./GuestIntroSlider";

const HIDDEN_PREFIXES = ["/tg/"];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const hideShell = useMemo(() => {
    if (!pathname) return false;
    return HIDDEN_PREFIXES.some((prefix) => pathname.startsWith(prefix));
  }, [pathname]);

  if (hideShell) {
    return (
      <main id="app-main" className="app-main app-main-plain">
        {children}
      </main>
    );
  }

  return (
    <>
      <GuestIntroSlider />
      <NavigationBar />
      <div className="app-shell">
        <SideNavigationBar />
        <main id="app-main" className="app-main">
          {children}
        </main>
      </div>
    </>
  );
}
