"use client";

import { useCallback, useMemo, useRef, useState, useEffect } from "react";
import { Participant } from "@/app/models/Participant";
import { Match, MatchPhase, PhaseType } from "@/app/models/Match";

import { useFirstHelpTooltip } from "@/app/hooks/useFirstHelpTooltip";
import { ScoreCell } from "./ScoreCell";

import { GroupStageTable } from "./GroupStageTable";
import { PlayoffStageTable } from "./PlayoffStageTable";

import "./PyramidView.css";
import "./GroupStageTable.css";
import "./PlayoffStageTable.css"
import "@/app/components/ParticipantsView.css";
import { useTournament } from "@/app/tournaments/[slug]/TournamentProvider";

const todayISO = new Date().toISOString().split("T")[0];

const formatDateForInput = (value?: Date | string | null): string => {
  if (!value) return todayISO;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? todayISO : date.toISOString().split("T")[0];
};

type GroupPlusPlayoffViewProps = {
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
  groupsCount?: number;
  advancePerGroup?: number;
  seeding?: "simple" | "snake";
};

export function GroupPlusPlayoffView({
  participants,
  matches,
  canManage,
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
  const [editValue, setEditValue] = useState("");
  const firstHelpTooltip = useFirstHelpTooltip();

  // Синхронизируем с глобальной клавиатурой если она открыта
  useEffect(() => {
    if (keyboardState?.isOpen) {
      setEditValue(keyboardState.editValue);
    }
  }, [keyboardState]);

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
    
    // Проходим по всем местам от 1 до topK
    for (let place = 0; place < topK; place++) {
      // Для каждого места собираем участников из всех групп
      for (let gi = 0; gi < groups.length; gi++) {
        const group = groups[gi];
        const stats = statsPerGroup[gi];
        const groupMatches = matchesPerGroup[gi];
                
        // Берем участника на текущем месте (place) в текущей группе
        const slot = stats[place];
        
        if (!slot) {
          out.push(null);
          continue;
        }
        
        // Находим участника по ID
        const qualifier = group.find(pp => pp.getId === slot.id) ?? null;
        
        // Проверяем, сыграл ли этот участник хотя бы один матч
        const hasPlayed = qualifier && hasParticipantPlayedAnyMatch(qualifier.getId, group, groupMatches);
        
        if (qualifier && hasPlayed) {
          out.push(qualifier);
        } else {
          out.push(null);
        }
      }
    }
    
    return out;
  }

// Вспомогательная функция для проверки, сыграл ли участник хотя бы один матч
function hasParticipantPlayedAnyMatch(participantId: number, group: Participant[], matches: Match[]): boolean {
  for (const p of group) {
    if (p.getId === participantId) continue; // пропускаем самого себя
    
    const match = findMatchBetween(participantId, p.getId);
    if (match && isCompletedMatch(match)) {
      return true;
    }
  }
  return false;
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

  // Обработчики для сохранения
  const handleSaveGroup = useCallback((aId: number, bId: number, groupIndex: number) => {
    if (onSaveScore) {
      onSaveScore(aId, bId, editValue || "", todayISO, { 
        phase: PhaseType.Group, 
        groupIndex, 
        roundIndex: null 
      });
    }
  }, [onSaveScore, editValue]);

  const handleSavePlayoff = useCallback((aId: number, bId: number, roundIndex: number) => {
    if (onSaveScore) {
      onSaveScore(aId, bId, editValue || "", todayISO, { 
        phase: PhaseType.Playoff, 
        groupIndex: null, 
        roundIndex 
      });
    }
  }, [onSaveScore, editValue]);

  // Адаптер для группового этапа
  const GroupMatchCell: React.FC<{
    a: Participant | null;
    b: Participant | null;
    scoreString: string | null;
    phaseFilter: MatchPhase;
  }> = ({ a, b, scoreString, phaseFilter }) => {
    const handleOpenKeyboard = useCallback((aId: number, bId: number, currentScore: string | null) => {
      if (!onOpenKeyboard || !a || !b) return;
      
      setEditValue(currentScore && currentScore !== "—" ? currentScore : "");
      const match = findMatchBetween(a.getId, b.getId, { 
        phase: PhaseType.Group, 
        groupIndex: phaseFilter?.groupIndex ?? null, 
        roundIndex: null 
      });
      const initialDate = formatDateForInput(match?.date ?? null);
      
      onOpenKeyboard(
        `${aId}_${bId}`,
        { participantA: a, participantB: b },
        currentScore && currentScore !== "—" ? currentScore : "",
        initialDate,
        { 
          phase: PhaseType.Group, 
          groupIndex: phaseFilter?.groupIndex ?? null, 
          roundIndex: null 
        }
      );
    }, [onOpenKeyboard, a, b, findMatchBetween, phaseFilter?.groupIndex]);

    const handleSave = useCallback((aId: number, bId: number) => {
      handleSaveGroup(aId, bId, phaseFilter?.groupIndex ?? 0);
    }, [handleSaveGroup, phaseFilter?.groupIndex]);

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

  // Адаптер для плей-офф
  const PlayoffMatchCell: React.FC<{
    a: Participant | null;
    b: Participant | null;
    scoreString: string | null;
    phaseFilter: MatchPhase;
  }> = ({ a, b, scoreString, phaseFilter }) => {
    const handleOpenKeyboard = useCallback((aId: number, bId: number, currentScore: string | null) => {
      if (!onOpenKeyboard || !a || !b) return;
      
      setEditValue(currentScore && currentScore !== "—" ? currentScore : "");
      const match = findMatchBetween(a.getId, b.getId, { 
        phase: PhaseType.Playoff, 
        groupIndex: null, 
        roundIndex: phaseFilter?.roundIndex ?? null 
      });
      const initialDate = formatDateForInput(match?.date ?? null);
      
      onOpenKeyboard(
        `${aId}_${bId}`,
        { participantA: a, participantB: b },
        currentScore && currentScore !== "—" ? currentScore : "",
        initialDate,
        { 
          phase: PhaseType.Playoff, 
          groupIndex: null, 
          roundIndex: phaseFilter?.roundIndex ?? null 
        }
      );
    }, [onOpenKeyboard, a, b, findMatchBetween, phaseFilter?.roundIndex]);

    const handleSave = useCallback((aId: number, bId: number) => {
      handleSavePlayoff(aId, bId, phaseFilter?.roundIndex ?? 0);
    }, [handleSavePlayoff, phaseFilter?.roundIndex]);

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

  function GroupBlock({ gIndex, group }: { gIndex: number; group: Participant[] }) {
    const matchesForGroup = groupMatches[gIndex];
    return (
      <GroupStageTable
        groupParticipants={group}
        groupMatches={matchesForGroup}
        groupIndex={gIndex}
        canManage={canManage}
        onSaveScore={(aId, bId, score, matchDate, meta) =>
          onSaveScore?.(aId, bId, score, matchDate || todayISO, meta)
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
          ScoreCellAdapter={PlayoffMatchCell}
        />
      </div>
    </div>
  );
}
