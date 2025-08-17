"use client";

import Script from "next/script";

const YM_ID = process.env.NEXT_PUBLIC_YM_ID;

export function YandexMetrika() {
  if (!YM_ID) return null;

  return (
    <>
      <Script
        id="ym-tag"
        src="https://mc.yandex.ru/metrika/tag.js"
        strategy="afterInteractive"
        onLoad={() => console.log("[YM] tag.js loaded", { YM_ID })}
        onError={(e) => console.error("[YM] tag.js failed", e)}
      />
      <Script
        id="ym-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
            m[i].l=1*new Date();})(window, document, "script", "", "ym");
            try {
              console.log("[YM] init start", ${YM_ID});
              ym(${YM_ID}, "init", { clickmap:true, trackLinks:true, accurateTrackBounce:true, webvisor:true });
              ym(${YM_ID}, "hit", location.pathname + location.search);
              console.log("[YM] init done, typeof ym=", typeof ym);
            } catch(e){ console.error("[YM] init error", e); }
          `,
        }}
      />
    </>
  );
}