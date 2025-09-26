import { Metadata } from "next";
import FreeTournamentModalLauncher from "./FreeTournamentModalLauncher";


const pageTitle = "Генератор турнирной сетки онлайн";
const pageDescription =
  "Бесплатный мастер создания турнирных сеток: запустите теннисный турнир, добавьте игроков и получите готовую сетку в пару кликов.";
const keywords = [
  "генератор турнирной сетки онлайн",
  "генератор турнирной сетки бесплатно",
  "создать турнирную сетку",
  "турнирная таблица онлайн",
  "теннисная турнирная сетка",
  "создать сетку турнира бесплатно",
];

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  keywords,
  openGraph: {
    title: `${pageTitle} | Tennis Pyramid`,
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
