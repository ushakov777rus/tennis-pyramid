import "./globals.css";
import { UserProvider } from "./components/UserContext";
import { YandexMetrika } from "./components/YandexMetrica";
import { YandexMetrikaHit } from "./ym";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>
        <UserProvider>{children}</UserProvider>
        <YandexMetrika />
        <YandexMetrikaHit />
        <noscript>
          <div><img src={`https://mc.yandex.ru/watch/${process.env.NEXT_PUBLIC_YM_ID}`} style={{ position:"absolute", left:"-9999px" }} alt=""/></div>
        </noscript>
      </body>
    </html>
  );
}