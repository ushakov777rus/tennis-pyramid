"use client";

import { useMemo, useRef, useState } from "react";

import { Participant } from "@/app/models/Participant";
import { Match, PhaseType } from "@/app/models/Match";

import { SaveIconButton, CancelIconButton } from "@/app/components/controls/IconButtons";
import { useFirstHelpTooltip } from "@/app/hooks/useFirstHelpTooltip";
import { ScoreKeyboard, useScoreKeyboardAvailable } from "@/app/components/controls/ScoreKeyboard";

import "./PyramidView.css";
import "./RoundRobinView.css";
import "@/app/components/ParticipantsView.css";

type DoubleEliminationViewProps = {
  participants: Participant[];
  matches: Match[];
  onSaveScore?: (
    aId: number,
    bId: number,
    score: string,
    meta?: { phase: PhaseType; groupIndex?: number | null; roundIndex?: number | null }
  ) => Promise<void> | void;
};

/* ---------- Утилиты ---------- */

function isValidParticipant(p: Participant | null | undefined): p is Participant {
  return !!p && (!!p.player || !!p.team);
}

function pid(p: Participant | null | undefined): number | null {
  return p ? p.getId : null;
}

function nextPow2(n: number) {
  let p = 1;
  while (p < n) p <<= 1;
  return p;
}

const BRACKET_GROUP_WB = 0;
const BRACKET_GROUP_LB = 1;
const BRACKET_GROUP_GF = 2;

type PhaseMeta = { phase?: PhaseType; roundIndex?: number | null; groupIndex?: number | null };

function findMatchBetween(aId: number, bId: number, matches: Match[], meta?: PhaseMeta): Match | undefined {
  const tryFind = (useMeta: boolean) =>
    matches.find((m) => {
      const id1 = m.player1?.id ?? m.team1?.id ?? 0;
      const id2 = m.player2?.id ?? m.team2?.id ?? 0;
      const samePair = (id1 === aId && id2 === bId) || (id1 === bId && id2 === aId);
      if (!samePair) return false;
      if (!useMeta || !meta) return true;
      if (meta.phase && (m as any).phase !== meta.phase) return false;
      if (meta.groupIndex != null && ((m as any).groupIndex ?? null) !== meta.groupIndex) return false;
      if (meta.roundIndex != null && ((m as any).roundIndex ?? null) !== meta.roundIndex) return false;
      return true;
    });

  if (meta) {
    const matchWithMeta = tryFind(true);
    if (matchWithMeta) return matchWithMeta;
  }
  return tryFind(false);
}

function getMatchScore(aId: number, bId: number, matches: Match[], meta?: PhaseMeta): string | null {
  const match = findMatchBetween(aId, bId, matches, meta);
  if (!match) return null;
  if (match.scores && match.scores.length > 0) {
    return match.scores.map(([s1, s2]) => `${s1}:${s2}`).join(", ");
  }
  return "—";
}

function isValidScoreFormat(s: string) {
  const trimmed = s.trim();
  if (!trimmed) return false;
  const setRe = /^\s*\d+\s*[:-]\s*\d+\s*$/;
  return trimmed.split(",").every((part) => setRe.test(part.trim()));
}

function NameCell({ p, nullText }: { p: Participant | null; nullText: string }) {
  if (!p) return <span className="player muted">{nullText}</span>;
  return <span className="player">{p.displayName(false)}</span>;
}

/* ---------- Построение Winners Bracket как в Single Elim ---------- */

function buildWB(ordered: Participant[]) {
  const size = nextPow2(ordered.length || 1);
  const padded: (Participant | null)[] = ordered.slice();
  while (padded.length < size) padded.push(null);

  const r0: Array<[Participant | null, Participant | null]> = [];
  for (let i = 0; i < size; i += 2) r0.push([padded[i], padded[i + 1]]);

  const rounds: Array<Array<[Participant | null, Participant | null]>> = [r0];
  let cur = r0.length;
  while (cur > 1) {
    rounds.push(new Array(cur / 2).fill(null).map(() => [null, null]));
    cur = cur / 2;
  }
  return rounds;
}

/* Победитель/проигравший пары; BYE учитываем опционально (allowBye) */
function resultOfPair(
  a: Participant | null,
  b: Participant | null,
  matches: Match[],
  allowBye: boolean
): { winnerId: number | null; loserId: number | null } {
  const aId = pid(a);
  const bId = pid(b);

  if (allowBye) {
    if (aId && !bId) return { winnerId: aId, loserId: null };
    if (!aId && bId) return { winnerId: bId, loserId: null };
  }
  if (!aId || !bId) return { winnerId: null, loserId: null };

  const m = findMatchBetween(aId, bId, matches);
  if (!m) return { winnerId: null, loserId: null };
  const w = m.getWinnerId?.();
  if (!w || w <= 0) return { winnerId: null, loserId: null };
  const l = w === aId ? bId : aId;
  return { winnerId: w, loserId: l ?? null };
}

/* ---------- Главный компонент Double Elimination ---------- */

export function DoubleEliminationView({
  participants,
  matches,
  onSaveScore,
}: DoubleEliminationViewProps) {
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const mobileKeyboardAvailable = useScoreKeyboardAvailable();
  const [mobileKeyboardContext, setMobileKeyboardContext] = useState<{
    aId: number;
    bId: number;
    meta?: { phase: PhaseType; groupIndex: number | null; roundIndex: number | null };
  } | null>(null);
  const editingInputRef = useRef<HTMLInputElement | HTMLDivElement | null>(null);
  const firstHelpTooltip = useFirstHelpTooltip();

  const ordered = useMemo(
    () =>
      participants
        .filter(isValidParticipant)
        .slice()
        .sort((a, b) => a.displayName(false).localeCompare(b.displayName(false), "ru")),
    [participants]
  );

  const wb = useMemo(() => buildWB(ordered), [ordered]);

  /* Заполняем WB победителями как в single-elim.
     BYE допускаем только при переходе из R1 в R2 (т.е. когда r === 1).
     Параллельно собираем лузеров WB по раундам. */
  const { resolvedWB, wbLosersByRound, wbWinnerId } = useMemo(() => {
    const wbCopy = wb.map((r) => r.map(([a, b]) => [a, b] as [Participant | null, Participant | null]));
    const losersByRound: number[][] = [];

    const pushUnique = (bucket: number[], value: number | null | undefined) => {
      if (!value) return;
      if (!bucket.includes(value)) bucket.push(value);
    };

    for (let r = 0; r < wbCopy.length; r++) {
      losersByRound[r] = [];

      if (r === 0) {
        // стартовый раунд уже содержит пары; лузеров дополним ниже (по внесённым результатам)
      } else {
        // победители предыдущего раунда -> текущий
        const prev = wbCopy[r - 1];
        const allowBye = (r === 1); // ✅ BYE только на переходе из R0 в R1
        for (let i = 0; i < wbCopy[r].length; i++) {
          const m1 = resultOfPair(prev[i * 2][0], prev[i * 2][1], matches, allowBye);
          const m2 = resultOfPair(prev[i * 2 + 1][0], prev[i * 2 + 1][1], matches, allowBye);
          wbCopy[r][i][0] = m1.winnerId ? ordered.find((p) => p.getId === m1.winnerId) ?? null : null;
          wbCopy[r][i][1] = m2.winnerId ? ordered.find((p) => p.getId === m2.winnerId) ?? null : null;

          // лузеры предыдущего раунда (если определились по результату, не по BYE)
          pushUnique(losersByRound[r - 1], m1.loserId);
          pushUnique(losersByRound[r - 1], m2.loserId);
        }
      }

      // Для R0 соберём лузеров после того, как внесены результаты R0
      if (r === 0) {
        const allowByeR0 = true; // для исходных BYE
        for (let i = 0; i < wbCopy[0].length; i++) {
          const m0 = resultOfPair(wbCopy[0][i][0], wbCopy[0][i][1], matches, allowByeR0);
          if (!losersByRound[0]) losersByRound[0] = [];
          pushUnique(losersByRound[0], m0.loserId);
        }
      }
    }

    const lastRound = wbCopy[wbCopy.length - 1];
    const finalPair = lastRound[0];
    const finalRes = resultOfPair(finalPair[0], finalPair[1], matches, false);

    return {
      resolvedWB: wbCopy,
      wbLosersByRound: losersByRound,
      wbWinnerId: finalRes.winnerId ?? null,
    };
  }, [wb, matches, ordered]);

  /* Строим LB универсально:
     LB[0] = лузеры WB[0] попарно.
     Для r>=1: entrants = победители LB[r-1] + лузеры WB[r]. */
  const resolvedLB = useMemo(() => {
    const rounds: Array<Array<[Participant | null, Participant | null]>> = [];
    const idToP = new Map<number, Participant>();
    ordered.forEach((p) => idToP.set(p.getId, p));

    const pairWinnerId = (a: Participant | null, b: Participant | null): number | null => {
      const aId = pid(a);
      const bId = pid(b);
      if (aId && !bId) return aId;   // автопроход: это не BYE-паддинг, это натуральное «одиночное» место
      if (!aId && bId) return bId;
      if (!aId || !bId) return null;
      const m = findMatchBetween(aId, bId, matches);
      if (!m) return null;
      const w = m.getWinnerId?.();
      return w && w > 0 ? w : null;
    };

    const lbWinnersCacheByRound: number[][] = [];

    for (let r = 0; r < wbLosersByRound.length; r++) {
      const lbPairs: Array<[Participant | null, Participant | null]> = [];

      if (r === 0) {
        const entrants = wbLosersByRound[0] ?? [];
        for (let i = 0; i < entrants.length; i += 2) {
          const a = idToP.get(entrants[i]) ?? null;
          const b = idToP.get(entrants[i + 1]) ?? null;
          lbPairs.push([a, b]);
        }
      } else {
        const winnersQueue = [...(lbWinnersCacheByRound[r - 1] ?? [])];
        const losersQueue = [...(wbLosersByRound[r] ?? [])];

        while (winnersQueue.length && losersQueue.length) {
          const a = idToP.get(winnersQueue.shift()!) ?? null;
          const b = idToP.get(losersQueue.shift()!) ?? null;
          lbPairs.push([a, b]);
        }

        const remainder = [...winnersQueue, ...losersQueue];
        for (let i = 0; i < remainder.length; i += 2) {
          const a = idToP.get(remainder[i]) ?? null;
          const b = idToP.get(remainder[i + 1]) ?? null;
          lbPairs.push([a, b]);
        }
      }

      rounds.push(lbPairs);

      const winners: number[] = [];
      for (const [a, b] of lbPairs) {
        const w = pairWinnerId(a, b);
        if (w) winners.push(w);
      }
      lbWinnersCacheByRound[r] = winners;
    }

    console.log("resolvedLB 1",rounds);

    // Схлопываем победителей LB до одного
    let curWinners = resolvedArrayLast(lbWinnersCacheByRound) ?? [];
    while (curWinners.length > 1) {
      const extraPairs: Array<[Participant | null, Participant | null]> = [];
      for (let i = 0; i < curWinners.length; i += 2) {
        const a = idToP.get(curWinners[i]) ?? null;
        const b = idToP.get(curWinners[i + 1]) ?? null;
        extraPairs.push([a, b]);
      }
      rounds.push(extraPairs);

      const nextWinners: number[] = [];
      for (const [a, b] of extraPairs) {
        const w = pairWinnerId(a, b);
        if (w) nextWinners.push(w);
      }
      curWinners = nextWinners;
    }

console.log("resolvedLB 2",rounds);

    return rounds;
  }, [ordered, matches, wbLosersByRound]);

  // Победитель LB (если уже определён)
  const lbWinnerId = useMemo(() => {
    if (resolvedLB.length === 0) return null;
    const last = resolvedLB[resolvedLB.length - 1];
    if (last.length !== 1) return null;
    const [a, b] = last[0];
    const aId = pid(a);
    const bId = pid(b);
    if (!aId || !bId) return null;
    const m = findMatchBetween(aId, bId, matches);
    if (!m) return null;
    const w = m.getWinnerId?.();
    return w && w > 0 ? w : null;
  }, [resolvedLB, matches]);

  /* Финалы:
     - GF1: WB winner vs LB winner
     - GF2 (reset): опциональный второй матч
  */
  const finalsPairs = useMemo(() => {
    const idToP = new Map<number, Participant>();
    ordered.forEach((p) => idToP.set(p.getId, p));

    const wbWinner = wbWinnerId ? idToP.get(wbWinnerId) ?? null : null;
    const lbWinner = lbWinnerId ? idToP.get(lbWinnerId) ?? null : null;

    const gf1: [Participant | null, Participant | null] = [wbWinner ?? null, lbWinner ?? null];
    const gf2: [Participant | null, Participant | null] = [wbWinner ?? null, lbWinner ?? null];

    return [gf1, gf2];
  }, [ordered, wbWinnerId, lbWinnerId]);

  /* -------- Редактирование счёта -------- */

  const pairKey = (aId: number, bId: number) => `${Math.min(aId, bId)}_${Math.max(aId, bId)}`;

  function startEdit(aId: number, bId: number, currentScore: string | null, meta?: PhaseMeta) {
    const k = pairKey(aId, bId);
    setEditingKey(k);
    setEditValue(currentScore && currentScore !== "—" ? currentScore : "");
    editingInputRef.current = null;
    if (mobileKeyboardAvailable) {
      const normalizedMeta =
        meta && meta.phase
          ? {
              phase: meta.phase,
              groupIndex: meta.groupIndex ?? null,
              roundIndex: meta.roundIndex ?? null,
            }
          : undefined;
      setMobileKeyboardContext({ aId, bId, meta: normalizedMeta });
    }
  }
  function cancelEdit() {
    setEditingKey(null);
    setEditValue("");
    editingInputRef.current = null;
    setMobileKeyboardContext(null);
  }
  async function saveEdit(
    aId: number,
    bId: number,
    meta?: { phase: PhaseType; groupIndex: number | null; roundIndex: number | null },
    raw?: string
  ) {
    const currentNode = editingInputRef.current;
    const fallbackValue = currentNode instanceof HTMLInputElement ? currentNode.value : editValue;
    const nextValue = (raw ?? fallbackValue ?? "").trim();
    if (!isValidScoreFormat(nextValue)) {
      alert('Неверный формат счёта. Пример: "6-4, 4-6, 10-8"');
      return;
    }
    try {
      setSaving(true);
      await onSaveScore?.(
        aId,
        bId,
        nextValue,
        meta
          ? {
              phase: meta.phase,
              groupIndex: meta.groupIndex ?? null,
              roundIndex: meta.roundIndex ?? null,
            }
          : undefined
      );
      setEditingKey(null);
      setEditValue("");
      editingInputRef.current = null;
      setMobileKeyboardContext(null);
    } finally {
      setSaving(false);
    }
  }

  /* -------- Рендер общей таблицы -------- */

  const RoundTable = ({
    title,
    pairs,
    rKeyPrefix,
    nullText,
    phaseMeta,
  }: {
    title: string;
    pairs: Array<[Participant | null, Participant | null]>;
    rKeyPrefix: string;
    nullText: string; // "BYE" для WB R1, иначе "Ожидается"
    phaseMeta?: { phase: PhaseType; groupIndex: number | null; roundIndex: number | null };
  }) => (
    <div className={`card ${editingKey ? "card--no-transition" : ""}`.trim()}>
      <div className="history-table-head">
        <strong>{title}</strong>
      </div>
      <table className="round-table">
        <thead>
          <tr className="grid-row">
            <th>Участник</th>
            <th>Счёт</th>
            <th>Участник</th>
          </tr>
        </thead>
        <tbody>
          {pairs.length > 0 ? (
            pairs.map(([a, b], i) => {
              const aId = pid(a);
              const bId = pid(b);
              const canEdit = !!aId && !!bId;
              const scoreMeta = phaseMeta;
              const score = canEdit ? getMatchScore(aId!, bId!, matches, scoreMeta) : null;
              const k = canEdit ? pairKey(aId!, bId!) : `${rKeyPrefix}_${i}`;
              const isEditing = canEdit && editingKey === k;

              const shouldShowHelpTooltip = canEdit && !score && !isEditing && firstHelpTooltip();

              return (
                <tr key={k} className={`grid-row ${isEditing ? "editing-row" : ""}`}>
                  <td><NameCell p={a} nullText={nullText} /></td>
                  <td className="score-cell">
                    {canEdit ? (
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
                            onClick={() => startEdit(aId!, bId!, score, scoreMeta)}
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
                            value={editValue}
                            readOnly={mobileKeyboardAvailable}
                            ref={(node) => {
                              editingInputRef.current = node;
                            }}
                            placeholder="6-4, 6-4"
                            pattern="[0-9\\s,:-]*"
                            inputMode={mobileKeyboardAvailable ? "numeric" : undefined}
                            autoFocus={!mobileKeyboardAvailable}
                            onFocus={(e) => {
                              if (mobileKeyboardAvailable) e.currentTarget.blur();
                            }}
                            onKeyDown={(e) => {
                              if (!mobileKeyboardAvailable) {
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  saveEdit(aId!, bId!, scoreMeta);
                                }
                                if (e.key === "Escape") {
                                  e.preventDefault();
                                  cancelEdit();
                                }
                              }
                            }}
                            onChange={(e) => {
                              if (!mobileKeyboardAvailable) {
                                setEditValue(e.target.value);
                              }
                            }}
                          />
                          {!mobileKeyboardAvailable && (
                            <>
                              <SaveIconButton
                                className="lg"
                                title="Сохранить счёт"
                                aria-label="Сохранить счёт"
                                onClick={() => saveEdit(aId!, bId!, scoreMeta)}
                                disabled={saving}
                              />
                              <CancelIconButton
                                className="lg"
                                title="Отмена"
                                aria-label="Отмена"
                                onClick={cancelEdit}
                                disabled={saving}
                              />
                            </>
                          )}
                        </div>
                      )
                    ) : (
                      // ✅ как в GroupPlusPlayoffView / SingleEliminationView
                      <span className="vs vs-placeholder" aria-hidden>
                        vs
                      </span>
                    )}
                  </td>
                  <td><NameCell p={b} nullText={nullText} /></td>
                </tr>
              );
            })
          ) : (
            <tr className="grid-row">
              <td colSpan={3} className="history-empty">В этом раунде нет пар.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="roundrobin-wrap">
      {/* Winners Bracket */}
      <div className="rounds-grid">
        {resolvedWB.map((pairs, r) => (
          <RoundTable
            key={`WB_${r}`}
            title={r === resolvedWB.length - 1 ? "WB — Финал" : `WB — Раунд ${r + 1}`}
            pairs={pairs}
            rKeyPrefix={`WB_${r}`}
            nullText={r === 0 ? "BYE" : "Ожидается"}  // ✅ BYE только в стартовом раунде
            phaseMeta={{ phase: PhaseType.Playoff, groupIndex: BRACKET_GROUP_WB, roundIndex: r }}
          />
        ))}
      </div>

      {/* Losers Bracket */}
      <div className="rounds-grid" style={{ marginTop: 16 }}>
        {resolvedLB.map((pairs, r) => (
          <RoundTable
            key={`LB_${r}`}
            title={`LB — Раунд ${r + 1}`}
            pairs={pairs}
            rKeyPrefix={`LB_${r}`}
            nullText="Ожидается"
            phaseMeta={{ phase: PhaseType.Playoff, groupIndex: BRACKET_GROUP_LB, roundIndex: r }}
          />
        ))}
      </div>

      {/* Finals */}
      <div className="rounds-grid" style={{ marginTop: 16 }}>
        <RoundTable
          title="Гранд-финал (GF1)"
          pairs={[finalsPairs[0]]}
          rKeyPrefix="GF1"
          nullText="Ожидается"
          phaseMeta={{ phase: PhaseType.Playoff, groupIndex: BRACKET_GROUP_GF, roundIndex: 0 }}
        />
        <RoundTable
          title="Гранд-финал (Reset, GF2)"
          pairs={[finalsPairs[1]]}
          rKeyPrefix="GF2"
          nullText="Ожидается"
          phaseMeta={{ phase: PhaseType.Playoff, groupIndex: BRACKET_GROUP_GF, roundIndex: 1 }}
        />
      </div>

      <div className="hint muted" style={{ marginTop: 8 }}>
        <div>• Лузеры WB автоматически попадают в следующий доступный раунд LB.</div>
        <div>• «Reset» показан отдельной карточкой — используйте по регламенту турнира.</div>
      </div>

      {mobileKeyboardAvailable && mobileKeyboardContext && (
        <ScoreKeyboard
          inputRef={editingInputRef}
          value={editValue}
          onChange={setEditValue}
          onSave={() =>
            void saveEdit(
              mobileKeyboardContext.aId,
              mobileKeyboardContext.bId,
              mobileKeyboardContext.meta
            )
          }
          onCancel={cancelEdit}
          disabled={saving}
          autoFocus={false}
        />
      )}
    </div>
  );
}

/* маленький помощник */
function resolvedArrayLast<T>(arr: T[][]): T[] | null {
  if (!arr.length) return null;
  return arr[arr.length - 1] ?? null;
}
