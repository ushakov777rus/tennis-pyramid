"use client";

import "./clubs.css";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useClubs } from "./ClubsProvider";
import { ClubsRepository } from "@/app/repositories/ClubsRepository";
import { ClubCreateInput } from "@/app/models/Club";
import { ClubCard } from "@/app/clubs/ClubCard";
import { AdminOnly } from "../components/RoleGuard";
import { AddClubModal } from "./AddClubModal";

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

  const onCreate = async (payload: ClubCreateInput) => {

    await createClub({ 
      name: payload.name, 
      city: payload.city });

    setModalOpen(false);
  };

  return (
    <div className="page-container">
      <h1 className="page-title">Клубы</h1>

      <div className="page-content-container">

      <div className="card page-toolbar">
        <input
          className="input"
          type="text"
          placeholder="Поиск по названию или городу…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
        />
      </div>

      {loading && <p className="clubs-loading">Загрузка…</p>}
      {error && <p className="clubs-error">Ошибка: {error}</p>}

      <ul className="card-grid-new">
        <AdminOnly>
        <ClubCard
            club={null}
            onClick={() => setModalOpen(true)}
        />
        </AdminOnly>
        {/* Список клубов */}
        {filtered.map((c) => (
          <li key={c.id}>
            <ClubCard
              club={c}
              onClick={() => router.push(ClubsRepository.clubUrl(c))}
              onDelete={() => {
                if (confirm(`Удалить клуб «${c.name}»?`)) void deleteClub(c.id);
              }}
            />
          </li>
        ))}
      </ul>

      {/* Простая модалка (MVP) */}
        <AddClubModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onCreate={onCreate}  // ✅ теперь передаём правильный handler
        />
    </div>
    </div>
  );
}