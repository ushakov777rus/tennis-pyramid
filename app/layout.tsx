import "./globals.css";
import Script from "next/script";
import { UserProvider } from "./components/UserContext";
import { YandexMetrikaHit } from "./ym"; // добавим ниже

const YM_ID = process.env.NEXT_PUBLIC_YM_ID;

export default function RootLayout({ children }: { children: React.ReactNode }) {

  console.log("process.env.NODE_ENV",process.env.NODE_ENV);
  return (
    <html lang="ru">
      <body>
        <UserProvider>{children}</UserProvider>

        {/* Яндекс.Метрика (только в проде и если задан ID) */}
        {process.env.NODE_ENV === "production" && YM_ID && (
          <>
            <Script
              id="ym-loader"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
                  m[i].l=1*new Date();k=e.createElement(t),a=e.getElementsByTagName(t)[0],
                  k.async=1;k.src=r;a.parentNode.insertBefore(k,a)})
                  (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
                  ym(${YM_ID}, "init", {
                    clickmap:true,
                    trackLinks:true,
                    accurateTrackBounce:true,
                    webvisor:true
                  });
                `,
              }}
            />
            {/* SPA-хиты при клиентских переходах */}
            <YandexMetrikaHit />

            {/* noscript-пиксель (на случай отключённого JS) */}
            <noscript>
              <div>
                <img src={`https://mc.yandex.ru/watch/${YM_ID}`} style={{ position: "absolute", left: "-9999px" }} alt="" />
              </div>
            </noscript>
          </>
        )}
      </body>
    </html>
  );
}