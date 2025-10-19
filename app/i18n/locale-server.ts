import { cookies, headers } from "next/headers";

import { defaultLocale, isLocale, type Locale } from "./config";

export async function resolveServerLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get("NEXT_LOCALE")?.value;
  if (isLocale(cookieLocale)) {
    return cookieLocale;
  }

  const acceptLanguage = headers().get("accept-language");
  if (acceptLanguage) {
    const preferred = acceptLanguage
      .split(",")
      .map((part) => part.trim())
      .map((part) => part.split(";")[0])
      .find((lang) => isLocale(lang.split("-")[0]));

    if (preferred) {
      const normalized = preferred.split("-")[0];
      if (isLocale(normalized)) {
        return normalized;
      }
    }
  }

  return defaultLocale;
}
