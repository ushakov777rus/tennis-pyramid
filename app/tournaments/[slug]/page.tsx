// app/tournaments/[slug]/page.tsx
import { notFound } from "next/navigation";
import { TournamentsRepository } from "@/app/repositories/TournamentsRepository";
import { TournamentProvider } from "./TournamentProvider";
import TournamentClient from "./TournamentClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type Params = { slug: string };

export default async function TournamentPage(
  { params }: { params: Promise<Params> } // 👈 меняем тип
) {
  const { slug } = await params;           // 👈 дожидаемся params
  const tPlain = await TournamentsRepository.getBySlug(slug);
  if (!tPlain) notFound();

  return (
    <TournamentProvider initial={{ slug, tournamentPlain: tPlain }}>
      <TournamentClient />
    </TournamentProvider>
  );
}