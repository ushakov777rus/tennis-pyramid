"use client";

import { useEffect, useMemo, useState } from "react";

import "./styles.css";

declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        initData: string;
        initDataUnsafe: Record<string, unknown>;
        ready: () => void;
        expand?: () => void;
        colorScheme?: "light" | "dark";
      };
    };
  }
}

export default function TelegramCreateTournamentPage() {
  const [initData, setInitData] = useState<string>("");
  const [colorScheme, setColorScheme] = useState<"light" | "dark" | "unknown">("unknown");

  useEffect(() => {
    const webApp = window.Telegram?.WebApp;
    if (!webApp) return;

    webApp.ready();
    webApp.expand?.();

    if (webApp.initData) {
      setInitData(webApp.initData);
    }

    if (webApp.colorScheme) {
      setColorScheme(webApp.colorScheme);
    }
  }, []);

  const notice = useMemo(() => {
    if (!initData) {
      return "Бот запущен, ждём данные от Telegram…";
    }
    return "WebApp инициализирован. Можем продолжать.";
  }, [initData]);

  return (
    <div className="tg-create-container" data-theme={colorScheme}>
      <h1>Настройка турнира</h1>
      <p>
        Это тестовая заглушка для Telegram WebApp. Страница доступна по HTTPS и сообщает Telegram, что
        мини-приложение готово.
      </p>
      <div className="tg-create-status">
        <strong>Статус: </strong>
        <span>{notice}</span>
      </div>
      {initData && (
        <details>
          <summary>Показать initData</summary>
          <pre>{initData}</pre>
        </details>
      )}
      <p className="tg-create-footnote">
        Позже здесь появится полноценная форма конструктора турнира. Пока можно использовать ссылку для
        настройки меню в BotFather.
      </p>
    </div>
  );
}
