// app/admin/clubs/[slug]/[tournamentSlug]/page.tsx
import { notFound } from "next/navigation";
import { TournamentsRepository } from "@/app/repositories/TournamentsRepository";
import { ClubsRepository } from "@/app/repositories/ClubsRepository";
import { ClubProvider } from "@/app/clubs/[slug]/ClubProvider";
import { TournamentProvider, useOptionalTournament } from "@/app/tournaments/[slug]/TournamentProvider";
import TournamentClient from "@/app/tournaments/[slug]/TournamentClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type Params = { slug: string; tournamentSlug?: string; tournamentsSlug?: string };

export default async function TournamentPage(
  { params }: { params: Promise<Params> } // ⬅️ как в твоём проекте ожидается
) {
  const { slug, tournamentSlug, tournamentsSlug } = await params; // ⬅️ дожидаемся
  const tSlug = tournamentSlug ?? tournamentsSlug;
  if (!tSlug) notFound();

  const [tPlain, clubPlain] = await Promise.all([
    TournamentsRepository.getBySlug(tSlug),
    ClubsRepository.getBySlug(slug),
  ]);

  if (!tPlain) notFound();

  return (
    <ClubProvider initial={{ slug, clubPlain }}>
      <TournamentProvider initial={{ tournamentSlug: tSlug, tournamentPlain: tPlain }}>
        <TournamentClient />
      </TournamentProvider>
    </ClubProvider>
  );
}