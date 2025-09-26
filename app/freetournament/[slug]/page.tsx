import { notFound } from "next/navigation";

import { TournamentsRepository } from "@/app/repositories/TournamentsRepository";
import { TournamentProvider } from "@/app/tournaments/[slug]/TournamentProvider";

import FreeTournamentWizard from "../FreeTournamentWizard";

type Params = { slug: string };

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function FreeTournamentSlugPage({
  params,
  searchParams,
}: {
  params: Promise<Params>;
  searchParams?: Record<string, string | string[]>;
}) {
  const { slug } = await params;

  const tournamentPlain = await TournamentsRepository.getBySlug(slug);
  if (!tournamentPlain) notFound();

  return (
    <TournamentProvider initial={{ tournamentSlug: slug, tournamentPlain }}>
      <FreeTournamentWizard />
    </TournamentProvider>
  );
}
