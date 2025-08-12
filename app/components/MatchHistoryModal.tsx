"use client";

import { useState } from "react";

import { Player } from "@/app/models/Player";
import { Match } from "@/app/models/Match";

import { MatchHistoryView } from "@/app/components/MatchHistoryView";
import { MatchRepository } from "@/app/repositories/MatchRepository";

import "@/app/components/MatchHistory.css";

type MatchHistoryModalProps = {
  isOpen: boolean;
  onClose: () => void;
  matches: Match[];
  player: Player;
  onEditMatch?: (match: Match) => void;
  onDeleteMatch?: (match: Match) => void;
};

export function MatchHistoryModal({
  isOpen,
  onClose,
  matches,
  player,
  onEditMatch,
  onDeleteMatch,
}: MatchHistoryModalProps) {
  if (!isOpen || player === null) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="match-history-modal"
        onClick={(e) => e.stopPropagation()}
        style={{
          display: "flex",
          flexDirection: "column",
          maxHeight: "90vh",
        }}
      >
        {/* Прокручиваемая часть */}
        <div style={{ overflowY: "auto", flex: "1 1 auto", paddingBottom: "60px" }}>
          <MatchHistoryView
            player={player}
            matches={matches}
            showTournament={true}
            onEditMatch={async (updated) => {
              await MatchRepository.updateMatch(updated);
              onEditMatch?.(updated);
            }}
            onDeleteMatch={async (m) => {
              await MatchRepository.deleteMatch(m);
              onDeleteMatch?.(m);
            }}
          />
        </div>

        {/* Фиксированная кнопка внизу */}
        <div
          style={{
            borderTop: "1px solid #ddd",
            padding: "10px",
            background: "none",
            position: "sticky",
            bottom: 0,
          }}
        >
          <button
            className="card-btn card-btn-act"
            style={{ width: "100%" }}
            onClick={onClose}
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
}