"use client";

import { useMemo, useRef, useState, useCallback, useEffect } from "react";
import { Participant } from "@/app/models/Participant";
import { Match, MatchPhase, PhaseType } from "@/app/models/Match";
import { PlayoffStageTable } from "./PlayoffStageTable";
import { ScoreCell } from "./ScoreCell";
import { useTournament } from "@/app/tournaments/[slug]/TournamentProvider";

const todayISO = new Date().toISOString().split("T")[0];

const formatDateForInput = (value?: Date | string | null): string => {
  if (!value) return todayISO;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? todayISO : date.toISOString().split("T")[0];
};

type DoubleEliminationViewProps = {
  participants: Participant[];
  matches: Match[];
  canManage: boolean;
  onSaveScore?: (
    aId: number,
    bId: number,
    score: string,
    matchDate: string,
    meta: MatchPhase
  ) => Promise<void> | void;
  onOpenKeyboard?: (
    editingKey: string,
    context: { participantA: Participant; participantB: Participant },
    initialValue: string,
    initialDate: string,
    phaseFilter: MatchPhase
  ) => void;
  onCloseKeyboard?: () => void;
  keyboardState?: {
    isOpen: boolean;
    editingKey: string | null;
    mobileKeyboardContext: { participantA: Participant; participantB: Participant } | null;
    editValue: string;
    editDate: string;
  };
};

/* ---------- Утилиты ---------- */

function isValidParticipant(p: Participant | null | undefined): p is Participant {
  return !!p && (!!p.player || !!p.team);
}

function nextPow2(n: number) {
  let p = 1;
  while (p < n) p <<= 1;
  return p;
}

const BRACKET_GROUP_WB = 0;
const BRACKET_GROUP_LB = 1;
const BRACKET_GROUP_GF = 2;

/* ---------- Главный компонент Double Elimination ---------- */

export function DoubleEliminationView({
  participants,
  matches,
  canManage,
  onSaveScore,
  onOpenKeyboard,
  onCloseKeyboard,
  keyboardState,
}: DoubleEliminationViewProps) {
  const {
    findMatchBetween
  } = useTournament();

  const editingInputRef = useRef<HTMLInputElement | HTMLDivElement | null>(null);
  const [editValue, setEditValue] = useState("");

  // Синхронизируем с глобальной клавиатурой если она открыта
  useEffect(() => {
    if (keyboardState?.isOpen) {
      setEditValue(keyboardState.editValue);
    }
  }, [keyboardState]);

  // Обработчики для сохранения
  const handleSaveWB = useCallback((aId: number, bId: number, roundIndex: number) => {
    if (onSaveScore) {
      onSaveScore(aId, bId, editValue || "", todayISO, {
        phase: PhaseType.Playoff,
        groupIndex: BRACKET_GROUP_WB,
        roundIndex,
      });
    }
  }, [onSaveScore, editValue]);

  const handleSaveLB = useCallback((aId: number, bId: number, roundIndex: number) => {
    if (onSaveScore) {
      onSaveScore(aId, bId, editValue || "", todayISO, {
        phase: PhaseType.Playoff,
        groupIndex: BRACKET_GROUP_LB,
        roundIndex,
      });
    }
  }, [onSaveScore, editValue]);

  const handleSaveGF = useCallback((aId: number, bId: number, roundIndex: number) => {
    if (onSaveScore) {
      onSaveScore(aId, bId, editValue || "", todayISO, {
        phase: PhaseType.Playoff,
        groupIndex: BRACKET_GROUP_GF,
        roundIndex,
      });
    }
  }, [onSaveScore, editValue]);

  /* ---------- Построение Winners Bracket ---------- */

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
    allowBye: boolean
  ): { winnerId: number | null; loserId: number | null } {
    const aId = a?.getId;
    const bId = b?.getId;

    if (allowBye) {
      if (aId && !bId) return { winnerId: aId, loserId: null };
      if (!aId && bId) return { winnerId: bId, loserId: null };
    }
    if (!aId || !bId) return { winnerId: null, loserId: null };

    const m = findMatchBetween(aId, bId, { phase: PhaseType.Playoff, groupIndex: BRACKET_GROUP_WB });
    if (!m) return { winnerId: null, loserId: null };
    const w = m.getWinnerId?.();
    if (!w || w <= 0) return { winnerId: null, loserId: null };
    const l = w === aId ? bId : aId;
    return { winnerId: w, loserId: l ?? null };
  }

  const ordered = useMemo(
    () =>
      participants
        .filter(isValidParticipant)
        .slice()
        .sort((a, b) => a.displayName(false).localeCompare(b.displayName(false), "ru")),
    [participants]
  );

  const wb = useMemo(() => buildWB(ordered), [ordered]);

  /* Заполняем WB победителями */
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
        // стартовый раунд уже содержит пары
      } else {
        // победители предыдущего раунда -> текущий
        const prev = wbCopy[r - 1];
        const allowBye = (r === 1); // BYE только на переходе из R0 в R1
        for (let i = 0; i < wbCopy[r].length; i++) {
          const m1 = resultOfPair(prev[i * 2][0], prev[i * 2][1], allowBye);
          const m2 = resultOfPair(prev[i * 2 + 1][0], prev[i * 2 + 1][1], allowBye);
          wbCopy[r][i][0] = m1.winnerId ? ordered.find((p) => p.getId === m1.winnerId) ?? null : null;
          wbCopy[r][i][1] = m2.winnerId ? ordered.find((p) => p.getId === m2.winnerId) ?? null : null;

          // лузеры предыдущего раунда
          pushUnique(losersByRound[r - 1], m1.loserId);
          pushUnique(losersByRound[r - 1], m2.loserId);
        }
      }

      // Для R0 соберём лузеров
      if (r === 0) {
        const allowByeR0 = true;
        for (let i = 0; i < wbCopy[0].length; i++) {
          const m0 = resultOfPair(wbCopy[0][i][0], wbCopy[0][i][1], allowByeR0);
          if (!losersByRound[0]) losersByRound[0] = [];
          pushUnique(losersByRound[0], m0.loserId);
        }
      }
    }

    const lastRound = wbCopy[wbCopy.length - 1];
    const finalPair = lastRound[0];
    const finalRes = resultOfPair(finalPair[0], finalPair[1], false);

    return {
      resolvedWB: wbCopy,
      wbLosersByRound: losersByRound,
      wbWinnerId: finalRes.winnerId ?? null,
    };
  }, [wb, ordered]);

  /* ---------- Losers Bracket ---------- */

  const resolvedLB = useMemo(() => {
    const rounds: Array<Array<[Participant | null, Participant | null]>> = [];
    const idToP = new Map<number, Participant>();
    ordered.forEach((p) => idToP.set(p.getId, p));

    const pairWinnerId = (a: Participant | null, b: Participant | null): number | null => {
      const aId = a?.getId;
      const bId = b?.getId;
      if (aId && !bId) return aId;
      if (!aId && bId) return bId;
      if (!aId || !bId) return null;
      const m = findMatchBetween(aId, bId, { phase: PhaseType.Playoff, groupIndex: BRACKET_GROUP_LB });
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

    return rounds;
  }, [ordered, wbLosersByRound]);

  // Победитель LB
  const lbWinnerId = useMemo(() => {
    if (resolvedLB.length === 0) return null;
    const last = resolvedLB[resolvedLB.length - 1];
    if (last.length !== 1) return null;
    const [a, b] = last[0];
    const aId = a?.getId;
    const bId = b?.getId;
    if (!aId || !bId) return null;
    const m = findMatchBetween(aId, bId, { phase: PhaseType.Playoff, groupIndex: BRACKET_GROUP_LB });
    if (!m) return null;
    const w = m.getWinnerId?.();
    return w && w > 0 ? w : null;
  }, [resolvedLB]);

  /* ---------- Finals ---------- */

  const finalsPairs = useMemo(() => {
    const idToP = new Map<number, Participant>();
    ordered.forEach((p) => idToP.set(p.getId, p));

    const wbWinner = wbWinnerId ? idToP.get(wbWinnerId) ?? null : null;
    const lbWinner = lbWinnerId ? idToP.get(lbWinnerId) ?? null : null;

    const gf1: [Participant | null, Participant | null] = [wbWinner ?? null, lbWinner ?? null];
    const gf2: [Participant | null, Participant | null] = [wbWinner ?? null, lbWinner ?? null];

    return [gf1, gf2];
  }, [ordered, wbWinnerId, lbWinnerId]);

  /* ---------- Адаптеры для ScoreCell ---------- */

  // Адаптер для Winners Bracket
  const WBScoreCell: React.FC<{
    a: Participant | null;
    b: Participant | null;
    scoreString: string | null;
    phaseFilter: MatchPhase;
  }> = ({ a, b, scoreString, phaseFilter }) => {
    const handleOpenKeyboard = useCallback((aId: number, bId: number, currentScore: string | null) => {
      if (!onOpenKeyboard || !a || !b) return;
      
      setEditValue(currentScore && currentScore !== "—" ? currentScore : "");
      const match = findMatchBetween(a.getId, b.getId, phaseFilter);
      const initialDate = formatDateForInput(match?.date ?? null);
      
      onOpenKeyboard(
        `${aId}_${bId}`,
        { participantA: a, participantB: b },
        currentScore && currentScore !== "—" ? currentScore : "",
        initialDate,
        phaseFilter
      );
    }, [onOpenKeyboard, a, b, findMatchBetween, phaseFilter]);

    const handleSave = useCallback((aId: number, bId: number) => {
      if (phaseFilter?.roundIndex != null) {
        handleSaveWB(aId, bId, phaseFilter.roundIndex);
      }
    }, [handleSaveWB, phaseFilter]);

    const handleCancel = useCallback(() => {
      setEditValue("");
      onCloseKeyboard?.();
    }, [onCloseKeyboard]);

    return (
      <ScoreCell
        a={a}
        b={b}
        scoreString={scoreString}
        phaseFilter={phaseFilter}
        editingKey={keyboardState?.editingKey}
        editValue={editValue}
        canManage={canManage}
        setEditValue={setEditValue}
        inputRef={editingInputRef}
        onSave={handleSave}
        onCancel={handleCancel}
        onOpenKeyboard={onOpenKeyboard ? handleOpenKeyboard : undefined}
        showHelpTooltip={false}
      />
    );
  };

  // Адаптер для Losers Bracket
  const LBScoreCell: React.FC<{
    a: Participant | null;
    b: Participant | null;
    scoreString: string | null;
    phaseFilter: MatchPhase;
  }> = ({ a, b, scoreString, phaseFilter }) => {
    const handleOpenKeyboard = useCallback((aId: number, bId: number, currentScore: string | null) => {
      if (!onOpenKeyboard || !a || !b) return;
      
      setEditValue(currentScore && currentScore !== "—" ? currentScore : "");
      const match = findMatchBetween(a.getId, b.getId, phaseFilter);
      const initialDate = formatDateForInput(match?.date ?? null);
      
      onOpenKeyboard(
        `${aId}_${bId}`,
        { participantA: a, participantB: b },
        currentScore && currentScore !== "—" ? currentScore : "",
        initialDate,
        phaseFilter
      );
    }, [onOpenKeyboard, a, b, findMatchBetween, phaseFilter]);

    const handleSave = useCallback((aId: number, bId: number) => {
      if (phaseFilter?.roundIndex != null) {
        handleSaveLB(aId, bId, phaseFilter.roundIndex);
      }
    }, [handleSaveLB, phaseFilter]);

    const handleCancel = useCallback(() => {
      setEditValue("");
      onCloseKeyboard?.();
    }, [onCloseKeyboard]);

    return (
      <ScoreCell
        a={a}
        b={b}
        scoreString={scoreString}
        phaseFilter={phaseFilter}
        editingKey={keyboardState?.editingKey}
        editValue={editValue}
        canManage={canManage}
        setEditValue={setEditValue}
        inputRef={editingInputRef}
        onSave={handleSave}
        onCancel={handleCancel}
        onOpenKeyboard={onOpenKeyboard ? handleOpenKeyboard : undefined}
        showHelpTooltip={false}
      />
    );
  };

  // Адаптер для Grand Finals
  const GFScoreCell: React.FC<{
    a: Participant | null;
    b: Participant | null;
    scoreString: string | null;
    phaseFilter: MatchPhase;
  }> = ({ a, b, scoreString, phaseFilter }) => {
    const handleOpenKeyboard = useCallback((aId: number, bId: number, currentScore: string | null) => {
      if (!onOpenKeyboard || !a || !b) return;
      
      setEditValue(currentScore && currentScore !== "—" ? currentScore : "");
      const match = findMatchBetween(a.getId, b.getId, phaseFilter);
      const initialDate = formatDateForInput(match?.date ?? null);
      
      onOpenKeyboard(
        `${aId}_${bId}`,
        { participantA: a, participantB: b },
        currentScore && currentScore !== "—" ? currentScore : "",
        initialDate,
        phaseFilter
      );
    }, [onOpenKeyboard, a, b, findMatchBetween, phaseFilter]);

    const handleSave = useCallback((aId: number, bId: number) => {
      if (phaseFilter?.roundIndex != null) {
        handleSaveGF(aId, bId, phaseFilter.roundIndex);
      }
    }, [handleSaveGF, phaseFilter]);

    const handleCancel = useCallback(() => {
      setEditValue("");
      onCloseKeyboard?.();
    }, [onCloseKeyboard]);

    return (
      <ScoreCell
        a={a}
        b={b}
        scoreString={scoreString}
        phaseFilter={phaseFilter}
        editingKey={keyboardState?.editingKey}
        editValue={editValue}
        canManage={canManage}
        setEditValue={setEditValue}
        inputRef={editingInputRef}
        onSave={handleSave}
        onCancel={handleCancel}
        onOpenKeyboard={onOpenKeyboard ? handleOpenKeyboard : undefined}
        showHelpTooltip={false}
      />
    );
  };

  return (
    <div className="roundrobin-wrap">
      {/* Winners Bracket */}
      <div style={{ marginBottom: 24 }}>
        <h3>Верхняя сетка (Winners Bracket)</h3>
        {resolvedWB.map((pairs, r) => (
          <PlayoffStageTable
            key={`WB_${r}`}
            playOffParticipants={pairs.flat()}
            matches={matches}
            ScoreCellAdapter={WBScoreCell}
          />
        ))}
      </div>

      {/* Losers Bracket */}
      <div style={{ marginBottom: 24 }}>
        <h3>Нижняя сетка (Losers Bracket)</h3>
        {resolvedLB.map((pairs, r) => (
          <PlayoffStageTable
            key={`LB_${r}`}
            playOffParticipants={pairs.flat()}
            matches={matches}
            ScoreCellAdapter={LBScoreCell}
          />
        ))}
      </div>

      {/* Grand Finals */}
      <div style={{ marginBottom: 24 }}>
        <h3>Гранд-финал</h3>
        <PlayoffStageTable
          key="GF1"
          playOffParticipants={finalsPairs[0]}
          matches={matches}
          ScoreCellAdapter={GFScoreCell}
        />
        <div style={{ marginTop: 16 }}>
          <PlayoffStageTable
            key="GF2"
            playOffParticipants={finalsPairs[1]}
            matches={matches}
            ScoreCellAdapter={GFScoreCell}
          />
        </div>
      </div>
    </div>
  );
}

function resolvedArrayLast<T>(arr: T[][]): T[] | null {
  if (!arr.length) return null;
  return arr[arr.length - 1] ?? null;
}

export default DoubleEliminationView;
