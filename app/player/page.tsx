import { resolveServerLocale } from "@/app/i18n/locale-server";
import { handlePlayerRedirect } from "@/app/player/_redirect";

export default async function PlayerRootPage() {
  const locale = await resolveServerLocale();
  await handlePlayerRedirect(locale);
}
