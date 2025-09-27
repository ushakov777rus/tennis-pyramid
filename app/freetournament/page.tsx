import { Metadata } from "next";
import FreeTournamentModalLauncher from "./FreeTournamentModalLauncher";


const pageTitle = "Генератор турнирной сетки онлайн";
const pageDescription =
  "Бесплатный мастер создания турнирных сеток: запустите теннисный турнир, добавьте игроков и получите готовую сетку в пару кликов.";
const openGraphDescription =
  "Создавайте турнирные сетки быстро и легко. Вы можете создать турниры на выбывание (одиночные и двойные), турниры по швейцарской системе и турниры по круговой системе.";
const keywords = [
    "генератор турнирной сетки онлайн бесплатно",
    "генератор турнирных сеток и таблиц онлайн",
    "любительские теннисные турниры",
    "сделать турнирную сетку онлайн",
    "создание турнирной сетки онлайн",
    "создать турнирную сетку онлайн бесплатно",
    "составить турнирную сетку онлайн",
    "составление турнирной сетки онлайн",
    "теннис онлайн турнирная сетка",
    "турнирная сетка онлайн",
    "турнирная сетка онлайн бесплатно",
    "турнирная сетка онлайн генератор",
    "организация турниров по теннису онлайн",
    "турнирная платформа для тенниса",
    "система управления теннисным клубом",
    "теннис турнирная сетка",
    "создание турнирной сетки конструктор",
    "конструктор турнирной сетки",
  ]

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
