// Server Component: просто оборачиваем клиент в провайдер

import { ClubsClient } from "@/app/clubs/ClubsClient";
import { ClubsProvider } from "@/app/clubs/ClubsProvider";

export default function ClubsPage() {
  return (
    <ClubsProvider mode="auto">
      <ClubsClient />
    </ClubsProvider>
  );
}