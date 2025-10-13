"use client";

import { useRef, useCallback, useState, useEffect, useMemo } from "react";
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

type SingleEliminationViewProps = {
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

export function SingleEliminationView({
  participants,
  matches,
  canManage,
  onSaveScore,
  onOpenKeyboard,
  onCloseKeyboard,
  keyboardState,
}: SingleEliminationViewProps) {
  const { findMatchBetween } = useTournament();
  const editingInputRef = useRef<HTMLInputElement | HTMLDivElement | null>(null);
  const [editValue, setEditValue] = useState("");

  // Синхронизируем с глобальной клавиатурой если она открыта
  useEffect(() => {
    if (keyboardState?.isOpen) {
      setEditValue(keyboardState.editValue);
    }
  }, [keyboardState]);

  // Обработчик для сохранения счёта
  const handleSave = useCallback((aId: number, bId: number, roundIndex: number) => {
    if (onSaveScore) {
      onSaveScore(aId, bId, editValue || "", todayISO, {
        phase: PhaseType.Playoff,
        groupIndex: null,
        roundIndex,
      });
    }
  }, [onSaveScore, editValue]);

  // Адаптер для ScoreCell
  const PlayoffScoreCell: React.FC<{
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
        // Состояние редактирования
        editingKey={keyboardState?.editingKey}
        editValue={editValue}
        canManage={canManage}
        setEditValue={setEditValue}
        inputRef={editingInputRef}
        // Обработчики
        onSave={handleSaveWithRound}
        onCancel={handleCancel}
        onOpenKeyboard={onOpenKeyboard ? handleOpenKeyboard : undefined}
        showHelpTooltip={false}
      />
    );
  };

  return (
      <PlayoffStageTable
        playOffParticipants={participants}
        matches={matches}
        ScoreCellAdapter={PlayoffScoreCell}
      />
  );
}

export default SingleEliminationView;
