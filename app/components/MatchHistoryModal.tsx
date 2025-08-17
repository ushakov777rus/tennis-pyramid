"use client";

import { useMemo } from "react";
import { Player } from "@/app/models/Player";
import { Match } from "@/app/models/Match";
import { useUser } from "@/app/components/UserContext";

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
  const { user } = useUser();
    // контекст уже ДОЛЖЕН быть выше в дереве
  const { matches: allMatches, updateMatch, deleteMatch } = useTournament();

  const effectiveMatches = useMemo(() => {
    if (matches) return matches;
    const id = player?.id;
    return allMatches.filter(
      (m) =>
        m.player1?.id === id ||
        m.player2?.id === id ||
        m.team1?.id === id ||
        m.team2?.id === id
    );
  }, [matches, allMatches, player]);

  if (!isOpen || !player) return null;

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
      <div className="modal-content modal-content-w" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">{`${player.name}`}</h2>
          <MatchHistoryView
            player={player}
            matches={effectiveMatches}
            showTournament={false}
            onEditMatch={handleEdit}
            onDeleteMatch={handleDelete}
            mask={user?.role !== "site_admin"}
          />

        <button onClick={onClose} className="modal-close-btn">
          ✖
        </button>
      </div>
    </div>
  );
}