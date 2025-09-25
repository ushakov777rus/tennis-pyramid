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

  const initialStepParam = searchParams?.step;
  const initialStep = Array.isArray(initialStepParam)
    ? parseInt(initialStepParam[0] ?? "1", 10)
    : parseInt(initialStepParam ?? "1", 10);

  return (
    <TournamentProvider initial={{ tournamentSlug: slug, tournamentPlain }}>
      <FreeTournamentWizard initialStep={Number.isFinite(initialStep) ? initialStep : 1} />
    </TournamentProvider>
  );
}
