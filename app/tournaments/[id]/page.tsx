// app/tournaments/[id]/page.tsx
import { TournamentProvider } from "./TournamentProvider";
import TournamentClient from "./TournamentClient";

export default async function TournamentPage({
  params,
}: {
  params: Promise<{ id: string }>; // 👈 params — Promise
}) {
  const { id } = await params;      // 👈 обязательно await
  const tournamentId = Number(id);

  return (
    <TournamentProvider initial={{ tournamentId }}>
      <TournamentClient />
    </TournamentProvider>
  );
}