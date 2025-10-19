import type { Metadata } from "next";

import { MatchesProvider } from "./MatchesProvider";
import { MatchesClient } from "./MatchesClient";

export const metadata: Metadata = {
  title: "Матчи HoneyCup",
  description:
    "Матчи HoneyCup: результаты сыгранных встреч, счета и статистика по турнирам.",
  alternates: { canonical: "/matches" },
};

export default function MatchesPage() {
  return (
    <MatchesProvider>
      <MatchesClient />
    </MatchesProvider>
  );
}
