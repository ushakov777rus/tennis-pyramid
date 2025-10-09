"use client";

import React, { RefObject, useCallback, useRef, useState } from "react";
import { Participant } from "@/app/models/Participant";
import { PhaseType } from "@/app/models/Match";
import { SaveIconButton, CancelIconButton } from "@/app/components/controls/IconButtons";
import { ScoreKeyboard, useScoreKeyboardAvailable } from "../controls/ScoreKeyboard";

/** Локальный тип фильтра фазы (совпадает по форме с используемым в родителе) */
export type MatchPhaseFilter = {
  phase?: PhaseType;
  groupIndex?: number | null;
  roundIndex?: number | null;
};

export type ScoreCellProps = {
  a: Participant | null;
  b: Participant | null;
  phaseFilter?: MatchPhaseFilter;

  /** Хелперы/состояния, приходящие от родителя */
  scoreString: string | null;

  editValue: string;
  setEditValue: (v: string) => void;

  onSave: (aId: number, bId: number, filter?: MatchPhaseFilter) => void;

  inputRef: RefObject<HTMLInputElement | HTMLDivElement | null>;
  
  /** Опционально: для показа подсказки в групповом этапе */
  showHelpTooltip?: boolean;
};

export function ScoreCell({
  a,
  b,
  phaseFilter,
  scoreString,
  editValue,
  setEditValue,
  onSave,
  inputRef,
  showHelpTooltip = false,
}: ScoreCellProps) {

  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const editingInputRef = useRef<HTMLInputElement | HTMLDivElement | null>(null);

  const [mobileKeyboardContext, setMobileKeyboardContext] = useState<{
    aId: number;
    bId: number;
  } | null>(null);

  const mobileKeyboardAvailable = useScoreKeyboardAvailable();
  
  // Вспомогательные функции
  const pairKey = useCallback((aId: number, bId: number) => 
    `${aId}_${bId}`, []);

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
      await onSave?.(aId, bId, { phase: PhaseType.Group });
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
  }, [editValue, onSave]);


  const aId = a?.getId;
  const bId = b?.getId;
  const canEdit = !!aId && !!bId;
  const localScoreString = canEdit ? scoreString : null;
  const kkk = canEdit ? pairKey(aId!, bId!) : undefined;
  const isEditing = !!kkk && editingKey === kkk;
  const shouldShowHelpTooltip = canEdit && !localScoreString && !isEditing && showHelpTooltip;

  console.log("ScoreCell", mobileKeyboardAvailable, mobileKeyboardContext);

  return (
    <>
    <div className="score-cell">
      {canEdit ? (
        localScoreString ? (
          <span className="rr-score rr-score--mirror">{localScoreString}</span>
        ) : !isEditing ? (
          <div className="score-cell__button-wrap">
            {shouldShowHelpTooltip && <div className="help-tooltip">Введите счёт</div>}
            <button
              type="button"
              className="vs vs-click"
              onClick={() => 
                {
                  startEdit(aId!, bId!, localScoreString)
                  if (mobileKeyboardAvailable) {
                    setMobileKeyboardContext({ aId, bId});
                  }
                }}
              title="Добавить счёт"
              aria-label="Добавить счёт"
            >
              vs
            </button>
          </div>
        ) : (
          <div className="score-edit-wrap">
            <input
              className="input score-input"
              value={editValue}
              readOnly={mobileKeyboardAvailable}
              ref={(node) => {
                // синхронизируем внешний ref
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (inputRef as any).current = node;
              }}
              placeholder="6-4, 4-6, 10-8"
              pattern="[0-9\\s,:-]*"
              autoFocus={!mobileKeyboardAvailable}
              onFocus={(e) => {
                if (mobileKeyboardAvailable) e.currentTarget.blur();
              }}
              onKeyDown={(e) => {
                if (!mobileKeyboardAvailable) {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    onSave(aId!, bId!, phaseFilter);
                  }
                  if (e.key === "Escape") {
                    e.preventDefault();
                    cancelEdit();
                  }
                }
              }}
              onChange={(e) => {
                if (!mobileKeyboardAvailable) {
                  setEditValue(e.target.value);
                }
              }}
            />
            {!mobileKeyboardAvailable && (
              <>
                <SaveIconButton
                  className="lg"
                  title="Сохранить счёт"
                  onClick={() => onSave(aId!, bId!, phaseFilter)}
                  disabled={saving}
                />
                <CancelIconButton
                  className="lg"
                  title="Отмена"
                  onClick={cancelEdit}
                  disabled={saving}
                />
              </>
            )}
          </div>
        )
      ) : (
        <span className="vs vs-placeholder" aria-hidden>
          vs
        </span>
      )}
    </div>

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