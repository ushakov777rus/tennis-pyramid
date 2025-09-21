"use client";

import { useMemo, useState } from "react";
import "@/app/components/matches/MatchHistoryView.css";

import { Match } from "@/app/models/Match";
import { MatchCard } from "@/app/components/matches/MatchCard";

type MatchHistoryViewProps = {
  matches: Match[];
  onEditMatch?: (match: Match) => void;
  onDeleteMatch?: (match: Match) => void;
};

export function MatchHistoryView({
  matches,
  onEditMatch,
  onDeleteMatch,
}: MatchHistoryViewProps) {
  // --- локальное состояние для редактирования (на будущее оставляем)
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editDate, setEditDate] = useState<string>("");
  const [editScore, setEditScore] = useState<string>("");

  // --- строка поиска
  const [q, setQ] = useState("");

  // нормализатор строки (убираем регистр и пробелы по краям)
  const norm = (s: string | null | undefined) => (s ?? "").trim().toLowerCase();

  // получаем «отображаемые имена» сторон матча (поддержка одиночного/парного)
  const sideName = (m: Match, side: 1 | 2) => {
    if (m.type === "double") {
      return side === 1 ? m.team1?.displayName(false) : m.team2?.displayName(false);
    }
    return side === 1 ? m.player1?.displayName(false) : m.player2?.displayName(false);
  };

  // --- фильтрация матчей по строке поиска: ищем по имени любой стороны
  const filtered = useMemo(() => {
    const qn = norm(q);
    if (!qn) return matches;
    return matches.filter((m) => {
      const n1 = norm(sideName(m, 1));
      const n2 = norm(sideName(m, 2));
      return n1.includes(qn) || n2.includes(qn);
    });
  }, [matches, q]);

  if (matches.length === 0) return <p className="history-empty">Матчей пока нет</p>;

  // ---- вспомогательные: редактирование/удаление (оставлены без изменений)
  const startEditing = (m: Match) => {
    setEditingId(m.id);
    setEditDate(new Date(m.date as any).toISOString().split("T")[0]);
    setEditScore(m.formatResult());
  };
  const cancelEditing = () => {
    setEditingId(null);
    setEditDate("");
    setEditScore("");
  };
  const confirmDelete = (m: Match) => onDeleteMatch?.(m);

  return (
    <div className="page-content-container">
      {/* Панель поиска */}
      <div className="card page-toolbar">
        <input
          className="input input-100"
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Поиск по игрокам/командам…"
          aria-label="Поиск по игрокам или командам"
        />
      </div>

      {/* Грид карточек матчей */}
      <div className="card-grid-new">
        {filtered.map((m) => (
          <MatchCard
            key={m.id}
            match={m}
            onDelete={() => confirmDelete(m)}
          />
        ))}
      </div>
    </div>
  );
}