"use client";

import { useRef, useCallback, useState, useEffect } from "react";
import { Participant } from "@/app/models/Participant";
import { Match, MatchPhase, PhaseType } from "@/app/models/Match";
import { GroupStageTable } from "./GroupStageTable";
import { ScoreCell } from "./ScoreCell";

type RoundRobinViewProps = {
  participants: Participant[];
  matches: Match[];
  canManage: boolean;
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

export function RoundRobinView({
  participants,
  matches,
  canManage,
  onSaveScore,
  onOpenKeyboard,
  onCloseKeyboard,
  keyboardState,
}: RoundRobinViewProps) {

  const editingInputRef = useRef<HTMLInputElement | HTMLDivElement |null>(null);
  const [editValue, setEditValue] = useState("");

  // Обработчик для onSave
  const handleSave = useCallback((aId: number, bId: number) => {
    if (onSaveScore) {
      onSaveScore(aId, bId, editValue || "", { phase: PhaseType.Group, groupIndex: null, roundIndex: null });
    }
  }, [onSaveScore, editValue]);

  // Синхронизируем с глобальной клавиатурой если она открыта
  useEffect(() => {
    if (keyboardState?.isOpen) {
      setEditValue(keyboardState.editValue);
    }
  }, [keyboardState]);

  // Адаптер для GroupStageTable
  const GroupMatchCell: React.FC<{
    a: Participant | null;
    b: Participant | null;
    scoreString: string | null;
    phaseFilter: MatchPhase;
  }> = ({ a, b, scoreString, phaseFilter }) => {
    const handleOpenKeyboard = useCallback((aId: number, bId: number, currentScore: string | null) => {
      if (!onOpenKeyboard || !a || !b) return;
      
      // Сбрасываем локальное состояние при открытии клавиатуры
      setEditValue(currentScore && currentScore !== "—" ? currentScore : "");
      
      onOpenKeyboard(
        `${aId}_${bId}`,
        { participantA: a, participantB: b },
        currentScore && currentScore !== "—" ? currentScore : "",
        { phase: PhaseType.Group, groupIndex: null, roundIndex: null }
      );
    }, [onOpenKeyboard, a, b]);

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
        onSave={handleSave}
        onCancel={handleCancel}
        onOpenKeyboard={onOpenKeyboard ? handleOpenKeyboard : undefined}
        showHelpTooltip={false}
      />
    );
  };

  return (
    <div className="card-container">
      <GroupStageTable
        groupParticipants={participants}
        groupMatches={matches}
        groupIndex={null}
        canManage={canManage}
        onSaveScore={onSaveScore}
        ScoreCellAdapter={GroupMatchCell}
      />
    </div>
  );
}