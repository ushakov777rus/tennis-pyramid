import { redirect } from "next/navigation";

import type { Locale } from "@/app/i18n/config";
import { getServerUser } from "@/app/lib/auth-server";
import { ClubsRepositoryServer } from "@/app/repositories/ClubsRepository.server";
import { withLocalePath } from "@/app/i18n/routing";

export async function handleAdminRedirect(locale: Locale): Promise<never> {
  const user = await getServerUser();
  const adminPath = withLocalePath(locale, "/admin");

  if (!user) {
    redirect(`/login?next=${encodeURIComponent(adminPath)}`);
  }

  const clubs = await ClubsRepositoryServer.findByAdmin(user.id!);

  if (clubs.length > 0) {
    redirect(withLocalePath(locale, `/admin/clubs/${clubs[0].slug}`));
  }

  redirect(withLocalePath(locale, "/admin/clubs"));
}
