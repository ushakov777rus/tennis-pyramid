"use client";

import { useRef, useCallback } from "react";
import { Participant } from "@/app/models/Participant";
import { Match, PhaseType } from "@/app/models/Match";
import { GroupStageTable } from "./GroupStageTable";
import { ScoreCell } from "./ScoreCell";

type RoundRobinViewProps = {
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
};

export function RoundRobinView({
  participants,
  matches,
  onSaveScore,
  onOpenKeyboard,
  onCloseKeyboard,
  keyboardState,
}: RoundRobinViewProps) {

  const editingInputRef = useRef<HTMLInputElement | HTMLDivElement |null>(null);

  // Обработчик для onSave (без глобальной клавиатуры)
  const handleSave = useCallback((aId: number, bId: number) => {
    if (onSaveScore) {
      onSaveScore(aId, bId, keyboardState?.editValue || "", { phase: PhaseType.Group });
    }
  }, [onSaveScore, keyboardState?.editValue]);

  // Адаптер для GroupStageTable
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
        { phase: PhaseType.Group }
      );
    }, [onOpenKeyboard, a, b]);

    return (
      <ScoreCell
        a={a}
        b={b}
        scoreString={scoreString}
        phaseFilter={phaseFilter}
        // Состояние редактирования
        editingKey={keyboardState?.editingKey}
        editValue={keyboardState?.editValue || ""}
        setEditValue={(value) => { /* глобальное состояние управляется родителем */ }}
        inputRef={editingInputRef}
        // Обработчики
        onSave={handleSave}
        onCancel={onCloseKeyboard}
        onOpenKeyboard={onOpenKeyboard ? handleOpenKeyboard : undefined}
        showHelpTooltip={false}
      />
    );
  };

  return (
    <GroupStageTable
      groupParticipants={participants}
      groupMatches={matches}
      onSaveScore={onSaveScore}
      ScoreCellAdapter={GroupMatchCell}
    />
  );
}