import { resolveServerLocale } from "@/app/i18n/locale-server";
import { handleAdminRedirect } from "@/app/admin/_redirect";

export default async function AdminRootPage() {
  const locale = await resolveServerLocale();
  await handleAdminRedirect(locale);
}
