// server component (по умолчанию)

import type { Metadata } from "next";
import { Suspense } from "react";

import { TournamentsProvider } from "@/app/tournaments/TournamentsProvider";
import { TournamentsClient } from "@/app/tournaments/TournamentsClient";

export const metadata: Metadata = {
  title: "Турниры HoneyCup",
  description:
    "Любительские турниры по теннису, паделу и бадминтону HoneyCup: сетки, расписание, результаты и статистика игроков.",
  alternates: { canonical: "/tournaments" },
};

export default function TournamentsPage() {
  return (
    <TournamentsProvider>
      <Suspense fallback={null}>
        <TournamentsClient club={null} />
      </Suspense>
    </TournamentsProvider>
  );
}
