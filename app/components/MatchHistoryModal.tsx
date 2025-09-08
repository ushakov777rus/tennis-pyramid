"use client";

import { useMemo } from "react";

import { Match } from "@/app/models/Match";
import { Participant } from "@/app/models/Participant";

import { MatchHistoryView } from "@/app/components/MatchHistoryView";

import "@/app/components/MatchHistoryModal.css";

type MatchHistoryModalProps = {
  isOpen: boolean;
  onClose: () => void;
  matches: Match[]; // всегда передаём извне
  participant: Participant | null;
  onEditMatch?: (match: Match) => Promise<void> | void;
  onDeleteMatch?: (match: Match) => Promise<void> | void;
};

export function MatchHistoryModal({
  isOpen,
  onClose,
  matches,
  participant,
  onEditMatch,
  onDeleteMatch,
}: MatchHistoryModalProps) {

  // вычисляем ID участника
  const participantId = useMemo(() => {
    if (!participant) return null;
    if (participant.player) return participant.player.id;
    if (participant.team) return participant.team.id;
    return null;
  }, [participant]);

  // вычисляем имя участника
  const participantName = useMemo(() => {
    if (!participant) return "";
    if (participant.player) return participant.player.displayName?.(false) ?? "Игрок";
    if (participant.team) return participant.team.displayName?.(false) ?? "Команда";
    return "";
  }, [participant]);

  // фильтруем матчи для конкретного участника
  const effectiveMatches = useMemo(() => {
    if (!participantId) return [];
    return matches.filter(
      (m) =>
        m.player1?.id === participantId ||
        m.player2?.id === participantId ||
        m.team1?.id === participantId ||
        m.team2?.id === participantId
    );
  }, [matches, participantId]);

  if (!isOpen || !participant) return null;

  const handleEdit = async (updated: Match) => {
    if (onEditMatch) await onEditMatch(updated);
  };

  const handleDelete = async (m: Match) => {
    if (onDeleteMatch) await onDeleteMatch(m);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-content-w modal-content-match-history" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">{participantName}</h2>
        <MatchHistoryView
          matches={effectiveMatches}
          onEditMatch={handleEdit}
          onDeleteMatch={handleDelete}
        />
        <button onClick={onClose} className="modal-close-btn">
          ✖
        </button>
      </div>
    </div>
  );
}