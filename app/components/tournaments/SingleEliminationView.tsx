"use client";

import { useMemo, useState } from "react";
import { useUser } from "@/app/components/UserContext";
import { Participant } from "@/app/models/Participant";
import { Match } from "@/app/models/Match";
import "./PyramidView.css";    // чипы/бейджи/карточки
import "./RoundRobinView.css"; // таблицы/гриды
import "@/app/components/ParticipantsView.css";
import { SaveIconButton, CancelIconButton } from "@/app/components/IconButtons";

type SingleEliminationViewProps = {
  participants: Participant[];
  matches: Match[];
  onSaveScore?: (aId: number, bId: number, score: string) => Promise<void> | void;
};

/** Валидный участник: либо одиночный игрок, либо пара */
function isValidParticipant(p: Participant | null | undefined): p is Participant {
  return !!p && (!!p.player || !!p.team);
}

/** Возвращает читаемое имя раунда по индексу и общему числу раундов */
function roundTitle(index: number, total: number) {
  const fromEnd = total - index;
  switch (fromEnd) {
    case 1: return "Финал";
    case 2: return "Полуфиналы";
    case 3: return "Четвертьфиналы";
    case 4: return "1/8 финала";
    case 5: return "1/16 финала";
    default: return `Раунд ${index + 1}`;
  }
}

/** Следующая степень двойки >= n */
function nextPow2(n: number) {
  if (n <= 1) return 1;
  let p = 1;
  while (p < n) p <<= 1;
  return p;
}

/** Счёт матча "6:3, 4:6, 10:8" или null, если матча нет */
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

/** Возвращает победителя пары, если он определён (счёт есть) или известен из BYE */
function getWinnerOfPair(
  a: Participant | null,
  b: Participant | null,
  matches: Match[],
  byId: Map<number, Participant>
): Participant | null {
  if (a && !b) return a;               // BYE
  if (!a && b) return b;               // BYE
  if (!a && !b) return null;

  const aId = a!.getId;
  const bId = b!.getId;
  const match = matches.find((m) => {
    const id1 = m.player1?.id ?? m.team1?.id;
    const id2 = m.player2?.id ?? m.team2?.id;
    return (id1 === aId && id2 === bId) || (id1 === bId && id2 === aId);
  });
  if (!match) return null;

  const wid = match.getWinnerId?.() ?? 0;
  if (!wid) return null;
  return byId.get(wid) ?? null;
}

/** Строит сетку олимпийки: массив раундов, каждый раунд = массив пар [A,B] */
function buildSingleEliminationRounds(
  base: Participant[],
  matches: Match[]
): (Array<[Participant | null, Participant | null]>)[] {
  // карта id -> Participant (и игроков, и пар)
  const byId = new Map<number, Participant>();
  for (const p of base) byId.set(p.getId, p);

  // 1) Паддинг до степени двойки
  const valid = base.slice();
  const size = nextPow2(valid.length || 1);
  while (valid.length < size) valid.push(null as unknown as Participant); // будем хранить как null

  // 2) Раунд 1: попарно [0,1], [2,3], ...
  const rounds: (Array<[Participant | null, Participant | null]>)[] = [];
  const first: Array<[Participant | null, Participant | null]> = [];
  for (let i = 0; i < valid.length; i += 2) {
    const a = (valid[i] ?? null) as Participant | null;
    const b = (valid[i + 1] ?? null) as Participant | null;
    first.push([a, b]);
  }
  rounds.push(first);

  // 3) Следующие раунды: победители двух соседних пар
  let prev = first;
  while (prev.length > 1) {
    const next: Array<[Participant | null, Participant | null]> = [];
    for (let i = 0; i < prev.length; i += 2) {
      const [a1, b1] = prev[i];
      const [a2, b2] = prev[i + 1] ?? [null, null];

      const w1 = getWinnerOfPair(a1, b1, matches, byId);
      const w2 = getWinnerOfPair(a2, b2, matches, byId);

      next.push([w1, w2]);
    }
    rounds.push(next);
    prev = next;
  }

  return rounds;
}

export function SingleEliminationView({
  participants,
  matches,
  onSaveScore,
}: SingleEliminationViewProps) {
  const { user } = useUser();
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>("");
  const [saving, setSaving] = useState(false);

  // стабильная сортировка входных участников по отображаемому имени
  const ordered = useMemo(
    () =>
      participants
        .filter(isValidParticipant)
        .slice()
        .sort((a, b) =>
          a.displayName(false).localeCompare(
            b.displayName(false),
            "ru"
          )
        ),
    [participants, user?.role]
  );

  const rounds = useMemo(
    () => buildSingleEliminationRounds(ordered, matches),
    [ordered, matches]
  );

  const pairKey = (aId: number, bId: number) =>
    `${Math.min(aId, bId)}_${Math.max(aId, bId)}`;

  function isValidScoreFormat(s: string) {
    const trimmed = s.trim();
    if (!trimmed) return false;
    const setRe = /^\s*\d+\s*[:-]\s*\d+\s*$/;
    return trimmed.split(",").every((part) => setRe.test(part.trim()));
  }

  function startEdit(aId: number, bId: number, currentScore: string | null) {
    setEditingKey(pairKey(aId, bId));
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

  function NameCell({ p }: { p: Participant | null }) {
    if (!p) return <span className="chip name-one-line name-muted">BYE</span>;
    if (p.player) {
      return (
        <span className="chip name-one-line" title={`ID: ${p.player.id}`}>
          {p.player.name}
        </span>
      );
    }
    const a = p.team?.player1?.name ?? "??";
    const b = p.team?.player2?.name ?? "??";
    return (
      <span className="chip name-stack" title={`ID: ${p.team?.id}`}>
        <span className="name-line">{a}</span>
        <span className="name-line">{b}</span>
      </span>
    );
  }

  const totalRounds = rounds.length;

  return (
    <div className="roundrobin-wrap">
      {/* колонки по раундам */}
      <div className="rounds-grid se-grid">
        {rounds.map((pairs, rIndex) => (
          <div key={rIndex} className="card">
            <div className="history-table-head">
              <strong>{roundTitle(rIndex, totalRounds)}</strong>
            </div>

            <table className="round-table">
              <thead>
                <tr className="grid-row">
                  <th>Игрок / Пара</th>
                  <th>Счёт</th>
                  <th>Игрок / Пара</th>
                </tr>
              </thead>

              <tbody>
                {pairs.map(([pa, pb], i) => {
                  const aId = pa?.getId ?? 0;
                  const bId = pb?.getId ?? 0;

                  const bothPresent = !!pa && !!pb;
                  const score = bothPresent ? getMatchScore(aId, bId, matches) : null;
                  const k = bothPresent ? pairKey(aId, bId) : `${rIndex}_${i}_bye`;
                  const isEditing = editingKey === k;

                  // BYE-пара: сразу показываем, кто проходит
                  const byeNote =
                    (!pa && pb) ? "Проходит вправо" :
                    (pa && !pb) ? "Проходит вправо" : null;

                  return (
                    <tr key={i} className={`grid-row ${isEditing ? "editing-row" : ""}`}>
                      <td><NameCell p={pa} /></td>

                      <td className="score-cell">
                        {bothPresent ? (
                          score ? (
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
                                className="score-input"
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                placeholder="6-4, 4-6, 10-8"
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
                          )
                        ) : (
                          <span className="badge badge-muted">{byeNote ?? "—"}</span>
                        )}
                      </td>

                      <td><NameCell p={pb} /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SingleEliminationView;