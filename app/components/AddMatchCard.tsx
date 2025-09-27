"use client";

import React, { useCallback, useState } from "react";

import { CustomSelect } from "@/app/components/controls/CustomSelect";
import { SaveIconButton } from "./controls/IconButtons";
import { Match } from "../models/Match";

import "./AddMatchCard.css"

type Option = { value: number; label: string };

type AddMatchCardProps = {
  options: Option[];
  selectedIds: number[];
  setSelectedIds: (updater: (prev: number[]) => number[]) => void;
  matchDate: string;
  setMatchDate: (v: string) => void;
  matchScore: string;
  setMatchScore: (v: string) => void;
  isAnon: boolean;
  isPlayerWithFixedAttacker: boolean;
  onAddMatch: () => void;
  isPyramid?: boolean;
  isDouble?: boolean;
};

export const AddMatchCard: React.FC<AddMatchCardProps> = React.memo(
  ({
    options,
    selectedIds,
    setSelectedIds,
    matchDate,
    setMatchDate,
    matchScore,
    setMatchScore,
    isAnon,
    isPlayerWithFixedAttacker,
    onAddMatch,
    isPyramid = false,
    isDouble = false,
  }) => {
    const [scoreError, setScoreError] = useState(false);

    const onChangeAttacker = useCallback(
      (val: string | number | null) => {
        const newVal = Number(val);
        setSelectedIds((prev) => {
          if (!newVal) return prev;
          if (prev.includes(newVal)) return prev;
          if (prev.length === 0) return [newVal];
          if (prev.length === 1) return [newVal, prev[1]];
          return [newVal, prev[1]];
        });
      },
      [setSelectedIds]
    );

    const onChangeDefender = useCallback(
      (val: string | number | null) => {
        const newVal = Number(val);
        setSelectedIds((prev) => {
          if (!newVal) return prev;
          if (prev.includes(newVal)) return prev;
          if (prev.length === 0) return [newVal];
          if (prev.length === 1) return [...prev, newVal];
          return [prev[0], newVal];
        });
      },
      [setSelectedIds]
    );

    const handleSave = () => {
      if (!Match.isValidScoreFormat(matchScore)) {
        setScoreError(true);
        return;
      }
      setScoreError(false);
      onAddMatch();
    };

    const attackerPlaceholder = isPyramid
      ? "Нападение"
      : isDouble
      ? "Команда 1"
      : "Игрок 1";

    const defenderPlaceholder = isPyramid
      ? "Защита"
      : isDouble
      ? "Команда 2"
      : "Игрок 2";

    return (
      <div className="card add-match-card">
          <CustomSelect
            className="input"
            options={options}
            value={selectedIds[0] ?? null}
            placeholder={attackerPlaceholder}
            disabled={isAnon || isPlayerWithFixedAttacker}
            onChange={onChangeAttacker}
            sort={true}
          />

          <CustomSelect
            className="input"
            options={options}
            value={selectedIds[1] ?? null}
            placeholder={defenderPlaceholder}
            disabled={isAnon}
            onChange={onChangeDefender}
            sort={true}
          />

          <input
            type="date"
            value={matchDate}
            onChange={(e) => setMatchDate(e.target.value)}
            className="input date"
          />

          <div>
            <input
              type="text"
              placeholder="6-4, 4-6, 11-8"
              value={matchScore}
              onChange={(e) => {
                setMatchScore(e.target.value);
                if (scoreError) setScoreError(false);
              }}
              className={`input ${scoreError ? "input-error" : ""}`}
            />

            <SaveIconButton
              className="lg"
              title="Сохранить счёт"
              aria-label="Сохранить счёт"
              onClick={handleSave}
              disabled={false}
            />
          </div>
      </div>
    );
  }
);
