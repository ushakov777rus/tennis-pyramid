// app/(admin)/admin/page.tsx
import { redirect } from "next/navigation";
import { getServerUser } from "@/app/lib/auth-server"; // мы уже писали ранее
import { ClubsRepositoryServer } from "@/app/repositories/ClubsRepository.server";

export default async function PlayerRootPage() {
  const user = await getServerUser();
  if (!user) redirect(`/login?next=${encodeURIComponent("/player")}`);

  const clubs = await ClubsRepositoryServer.findByAdmin(user.id!);

  if (clubs.length > 0) {
    redirect(`/player/clubs/${clubs[0].slug}`);
  }
  redirect("/player/clubs");
}