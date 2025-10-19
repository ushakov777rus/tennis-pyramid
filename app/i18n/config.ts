export const locales = ["ru", "en"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "ru";

export function isLocale(value: string | undefined | null): value is Locale {
  if (!value) {
    return false;
  }
  return locales.includes(value as Locale);
}
