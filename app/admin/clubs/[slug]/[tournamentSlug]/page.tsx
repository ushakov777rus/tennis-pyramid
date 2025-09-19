// app/admin/clubs/[slug]/[tournamentSlug]/page.tsx
import { notFound } from "next/navigation";
import { TournamentsRepository } from "@/app/repositories/TournamentsRepository";
import { ClubsRepository } from "@/app/repositories/ClubsRepository";
import { ClubProvider } from "@/app/clubs/[slug]/ClubProvider";
import { TournamentProvider } from "@/app/tournaments/[slug]/TournamentProvider";
import TournamentClient from "@/app/tournaments/[slug]/TournamentClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type Params = { slug: string; tournamentSlug?: string; tournamentsSlug?: string };

export default async function TournamentPage({ params }: { params: Params }) {
  const { slug } = params;

  // На случай, если папка названа [tournamentsSlug] — подстрахуемся
  const tournamentSlug = params.tournamentSlug ?? params.tournamentsSlug;
  if (!tournamentSlug) notFound();

  const [tPlain, clubPlain] = await Promise.all([
    TournamentsRepository.getBySlug(tournamentSlug),
    ClubsRepository.getBySlug(slug),
  ]);

  if (!tPlain) notFound();

  return (
    <ClubProvider initial={{ slug, clubPlain }}>
      <TournamentProvider initial={{ tournamentSlug, tournamentPlain: tPlain }}>
        <TournamentClient />
      </TournamentProvider>
    </ClubProvider>
  );
}