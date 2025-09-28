import { notFound } from "next/navigation";

import { TournamentsRepository } from "@/app/repositories/TournamentsRepository";
import { TournamentProvider } from "@/app/tournaments/[slug]/TournamentProvider";

import FreeTournamentWizard from "../FreeTournamentWizard";
import TournamentClient from "@/app/tournaments/[slug]/TournamentClient";

type Params = { slug: string };

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function FreeTournamentSlugPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;

  const tournamentPlain = await TournamentsRepository.getBySlug(slug);
  if (!tournamentPlain) notFound();

  return (
    <TournamentProvider initial={{ tournamentSlug: slug, tournamentPlain }}>
      <TournamentClient />
    </TournamentProvider>
  );
}
