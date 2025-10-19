"use client";

import { useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { locales, type Locale } from "@/app/i18n/config";
import { stripLocaleFromPath, withLocalePath } from "@/app/i18n/routing";
import { useDictionary, useLanguage } from "../LanguageProvider";

export function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname() ?? "/";
  const searchParams = useSearchParams();
  const { locale } = useLanguage();
  const dictionary = useDictionary();
  const [, startTransition] = useTransition();

  if (locales.length <= 1) {
    return null;
  }

  const { path } = stripLocaleFromPath(pathname);

  function changeLocale(target: Locale) {
    if (target === locale) return;
    const newPath = withLocalePath(target, path);
    const queryString = searchParams?.toString();

    if (typeof document !== "undefined") {
      document.cookie = `NEXT_LOCALE=${target};path=/;max-age=${60 * 60 * 24 * 365}`;
    }

    startTransition(() => {
      router.push(queryString ? `${newPath}?${queryString}` : newPath);
      router.refresh();
    });
  }

  return (
    <div className="lang-switcher" role="group" aria-label={dictionary.languageSwitcher.label}>
      {locales.map((item) => (
        <button
          key={item}
          type="button"
          className={`lang-switcher__btn ${locale === item ? "active" : ""}`}
          onClick={() => changeLocale(item)}
          aria-pressed={locale === item}
        >
          {dictionary.languageSwitcher.localeNames[item] ?? item.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
