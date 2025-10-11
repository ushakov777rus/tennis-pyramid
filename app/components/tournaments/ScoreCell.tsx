"use client";

import React, { RefObject, useCallback, useRef, useState } from "react";
import { Participant } from "@/app/models/Participant";
import { MatchPhase, PhaseType } from "@/app/models/Match";
import { useUser } from "../UserContext";
import { UserRole } from "@/app/models/Users";

export type ScoreCellProps = {
  a: Participant | null;
  b: Participant | null;
  phaseFilter: MatchPhase;

  /** Хелперы/состояния, приходящие от родителя */
  scoreString: string | null;

  // Состояние редактирования (может быть глобальным или локальным)
  editingKey?: string | null;
  editValue: string | null;
  setEditValue: (v: string) => void;

  // Обработчики
  onSave: (aId: number, bId: number, filter: MatchPhase) => void;
  onCancel?: () => void;
  onOpenKeyboard?: (aId: number, bId: number, currentScore: string | null) => void;
  onStartEdit?: (aId: number, bId: number, currentScore: string | null) => void;

  inputRef: RefObject<HTMLInputElement | HTMLDivElement | null>;
  
  /** Опционально: для показа подсказки в групповом этапе */
  showHelpTooltip?: boolean;
  saving?: boolean;
};

export function ScoreCell({
  a,
  b,
  phaseFilter,
  scoreString,
  editingKey: externalEditingKey,
  editValue,
  setEditValue,
  onSave,
  onCancel,
  onOpenKeyboard,
  onStartEdit,
  inputRef,
  showHelpTooltip = false,
  saving = false,
}: ScoreCellProps) {

  // Локальное состояние для случаев, когда нет глобального управления
  const [localEditingKey, setLocalEditingKey] = useState<string | null>(null);
  const [localSaving, setLocalSaving] = useState(false);
  const [mobileKeyboardContext, setMobileKeyboardContext] = useState<{
    aId: number;
    bId: number;
  } | null>(null);

  const editingInputRef = useRef<HTMLInputElement | HTMLDivElement | null>(null);

  const { user } = useUser();


  // Определяем, используем ли глобальное или локальное состояние
  const isGlobalKeyboard = !!onOpenKeyboard;
  const editingKey = isGlobalKeyboard ? externalEditingKey : localEditingKey;
  const isSaving = isGlobalKeyboard ? saving : localSaving;
  
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

  const cancelEdit = useCallback(() => {
    if (onCancel) {
      // Глобальная отмена
      onCancel();
    } else {
      // Локальная отмена
      setLocalEditingKey(null);
      setEditValue("");
      editingInputRef.current = null;
      setMobileKeyboardContext(null);
    }
  }, [onCancel, setEditValue]);

  const saveEdit = useCallback(async (aId: number, bId: number) => {
    const needScore = editValue && editValue.trim();

    if (!needScore) {
      alert('Введите счёт');
      return;
    }

    try {
      if (!isGlobalKeyboard) {
        setLocalSaving(true);
      }
      
      await onSave(aId, bId, phaseFilter);
      cancelEdit();
    } catch (err) {
      console.error("Ошибка при сохранении счёта:", err);
      alert(err instanceof Error ? err.message : "Не удалось сохранить счёт");
    } finally {
      if (!isGlobalKeyboard) {
        setLocalSaving(false);
      }
    }
  }, [editValue, onSave, phaseFilter, cancelEdit, isGlobalKeyboard]);

  const handleSaveClick = useCallback(() => {
    if (!a?.getId || !b?.getId) return;
    saveEdit(a.getId, b.getId);
  }, [a, b, saveEdit]);

  const aId = a?.getId;
  const bId = b?.getId;
  const canEdit = !!aId && !!bId;
  const localScoreString = canEdit ? scoreString : null;
  const kkk = canEdit ? pairKey(aId!, bId!) : undefined;
  const isEditing = !!kkk && editingKey === kkk;
  const shouldShowHelpTooltip = canEdit && !localScoreString && !isEditing && showHelpTooltip;

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
                onClick={() => startEdit(aId!, bId!, localScoreString)}
                disabled={user == null || (user.role != UserRole.SiteAdmin && user.role != UserRole.TournamentAdmin)}
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