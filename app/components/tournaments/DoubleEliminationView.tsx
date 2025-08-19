"use client";

import { useMemo, useState } from "react";

import { Participant } from "@/app/models/Participant";
import { Match } from "@/app/models/Match";

import { useUser } from "@/app/components/UserContext";
import { SaveIconButton, CancelIconButton } from "@/app/components/IconButtons";

import "./PyramidView.css";
import "./RoundRobinView.css";
import "@/app/components/TeamsTable.css";


type DoubleEliminationViewProps = {
  participants: Participant[];
  matches: Match[];
  onSaveScore?: (aId: number, bId: number, score: string) => Promise<void> | void;
};

/* ---------- Утилиты ---------- */

function isValidParticipant(p: Participant | null | undefined): p is Participant {
  return !!p && (!!p.player || !!p.team);
}

function pid(p: Participant | null | undefined): number | null {
  if (!p) return null;
  return p.getId; // у вас уже реализовано
}

function nextPow2(n: number) {
  let p = 1;
  while (p < n) p <<= 1;
  return p;
}

function findMatchBetween(aId: number, bId: number, matches: Match[]): Match | undefined {
  return matches.find((m) => {
    const id1 = m.player1?.id ?? m.team1?.id ?? 0;
    const id2 = m.player2?.id ?? m.team2?.id ?? 0;
    return (id1 === aId && id2 === bId) || (id1 === bId && id2 === aId);
  });
}

function getMatchScore(aId: number, bId: number, matches: Match[]): string | null {
  const match = findMatchBetween(aId, bId, matches);
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

function NameCell({ p }: { p: Participant }) {
  if (p.player) {
    return <span className="chip name-one-line" title={`ID: ${p.player.id}`}>{p.player.name}</span>;
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

/* Победитель пары (учитывая BYE и реальные матчи), и проигравший */
function resultOfPair(
  a: Participant | null,
  b: Participant | null,
  matches: Match[]
): { winnerId: number | null; loserId: number | null } {
  const aId = pid(a);
  const bId = pid(b);
  if (aId && !bId) return { winnerId: aId, loserId: null };
  if (!aId && bId) return { winnerId: bId, loserId: null };
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
  const { user } = useUser();
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>("");
  const [saving, setSaving] = useState(false);

  const ordered = useMemo(
    () =>
      participants
        .filter(isValidParticipant)
        .slice()
        .sort((a, b) =>
          a
            .displayName(user?.role !== "site_admin")
            .localeCompare(b.displayName(user?.role !== "site_admin"), "ru")
        ),
    [participants]
  );

  const wb = useMemo(() => buildWB(ordered), [ordered]);

  /* Заполняем WB победителями как в single-elim, и собираем лузеров по раундам */
  const { resolvedWB, wbLosersByRound, wbWinnerId } = useMemo(() => {
    const wbCopy = wb.map((r) => r.map(([a, b]) => [a, b] as [Participant | null, Participant | null]));
    const losersByRound: number[][] = [];

    for (let r = 0; r < wbCopy.length; r++) {
      losersByRound[r] = [];
      if (r === 0) {
        // стартовые пары уже есть
      } else {
        // участников текущего раунда — победители предыдущего
        const prev = wbCopy[r - 1];
        for (let i = 0; i < wbCopy[r].length; i++) {
          const m1 = resultOfPair(prev[i * 2][0], prev[i * 2][1], matches);
          const m2 = resultOfPair(prev[i * 2 + 1][0], prev[i * 2 + 1][1], matches);
          wbCopy[r][i][0] = m1.winnerId ? ordered.find((p) => p.getId === m1.winnerId) ?? null : null;
          wbCopy[r][i][1] = m2.winnerId ? ordered.find((p) => p.getId === m2.winnerId) ?? null : null;
          // одновременно собираем лузеров предыдущего раунда (которые уже определились)
          if (m1.loserId) losersByRound[r - 1].push(m1.loserId);
          if (m2.loserId) losersByRound[r - 1].push(m2.loserId);
        }
      }
      // для R0 лузеры появятся после того, как будут внесены результаты — обработаем ниже повторно
      if (r === 0) {
        for (let i = 0; i < wbCopy[0].length; i++) {
          const m0 = resultOfPair(wbCopy[0][i][0], wbCopy[0][i][1], matches);
          if (m0.loserId) {
            if (!losersByRound[0]) losersByRound[0] = [];
            losersByRound[0].push(m0.loserId);
          }
        }
      }
    }

    const lastRound = wbCopy[wbCopy.length - 1];
    const finalPair = lastRound[0];
    const finalRes = resultOfPair(finalPair[0], finalPair[1], matches);

    return {
      resolvedWB: wbCopy,
      wbLosersByRound: losersByRound,
      wbWinnerId: finalRes.winnerId ?? null,
    };
  }, [wb, matches, ordered]);

  /* Строим LB «универсальным» способом:
     LB[0] формируется из лузеров WB[0] попарно.
     Далее для каждого r>=1: список = победители LB[r-1] + лузеры WB[r]; пары — последовательно.
  */
  const resolvedLB = useMemo(() => {
    const rounds: Array<Array<[Participant | null, Participant | null]>> = [];
    const idToP = new Map<number, Participant>();
    ordered.forEach((p) => idToP.set(p.getId, p));

    // Помощники для вычисления победителей LB-матчей по результатам matches
    const pairWinnerId = (a: Participant | null, b: Participant | null): number | null => {
      const aId = pid(a);
      const bId = pid(b);
      if (aId && !bId) return aId;
      if (!aId && bId) return bId;
      if (!aId || !bId) return null;
      const m = findMatchBetween(aId, bId, matches);
      if (!m) return null;
      const w = m.getWinnerId?.();
      return w && w > 0 ? w : null;
    };

    const lbWinnersCacheByRound: number[][] = [];

    for (let r = 0; r < wbLosersByRound.length; r++) {
      const entrants: number[] = [];
      // добавляем победителей предыдущего LB-раунда (если есть)
      if (r - 1 >= 0 && lbWinnersCacheByRound[r - 1]?.length) {
        entrants.push(...lbWinnersCacheByRound[r - 1]);
      }
      // добавляем лузеров текущего WB-раунда
      if (wbLosersByRound[r]?.length) {
        entrants.push(...wbLosersByRound[r]);
      }

      // собираем пары
      const lbPairs: Array<[Participant | null, Participant | null]> = [];
      for (let i = 0; i < entrants.length; i += 2) {
        const a = idToP.get(entrants[i]) ?? null;
        const b = idToP.get(entrants[i + 1]) ?? null;
        lbPairs.push([a ?? null, b ?? null]);
      }
      rounds.push(lbPairs);

      // посчитаем победителей этого LB-раунда — понадобятся на r+1
      const winners: number[] = [];
      for (const [a, b] of lbPairs) {
        const w = pairWinnerId(a, b);
        if (w) winners.push(w);
      }
      lbWinnersCacheByRound[r] = winners;
    }

    // После того как все лузеры WB «упали», LB должен продолжить сокращаться до одного победителя.
    // Делаем дополнительные раунды, пока победителей > 1.
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
     - GF1: WB winner vs LB winner (когда оба известны)
     - GF2 (reset): опциональный второй матч. Оставляем как отдельную карточку для удобства.
  */
  const finalsPairs = useMemo(() => {
    const idToP = new Map<number, Participant>();
    ordered.forEach((p) => idToP.set(p.getId, p));

    const wbWinner = wbWinnerId ? idToP.get(wbWinnerId) ?? null : null;
    const lbWinner = lbWinnerId ? idToP.get(lbWinnerId) ?? null : null;

    const gf1: [Participant | null, Participant | null] = [wbWinner ?? null, lbWinner ?? null];
    // reset матч (GF2) — тот же состав; его наличие/использование определяется регламентом
    const gf2: [Participant | null, Participant | null] = [wbWinner ?? null, lbWinner ?? null];

    return [gf1, gf2];
  }, [ordered, wbWinnerId, lbWinnerId]);

  /* -------- Редактирование счёта -------- */

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

  /* -------- Рендер общей таблицы (переиспользуем стили) -------- */

  const RoundTable = ({
    title,
    pairs,
    rKeyPrefix,
  }: {
    title: string;
    pairs: Array<[Participant | null, Participant | null]>;
    rKeyPrefix: string;
  }) => (
    <div className="card">
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
              const score = canEdit ? getMatchScore(aId!, bId!, matches) : null;
              const k = canEdit ? pairKey(aId!, bId!) : `${rKeyPrefix}_${i}`;
              const isEditing = canEdit && editingKey === k;

              return (
                <tr key={k} className={`grid-row ${isEditing ? "editing-row" : ""}`}>
                  <td>{a ? <NameCell p={a} /> : <span className="chip muted">Ожидается</span>}</td>
                  <td className="score-cell">
                    {canEdit ? (
                      score ? (
                        <span className="badge">{score}</span>
                      ) : !isEditing ? (
                        <button
                          type="button"
                          className="vs vs-click"
                          onClick={() => startEdit(aId!, bId!, score)}
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
                            placeholder="6-4, 6-4"
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                saveEdit(aId!, bId!);
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
                            onClick={() => saveEdit(aId!, bId!)}
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
                      <span className="badge muted">—</span>
                    )}
                  </td>
                  <td>{b ? <NameCell p={b} /> : <span className="chip muted">Ожидается</span>}</td>
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
      <div className="rounds-grid bracket-grid">
        {resolvedWB.map((pairs, r) => (
          <RoundTable
            key={`WB_${r}`}
            title={r === resolvedWB.length - 1 ? "WB — Финал" : `WB — Раунд ${r + 1}`}
            pairs={pairs}
            rKeyPrefix={`WB_${r}`}
          />
        ))}
      </div>

      {/* Losers Bracket */}
      <div className="rounds-grid bracket-grid" style={{ marginTop: 16 }}>
        {resolvedLB.map((pairs, r) => (
          <RoundTable
            key={`LB_${r}`}
            title={`LB — Раунд ${r + 1}`}
            pairs={pairs}
            rKeyPrefix={`LB_${r}`}
          />
        ))}
      </div>

      {/* Finals */}
      <div className="rounds-grid bracket-grid" style={{ marginTop: 16 }}>
        <RoundTable title="Гранд-финал (GF1)" pairs={[finalsPairs[0]]} rKeyPrefix="GF1" />
        <RoundTable title="Гранд-финал (Reset, GF2)" pairs={[finalsPairs[1]]} rKeyPrefix="GF2" />
      </div>

      <div className="hint muted" style={{ marginTop: 8 }}>
        <div>• Лузеры WB автоматически попадают в следующий доступный раунд LB.</div>
        <div>• «Reset» показан отдельной карточкой — используйте по регламенту турнира.</div>
      </div>
    </div>
  );
}

/* маленький помощник */
function resolvedArrayLast<T>(arr: T[][]): T[] | null {
  if (!arr.length) return null;
  return arr[arr.length - 1] ?? null;
}