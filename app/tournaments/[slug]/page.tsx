// app/tournaments/[slug]/page.tsx
import { notFound } from "next/navigation";
import { TournamentsRepository } from "@/app/repositories/TournamentsRepository";
import { TournamentProvider } from "./TournamentProvider";
import TournamentClient from "./TournamentClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type Params = { tournamentSlug: string };

export default async function TournamentPage(
  { params }: { params: Promise<Params> } // 👈 меняем тип
) {
  const { tournamentSlug } = await params;           // 👈 дожидаемся params
  const tPlain = await TournamentsRepository.getBySlug(tournamentSlug);
  if (!tPlain) notFound();

  return (
      <TournamentProvider initial={{ tournamentSlug, tournamentPlain: tPlain }}>
        <TournamentClient />
      </TournamentProvider>
  );
}