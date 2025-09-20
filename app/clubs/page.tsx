// Server Component: просто оборачиваем клиент в провайдер
import { Suspense } from "react";

import { ClubsProvider } from "./ClubsProvider";
import { ClubsClient } from "./ClubsClient";

export default function ClubsPage() {
  return (
    <ClubsProvider mode="all">
      <Suspense fallback={null}>
        <ClubsClient />
      </Suspense>
    </ClubsProvider>
  );
}
