"use client";

import { useCallback, useMemo, useRef } from "react";
import { Participant } from "@/app/models/Participant";
import { Match, PhaseType } from "@/app/models/Match";

import { useFirstHelpTooltip } from "@/app/hooks/useFirstHelpTooltip";
import { ScoreCell } from "./ScoreCell";

import { GroupStageTable } from "./GroupStageTable";
import { PlayoffStageTable } from "./PlayoffStageTable";

import "./PyramidView.css";
import "./GroupStageTable.css";
import "./PlayoffStageTable.css"
import "@/app/components/ParticipantsView.css";
import { useTournament } from "@/app/tournaments/[slug]/TournamentProvider";

type MatchPhaseFilter = {
  phase?: PhaseType;
  groupIndex?: number | null;
  roundIndex?: number | null;
};

type GroupPlusPlayoffViewProps = {
  participants: Participant[];
  matches: Match[];
  onSaveScore?: (
    aId: number,
    bId: number,
    score: string,
    meta?: { phase: PhaseType; groupIndex?: number | null; roundIndex?: number | null }
  ) => Promise<void> | void;
  onOpenKeyboard?: (
    editingKey: string,
    context: { participantA: Participant; participantB: Participant },
    initialValue: string,
    phaseFilter?: { phase?: PhaseType; groupIndex?: number | null; roundIndex?: number | null }
  ) => void;
  onCloseKeyboard?: () => void;
  keyboardState?: {
    isOpen: boolean;
    editingKey: string | null;
    mobileKeyboardContext: { participantA: Participant; participantB: Participant } | null;
    editValue: string;
  };
  groupsCount?: number;
  advancePerGroup?: number;
  seeding?: "simple" | "snake";
};

export function GroupPlusPlayoffView({
  participants,
  matches,
  onSaveScore,
  onOpenKeyboard,
  onCloseKeyboard,
  keyboardState,
  groupsCount = 2,
  advancePerGroup = 2,
  seeding = "snake",
}: GroupPlusPlayoffViewProps) {

  const {
    findMatchBetween
  } = useTournament();

  const editingInputRef = useRef<HTMLInputElement | HTMLDivElement | null>(null);
  const firstHelpTooltip = useFirstHelpTooltip();

  // Вспомогательные функции
  function isValidParticipant(p: Participant | null | undefined): p is Participant {
    return !!p && (!!p.player || !!p.team);
  }

  function nextPow2(n: number) { let p = 1; while (p < n) p <<= 1; return p; }

  function distributeIntoGroups(items: Participant[], groupsCount: number, mode: "simple" | "snake"): Participant[][] {
    const groups: Participant[][] = Array.from({ length: groupsCount }, () => []);
    if (mode === "simple") {
      items.forEach((p, i) => groups[i % groupsCount].push(p));
    } else {
      let idx = 0, dir = 1;
      for (const p of items) {
        groups[idx].push(p);
        idx += dir;
        if (idx === groupsCount) { idx = groupsCount - 1; dir = -1; }
        else if (idx < 0) { idx = 0; dir = 1; }
      }
    }
    return groups;
  }

  type GroupStats = { id: number; name: string; wins: number; setsDiff: number; gamesDiff: number; };
  function computeGroupStats(group: Participant[], matches: Match[]): GroupStats[] {
    const map = new Map<number, GroupStats>();
    
    for (const p of group) 
      map.set(p.getId, { id: p.getId, name: p.displayName(), wins: 0, setsDiff: 0, gamesDiff: 0 });

    for (let i = 0; i < group.length; i++) {
      for (let j = i + 1; j < group.length; j++) {
        const a = group[i], b = group[j];
        const aId = a.getId, bId = b.getId;
        const m = findMatchBetween(aId, bId);
        if (!m || !m.scores || m.scores.length === 0) continue;

        let aSets = 0, bSets = 0, aGames = 0, bGames = 0;
        for (const [s1, s2] of m.scores) {
          aGames += s1; bGames += s2;
          if (s1 > s2) aSets++; else if (s2 > s1) bSets++;
        }
        if (aSets > bSets) map.get(aId)!.wins += 1;
        else if (bSets > aSets) map.get(bId)!.wins += 1;
        map.get(aId)!.setsDiff += (aSets - bSets);
        map.get(bId)!.setsDiff += (bSets - aSets);
        map.get(aId)!.gamesDiff += (aGames - bGames);
        map.get(bId)!.gamesDiff += (bGames - aGames);
      }
    }

    return Array.from(map.values()).sort((x, y) => {
      if (y.wins !== x.wins) return y.wins - x.wins;
      if (y.setsDiff !== x.setsDiff) return y.setsDiff - x.setsDiff;
      return y.gamesDiff - x.gamesDiff;
    });
  }

  function isCompletedMatch(m?: Match | null): boolean { return !!(m && m.scores && m.scores.length > 0); }
  function countCompletedPairsInGroup(group: Participant[], matches: Match[]): number {
    let done = 0;
    for (let i = 0; i < group.length; i++) {
      for (let j = i + 1; j < group.length; j++) {
        const aId = group[i].getId, bId = group[j].getId;
        if (isCompletedMatch(findMatchBetween(aId, bId))) done++;
      }
    }
    return done;
  }
  function isGroupStarted(group: Participant[], matches: Match[]): boolean {
    return countCompletedPairsInGroup(group, matches) > 0;
  }
  function makePlayoffQualifiersFromFiltered(
    groups: Participant[][],
    statsPerGroup: GroupStats[][],
    topK: number,
    matchesPerGroup: Match[][]
  ): (Participant | null)[] {
    const out: (Participant | null)[] = [];
    const G = groups.length;
    const order: number[] = Array.from({ length: G }, (_, i) => i);

    function pick(gi: number, place: number) {
      const group = groups[gi];
      const stats = statsPerGroup[gi];
      if (!isGroupStarted(group, matchesPerGroup[gi])) { out.push(null); return; }
      const slot = stats[place]; if (!slot) { out.push(null); return; }
      out.push(group.find(pp => pp.getId === slot.id) ?? null);
    }

    for (const gi of order) pick(gi, 0);
    if (topK >= 2) for (const gi of [...order].reverse()) pick(gi, 1);
    for (let place = 3; place <= topK; place++) {
      const wave = place % 2 === 1 ? order : [...order].reverse();
      for (const gi of wave) pick(gi, place - 1);
    }
    return out;
  }
  function buildSingleElimPairs(entrants: (Participant | null)[]) {
    const size = nextPow2(entrants.length || 1);
    const padded = entrants.slice();
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
  function pairWinnerId(
    a: Participant | null,
    b: Participant | null,
    matches: Match[],
    filter?: { phase?: PhaseType; groupIndex?: number | null; roundIndex?: number | null }
  ): number | null {
    const aId = a?.getId; 
    const bId = b?.getId;
    
    if (aId && !bId) return aId;
    if (!aId && bId) return bId;
    if (!aId || !bId) return null;
    const m = findMatchBetween(aId, bId, filter);
    if (!m) return null;
    const w = m.getWinnerId?.();
    return w && w > 0 ? w : null;
  }

  // Обработчики для сохранения
  const handleSaveGroup = useCallback((aId: number, bId: number, groupIndex: number) => {
    if (onSaveScore) {
      onSaveScore(aId, bId, keyboardState?.editValue || "", { 
        phase: PhaseType.Group, 
        groupIndex, 
        roundIndex: null 
      });
    }
  }, [onSaveScore, keyboardState?.editValue]);

  const handleSavePlayoff = useCallback((aId: number, bId: number, roundIndex: number) => {
    if (onSaveScore) {
      onSaveScore(aId, bId, keyboardState?.editValue || "", { 
        phase: PhaseType.Playoff, 
        groupIndex: null, 
        roundIndex 
      });
    }
  }, [onSaveScore, keyboardState?.editValue]);

  // Адаптер для группового этапа
  const GroupMatchCell: React.FC<{
    a: Participant | null;
    b: Participant | null;
    scoreString: string | null;
    phaseFilter?: { phase?: PhaseType; groupIndex?: number | null; roundIndex?: number | null };
  }> = ({ a, b, scoreString, phaseFilter }) => {
    const handleOpenKeyboard = useCallback((aId: number, bId: number, currentScore: string | null) => {
      if (!onOpenKeyboard || !a || !b) return;
      
      onOpenKeyboard(
        `${aId}_${bId}`,
        { participantA: a, participantB: b },
        currentScore && currentScore !== "—" ? currentScore : "",
        { 
          phase: PhaseType.Group, 
          groupIndex: phaseFilter?.groupIndex ?? null, 
          roundIndex: null 
        }
      );
    }, [onOpenKeyboard, a, b, phaseFilter?.groupIndex]);

    const handleSave = useCallback((aId: number, bId: number) => {
      handleSaveGroup(aId, bId, phaseFilter?.groupIndex ?? 0);
    }, [handleSaveGroup, phaseFilter?.groupIndex]);

    return (
      <ScoreCell
        a={a}
        b={b}
        scoreString={scoreString}
        phaseFilter={phaseFilter}
        editingKey={keyboardState?.editingKey}
        editValue={keyboardState?.editValue || ""}
        setEditValue={(value) => { /* глобальное состояние управляется родителем */ }}
        inputRef={editingInputRef}
        onSave={handleSave}
        onCancel={onCloseKeyboard}
        onOpenKeyboard={onOpenKeyboard ? handleOpenKeyboard : undefined}
        showHelpTooltip={false}
      />
    );
  };

  // Адаптер для плей-офф
  const PlayoffMatchCell: React.FC<{
    a: Participant | null;
    b: Participant | null;
    scoreString: string | null;
    phaseFilter?: { phase?: PhaseType; groupIndex?: number | null; roundIndex?: number | null };
  }> = ({ a, b, scoreString, phaseFilter }) => {
    const handleOpenKeyboard = useCallback((aId: number, bId: number, currentScore: string | null) => {
      if (!onOpenKeyboard || !a || !b) return;
      
      onOpenKeyboard(
        `${aId}_${bId}`,
        { participantA: a, participantB: b },
        currentScore && currentScore !== "—" ? currentScore : "",
        { 
          phase: PhaseType.Playoff, 
          groupIndex: null, 
          roundIndex: phaseFilter?.roundIndex ?? null 
        }
      );
    }, [onOpenKeyboard, a, b, phaseFilter?.roundIndex]);

    const handleSave = useCallback((aId: number, bId: number) => {
      handleSavePlayoff(aId, bId, phaseFilter?.roundIndex ?? 0);
    }, [handleSavePlayoff, phaseFilter?.roundIndex]);

    return (
      <ScoreCell
        a={a}
        b={b}
        scoreString={scoreString}
        phaseFilter={phaseFilter}
        editingKey={keyboardState?.editingKey}
        editValue={keyboardState?.editValue || ""}
        setEditValue={(value) => { /* глобальное состояние управляется родителем */ }}
        inputRef={editingInputRef}
        onSave={handleSave}
        onCancel={onCloseKeyboard}
        onOpenKeyboard={onOpenKeyboard ? handleOpenKeyboard : undefined}
        showHelpTooltip={false}
      />
    );
  };

  const ordered = useMemo(
    () => participants.filter(isValidParticipant).slice().sort((a, b) => a.displayName(false).localeCompare(b.displayName(false), "ru")),
    [participants]
  );
  const groups = useMemo(() => distributeIntoGroups(ordered, Math.max(1, groupsCount), seeding), [ordered, groupsCount, seeding]);
  const groupMatches: Match[][] = useMemo(
    () => groups.map((_, gi) => matches.filter(m => (m as any).phase === PhaseType.Group && (m as any).groupIndex === gi)),
    [groups, matches]
  );
  const groupStats = useMemo(() => groups.map((g, gi) => computeGroupStats(g, groupMatches[gi])), [groups, groupMatches]);
  const qualifiers = useMemo(
    () => makePlayoffQualifiersFromFiltered(groups, groupStats, advancePerGroup, groupMatches),
    [groups, groupStats, advancePerGroup, groupMatches]
  );
  const playoffRounds = useMemo(() => buildSingleElimPairs(qualifiers), [qualifiers]);

  const resolvedPlayoff = useMemo(() => {
    const copy = playoffRounds.map(r => r.map(([a, b]) => [a, b] as [Participant | null, Participant | null]));
    for (let r = 1; r < copy.length; r++) {
      const prev = copy[r - 1];
      for (let i = 0; i < copy[r].length; i++) {
        const w1 = pairWinnerId(prev[i * 2][0], prev[i * 2][1], matches, { phase: PhaseType.Playoff, roundIndex: r - 1 });
        const w2 = pairWinnerId(prev[i * 2 + 1][0], prev[i * 2 + 1][1], matches, { phase: PhaseType.Playoff, roundIndex: r - 1 });
        copy[r][i][0] = w1 ? ordered.find(p => p.getId === w1) ?? null : null;
        copy[r][i][1] = w2 ? ordered.find(p => p.getId === w2) ?? null : null;
      }
    }
    return copy;
  }, [playoffRounds, matches, ordered]);

  /** Разложение сетов по строкам для таблицы матча плей-офф */
  function getOrientedSetsFor(
    a: Participant | null,
    b: Participant | null,
    phaseFilter: { phase?: PhaseType; groupIndex?: number | null; roundIndex?: number | null }
  ) {
    const aId = a?.getId;
    const bId = b?.getId;
    if (!aId || !bId) return null;

    const m = findMatchBetween(aId, bId, phaseFilter);
    if (!m || !m.scores || m.scores.length === 0) return null;

    const id1 = m.player1?.id ?? m.team1?.id;
    const aFirst = id1 === aId;
    const s1 = m.scores[0], s2 = m.scores[1], s3 = m.scores[2];

    const val = (s?: [number, number], first?: boolean) => (s ? (first ? s[0] : s[1]) : null);

    return {
      aRow: [val(s1, aFirst), val(s2, aFirst), val(s3, aFirst)],
      bRow: [val(s1, !aFirst), val(s2, !aFirst), val(s3, !aFirst)],
    };
  }

  /* ---------------------------------- UI ---------------------------------- */
  function GroupBlock({ gIndex, group }: { gIndex: number; group: Participant[] }) {
    const matchesForGroup = groupMatches[gIndex];
    return (
      <GroupStageTable
        groupParticipants={group}
        groupMatches={matchesForGroup}
        groupIndex={gIndex}
        onSaveScore={(aId, bId, score) =>
          onSaveScore?.(aId, bId, score, { phase: PhaseType.Group, groupIndex: gIndex, roundIndex: null })
        }
        ScoreCellAdapter={GroupMatchCell}
      />
    );
  }

  return (
    <div>
      {/* ГРУППЫ */}
      <div className="card-container">
        {groups.map((g, gi) => (
          <GroupBlock key={gi} gIndex={gi} group={g} />
        ))}
      </div>

      {/* ПЛЕЙ-ОФФ */}
      <div style={{ marginTop: 16 }}>
        <PlayoffStageTable
          playOffParticipants={qualifiers}
          matches={matches}
          roundLabel={roundLabel}
          pairWinnerId={pairWinnerId}
          getOrientedSetsFor={getOrientedSetsFor}
          ScoreCellAdapter={PlayoffMatchCell}
        />
      </div>
    </div>
  );
}