// app/admin/clubs/page.tsx
import { ClubsProvider } from "../clubs/ClubsProvider";
import { TournamentAdminClientPage } from "./TournamentAdminClientPage";

export default function ClubsPage() {
  return (
    <ClubsProvider mode="auto">
      <TournamentAdminClientPage />
    </ClubsProvider>
  );
}