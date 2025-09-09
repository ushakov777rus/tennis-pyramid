// app/tournaments/[slug]/page.tsx
import { notFound } from "next/navigation";
import { TournamentsRepository } from "@/app/repositories/TournamentsRepository";
import { TournamentProvider } from "./TournamentProvider";
import TournamentClient from "./TournamentClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function TournamentPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const tPlain = await TournamentsRepository.getBySlug(slug);
  if (!tPlain) notFound();

  return (
    <TournamentProvider initial={{ slug, tournamentPlain: tPlain }}>
      <TournamentClient />
    </TournamentProvider>
  );
}