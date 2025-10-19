import "./colors.css";
import "./globals.css";
import "./cards.css";
import "./tables.css";
import "./modal.css";
import "./app-shell.css";

import { cookies } from "next/headers";
import type { Metadata } from "next";
import { defaultLocale, isLocale } from "./i18n/config";

export const metadata: Metadata = {
  metadataBase: new URL("https://honeycup.ru"),
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies(); // теперь cookies() нужно await'ить
  const cookieLocale = cookieStore.get("NEXT_LOCALE")?.value;
  const locale = isLocale(cookieLocale) ? cookieLocale : defaultLocale;

  return (
    <html lang={locale} suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}