"use client";

import React, { useCallback, useState } from "react";

import { CustomSelect } from "@/app/components/controls/CustomSelect";
import { SaveIconButton } from "./controls/IconButtons";
import { Match } from "../models/Match";
import { useDictionary } from "@/app/components/LanguageProvider";

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
    isPlayerWithFixedAttacker,
    onAddMatch,
    isPyramid = false,
    isDouble = false,
  }) => {
    const [scoreError, setScoreError] = useState(false);
    const { addMatchCard } = useDictionary();

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
      ? addMatchCard.attackerPyramid
      : isDouble
      ? addMatchCard.attackerDouble
      : addMatchCard.attackerSingle;

    const defenderPlaceholder = isPyramid
      ? addMatchCard.defenderPyramid
      : isDouble
      ? addMatchCard.defenderDouble
      : addMatchCard.defenderSingle;

    return (
      <div className="card add-match-card">
          <CustomSelect
            className="input"
            options={options}
            value={selectedIds[0] ?? null}
            placeholder={attackerPlaceholder}
            disabled={isPlayerWithFixedAttacker}
            onChange={onChangeAttacker}
            sort={true}
          />

          <CustomSelect
            className="input"
            options={options}
            value={selectedIds[1] ?? null}
            placeholder={defenderPlaceholder}
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
              placeholder={addMatchCard.scorePlaceholder}
              value={matchScore}
              onChange={(e) => {
                setMatchScore(e.target.value);
                if (scoreError) setScoreError(false);
              }}
              pattern="[0-9\\s,:-]*"
              className={`input ${scoreError ? "input-error" : ""}`}
            />

            <SaveIconButton
              className="lg"
              title={addMatchCard.saveScore}
              aria-label={addMatchCard.saveScore}
              onClick={handleSave}
              disabled={false}
            />
          </div>
          {scoreError && <div className="match-card-edit__error">{addMatchCard.invalidScore}</div>}
      </div>
    );
  }
);
