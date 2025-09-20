"use client";

import "./clubs.css";

import { useMemo, useState, useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useClubs } from "./ClubsProvider";
import { ClubCreateInput } from "@/app/models/Club";
import { ClubCard } from "@/app/clubs/ClubCard";
import { AdminOnly } from "../components/RoleGuard";
import { AddClubModal } from "./AddClubModal";
import { useUser } from "../components/UserContext";
import { UserRole } from "../models/Users";


/**
 * Компонент списка клубов.
 * Отображает:
 *  - поиск
 *  - список клубов
 *  - кнопку добавления нового клуба
 *  - модалку для создания клуба
 */
export function ClubsClient() {
  const { user } = useUser();
  const { clubs, loading, error, createClub, deleteClub, initialLoaded } = useClubs();
  const pathname = usePathname();
  const router = useRouter();
  
  // состояние строки поиска
  const [q, setQ] = useState("");

  // состояние открытия модалки создания клуба
  const [modalOpen, setModalOpen] = useState(false);

  /**
   * Отфильтрованные клубы по строке поиска.
   * Если q пустая строка → возвращаем все клубы.
   */
  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return clubs;
    return clubs.filter(
      (c) =>
        c.name.toLowerCase().includes(s) ||
        (c.city ?? "").toLowerCase().includes(s)
    );
  }, [clubs, q]);

  /**
   * Обработчик создания нового клуба.
   * После создания → закрываем модалку и делаем переход по slug.
   */
  const onCreate = async (payload: ClubCreateInput) => {
    const newClub = await createClub({
      name: payload.name,
      city: payload.city,
      director_id: payload.director_id,
    });

    setModalOpen(false);

    if (newClub?.slug) {
      router.push(`/admin/clubs/${newClub.slug}`);
    }
  };

  /**
   * Автоматический переход:
   * если у пользователя есть creatorId и ровно один клуб — редиректим сразу в него.
   */
  const isAdmin = user?.role === UserRole.TournamentAdmin && pathname.includes("/admin");

  // Автопереход в единственный клуб
  useEffect(() => {
    if (initialLoaded && !loading && isAdmin && clubs.length === 1) {
      router.replace(`/admin/clubs/${clubs[0].slug}`);
    }
  }, [initialLoaded, loading, isAdmin, clubs, router]);

  /**
   * Если это первый клуб и у пользователя есть creatorId —
   * показываем экран «создания клуба» вместо списка.
   */
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab");
  const className = user || tab ? "page-container-no-padding" : "page-container";

  // ClubsClient.tsx
  if (isAdmin && initialLoaded && clubs.length === 0 && !loading) {
    return (
      <div className={className}>
        <h1 className="page-title">Создание нового клуба...</h1>
        <div className="page-content-container">
          <ul className="card-grid-new">
            <AdminOnly>
              <ClubCard
                club={null}
                displayName={false}
                onClick={() => setModalOpen(true)}
              />
            </AdminOnly>
          </ul>

          <AddClubModal
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            onCreate={onCreate}
          />
        </div>
      </div>
    );
  }

  /**
   * Основной экран со списком клубов.
   */
  return (
    <div className={className}>
      <h1 className="page-title">Клубы</h1>

      <div className="page-content-container">
        {/* Панель поиска */}
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

        {/* Состояния загрузки / ошибки */}
        {loading && <p className="clubs-loading">Загрузка…</p>}
        {error && <p className="clubs-error">Ошибка: {error}</p>}

        {/* Список клубов */}
        <ul className="card-grid-new">
          {filtered.map((c) => (
            <li key={c.id}>
              <ClubCard
                club={c}
                displayName={true}
                onClick={() => isAdmin ? router.push(`/admin/clubs/${c.slug}`) : router.push(`/player/clubs/${c.slug}`)}
                onDelete={() => {
                  if (confirm(`Удалить клуб «${c.name}»?`)) {
                    void deleteClub(c.id);
                  }
                }}
              />
            </li>
          ))}
        </ul>

        {/* Модалка добавления нового клуба */}
        <AddClubModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onCreate={onCreate}
        />
      </div>
    </div>
  );
}