"use client";

import { IconMail, IconTelegram } from "./components/controls/IconButtons";
import "./Footer.css";
import { useDictionary } from "./components/LanguageProvider";

export function Footer() {
  const { footer } = useDictionary();
  const currentYear = new Date().getFullYear().toString();
  const brandLine = footer.brandLine.replace("{year}", currentYear);

  return (
    <footer>
      <section className="section card footer">
        <div className="footer-section left">
          <h3>{footer.contactTitle}</h3>
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
          <h3>{brandLine}</h3>
          <p>{footer.rights}</p>
        </div>
      </section>
    </footer>
  );
}
