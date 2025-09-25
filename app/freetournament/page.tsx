import { Metadata } from "next";
import FreeTournamentWizard from "./FreeTournamentWizard";


export const metadata: Metadata = {
  title: "Быстрый турнир",
  description: "Пошаговый мастер создания турнира",
};

export default function FreeTournamentPage() {
  return <FreeTournamentWizard />;
}
