"use client";

import "./Footer.css";

/* SVG-иконки 24x24, цвет #CF6 */
function IconBase({ children }: { children: React.ReactNode }) {
  return (
    <svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <g
        stroke="#CF6"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {children}
      </g>
    </svg>
  );
}

function IconMail() {
  return (
    <IconBase>
      <rect x={3} y={5} width={18} height={14} rx={2} />
      <path d="M3 7l9 6 9-6" />
    </IconBase>
  );
}

function IconTelegram() {
  return (
    <IconBase>
      <path d="M21 3L3 10.5l6 2 2 6 2.5-3.5 5 3L21 3z" />
    </IconBase>
  );
}

function IconVK() {
  return (
    <IconBase>
      <path d="M3 7c.2 6.5 3.5 10.3 9.5 10.5h.3v-3.8c2.1.2 3.7 1.7 4.3 3.8H21c-.8-3-3-5-5.3-5.7C18.9 10.8 20 8.9 21 7h-3.6c-.6 1.5-1.8 3.2-3.4 3v-3H11v11h2V10" />
    </IconBase>
  );
}

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
            <a
              href="https://vk.com/honeycup"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-icon"
              aria-label="ВКонтакте"
            >
              <IconVK />
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
