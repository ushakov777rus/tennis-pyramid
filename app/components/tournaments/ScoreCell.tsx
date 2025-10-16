"use client";

import React, { RefObject, useCallback, useRef, useState } from "react";
import { Participant } from "@/app/models/Participant";
import { MatchPhase } from "@/app/models/Match";

export type ScoreCellProps = {
  a: Participant | null;
  b: Participant | null;
  phaseFilter: MatchPhase;

  /** Хелперы/состояния, приходящие от родителя */
  scoreString: string | null;

  // Состояние редактирования (может быть глобальным или локальным)
  editingKey?: string | null;
  editValue: string | null;
  canManage: boolean;
  showHelpTooltip: boolean;
  setEditValue: (v: string) => void;

  // Обработчики
  onSave: (aId: number, bId: number, filter: MatchPhase) => void;
  onCancel?: () => void;
  onOpenKeyboard?: (aId: number, bId: number, currentScore: string | null) => void;
  onStartEdit?: (aId: number, bId: number, currentScore: string | null) => void;

  inputRef: RefObject<HTMLInputElement | HTMLDivElement | null>;
  
  /** Опционально: для показа подсказки в групповом этапе */
  saving?: boolean;
};

export function ScoreCell({
  a,
  b,
  phaseFilter,
  scoreString,
  editingKey: externalEditingKey,
  editValue,
  canManage,
  setEditValue,
  onOpenKeyboard,
  onStartEdit,
  showHelpTooltip,
}: ScoreCellProps) {

  // Локальное состояние для случаев, когда нет глобального управления
  const [localEditingKey, setLocalEditingKey] = useState<string | null>(null);
  const [mobileKeyboardContext, setMobileKeyboardContext] = useState<{
    aId: number;
    bId: number;
  } | null>(null);

  const editingInputRef = useRef<HTMLInputElement | HTMLDivElement | null>(null);

  // Определяем, используем ли глобальное или локальное состояние
  const isGlobalKeyboard = !!onOpenKeyboard;
  const editingKey = isGlobalKeyboard ? externalEditingKey : localEditingKey;
  
  // Вспомогательные функции
  const pairKey = useCallback((aId: number, bId: number) => 
    `${aId}_${bId}`, []);

  const startEdit = useCallback((aId: number, bId: number, currentScore: string | null) => {
    const initialValue = currentScore && currentScore !== "—" ? currentScore : "";

    if (onOpenKeyboard) {
      // Используем глобальную клавиатуру
      onOpenKeyboard(aId, bId, currentScore);
    } else if (onStartEdit) {
      // Используем переданный обработчик (для обратной совместимости)
      onStartEdit(aId, bId, currentScore);
    } else {
      // Локальное управление (старое поведение)
      const k = pairKey(aId, bId);
      setLocalEditingKey(k);
      setEditValue(initialValue);
      editingInputRef.current = null;

      // Устанавливаем контекст для мобильной клавиатуры
      setMobileKeyboardContext({ aId, bId });
    }
  }, [onOpenKeyboard, onStartEdit, pairKey, setEditValue]);

  const aId = a?.getId;
  const bId = b?.getId;
  const canEdit = !!aId && !!bId;
  const localScoreString = canEdit ? scoreString : null;
  const kkk = canEdit ? pairKey(aId!, bId!) : undefined;
  const isEditing = !!kkk && editingKey === kkk;
  const shouldShowHelpTooltip = canEdit && !localScoreString && !isEditing && showHelpTooltip && canManage;

console.log("ScoreCell debug:", {
    aId,
    bId,
    canEdit,
    localScoreString,
    kkk,
    editingKey,
    isEditing,
    showHelpTooltip,
    canManage,
    shouldShowHelpTooltip
  });

  if (showHelpTooltip) {
    console.log("Uraaaaaaaaaaaaaaaaaaa");
  }
  console.log("Nop");

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
                className="vs-click"
                onClick={() => startEdit(aId!, bId!, localScoreString)}
                disabled={!canManage}
                title="Добавить счёт"
                aria-label="Добавить счёт"
              >
                vs
              </button>
            </div>
          ) : (
            <div className="score-edit-wrap">
              <span className="rr-score rr-score--mirror">{editValue ? editValue.replace(/,/g, '\n') : ""}</span>
            </div>
          )
        ) : (
          <span className="vs vs-placeholder" aria-hidden>
            vs
          </span>
        )}
      </div>
    </>
  );
}
