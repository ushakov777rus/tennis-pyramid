"use client";

import { useCallback, useRef, useState } from "react";
import { Participant } from "@/app/models/Participant";
import { Match, PhaseType } from "@/app/models/Match";
import { GroupStageTable } from "./GroupStageTable";
import { ScoreCell } from "./ScoreCell";
import { ScoreKeyboard, useScoreKeyboardAvailable } from "@/app/components/controls/ScoreKeyboard";

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
  const mobileKeyboardAvailable = useScoreKeyboardAvailable();
  const [mobileKeyboardContext, setMobileKeyboardContext] = useState<{
    aId: number;
    bId: number;
  } | null>(null);

  // Вспомогательные функции
  const pairKey = useCallback((aId: number, bId: number) => 
    `${Math.min(aId, bId)}_${Math.max(aId, bId)}`, []);

  const startEdit = useCallback((aId: number, bId: number, currentScore: string | null) => {
    const k = pairKey(aId, bId);
    setEditingKey(k);
    setEditValue(currentScore && currentScore !== "—" ? currentScore : "");
    editingInputRef.current = null;
  }, [pairKey]);

  const cancelEdit = useCallback(() => {
    setEditingKey(null);
    setEditValue("");
    editingInputRef.current = null;
    setMobileKeyboardContext(null);
  }, []);

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

  // Функция для получения счёта матча
  const getMatchScore = useCallback((aId: number | undefined, bId: number | undefined): string | null => {
    if (aId == undefined || bId == undefined)
      return null;

    const match = matches.find((m) => {
      const id1 = m.player1?.id ?? m.team1?.id;
      const id2 = m.player2?.id ?? m.team2?.id;
      return (id1 === aId && id2 === bId) || (id1 === bId && id2 === aId);
    });
    return match ? match.formatResult() : null;
  }, [matches]);

  // Адаптер для GroupStageTable
  const GroupMatchCell: React.FC<{
    a: Participant | null;
    b: Participant | null;
    phaseFilter?: { phase?: PhaseType; groupIndex?: number | null; roundIndex?: number | null };
  }> = ({ a, b, phaseFilter }) => (
    <ScoreCell
      a={a}
      b={b}
      phaseFilter={phaseFilter}
      // helpers/state
      scoreString={getMatchScore(a?.getId, b?.getId)}
      pairKey={pairKey}
      editingKey={editingKey}
      editValue={editValue}
      setEditValue={setEditValue}
      saving={saving}
      inputRef={editingInputRef}
      mobileKeyboardAvailable={mobileKeyboardAvailable}
      onStartEdit={(aId, bId, currentScore, f) => {
        startEdit(aId, bId, currentScore);
        if (mobileKeyboardAvailable) {
          setMobileKeyboardContext({ aId, bId});
        }
      }}
      onSave={(aId, bId, f) => saveEdit(aId, bId)}
      onCancel={cancelEdit}
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
      
      {/* Мобильная клавиатура */}
      {mobileKeyboardAvailable && mobileKeyboardContext && (
        <ScoreKeyboard
          inputRef={editingInputRef}
          value={editValue}
          onChange={setEditValue}
          onSave={() =>
            saveEdit(mobileKeyboardContext.aId, mobileKeyboardContext.bId)
          }
          onCancel={cancelEdit}
          disabled={saving}
          autoFocus={false}
        />
      )}
    </>
  );
}