"use client";

import { useMemo, useRef, useState, useCallback, useEffect } from "react";
import { Participant } from "@/app/models/Participant";
import { Match, MatchPhase, PhaseType } from "@/app/models/Match";
import { PlayoffStageTable } from "./PlayoffStageTable";
import { ScoreCell } from "./ScoreCell";
import { useTournament } from "@/app/tournaments/[slug]/TournamentProvider";
import { useDictionary } from "@/app/components/LanguageProvider";

const todayISO = new Date().toISOString().split("T")[0];

const formatDateForInput = (value?: Date | string | null): string => {
  if (!value) return todayISO;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? todayISO : date.toISOString().split("T")[0];
};

type SwissViewProps = {
  participants: Participant[];
  matches: Match[];
  canManage: boolean;
  roundsCount: number;
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
    phaseFilter: MatchPhase,
    intent?: "edit" | "pyramid-add"
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

/* ========= Утилиты ========= */

function isValidParticipant(p: Participant | null | undefined): p is Participant {
  return !!p && (!!p.player || !!p.team);
}

function havePlayed(aId: number, bId: number, matches: Match[]) {
  return !!matches.find((m) => {
    const id1 = m.player1?.id ?? m.team1?.id ?? 0;
    const id2 = m.player2?.id ?? m.team2?.id ?? 0;
    return (id1 === aId && id2 === bId) || (id1 === bId && id2 === aId);
  });
}

const makePairKey = (aId: number, bId: number) =>
  `${Math.min(aId, bId)}_${Math.max(aId, bId)}`;

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
    if (!m.scores || m.scores.length === 0) continue;
    a.oppIds.push(bId); b.oppIds.push(aId);

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
  stats: Map<number, PStats>,
  alreadyPaired: Set<string>,
  seedOrder: Map<number, number>
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
    const seedA = seedOrder.get(a.getId) ?? 0;
    const seedB = seedOrder.get(b.getId) ?? 0;
    if (seedA !== seedB) return seedA - seedB;
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
      const key = makePairKey(aId, bId);
      if (alreadyPaired.has(key)) continue;
      if (!havePlayed(aId, bId, matches)) {
        found = B;
        used.add(aId);
        used.add(bId);
        alreadyPaired.add(key);
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

type SwissRoundPair = {
  a: Participant | null;
  b: Participant | null;
  match: Match | null;
  phase: MatchPhase;
  isBye: boolean;
};

type SwissRoundDefinition = {
  roundIndex: number;
  pairs: SwissRoundPair[];
};

const formatMatchScore = (match: Match | null): string | null => {
  if (!match) return null;
  if (!match.scores || match.scores.length === 0) return "—";
  return match.scores.map(([s1, s2]) => `${s1}:${s2}`).join(", ");
};

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
  const { tournamentTables } = useDictionary();
  const swissText = tournamentTables.swiss;

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
      onSaveScore(aId, bId, editValue || "", todayISO, {
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

  const seedOrder = useMemo(() => {
    const map = new Map<number, number>();
    ordered.forEach((p, index) => map.set(p.getId, index));
    return map;
  }, [ordered]);

  const swissMatches = useMemo(
    () =>
      matches.filter((m) => {
        const phase = (m as any).phase as PhaseType | undefined;
        if (!phase) return true;
        return phase === PhaseType.Swiss;
      }),
    [matches]
  );

  // Статы по текущим результатам
  const stats = useMemo(() => computeStats(ordered, swissMatches), [ordered, swissMatches]);

  // Строим пары для всех раундов
  const swissRounds = useMemo<SwissRoundDefinition[]>(() => {
    if (!ordered.length) return [];

    const participantsById = new Map<number, Participant>();
    ordered.forEach((p) => participantsById.set(p.getId, p));

    const matchesByRound = new Map<number, Match[]>();
    swissMatches.forEach((match) => {
      const rawRound = (match as any).roundIndex;
      const roundIndex =
        typeof rawRound === "number" && Number.isFinite(rawRound) ? rawRound : 0;
      if (!matchesByRound.has(roundIndex)) {
        matchesByRound.set(roundIndex, []);
      }
      matchesByRound.get(roundIndex)!.push(match);
    });

    const recordedRoundIndexes = Array.from(matchesByRound.keys());
    const maxRecordedRound = recordedRoundIndexes.length
      ? Math.max(...recordedRoundIndexes)
      : -1;
    const totalRounds = Math.max(1, Math.max(roundsCount, maxRecordedRound + 1));

    const rounds: SwissRoundDefinition[] = [];
    const matchesBefore: Match[] = [];
    const alreadyPaired = new Set<string>();

    for (let roundIndex = 0; roundIndex < totalRounds; roundIndex++) {
      const roundMatches = matchesByRound.get(roundIndex) ?? [];
      const scheduledIds = new Set<number>();
      const pairs: SwissRoundPair[] = [];

      roundMatches.forEach((match) => {
        const aId = match.player1?.id ?? match.team1?.id ?? 0;
        const bId = match.player2?.id ?? match.team2?.id ?? 0;
        const a = aId ? participantsById.get(aId) ?? null : null;
        const b = bId ? participantsById.get(bId) ?? null : null;
        if (!a && !b) return;
        if (a) scheduledIds.add(a.getId);
        if (b) scheduledIds.add(b.getId);
        if (a && b) {
          alreadyPaired.add(makePairKey(a.getId, b.getId));
        }
        pairs.push({
          a,
          b,
          match,
          phase: { phase: PhaseType.Swiss, groupIndex: null, roundIndex },
          isBye: !a || !b,
        });
      });

      const remaining = ordered.filter((p) => !scheduledIds.has(p.getId));
      if (remaining.length > 0) {
        const statsForRound = computeStats(ordered, matchesBefore);
        const generated = swissPairRound(
          remaining,
          matchesBefore,
          statsForRound,
          alreadyPaired,
          seedOrder
        );
        generated.forEach(([a, b]) => {
          if (!a && !b) return;
          const isBye = !a || !b;
          if (a) scheduledIds.add(a.getId);
          if (b) scheduledIds.add(b.getId);
          if (a && b) {
            alreadyPaired.add(makePairKey(a.getId, b.getId));
          }
          pairs.push({
            a,
            b,
            match: null,
            phase: { phase: PhaseType.Swiss, groupIndex: null, roundIndex },
            isBye,
          });
        });
      }

      rounds.push({ roundIndex, pairs });
      matchesBefore.push(...roundMatches);
    }

    return rounds;
  }, [ordered, swissMatches, roundsCount, seedOrder]);

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

  return (
    <div className="roundrobin-wrap">
      {/* РАУНДЫ ШВЕЙЦАРКИ */}
      <div className="rounds-grid">
        {swissRounds.map((round) => {
          const roundParticipants = round.pairs.flatMap(({ a, b }) => {
            const list: Participant[] = [];
            if (a) list.push(a);
            if (b) list.push(b);
            return list;
          });

          const RoundScoreCell: React.FC<{
            a: Participant | null;
            b: Participant | null;
            scoreString: string | null;
            phaseFilter: MatchPhase;
            showHelpTooltip: boolean;
          }> = ({ a, b, scoreString: rawScoreString, showHelpTooltip }) => {
            const effectivePhase: MatchPhase = {
              phase: PhaseType.Swiss,
              groupIndex: null,
              roundIndex: round.roundIndex,
            };

            const resolveScoreString = () => {
              if (!a || !b) return "—";
              const match = findMatchBetween(a.getId, b.getId, effectivePhase);
              if (match && match.scores && match.scores.length > 0) {
                return formatMatchScore(match);
              }
              return rawScoreString ?? "—";
            };

            const handleOpenKeyboard = (aId: number, bId: number, currentScore: string | null) => {
              if (!onOpenKeyboard || !a || !b) return;

              setEditValue(currentScore && currentScore !== "—" ? currentScore : "");
              const match = findMatchBetween(a.getId, b.getId, effectivePhase);
              const initialDate = formatDateForInput(match?.date ?? null);

              onOpenKeyboard(
                `${aId}_${bId}`,
                { participantA: a, participantB: b },
                currentScore && currentScore !== "—" ? currentScore : "",
                initialDate,
                effectivePhase
              );
            };

            const handleSaveWithRound = (aId: number, bId: number) => {
              handleSave(aId, bId, round.roundIndex);
            };

            const handleCancel = () => {
              setEditValue("");
              onCloseKeyboard?.();
            };

            return (
              <ScoreCell
                a={a}
                b={b}
                scoreString={resolveScoreString()}
                phaseFilter={effectivePhase}
                editingKey={keyboardState?.editingKey}
                editValue={editValue}
                canManage={canManage}
                setEditValue={setEditValue}
                inputRef={editingInputRef}
                onSave={handleSaveWithRound}
                onCancel={handleCancel}
                onOpenKeyboard={onOpenKeyboard ? handleOpenKeyboard : undefined}
                showHelpTooltip={showHelpTooltip}
              />
            );
          };

          return (
            <PlayoffStageTable
              key={round.roundIndex}
              playOffParticipants={roundParticipants}
              canManage={canManage}
              ScoreCellAdapter={RoundScoreCell}
              forSwiss
            />
          );
        })}
      </div>

      {/* ТАБЛИЦА УЧАСТНИКОВ */}
      <div
        className="card"
        style={{ marginTop: 16 }}
      >
        <div className="history-table-head"><strong>{swissText.standingsTitle}</strong></div>
        <table className="round-table">
          <thead>
            <tr className="grid-row-swiss">
              <th>{swissText.participant}</th>
              <th>{swissText.points}</th>
              <th>{swissText.buchholz}</th>
              <th>{swissText.sonneborn}</th>
              <th>{swissText.setDiff}</th>
              <th>{swissText.gameDiff}</th>
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
          <div>• {swissText.sortingHint}</div>
          <div>• {swissText.byeHint}</div>
        </div>
      </div>
    </div>
  );
}

export default SwissView;
