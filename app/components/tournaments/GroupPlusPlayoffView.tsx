"use client";

import { useCallback, useMemo, useRef, useState, useEffect } from "react";
import { Participant } from "@/app/models/Participant";
import { Match, MatchPhase, PhaseType } from "@/app/models/Match";

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
  participantsInGroupCount?: number;
  advancePerGroup?: number;
  seeding?: "simple" | "snake";
  groupAssignments?: Record<number, number>;
};

type GroupStats = { id: number; name: string; wins: number; setsDiff: number; gamesDiff: number };

function isValidParticipant(p: Participant | null | undefined): p is Participant {
  return !!p && (!!p.player || !!p.team);
}

function distributeIntoGroups(items: Participant[], groupsCount: number, mode: "simple" | "snake"): Participant[][] {
  const groups: Participant[][] = Array.from({ length: groupsCount }, () => []);
  if (mode === "simple") {
    items.forEach((p, i) => groups[i % groupsCount].push(p));
  } else {
    let idx = 0;
    let dir = 1;
    for (const p of items) {
      groups[idx].push(p);
      idx += dir;
      if (idx === groupsCount) {
        idx = groupsCount - 1;
        dir = -1;
      } else if (idx < 0) {
        idx = 0;
        dir = 1;
      }
    }
  }
  return groups;
}

function buildGroupsWithAssignments(
  items: Participant[],
  groupsCount: number,
  assignments: Record<number, number> | undefined,
  mode: "simple" | "snake"
): Participant[][] {
  if (!assignments || Object.keys(assignments).length === 0) {
    return distributeIntoGroups(items, groupsCount, mode);
  }

  const groups: Participant[][] = Array.from({ length: groupsCount }, () => []);
  const fallback: Participant[] = [];

  items.forEach((participant) => {
    const id = participant.getId;
    const groupIndex = assignments[id];
    if (
      typeof groupIndex === "number" &&
      groupIndex >= 0 &&
      groupIndex < groupsCount
    ) {
      groups[groupIndex].push(participant);
    } else {
      fallback.push(participant);
    }
  });

  if (fallback.length > 0) {
    const auto = distributeIntoGroups(fallback, groupsCount, mode);
    auto.forEach((autoGroup, index) => {
      groups[index].push(...autoGroup);
    });
  }

  return groups;
}

function computeGroupStats(group: Participant[], matchesForGroup: Match[]): GroupStats[] {
  const map = new Map<number, GroupStats>();

  for (const p of group) {
    map.set(p.getId, { id: p.getId, name: p.displayName(), wins: 0, setsDiff: 0, gamesDiff: 0 });
  }

  for (let i = 0; i < group.length; i++) {
    for (let j = i + 1; j < group.length; j++) {
      const a = group[i];
      const b = group[j];
      const aId = a.getId;
      const bId = b.getId;
      const match = matchesForGroup.find((m) => {
        const id1 = m.player1?.id ?? m.team1?.id;
        const id2 = m.player2?.id ?? m.team2?.id;
        return (id1 === aId && id2 === bId) || (id1 === bId && id2 === aId);
      });
      if (!match || !match.scores || match.scores.length === 0) continue;

      let aSets = 0;
      let bSets = 0;
      let aGames = 0;
      let bGames = 0;
      for (const [s1, s2] of match.scores) {
        aGames += s1;
        bGames += s2;
        if (s1 > s2) aSets++;
        else if (s2 > s1) bSets++;
      }
      if (aSets > bSets) map.get(aId)!.wins += 1;
      else if (bSets > aSets) map.get(bId)!.wins += 1;
      map.get(aId)!.setsDiff += aSets - bSets;
      map.get(bId)!.setsDiff += bSets - aSets;
      map.get(aId)!.gamesDiff += aGames - bGames;
      map.get(bId)!.gamesDiff += bGames - aGames;
    }
  }

  return Array.from(map.values()).sort((x, y) => {
    if (y.wins !== x.wins) return y.wins - x.wins;
    if (y.setsDiff !== x.setsDiff) return y.setsDiff - x.setsDiff;
    return y.gamesDiff - x.gamesDiff;
  });
}

function isCompletedMatch(m?: Match | null): boolean {
  return !!(m && m.scores && m.scores.length > 0);
}

function hasParticipantPlayedAnyMatch(participantId: number, matches: Match[]): boolean {
  return matches.some((match) => {
    const id1 = match.player1?.id ?? match.team1?.id;
    const id2 = match.player2?.id ?? match.team2?.id;
    if (id1 !== participantId && id2 !== participantId) return false;
    return isCompletedMatch(match);
  });
}

function makePlayoffQualifiersFromFiltered(
  groups: Participant[][],
  statsPerGroup: GroupStats[][],
  topK: number,
  matchesPerGroup: Match[][]
): (Participant | null)[] {
  const out: (Participant | null)[] = [];

  for (let place = 0; place < topK; place++) {
    for (let gi = 0; gi < groups.length; gi++) {
      const group = groups[gi];
      const stats = statsPerGroup[gi];
      const matchesForGroup = matchesPerGroup[gi];

      const slot = stats[place];

      if (!slot) {
        out.push(null);
        continue;
      }

      const qualifier = group.find((pp) => pp.getId === slot.id) ?? null;
      const hasPlayed = qualifier && hasParticipantPlayedAnyMatch(qualifier.getId, matchesForGroup);
      out.push(qualifier && hasPlayed ? qualifier : null);
    }
  }

  console.log("Make playoff qualifiers", topK, groups.length, out.length);

  return out;
}

export function GroupPlusPlayoffView({
  participants,
  matches,
  canManage,
  onSaveScore,
  onOpenKeyboard,
  onCloseKeyboard,
  keyboardState,
  participantsInGroupCount = 4,
  advancePerGroup = 2,
  seeding = "snake",
  groupAssignments,
}: GroupPlusPlayoffViewProps) {

  const {
    findMatchBetween
  } = useTournament();

  const editingInputRef = useRef<HTMLInputElement | HTMLDivElement | null>(null);
  const [editValue, setEditValue] = useState("");

  const effectiveGroupSize = Math.max(1, Number.isFinite(participantsInGroupCount) ? participantsInGroupCount : 4);
  const maxAssignedGroupIndex =
    groupAssignments && Object.keys(groupAssignments).length
      ? Math.max(
          ...Object.values(groupAssignments).map((value) =>
            typeof value === "number" && Number.isFinite(value) ? value : 0
          )
        )
      : 0;
  const groupCount = Math.max(
    1,
    maxAssignedGroupIndex + 1,
    Math.ceil(participants.length / effectiveGroupSize)
  );

  // Синхронизируем с глобальной клавиатурой если она открыта
  useEffect(() => {
    if (keyboardState?.isOpen) {
      setEditValue(keyboardState.editValue);
    }
  }, [keyboardState]);

  // Вспомогательные функции
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
    showHelpTooltip: boolean;
  }> = ({ a, b, scoreString, phaseFilter, showHelpTooltip }) => {
    const handleOpenKeyboard = (aId: number, bId: number, currentScore: string | null) => {
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
    };

    const handleSave = (aId: number, bId: number) => {
      handleSaveGroup(aId, bId, phaseFilter?.groupIndex ?? 0);
    };

    const handleCancel = () => {
      setEditValue("");
      onCloseKeyboard?.();
    };

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
        showHelpTooltip={showHelpTooltip}
      />
    );
  };

  // Адаптер для плей-офф
  const PlayoffMatchCell: React.FC<{
    a: Participant | null;
    b: Participant | null;
    scoreString: string | null;
    phaseFilter: MatchPhase;
    showHelpTooltip: boolean;
  }> = ({ a, b, scoreString, phaseFilter, showHelpTooltip }) => {
    const handleOpenKeyboard = (aId: number, bId: number, currentScore: string | null) => {
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
    };

    const handleSave = (aId: number, bId: number) => {
      handleSavePlayoff(aId, bId, phaseFilter?.roundIndex ?? 0);
    };

    const handleCancel = () => {
      setEditValue("");
      onCloseKeyboard?.();
    };

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
        showHelpTooltip={showHelpTooltip}
      />
    );
  };

  const ordered = useMemo(
    () => participants.filter(isValidParticipant).slice().sort((a, b) => a.displayName(false).localeCompare(b.displayName(false), "ru")),
    [participants]
  );
  const groups = useMemo(
    () =>
      buildGroupsWithAssignments(
        ordered,
        groupCount,
        groupAssignments,
        seeding
      ),
    [ordered, groupCount, groupAssignments, seeding]
  );
  const groupMatches: Match[][] = useMemo(
    () => groups.map((_, gi) => matches.filter(m => (m as any).phase === PhaseType.Group && (m as any).groupIndex === gi)),
    [groups, matches]
  );
  const groupStats = useMemo(() => groups.map((g, gi) => computeGroupStats(g, groupMatches[gi])), [groups, groupMatches]);
  const qualifiers = useMemo(
    () => makePlayoffQualifiersFromFiltered(groups, groupStats, advancePerGroup, groupMatches),
    [groups, groupStats, advancePerGroup, groupMatches]
  );

  return (
    <div>
      {/* ГРУППЫ */}
      <h2 style={{ marginTop: "16px", marginBottom:"16px" }}>Группы</h2>
      <div className="card-container">
        {groups.map((group, gIndex) => {
          const matchesForGroup = groupMatches[gIndex];
          return (
            <GroupStageTable
              key={gIndex}
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
        })}
      </div>

      {/* ПЛЕЙ-ОФФ */}
      <h2 style={{ marginTop: "16px", marginBottom:"16px" }}>Плейофф</h2>
      <div>
        <PlayoffStageTable
          playOffParticipants={qualifiers}
          canManage={canManage}
          ScoreCellAdapter={PlayoffMatchCell}
        />
      </div>
    </div>
  );
}
