"use client";

import { createContext, useContext, useMemo } from "react";
import type { Locale } from "@/app/i18n/config";
import type { Dictionary } from "@/app/i18n/dictionaries";

type LanguageContextValue = {
  locale: Locale;
  dictionary: Dictionary;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({
  locale,
  dictionary,
  children,
}: {
  locale: Locale;
  dictionary: Dictionary;
  children: React.ReactNode;
}) {
  const value = useMemo<LanguageContextValue>(() => ({ locale, dictionary }), [locale, dictionary]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}

export function useDictionary() {
  return useLanguage().dictionary;
}

export function useLocale() {
  return useLanguage().locale;
}
