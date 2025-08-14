"use client";

import { useMemo, useState } from "react";
import { Participant } from "@/app/models/Participant";
import { Match } from "@/app/models/Match";
import "./PyramidView.css";    // чипы/бейджи/карточки
import "./RoundRobinView.css"; // таблица кругового турнира
import "./TeamsTable.css";     // стиль .icon-btn, .danger, .lg
import { SaveIconButton, CancelIconButton } from "./IconButtons";

type RoundRobinViewProps = {
  participants: Participant[];
  matches: Match[]; // уже существующие матчи (чтобы показать счёт)
  onSaveScore?: (aId: number, bId: number, score: string) => Promise<void> | void; // колбэк сохранения счёта
};

type Unit = { id: number; name: string };

function unitFromParticipant(p: Participant): Unit | null {
  if (p.player) return { id: p.player.id, name: p.player.name };
  if (p.team)
    return {
      id: p.team.id,
      name: `${p.team.player1?.name ?? "??"} + ${p.team.player2?.name ?? "??"}`,
    };
  return null;
}

/** "Circle method" — строим расписание */
function buildRoundRobin(units: Unit[]): Unit[][][] {
  const list: (Unit | null)[] = units.map((u) => u);
  if (list.length % 2 === 1) list.push(null); // BYE

  const n = list.length;
  const roundsCount = n - 1;
  const rounds: Unit[][][] = [];

  for (let r = 0; r < roundsCount; r++) {
    const pairs: Unit[][] = [];
    for (let i = 0; i < n / 2; i++) {
      const a = list[i];
      const b = list[n - 1 - i];
      if (a && b) pairs.push([a, b]); // пары с BYE пропускаем
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

  const units = useMemo(
    () =>
      participants
        .map(unitFromParticipant)
        .filter((u): u is Unit => !!u)
        .sort((a, b) => a.name.localeCompare(b.name, "ru")),
    [participants]
  );

  const rounds = useMemo(() => buildRoundRobin(units), [units]);

  const pairKey = (a: number, b: number) => `${Math.min(a, b)}_${Math.max(a, b)}`;

  function isValidScoreFormat(s: string) {
    const trimmed = s.trim();
    if (!trimmed) return false;
    const setRe = /^\s*\d+\s*[:\-]\s*\d+\s*$/; // "6:4" или "6-4"
    return trimmed.split(",").every((part) => setRe.test(part.trim()));
  }

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
    if (!isValidScoreFormat(editValue)) {
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

  return (
    <div className="roundrobin-wrap">
      <div className="rounds-grid">
        {rounds.map((pairs, rIndex) => (
          <div key={rIndex} className="card">
            <div className="history-table-head">
              <strong>Раунд {rIndex + 1}</strong>
            </div>

            <table className="round-table">
              <colgroup>
                <col className="col-left" />
                <col className="col-score" />
                <col className="col-right" />
              </colgroup>

              <thead>
                <tr>
                  <th>Игрок</th>
                  <th>Счёт</th>
                  <th>Игрок</th>
                </tr>
              </thead>

              <tbody>
                {pairs.length > 0 ? (
                  pairs.map(([a, b], i) => {
                    const score = getMatchScore(a.id, b.id, matches);
                    const k = pairKey(a.id, b.id);
                    const isEditing = editingKey === k;

                    return (
                      <tr key={i}>
                        <td>
                          <span className="chip" title={`ID: ${a.id}`}>
                            {a.name}
                          </span>
                        </td>

                        <td className="score-cell">
                          {score ? (
                            <span className="badge">{score}</span>
                          ) : !isEditing ? (
                            <button
                              type="button"
                              className="vs vs-click"
                              onClick={() => startEdit(a.id, b.id, score)}
                              title="Добавить счёт"
                              aria-label="Добавить счёт"
                            >
                              vs
                            </button>
                          ) : (
                            <div className="score-edit-wrap">
                              <span className="vs vs-static">vs</span>

                              <input
                                className="score-input"
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                placeholder="6-4, 4-6, 10-8"
                                autoFocus
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    e.preventDefault();
                                    saveEdit(a.id, b.id);
                                  }
                                  if (e.key === "Escape") {
                                    e.preventDefault();
                                    cancelEdit();
                                  }
                                }}
                              />

                              {/* Сохранить */}
                              <SaveIconButton
                                className="lg"
                                title="Сохранить счёт"
                                aria-label="Сохранить счёт"
                                onClick={() => saveEdit(a.id, b.id)}
                                disabled={saving}
                              />

                              {/* Отмена */}
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
                          <span className="chip" title={`ID: ${b.id}`}>
                            {b.name}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
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