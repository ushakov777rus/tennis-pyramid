import { notFound } from "next/navigation";

import { TournamentsRepository } from "@/app/repositories/TournamentsRepository";
import { TournamentProvider } from "./TournamentProvider";
import TournamentClient from "./TournamentClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type Params = { tournamentSlug: string };

export default async function TournamentPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { tournamentSlug } = await params;
  const tournamentPlain = await TournamentsRepository.getBySlug(tournamentSlug);
  if (!tournamentPlain) notFound();

  return (
    <TournamentProvider initial={{ tournamentSlug, tournamentPlain }}>
      <TournamentClient />
    </TournamentProvider>
  );
}
