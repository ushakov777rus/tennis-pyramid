"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useClubs } from "./ClubsProvider";
import { ClubsRepository } from "@/app/repositories/ClubRepository";
import { ClubCard } from "@/app/clubs/ClubCard";

import "./page.css";
import { AdminOnly } from "../components/RoleGuard";

export function ClubsClient() {
  const { clubs, loading, error, createClub, deleteClub } = useClubs();
  const router = useRouter();

  const [q, setQ] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return clubs;
    return clubs.filter(c =>
      c.name.toLowerCase().includes(s) ||
      (c.city ?? "").toLowerCase().includes(s)
    );
  }, [clubs, q]);

  async function onCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name") || "").trim();
    const slug = String(fd.get("slug") || "").trim();
    const city = String(fd.get("city") || "").trim() || null;
    if (!name || !slug) return alert("Заполните Название и Slug");
    await createClub({ name, slug, city });
    setModalOpen(false);
    e.currentTarget.reset();
  }

  return (
    <div className="page-container">
      <h1 className="page-title">Клубы</h1>

      <div className="page-content-container">

      <div className="clubs-toolbar">
        <input
          className="clubs-search"
          type="text"
          placeholder="Поиск по названию или городу…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
        />
        <button className="clubs-btn" onClick={() => setModalOpen(true)}>Создать клуб</button>
      </div>

      {loading && <p className="clubs-loading">Загрузка…</p>}
      {error && <p className="clubs-error">Ошибка: {error}</p>}

      <ul className="card-grid-new">
        <AdminOnly>
        <ClubCard
            club={null}
        />
        </AdminOnly>
        {/* Список клубов */}
        {filtered.map((c) => (
          <li key={c.id}>
            <ClubCard
              club={c}
              onOpen={() => router.push(ClubsRepository.clubUrl(c))}
              onDelete={() => {
                if (confirm(`Удалить клуб «${c.name}»?`)) void deleteClub(c.id);
              }}
            />
          </li>
        ))}
      </ul>

      {/* Простая модалка (MVP) */}
      {modalOpen && (
        <div className="clubs-modal">
          <div className="clubs-modal-card">
            <h3>Новый клуб</h3>
            <form onSubmit={onCreate}>
              <label>Название<input name="name" type="text" required /></label>
              <label>Slug<input name="slug" type="text" required placeholder="moscow-tennis-academy" /></label>
              <label>Город<input name="city" type="text" /></label>
              <div className="clubs-modal-actions">
                <button type="button" onClick={() => setModalOpen(false)}>Отмена</button>
                <button type="submit">Создать</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
    </div>
  );
}