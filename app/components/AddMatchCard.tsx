"use client";

import React, { useCallback, useState } from "react";

import { CustomSelect } from "@/app/components/CustomSelect";
import { SaveIconButton } from "./IconButtons";
import { Match } from "../models/Match";

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

    return (
      <div className="card card-controls sticky-add-match-card">
        <CustomSelect
          className="input card-filter-controls"
          options={options}
          value={selectedIds[0] ?? null}
          placeholder="-- Нападение --"
          disabled={isAnon || isPlayerWithFixedAttacker}
          onChange={onChangeAttacker}
          sort={true}
        />

        <CustomSelect
          className="input card-filter-controls"
          options={options}
          value={selectedIds[1] ?? null}
          placeholder="-- Защита --"
          disabled={isAnon}
          onChange={onChangeDefender}
          sort={true}
        />

        <input
          type="date"
          value={matchDate}
          onChange={(e) => setMatchDate(e.target.value)}
          className="input card-filter-controls-date"
        />

        <input
          type="text"
          placeholder="6-4, 4-6, 11-8"
          value={matchScore}
          onChange={(e) => {
            setMatchScore(e.target.value);
            if (scoreError) setScoreError(false);
          }}
          className={`input card-filter-controls ${scoreError ? "input-error" : ""}`}
        />

        <SaveIconButton
          className="lg"
          title="Сохранить счёт"
          aria-label="Сохранить счёт"
          onClick={handleSave}
          disabled={false}
        />
      </div>
    );
  }
);