"use client";

import { useCallback, useRef, useState } from "react";
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
};


export function RoundRobinView({
  participants,
  matches,
  onSaveScore,
}: RoundRobinViewProps) {

  // Состояния для редактирования
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const editingInputRef = useRef<HTMLInputElement | HTMLDivElement | null>(null);

  const [mobileKeyboardContext, setMobileKeyboardContext] = useState<{
    aId: number;
    bId: number;
  } | null>(null);

  const saveEdit = useCallback(async (aId: number, bId: number) => {
    const node = editingInputRef.current;
    const draft = node instanceof HTMLInputElement ? node.value : editValue;
    const nextValue = (draft ?? "").trim();

    if (!nextValue) {
      alert('Введите счёт');
      return;
    }

    try {
      setSaving(true);
      await onSaveScore?.(aId, bId, nextValue, { phase: PhaseType.Group });
      setEditingKey(null);
      setEditValue("");
      editingInputRef.current = null;
      setMobileKeyboardContext(null);
    } catch (err) {
      console.error("Ошибка при сохранении счёта:", err);
      alert(err instanceof Error ? err.message : "Не удалось сохранить счёт");
    } finally {
      setSaving(false);
    }
  }, [editValue, onSaveScore]);

  // Адаптер для GroupStageTable
  const GroupMatchCell: React.FC<{
    a: Participant | null;
    b: Participant | null;
    scoreString: string | null;
    phaseFilter?: { phase?: PhaseType; groupIndex?: number | null; roundIndex?: number | null };
  }> = ({ a, b, scoreString, phaseFilter }) => (
    <ScoreCell
      a={a}
      b={b}
      scoreString={scoreString}
      phaseFilter={phaseFilter}
      // helpers/state 
      editValue={editValue}
      setEditValue={setEditValue}
      inputRef={editingInputRef}
      onSave={(aId, bId, f) => saveEdit(aId, bId)}
      showHelpTooltip={false}
    />
  );

  return (
    <>
      <GroupStageTable
        groupParticipants={participants}
        groupMatches={matches}
        onSaveScore={onSaveScore}
        ScoreCellAdapter={GroupMatchCell}
      />
    </>
  );
}