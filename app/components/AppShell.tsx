"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";

import { SideNavigationBar } from "./controls/SideNavigationBar";
import { GuestIntroSlider } from "./GuestIntroSlider";
import { useUser } from "./UserContext";
import { NavigationBar } from "./controls/NavigationBar";
import { useDictionary } from "./LanguageProvider";
import { stripLocaleFromPath } from "@/app/i18n/routing";

const HIDDEN_PREFIXES = ["/tg/"];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const dictionary = useDictionary();
  const { loading } = useUser();

  const normalizedPathname = useMemo(() => {
    if (!pathname) return "/";
    const { path } = stripLocaleFromPath(pathname);
    return path;
  }, [pathname]);

  const hideShell = useMemo(() => {
    if (!normalizedPathname) return false;
    return HIDDEN_PREFIXES.some((prefix) => normalizedPathname.startsWith(prefix));
  }, [normalizedPathname]);

  if (hideShell) {
    return (
      <main id="app-main" className="app-main app-main-plain">
        {children}
      </main>
    );
  }

  if (loading) return <div>{dictionary.common.loading}</div>;

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
