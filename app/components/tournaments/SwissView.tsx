"use client";

import { useMemo, useRef, useState, useCallback, useEffect } from "react";
import { Participant } from "@/app/models/Participant";
import { Match, MatchPhase, PhaseType } from "@/app/models/Match";
import { PlayoffStageTable } from "./PlayoffStageTable";
import { ScoreCell } from "./ScoreCell";
import { useTournament } from "@/app/tournaments/[slug]/TournamentProvider";

type SwissViewProps = {
  participants: Participant[];
  matches: Match[];
  canManage: boolean;
  roundsCount: number;
  onSaveScore?: (
    aId: number,
    bId: number,
    score: string,
    meta: MatchPhase
  ) => Promise<void> | void;
  onOpenKeyboard?: (
    editingKey: string,
    context: { participantA: Participant; participantB: Participant },
    initialValue: string,
    phaseFilter: MatchPhase
  ) => void;
  onCloseKeyboard?: () => void;
  keyboardState?: {
    isOpen: boolean;
    editingKey: string | null;
    mobileKeyboardContext: { participantA: Participant; participantB: Participant } | null;
    editValue: string;
  };
};

/* ========= Утилиты ========= */

function isValidParticipant(p: Participant | null | undefined): p is Participant {
  return !!p && (!!p.player || !!p.team);
}

function pid(p: Participant | null | undefined): number | null {
  if (!p) return null;
  return p.getId;
}

function havePlayed(aId: number, bId: number, matches: Match[]) {
  return !!matches.find((m) => {
    const id1 = m.player1?.id ?? m.team1?.id ?? 0;
    const id2 = m.player2?.id ?? m.team2?.id ?? 0;
    return (id1 === aId && id2 === bId) || (id1 === bId && id2 === aId);
  });
}

/* ========= Подсчёт очков и тай-брейков ========= */

type PStats = {
  id: number;
  points: number;
  setsDiff: number;
  gamesDiff: number;
  oppIds: number[];
  beatIds: number[];
};

function emptyPStats(ids: number[]): Map<number, PStats> {
  const m = new Map<number, PStats>();
  ids.forEach((id) => m.set(id, { id, points: 0, setsDiff: 0, gamesDiff: 0, oppIds: [], beatIds: [] }));
  return m;
}

function computeStats(participants: Participant[], matches: Match[]): Map<number, PStats> {
  const ids = participants.map((p) => p.getId);
  const st = emptyPStats(ids);
  for (const m of matches) {
    const aId = m.player1?.id ?? m.team1?.id ?? 0;
    const bId = m.player2?.id ?? m.team2?.id ?? 0;
    if (!aId || !bId) continue;
    const a = st.get(aId)!; const b = st.get(bId)!;
    a.oppIds.push(bId); b.oppIds.push(aId);

    if (!m.scores || m.scores.length === 0) continue;

    let aSets = 0, bSets = 0, aGames = 0, bGames = 0;
    for (const [s1, s2] of m.scores) {
      aGames += s1; bGames += s2;
      if (s1 > s2) aSets++; else if (s2 > s1) bSets++;
    }
    a.setsDiff += (aSets - bSets);
    b.setsDiff += (bSets - aSets);
    a.gamesDiff += (aGames - bGames);
    b.gamesDiff += (bGames - aGames);

    if (aSets > bSets) { a.points += 1; a.beatIds.push(bId); }
    else if (bSets > aSets) { b.points += 1; b.beatIds.push(aId); }
  }
  return st;
}

function buchholz(st: Map<number, PStats>, id: number) {
  const s = st.get(id)!;
  return s.oppIds.reduce((acc, oid) => acc + (st.get(oid)?.points ?? 0), 0);
}

function sonnebornBerger(st: Map<number, PStats>, id: number) {
  const s = st.get(id)!;
  return s.beatIds.reduce((acc, oid) => acc + (st.get(oid)?.points ?? 0), 0);
}

/* ========= Пейринг швейцарки ========= */

function swissPairRound(
  participants: Participant[],
  matches: Match[],
  stats: Map<number, PStats>
): Array<[Participant | null, Participant | null]> {
  const sorted = participants.slice().sort((a, b) => {
    const sa = stats.get(a.getId)!;
    const sb = stats.get(b.getId)!;
    if (sb.points !== sa.points) return sb.points - sa.points;
    const ba = buchholz(stats, a.getId);
    const bb = buchholz(stats, b.getId);
    if (bb !== ba) return bb - ba;
    const sba = sonnebornBerger(stats, a.getId);
    const sbb = sonnebornBerger(stats, b.getId);
    if (sbb !== sba) return sbb - sba;
    const an = a.displayName(false);
    const bn = b.displayName(false);
    return an.localeCompare(bn, "ru");
  });

  const used = new Set<number>();
  const pairs: Array<[Participant | null, Participant | null]> = [];

  const N = sorted.length;
  let i = 0;
  while (i < N) {
    const A = sorted[i];
    const aId = A.getId;
    if (used.has(aId)) {
      i++;
      continue;
    }

    let found: Participant | null = null;
    for (let j = i + 1; j < N; j++) {
      const B = sorted[j];
      const bId = B.getId;
      if (used.has(bId)) continue;
      if (!havePlayed(aId, bId, matches)) {
        found = B;
        used.add(aId);
        used.add(bId);
        pairs.push([A, B]);
        break;
      }
    }

    if (!found) {
      used.add(aId);
      pairs.push([A, null]);
    }

    i++;
  }

  const remain = sorted.filter((p) => !used.has(p.getId));
  if (remain.length === 1) pairs.push([remain[0], null]);

  return pairs;
}

/* ========= Компонент ========= */

export function SwissView({
  participants,
  matches,
  canManage,
  roundsCount,
  onSaveScore,
  onOpenKeyboard,
  onCloseKeyboard,
  keyboardState,
}: SwissViewProps) {
  const editingInputRef = useRef<HTMLInputElement | HTMLDivElement | null>(null);
  const [editValue, setEditValue] = useState("");

  // Синхронизируем с глобальной клавиатурой если она открыта
  useEffect(() => {
    if (keyboardState?.isOpen) {
      setEditValue(keyboardState.editValue);
    }
  }, [keyboardState]);

  const {
    findMatchBetween
  } = useTournament();

  // Обработчик для сохранения счёта
  const handleSave = useCallback((aId: number, bId: number, roundIndex: number) => {
    if (onSaveScore) {
      onSaveScore(aId, bId, editValue || "", {
        phase: PhaseType.Swiss,
        groupIndex: null,
        roundIndex,
      });
    }
  }, [onSaveScore, editValue]);

  // Базовая сортировка
  const ordered = useMemo(
    () =>
      participants
        .filter(isValidParticipant)
        .slice()
        .sort((a, b) => a.displayName(false).localeCompare(b.displayName(false), "ru")),
    [participants]
  );

  // Статы по текущим результатам
  const stats = useMemo(() => computeStats(ordered, matches), [ordered, matches]);

  // Строим пары для всех раундов
  const swissRounds = useMemo(() => {
    const rounds: Array<Array<[Participant | null, Participant | null]>> = [];
    for (let r = 0; r < Math.max(1, roundsCount); r++) {
      const pairs = swissPairRound(ordered, matches, stats);
      rounds.push(pairs);
    }
    return rounds;
  }, [ordered, matches, stats, roundsCount]);

  // Таблица участников
  const standings = useMemo(() => {
    const rows = Array.from(stats.values()).map((s) => {
      const bh = buchholz(stats, s.id);
      const sb = sonnebornBerger(stats, s.id);
      return { ...s, buchholz: bh, sb };
    });
    rows.sort((x, y) => {
      if (y.points !== x.points) return y.points - x.points;
      if (y.buchholz !== x.buchholz) return y.buchholz - x.buchholz;
      if (y.sb !== x.sb) return y.sb - x.sb;
      if (y.setsDiff !== x.setsDiff) return y.setsDiff - x.setsDiff;
      return y.gamesDiff - x.gamesDiff;
    });
    return rows;
  }, [stats]);

  // Адаптер для ScoreCell
  const SwissScoreCell: React.FC<{
    a: Participant | null;
    b: Participant | null;
    scoreString: string | null;
    phaseFilter: MatchPhase;
  }> = ({ a, b, scoreString, phaseFilter }) => {
    const handleOpenKeyboard = useCallback((aId: number, bId: number, currentScore: string | null) => {
      if (!onOpenKeyboard || !a || !b) return;
      
      setEditValue(currentScore && currentScore !== "—" ? currentScore : "");
      
      onOpenKeyboard(
        `${aId}_${bId}`,
        { participantA: a, participantB: b },
        currentScore && currentScore !== "—" ? currentScore : "",
        phaseFilter
      );
    }, [onOpenKeyboard, a, b, phaseFilter]);

    const handleSaveWithRound = useCallback((aId: number, bId: number) => {
      if (phaseFilter?.roundIndex != null) {
        handleSave(aId, bId, phaseFilter.roundIndex);
      }
    }, [handleSave, phaseFilter]);

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
        onSave={handleSaveWithRound}
        onCancel={handleCancel}
        onOpenKeyboard={onOpenKeyboard ? handleOpenKeyboard : undefined}
        showHelpTooltip={false}
      />
    );
  };

  return (
    <div className="roundrobin-wrap">
      {/* РАУНДЫ ШВЕЙЦАРКИ */}
      <div className="rounds-grid">
        {swissRounds.map((pairs, rIndex) => (
          <PlayoffStageTable
            key={rIndex}
            playOffParticipants={pairs.flat()}
            matches={matches}
            ScoreCellAdapter={SwissScoreCell}
          />
        ))}
      </div>

      {/* ТАБЛИЦА УЧАСТНИКОВ */}
      <div
        className="card"
        style={{ marginTop: 16 }}
      >
        <div className="history-table-head"><strong>Таблица</strong></div>
        <table className="round-table">
          <thead>
            <tr className="grid-row-swiss">
              <th>Участник</th>
              <th>Очки</th>
              <th>Бухгольц</th>
              <th>Соннеборн–Бергер</th>
              <th>Δ сет</th>
              <th>Δ гейм</th>
            </tr>
          </thead>
          <tbody>
            {standings.map((s) => (
              <tr key={s.id} className="grid-row-swiss">
                <td>
                  <span className="player">
                    {participants.find(p => p.getId === s.id)?.displayName(false) ?? s.id}
                  </span>
                </td>
                <td>{s.points}</td>
                <td>{s.buchholz}</td>
                <td>{s.sb}</td>
                <td>{s.setsDiff}</td>
                <td>{s.gamesDiff}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="hint muted" style={{ marginTop: 8 }}>
          <div>• Порядок: Очки → Бухгольц → Соннеборн–Бергер → Δ сетов → Δ геймов.</div>
          <div>• BYE считается как победа (+1 очко), соперник отсутствует.</div>
        </div>
      </div>
    </div>
  );
}

export default SwissView;