// server component (по умолчанию)

import { Suspense } from "react";

import { TournamentsProvider } from "@/app/tournaments/TournamentsProvider";
import { TournamentsClient } from "@/app/tournaments/TournamentsClient";

export default function TournamentsPage() {
  return (
    <TournamentsProvider>
      <Suspense fallback={null}>
        <TournamentsClient club={null} />
      </Suspense>
    </TournamentsProvider>
  );
}
