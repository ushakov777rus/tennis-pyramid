// Server Component: просто оборачиваем клиент в провайдер

import { Suspense } from "react";

import { ClubsClient } from "@/app/clubs/ClubsClient";
import { ClubsProvider } from "@/app/clubs/ClubsProvider";

export default function ClubsPage() {
  return (
    <ClubsProvider mode="auto">
      <Suspense fallback={null}>
        <ClubsClient />
      </Suspense>
    </ClubsProvider>
  );
}
