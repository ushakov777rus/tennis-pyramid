// Server Component: просто оборачиваем клиент в провайдер
import { redirect } from "next/navigation";

import { resolveServerLocale } from "@/app/i18n/locale-server";
import { withLocalePath } from "@/app/i18n/routing";

export default async function ClubsPage() {
  const locale = await resolveServerLocale();
  redirect(withLocalePath(locale, "/clubs"));
}
