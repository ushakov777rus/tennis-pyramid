"use client";

import { useState } from "react";

import { Player } from "@/app/models/Player";
import { Match } from "@/app/models/Match";

import { MatchHistoryView } from "@/app/components/MatchHistoryView";

import { MatchRepository } from "@/app/repositories/MatchRepository"

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
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editDate, setEditDate] = useState<string>("");
  const [editScore, setEditScore] = useState<string>("");

  if (!isOpen || player === null) return null;
  console.log("Show history");

  // Фильтруем только матчи игрока
  const playerMatches = matches.filter(
    (m) => m.player1?.id === player?.id || m.player2?.id === player.id
  );

  // Сортировка (новые → старые)
  const sortedMatches = [...playerMatches].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Определяем имя игрока
  const playerName =
    playerMatches[0]?.player1?.id === player.id
      ? playerMatches[0]?.player1?.name
      : playerMatches[0]?.player2?.name;

  const startEditing = (m: Match) => {
    setEditingId(m.id);
    setEditDate(m.date.toISOString().split("T")[0]);
    setEditScore(m.formatResult());
  };

  const saveEditing = (m: Match) => {
    const newSets: [number, number][] = editScore.split(",").map((set) => {
      const [a, b] = set.trim().split("-").map(Number);
      return [a, b];
    });

    const updated = new Match(
      m.id,
      m.type,
      new Date(editDate),      
      newSets,
      m.tournament,
      m.player1,
      m.player2,
      m.team1,
      m.team2
    );

    onEditMatch?.(updated);
    setEditingId(null);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="match-history-modal" onClick={(e) => e.stopPropagation()}>
        <MatchHistoryView
          player={player}
          matches={matches}
          showTournament={true}
          onEditMatch={(updated) => {
            // тут обновляем через MatchRepository
            MatchRepository.updateMatch(updated);
          }}
          onDeleteMatch={(m) => {
            // тут удаляем через MatchRepository
            console.log("Удаление:", m);
            MatchRepository.deleteMatch(m);
          }}
        />

        <button
          className="card-btn card-btn-act card-btn-margin-top"
          onClick={onClose}
        >
          Закрыть
        </button>
      </div>
    </div>
  );
}