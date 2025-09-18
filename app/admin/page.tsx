// app/(admin)/admin/page.tsx
import { redirect } from "next/navigation";
import { getServerUser } from "@/app/lib/auth-server"; // мы уже писали ранее
import { ClubsRepositoryServer } from "@/app/repositories/ClubsRepository.server";

export default async function AdminRootPage() {
  const user = await getServerUser();
  if (!user) redirect(`/login?next=${encodeURIComponent("/admin")}`);

  const clubs = await ClubsRepositoryServer.findByAdmin(user.id!);

  if (clubs.length > 0) {
    redirect(`/admin/clubs/${clubs[0].slug}`);
  }
  redirect("/admin/clubs");
}