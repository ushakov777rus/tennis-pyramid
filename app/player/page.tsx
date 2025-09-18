// app/admin/clubs/page.tsx  (SERVER component)
import { ClubsProvider } from "../clubs/ClubsProvider";
import { PlayerClientPage } from "./PlayerClientPage";

export default function ClubsPage() {
  return (
    <ClubsProvider mode="auto">
      <PlayerClientPage />
    </ClubsProvider>
  );
}