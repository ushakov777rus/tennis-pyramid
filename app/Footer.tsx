"use client";

import { IconMail, IconTelegram } from "./components/controls/IconButtons";
import "./Footer.css";

export function Footer() {
  return (
    <footer>
      <section className="section card footer">
        <div className="footer-section left">
          <h3>Для связи</h3>
          <div className="footer-icons">
            <a
              href="mailto:honey.cup@yandex.ru"
              className="footer-icon"
              aria-label="E-mail"
            >
              <IconMail />
            </a>
            <a
              href="https://t.me/honeycuptennis"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-icon"
              aria-label="Telegram"
            >
              <IconTelegram />
            </a>
          </div>
        </div>

        <div className="footer-section right">
          <h3>© {new Date().getFullYear()} HoneyCup</h3>
          <p>Все права защищены</p>
        </div>
      </section>
    </footer>
  );
}
