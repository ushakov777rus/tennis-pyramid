// app/tournaments/[slug]/page.tsx
import { notFound } from "next/navigation";
import { ClubsRepository } from "@/app/repositories/ClubsRepository";
import { ClubProvider } from "@/app/clubs/[slug]/ClubProvider";
import ClubClient from "@/app/clubs/[slug]/ClubClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type Params = { slug: string };

export default async function ClubPage(
  { params }: { params: Promise<Params> } // 👈 меняем тип
) {
  const { slug } = await params;           // 👈 дожидаемся params
  const tPlain = await ClubsRepository.getBySlug(slug);
  console.log("Club.getBySlug", slug, tPlain);
  if (!tPlain) notFound();

  return (
    <ClubProvider initial={{ slug, clubPlain: tPlain }}>
      <ClubClient />
    </ClubProvider>
  );
}