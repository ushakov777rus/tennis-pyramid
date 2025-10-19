import { isLocale, type Locale } from "./config";

export function stripLocaleFromPath(pathname: string): { locale: Locale | null; path: string } {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0) {
    return { locale: null, path: "/" };
  }

  const maybeLocale = segments[0];
  if (isLocale(maybeLocale)) {
    const rest = segments.slice(1);
    return {
      locale: maybeLocale,
      path: rest.length ? `/${rest.join("/")}` : "/",
    };
  }

  return { locale: null, path: pathname || "/" };
}

export function withLocalePath(locale: Locale, path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (normalized === "/") {
    return `/${locale}`;
  }
  return `/${locale}${normalized}`;
}

export function toggleLocale(currentLocale: Locale, targetLocale: Locale, pathname: string): string {
  const { path } = stripLocaleFromPath(pathname);
  return withLocalePath(targetLocale, path);
}
