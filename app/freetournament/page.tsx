import { Metadata } from "next";
import FreeTournamentModalLauncher from "./FreeTournamentModalLauncher";


const pageTitle = "Генератор турнирной сетки онлайн";
const pageDescription =
  "Бесплатный мастер создания турнирных сеток: запустите теннисный турнир, добавьте игроков и получите готовую сетку в пару кликов.";
const openGraphDescription =
  "Создавайте турнирные сетки быстро и легко. Вы можете создать турниры на выбывание (одиночные и двойные), турниры по швейцарской системе и турниры по круговой системе.";
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
    description: openGraphDescription,
  },
  twitter: {
    card: "summary",
    title: pageTitle,
    description: pageDescription,
  },
  other: {
    "og:description": openGraphDescription,
  },
};

export default function FreeTournamentPage() {
  return <FreeTournamentModalLauncher />;
}
