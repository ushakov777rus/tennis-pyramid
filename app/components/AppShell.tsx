"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";

import { NavigationBar } from "./NavigationBar";
import { SideNavigationBar } from "./controls/SideNavigationBar";
import { GuestIntroSlider } from "./GuestIntroSlider";
import { useUser } from "./UserContext";

const HIDDEN_PREFIXES = ["/tg/"];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { loading } = useUser();

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

  if (loading)
    return <div>Загрузка...</div>;

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
