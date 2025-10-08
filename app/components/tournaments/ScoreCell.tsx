"use client";

import React, { RefObject } from "react";
import { Participant } from "@/app/models/Participant";
import { PhaseType } from "@/app/models/Match";
import { SaveIconButton, CancelIconButton } from "@/app/components/controls/IconButtons";

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
  getMatchScore: (aId: number, bId: number, filter?: MatchPhaseFilter) => string | null;
  pairKey: (aId: number, bId: number) => string;
  editingKey: string | null;

  editValue: string;
  setEditValue: (v: string) => void;
  saving: boolean;

  onStartEdit: (aId: number, bId: number, currentScore: string | null, filter?: MatchPhaseFilter) => void;
  onSave: (aId: number, bId: number, filter?: MatchPhaseFilter) => void;
  onCancel: () => void;

  inputRef: RefObject<HTMLInputElement | HTMLDivElement | null>;
  mobileKeyboardAvailable: boolean;
  
  /** Опционально: для показа подсказки в групповом этапе */
  showHelpTooltip?: boolean;
};

export function ScoreCell({
  a,
  b,
  phaseFilter,
  getMatchScore,
  pairKey,
  editingKey,
  editValue,
  setEditValue,
  saving,
  onStartEdit,
  onSave,
  onCancel,
  inputRef,
  mobileKeyboardAvailable,
  showHelpTooltip = false,
}: ScoreCellProps) {
  const aId = a?.getId;
  const bId = b?.getId;
  const canEdit = !!aId && !!bId;
  const score = canEdit ? getMatchScore(aId!, bId!, phaseFilter) : null;
  const k = canEdit ? pairKey(aId!, bId!) : undefined;
  const isEditing = !!k && editingKey === k;
  const shouldShowHelpTooltip = canEdit && !score && !isEditing && showHelpTooltip;

  return (
    <div className="score-cell">
      {canEdit ? (
        score ? (
          <span className="badge">{score}</span>
        ) : !isEditing ? (
          <div className="score-cell__button-wrap">
            {shouldShowHelpTooltip && <div className="help-tooltip">Введите счёт</div>}
            <button
              type="button"
              className="vs vs-click"
              onClick={() => onStartEdit(aId!, bId!, score, phaseFilter)}
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
                    onCancel();
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
                  onClick={onCancel}
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
  );
}