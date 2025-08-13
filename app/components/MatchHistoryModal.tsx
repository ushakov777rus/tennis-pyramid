"use client";

import { useMemo } from "react";
import { Player } from "@/app/models/Player";
import { Match } from "@/app/models/Match";

import { MatchHistoryView } from "@/app/components/MatchHistoryView";
import "@/app/components/MatchHistory.css";

import { useTournament } from "@/app/tournaments/[id]/TournamentProvider";

type MatchHistoryModalProps = {
  isOpen: boolean;
  onClose: () => void;
  matches?: Match[];
  player: Player | null;
  onEditMatch?: (match: Match) => Promise<void> | void;
  onDeleteMatch?: (match: Match) => Promise<void> | void;
};

export function MatchHistoryModal({
  isOpen,
  onClose,
  matches,
  player,
  onEditMatch,
  onDeleteMatch,
}: MatchHistoryModalProps) {
    // контекст уже ДОЛЖЕН быть выше в дереве
  const { matches: allMatches, updateMatch, deleteMatch } = useTournament();

  if (!isOpen || !player) return null;

  const effectiveMatches = useMemo(() => {
    if (matches) return matches;
    const id = player.id;
    return allMatches.filter(
      (m) =>
        m.player1?.id === id ||
        m.player2?.id === id ||
        m.team1?.id === id ||
        m.team2?.id === id
    );
  }, [matches, allMatches, player]);

  const handleEdit = async (updated: Match) => {
    if (onEditMatch) return onEditMatch(updated);
    await updateMatch(updated);
  };

  const handleDelete = async (m: Match) => {
    if (onDeleteMatch) return onDeleteMatch(m);
    await deleteMatch(m);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="match-history-modal"
        onClick={(e) => e.stopPropagation()}
        style={{ display: "flex", flexDirection: "column", maxHeight: "90vh" }}
        role="dialog"
        aria-modal="true"
        aria-label={`История матчей: ${player.name}`}
      >
        <div style={{ overflowY: "auto", flex: "1 1 auto", paddingBottom: 60 }}>
          <MatchHistoryView
            player={player}
            matches={effectiveMatches}
            showTournament={true}
            onEditMatch={handleEdit}
            onDeleteMatch={handleDelete}
          />
        </div>

        <div
          style={{
            borderTop: "1px solid #2a2a2a",
            padding: 10,
            background: "none",
            position: "sticky",
            bottom: 0,
          }}
        >
          <button className="card-btn card-btn-act" style={{ width: "100%" }} onClick={onClose}>
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
}