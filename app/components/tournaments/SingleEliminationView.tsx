"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { useUser } from "@/app/components/UserContext";
import { Participant } from "@/app/models/Participant";
import { Match, PhaseType } from "@/app/models/Match";
import { useFirstHelpTooltip } from "@/app/hooks/useFirstHelpTooltip";

import "./PyramidView.css";    // чипы/бейджи/карточки
import "./RoundRobinView.css"; // таблицы/гриды
import "@/app/components/ParticipantsView.css";
import { SaveIconButton, CancelIconButton } from "@/app/components/controls/IconButtons";

/* ========================================================================== */
/*                                   TYPES                                    */
/* ========================================================================== */

type SingleEliminationViewProps = {
  participants: Participant[];
  matches: Match[];
  onSaveScore?: (
    aId: number,
    bId: number,
    score: string,
    meta?: { phase: PhaseType; groupIndex?: number | null; roundIndex?: number | null }
  ) => Promise<void> | void;
};

/* ========================================================================== */
/*                               PURE HELPERS                                 */
/* ========================================================================== */

/** Валидный участник: либо одиночный игрок, либо пара */
function isValidParticipant(p: Participant | null | undefined): p is Participant {
  return !!p && (!!p.player || !!p.team);
}

/** Следующая степень двойки >= n */
function nextPow2(n: number) {
  if (n <= 1) return 1;
  let p = 1;
  while (p < n) p <<= 1;
  return p;
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

/** Найти матч между участниками с учётом фазы/раунда (если проставлены в модели Match) */
function findMatchBetweenWithPhase(
  aId: number,
  bId: number,
  matches: Match[],
  meta?: { phase?: PhaseType; roundIndex?: number | null }
): Match | undefined {
  return matches.find((m) => {
    const id1 = m.player1?.id ?? m.team1?.id ?? 0;
    const id2 = m.player2?.id ?? m.team2?.id ?? 0;
    const samePair = (id1 === aId && id2 === bId) || (id1 === bId && id2 === aId);
    if (!samePair) return false;

    if (meta?.phase && (m as any).phase !== meta.phase) return false;
    if (meta?.phase === PhaseType.Playoff && meta.roundIndex != null) {
      if (((m as any).roundIndex ?? null) !== (meta.roundIndex ?? null)) return false;
    }
    return true;
  });
}

/** Счёт матча "6:3, 4:6, 10:8" или null, если матча нет */
function getMatchScore(
  aId: number,
  bId: number,
  matches: Match[],
  meta?: { phase?: PhaseType; roundIndex?: number | null }
): string | null {
  const match = findMatchBetweenWithPhase(aId, bId, matches, meta);
  if (!match) return null;
  if (match.scores && match.scores.length > 0) {
    return match.scores.map(([s1, s2]) => `${s1}:${s2}`).join(", ");
  }
  return "—";
}

/** Вернуть победителя пары, если он определён (счёт есть). BYE допускаем только если allowBye=true */
function getWinnerOfPair(
  a: Participant | null,
  b: Participant | null,
  matches: Match[],
  byId: Map<number, Participant>,
  allowBye: boolean,
  metaForPhase?: { phase?: PhaseType; roundIndex?: number | null }
): Participant | null {
  if (allowBye) {
    if (a && !b) return a;               // BYE только на первом переходе
    if (!a && b) return b;
  }
  if (!a || !b) return null;

  const aId = a.getId;
  const bId = b.getId;
  const match = findMatchBetweenWithPhase(aId, bId, matches, metaForPhase);
  if (!match) return null;

  const wid = match.getWinnerId?.() ?? 0;
  if (!wid) return null;
  return byId.get(wid) ?? null;
}

/** Строит сетку олимпийки: массив раундов, каждый раунд = массив пар [A,B]
 *  — BYE учитывается ТОЛЬКО на переходе из 1-го раунда (R1) в следующий
 */
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
  let layer = 1; // переход из R1 -> R2 = layer 1
  while (prev.length > 1) {
    const next: Array<[Participant | null, Participant | null]> = [];
    for (let i = 0; i < prev.length; i += 2) {
      const [a1, b1] = prev[i];
      const [a2, b2] = prev[i + 1] ?? [null, null];

      // ✅ BYE работает только на первом переходе (из R1 в R2)
      const allowBye = (layer === 1);

      const winnerLeft  = getWinnerOfPair(a1, b1, matches, byId, allowBye, { phase: PhaseType.Playoff, roundIndex: layer - 1 });
      const winnerRight = getWinnerOfPair(a2, b2, matches, byId, allowBye, { phase: PhaseType.Playoff, roundIndex: layer - 1 });

      next.push([winnerLeft, winnerRight]);
    }
    rounds.push(next);
    prev = next;
    layer += 1;
  }

  return rounds;
}

/* ========================================================================== */
/*                              MAIN COMPONENT UI                              */
/* ========================================================================== */

export function SingleEliminationView({
  participants,
  matches,
  onSaveScore,
}: SingleEliminationViewProps) {
  const { user } = useUser();
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const editingInputRef = useRef<HTMLInputElement | null>(null);
  const firstHelpTooltip = useFirstHelpTooltip();

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
    [participants]
  );

  const rounds = useMemo(
    () => buildSingleEliminationRounds(ordered, matches),
    [ordered, matches]
  );

  const totalRounds = rounds.length;

  const pairKey = useCallback((aId: number, bId: number) =>
    `${Math.min(aId, bId)}_${Math.max(aId, bId)}`
  , []);

  const isValidScoreFormat = useCallback((s: string) => {
    const trimmed = s.trim();
    if (!trimmed) return false;
    const setRe = /^\s*\d+\s*[:-]\s*\d+\s*$/;
    return trimmed.split(",").every((part) => setRe.test(part.trim()));
  }, []);

  const startEdit = useCallback((aId: number, bId: number, currentScore: string | null) => {
    setEditingKey(pairKey(aId, bId));
    setEditValue(currentScore && currentScore !== "—" ? currentScore : "");
    editingInputRef.current = null;
  }, [pairKey, editingInputRef]);

  const cancelEdit = useCallback(() => {
    setEditingKey(null);
    setEditValue("");
    editingInputRef.current = null;
  }, [editingInputRef]);

  const saveEdit = useCallback(async (aId: number, bId: number, roundIndex: number, raw?: string) => {
    const nextValue = (raw ?? editingInputRef.current?.value ?? editValue).trim();
    if (!isValidScoreFormat(nextValue)) {
      alert('Неверный формат счёта. Пример: "6-4, 4-6, 10-8"');
      return;
    }
    try {
      setSaving(true);
      // Передаём в onSaveScore мета о фазе/раунде, чтобы не путаться с групповыми матчами
      await onSaveScore?.(aId, bId, nextValue, {
        phase: PhaseType.Playoff,
        groupIndex: null,
        roundIndex,
      });
      setEditingKey(null);
      setEditValue("");
      editingInputRef.current = null;
    } finally {
      setSaving(false);
    }
  }, [editValue, editingInputRef, isValidScoreFormat, onSaveScore]);

  /** Имя участника: null -> BYE (только в 1-м раунде), выше — "Ожидается" */
  function NameCell({ p, nullText }: { p: Participant | null; nullText: string }) {
    if (!p) return <span className="player name-muted">{nullText}</span>;
    return <span className="player">{p.displayName(false)}</span>;
  }

  return (
    <div className="roundrobin-wrap">
      {/* колонки по раундам */}
      <div className="rounds-grid se-grid">
        {rounds.map((pairs, rIndex) => {
          const isInitialRound = rIndex === 0;
          const nullText = isInitialRound ? "BYE" : "Ожидается";

          return (
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
                    const score = bothPresent
                      ? getMatchScore(aId, bId, matches, { phase: PhaseType.Playoff, roundIndex: rIndex })
                      : null;

                    const k = bothPresent ? pairKey(aId, bId) : `${rIndex}_${i}_empty`;
                    const isEditing = editingKey === k;
                    const shouldShowHelpTooltip = bothPresent && !score && !isEditing && firstHelpTooltip();

                    return (
                      <tr key={i} className={`grid-row ${isEditing ? "editing-row" : ""}`}>
                        <td><NameCell p={pa} nullText={nullText} /></td>

                        <td className="score-cell">
                          {bothPresent ? (
                            score ? (
                              <span className="badge">{score}</span>
                            ) : !isEditing ? (
                              <div className="score-cell__button-wrap">
                                {shouldShowHelpTooltip && (
                                  <div className="help-tooltip">Введите счёт</div>
                                )}
                                <button
                                  type="button"
                                  className="vs vs-click"
                                  onClick={() => startEdit(aId, bId, score)}
                                  title="Добавить счёт"
                                  aria-label="Добавить счёт"
                                >
                                  vs
                                </button>
                              </div>
                            ) : (
                              <div className="score-edit-wrap">
                                  <input
                                    className="input score-input"
                                    defaultValue={editValue}
                                    ref={(node) => {
                                      editingInputRef.current = node;
                                    }}
                                    placeholder="6-4, 4-6, 10-8"
                                    pattern="[0-9\\s,:-]*"
                                    autoFocus
                                    onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                      e.preventDefault();
                                      void saveEdit(aId, bId, rIndex);
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
                                  onClick={() => saveEdit(aId, bId, rIndex)}
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
                            // ✅ как в GroupPlusPlayoffView: placeholder "vs"
                            <span className="vs vs-placeholder" aria-hidden>vs</span>
                          )}
                        </td>

                        <td><NameCell p={pb} nullText={nullText} /></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default SingleEliminationView;
