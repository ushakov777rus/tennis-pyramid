"use client";

import { useEffect, useState, useCallback } from "react";
import { ClubsRepository, Club } from "@/app/repositories/ClubRepository";

import "@/app/clubs/clubs.css";

export default function ClubsPage() {
  // Состояния страницы
  const [loading, setLoading] = useState(true);
  const [clubs, setClubs] = useState<Club[]>([]);
  const [search, setSearch] = useState("");

  // Загрузка клубов (MVP: клиентская, потом можно SSR)
  const load = useCallback(async () => {
    setLoading(true);
    const data = await ClubsRepository.list({ search, limit: 50, offset: 0 });
    setClubs(data);
    setLoading(false);
  }, [search]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="page-container">
      <h1 className="page-title">Клубы</h1>

      <div className="page-content-container">


      {/* Поиск по названию/городу */}
      <div className="clubs-toolbar">
        <input
          className="clubs-search"
          type="text"
          placeholder="Поиск по названию или городу…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && load()}
        />
        <button className="clubs-btn" onClick={load}>Найти</button>
      </div>

      {loading ? (
        <p className="clubs-loading">Загрузка…</p>
      ) : clubs.length === 0 ? (
        <p className="clubs-empty">Клубы не найдены.</p>
      ) : (
        <ul className="clubs-grid">
          {clubs.map((c) => (
            <li key={c.id} className="club-card">
              <a className="club-link" href={`/clubs/${c.slug}`}>
                <div className="club-logo-wrap">
                  {/* Логотип, если есть */}
                  {c.logo_url ? (
                    <img className="club-logo" src={c.logo_url} alt={c.name} />
                  ) : (
                    <div className="club-logo-placeholder">🏆</div>
                  )}
                </div>

                <div className="club-info">
                  <div className="club-name">{c.name}</div>
                  {c.city && <div className="club-city">{c.city}</div>}

                  <div className="club-meta">
                    <span className="club-members">
                      Участников: {c.members_count ?? 0}
                    </span>
                  </div>

                  {c.description && (
                    <div className="club-desc" title={c.description}>
                      {c.description}
                    </div>
                  )}
                </div>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
    </div>
  );
}