"use client";

import { useRef, useCallback, useState, useEffect, useMemo } from "react";
import { Participant } from "@/app/models/Participant";
import { Match, MatchPhase, PhaseType } from "@/app/models/Match";
import { PlayoffStageTable } from "./PlayoffStageTable";
import { ScoreCell } from "./ScoreCell";

type SingleEliminationViewProps = {
  participants: Participant[];
  matches: Match[];
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

export function SingleEliminationView({
  participants,
  matches,
  onSaveScore,
  onOpenKeyboard,
  onCloseKeyboard,
  keyboardState,
}: SingleEliminationViewProps) {
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
      onSaveScore(aId, bId, editValue || "", {
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
        // Состояние редактирования
        editingKey={keyboardState?.editingKey}
        editValue={editValue}
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