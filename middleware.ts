import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { defaultLocale, isLocale, locales } from "./app/i18n/config";

const HANDLED_PATH_PREFIXES = ["/", "/tournaments", "/matches", "/rating", "/freetournament", "/about"];

const PUBLIC_FILE = /\.(.*)$/;

function resolveLocale(request: NextRequest) {
  const localeFromCookie = request.cookies.get("NEXT_LOCALE")?.value;
  if (isLocale(localeFromCookie)) {
    return localeFromCookie;
  }

  const acceptLanguage = request.headers.get("accept-language");
  if (acceptLanguage) {
    const preferredLanguage = acceptLanguage
      .split(",")
      .map((part) => part.trim())
      .map((part) => part.split(";")[0])
      .find((language) => isLocale(language.split("-")[0]));

    if (preferredLanguage) {
      const normalized = preferredLanguage.split("-")[0];
      if (isLocale(normalized)) {
        return normalized;
      }
    }
  }

  return defaultLocale;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  const shouldHandle = HANDLED_PATH_PREFIXES.some((prefix) => {
    if (prefix === "/") {
      return pathname === "/";
    }
    return pathname === prefix || pathname.startsWith(`${prefix}/`);
  });

  if (!shouldHandle) {
    return NextResponse.next();
  }

  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  if (pathnameIsMissingLocale) {
    const locale = resolveLocale(request);
    const redirectUrl = new URL(
      `/${locale}${pathname === "/" ? "" : pathname}`,
      request.url
    );
    const response = NextResponse.redirect(redirectUrl);
    response.cookies.set("NEXT_LOCALE", locale, { path: "/" });
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"],
};
