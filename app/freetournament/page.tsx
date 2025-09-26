import { Metadata } from "next";
import FreeTournamentModalLauncher from "./FreeTournamentModalLauncher";


const pageTitle = "Быстрый турнир";
const pageDescription = "Пошаговый мастер создания турнира";
const keywords = [
  "создать турнирную таблицу",
  "турнирная таблица онлайн создать",
];

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  keywords,
  openGraph: {
    title: pageTitle,
    description: pageDescription,
  },
  twitter: {
    card: "summary",
    title: pageTitle,
    description: pageDescription,
  },
};

export default function FreeTournamentPage() {
  return <FreeTournamentModalLauncher />;
}
