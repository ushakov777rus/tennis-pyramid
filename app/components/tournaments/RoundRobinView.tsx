"use client";

import { useMemo, useState } from "react";
import { Participant } from "@/app/models/Participant";
import { Match } from "@/app/models/Match";
import { SaveIconButton, CancelIconButton } from "@/app/components/controls/IconButtons";

import "./PyramidView.css";    // чипы/бейджи/карточки
import "./RoundRobinView.css"; // таблица кругового турнира (grid-строки)
import "@/app/components/ParticipantsView.css";

type RoundRobinViewProps = {
  participants: Participant[];
  matches: Match[];
  onSaveScore?: (aId: number, bId: number, score: string) => Promise<void> | void;
};

/** Валидный участник: либо одиночный игрок, либо пара */
function isValidParticipant(p: Participant | null | undefined): p is Participant {
  return !!p && (!!p.player || !!p.team);
}

/** Строим расписание (circle method) по целым Participant */
function buildRoundRobin(units: Participant[]): Participant[][][] {
  const list: (Participant | null)[] = units.map((u) => u);
  if (list.length % 2 === 1) list.push(null); // BYE

  const n = list.length;
  const roundsCount = n - 1;
  const rounds: Participant[][][] = [];

  for (let r = 0; r < roundsCount; r++) {
    const pairs: Participant[][] = [];
    for (let i = 0; i < n / 2; i++) {
      const a = list[i];
      const b = list[n - 1 - i];
      if (a && b) pairs.push([a, b]); // BYE пропускаем
    }
    rounds.push(pairs);

    // ротация: фиксируем 0-й, остальное крутим вправо
    const fixed = list[0];
    const tail = list.slice(1);
    tail.unshift(tail.pop()!);
    list.splice(0, list.length, fixed, ...tail);
  }

  return rounds;
}

/** Отформатированный счёт "6:3, 4:6, 10:8" или null, если матча нет */
function getMatchScore(aId: number, bId: number, matches: Match[]): string | null {
  const match = matches.find((m) => {
    const id1 = m.player1?.id ?? m.team1?.id;
    const id2 = m.player2?.id ?? m.team2?.id;
    return (id1 === aId && id2 === bId) || (id1 === bId && id2 === aId);
  });
  if (!match) return null;

  if (match.scores && match.scores.length > 0) {
    return match.scores.map(([s1, s2]) => `${s1}:${s2}`).join(", ");
  }
  return "—";
}

export function RoundRobinView({ participants, matches, onSaveScore }: RoundRobinViewProps) {
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>("");
  const [saving, setSaving] = useState(false);

  // берём только валидных участников и стабильно сортируем по имени/именам
  const ordered = useMemo(
    () =>
      participants
        .filter(isValidParticipant)
        .slice()
        .sort((a, b) => a.displayName(false).localeCompare(b.displayName(false), "ru")),
    [participants]
  );

  const rounds = useMemo(() => buildRoundRobin(ordered), [ordered]);

  // ключ пары (порядок не важен)
  const pairKey = (aId: number, bId: number) => `${Math.min(aId, bId)}_${Math.max(aId, bId)}`;

  function startEdit(aId: number, bId: number, currentScore: string | null) {
    const k = pairKey(aId, bId);
    setEditingKey(k);
    setEditValue(currentScore && currentScore !== "—" ? currentScore : "");
  }

  function cancelEdit() {
    setEditingKey(null);
    setEditValue("");
  }

  async function saveEdit(aId: number, bId: number) {
    if (!Match.isValidScoreFormat(editValue)) {
      alert('Неверный формат счёта. Пример: "6-4, 4-6, 10-8"');
      return;
    }
    try {
      setSaving(true);
      await onSaveScore?.(aId, bId, editValue.trim());
      setEditingKey(null);
      setEditValue("");
    } finally {
      setSaving(false);
    }
  }

  // Рендер имени: одиночка — одна строка; пара — два имени столбиком
  function NameCell({ p }: { p: Participant }) {
    return <span className="player">{p.displayName(false)}</span>;
  }

  return (
    <div className="roundrobin-wrap">
      <div className="rounds-grid">
        {rounds.map((pairs, rIndex) => (
          <div key={rIndex} className="card">
            <div className="history-table-head">
              <strong>Раунд {rIndex + 1}</strong>
            </div>

            <table className="round-table">

              <tbody>
                {pairs.length > 0 ? (
                  pairs.map(([pa, pb], i) => {
                    const aId = pa.getId;
                    const bId = pb.getId;
                    const score = getMatchScore(aId, bId, matches);
                    const k = pairKey(aId, bId);
                    const isEditing = editingKey === k;

                    return (
                      <tr key={i} className={`grid-row ${isEditing ? "editing-row" : ""}`}>
                        <td>
                          <NameCell p={pa} />
                        </td>

                        <td className="score-cell">
                          {score ? (
                            <span className="badge">{score}</span>
                          ) : !isEditing ? (
                            <button
                              type="button"
                              className="vs vs-click"
                              onClick={() => startEdit(aId, bId, score)}
                              title="Добавить счёт"
                              aria-label="Добавить счёт"
                            >
                              vs
                            </button>
                          ) : (
                            <div className="score-edit-wrap">
                              <input
                                className="input score-input"
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                placeholder="6-4, 4-6, 10-8"
                                pattern="\d*"
                                autoFocus
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    e.preventDefault();
                                    saveEdit(aId, bId);
                                  }
                                  if (e.key === "Escape") {
                                    e.preventDefault();
                                    cancelEdit();
                                  }
                                }}
                              />

                              <SaveIconButton
                                className="lg"
                                title="Сохранить счёт"
                                aria-label="Сохранить счёт"
                                onClick={() => saveEdit(aId, bId)}
                                disabled={saving}
                              />

                              <CancelIconButton
                                className="lg"
                                title="Отмена"
                                aria-label="Отмена"
                                onClick={cancelEdit}
                                disabled={saving}
                              />
                            </div>
                          )}
                        </td>

                        <td>
                          <NameCell p={pb} />
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr className="grid-row">
                    <td colSpan={3} className="history-empty">
                      В этом раунде нет пар (BYE).
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
}
