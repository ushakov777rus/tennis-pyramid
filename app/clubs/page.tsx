// Server Component: просто оборачиваем клиент в провайдер
import { ClubsProvider } from "./ClubsProvider";
import { ClubsClient } from "./ClubsClient";

export default function ClubsPage() {
  return (
    <ClubsProvider creatorId={null}>
      <ClubsClient />
    </ClubsProvider>
  );
}