// app/tournaments/[slug]/components/AboutTournament.tsx
"use client";

import { useMemo } from "react";
import "./AboutTournament.css";
import { useTournament } from "@/app/tournaments/[slug]/TournamentProvider";

function formatDate(d?: string | null) {
  if (!d) return "";
  const date = new Date(d);
  return date.toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function formatDateRange(start?: string | null, end?: string | null) {
  if (!start && !end) return "—";
  if (start && end) return `${formatDate(start)} → ${formatDate(end)}`;
  return start ? formatDate(start) : formatDate(end);
}

export function AboutTournament() {
  const { tournament, creator } = useTournament();

  // Защитимся, если данных нет
  if (!tournament) {
    return <div className="card about-card">Нет данных о турнире</div>;
  }

  const {
    name,
    format,
    tournament_type,
    start_date,
    end_date,
    city,
    venue,           // если у тебя есть поле площадки/клуба
    surface,         // покрытие, если есть
    fee,             // взнос
    categories,      // массив строк, если есть
    organizer_name,
    organizer_phone,
    organizer_telegram,
    organizer_whatsapp,
    description,     // Markdown/текст про турнир
    rules,           // Markdown/текст с правилами
    tags,            // массив строк
    participants_count,
    matches_count,
    status,          // черновик/открыт/закрыт и т.п.
  } = tournament as any;

  const chips = useMemo(() => {
    const arr: string[] = [];
    if (format) arr.push(String(format));
    if (tournament_type) arr.push(String(tournament_type));
    if (surface) arr.push(String(surface));
    if (Array.isArray(categories)) arr.push(...categories);
    if (Array.isArray(tags)) arr.push(...tags);
    return arr.slice(0, 12);
  }, [format, tournament_type, surface, categories, tags]);

  return (
    <div className="about-root">
      {/* Summary карточка */}
      <section className="card about-card">
        <h2 className="about-title">{name}</h2>
        <div className="about-summary">
          <div className="about-summary-item">
            <div className="about-kv-k">Даты</div>
            <div className="about-kv-v">{formatDateRange(start_date, end_date)}</div>
          </div>
          <div className="about-summary-item">
            <div className="about-kv-k">Тип</div>
            <div className="about-kv-v">
              {tournament_type ? String(tournament_type) : "—"}
            </div>
          </div>
          <div className="about-summary-item">
            <div className="about-kv-k">Формат</div>
            <div className="about-kv-v">{format ? String(format) : "—"}</div>
          </div>
          <div className="about-summary-item">
            <div className="about-kv-k">Участников</div>
            <div className="about-kv-v">{participants_count ?? "—"}</div>
          </div>
          <div className="about-summary-item">
            <div className="about-kv-k">Игр</div>
            <div className="about-kv-v">{matches_count ?? "—"}</div>
          </div>
          <div className="about-summary-item">
            <div className="about-kv-k">Статус</div>
            <div className="about-kv-v">{status ?? "—"}</div>
          </div>
        </div>

        {chips.length > 0 && (
          <div className="about-chips">
            {chips.map((c, i) => (
              <span key={i} className="chip">
                {c}
              </span>
            ))}
          </div>
        )}
      </section>

      {/* Инфо-грид */}
      <section className="card about-grid">
        <div className="info-item">
          <div className="info-k">Организатор</div>
          <div className="info-v">{creator?.displayName(false)}</div>
        </div>
        <div className="info-item">
          <div className="info-k">Где</div>
          <div className="info-v">
            {venue ? `${venue}${city ? `, ${city}` : ""}` : city ?? "—"}
          </div>
        </div>
        <div className="info-item">
          <div className="info-k">Покрытие</div>
          <div className="info-v">{surface ?? "—"}</div>
        </div>
        <div className="info-item">
          <div className="info-k">Взнос</div>
          <div className="info-v">{fee != null ? `${fee} ₽` : "—"}</div>
        </div>
      </section>

      {/* Контакты */}
      {(organizer_phone || organizer_telegram || organizer_whatsapp) && (
        <section className="card about-contacts">
          <div className="info-k">Связаться с организатором</div>
          <div className="contact-actions">
              <>
                <a className="btn-ghost" href={`tel:${creator?.phone}`}>Позвонить</a>
                <a className="btn-ghost" href={`sms:${organizer_phone}`}>SMS</a>
              </>
            {organizer_whatsapp && (
              <a
                className="btn-ghost"
                href={`https://wa.me/${organizer_whatsapp.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp
              </a>
            )}
            {organizer_telegram && (
              <a
                className="btn-ghost"
                href={`https://t.me/${organizer_telegram.replace(/^@/, "")}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Telegram
              </a>
            )}
          </div>
        </section>
      )}

      {/* Описание */}
      {description && (
        <section className="card about-text">
          <h3>Описание</h3>
          <p className="muted">{description}</p>
        </section>
      )}

      {/* Правила */}
      {rules && (
        <section className="card about-text">
          <h3>Правила</h3>
          <p className="muted">{rules}</p>
        </section>
      )}
    </div>
  );
}