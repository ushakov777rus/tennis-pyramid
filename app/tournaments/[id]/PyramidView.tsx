"use client";

import { useState } from "react";
import { Participant } from "@/app/models/Participant";
import { Match } from "@/app/models/Match";
import "./PyramidView.css";

type PyramidViewProps = {
  participants: Participant[];
  onSelect: (ids: number[]) => void;
  selectedIds: number[];
  onShowHistory?: (id?: number) => void;
  matches: Match[];
};

function getPlayerStatusIcon(
  participantId: number,
  match: Match
): { icon: string; className: string } {
  const winnerId = match.getWinnerId();
  const isWinner = winnerId === participantId;

  const isAttacker =
    match.player1?.id === participantId || match.team1?.id === participantId;

  if (isWinner && isAttacker) return { icon: "↑", className: "winner-attacker" };
  if (isWinner && !isAttacker) return { icon: "✖", className: "winner-defender" };
  if (!isWinner && isAttacker) return { icon: "↺", className: "loser-attacker" };
  return { icon: "↓", className: "loser-defender" };
}

export function PyramidView({
  participants,
  onSelect,
  selectedIds,
  onShowHistory,
  matches,
}: PyramidViewProps) {
  const [invalidId, setInvalidId] = useState<number | null>(null);

  const levels: Record<number, Participant[]> = {};
  for (let i = 1; i <= 15; i++) {
    levels[i] = [];
  }

  const bench: Participant[] = [];

  participants.forEach((p) => {
    if (!p.level) {
      bench.push(p);
    } else {
      levels[p.level].push(p);
    }
  });

  const canChallenge = (attacker: Participant, defender: Participant): boolean => {
    if (!attacker.level || !attacker.position || !defender.level || !defender.position) {
      return false;
    }

    if (attacker.level === defender.level) {
      return defender.position < attacker.position;
    }

    if (defender.level === attacker.level - 1) {
      return true;
    }

    return false;
  };

  const getPlayerClass = (participant: Participant): string => {
    const id = participant.player?.id ?? participant.team?.id;
    if (!id) return "";

    const playerMatches = matches.filter(
      (m) =>
        m.player1?.id === id ||
        m.player2?.id === id ||
        m.team1?.id === id ||
        m.team2?.id === id
    );

    if (playerMatches.length === 0) return "";

    const lastMatch = playerMatches.sort(
      (a, b) => b.date.getTime() - a.date.getTime()
    )[0];

    return lastMatch.getWinnerId() === id ? "winner" : "loser";
  };

  const handleClick = (id: number, participant: Participant) => {
    let newSelection: number[] = [];

    if (selectedIds.includes(id)) {
      newSelection = selectedIds.filter((x) => x !== id);
    } else if (selectedIds.length === 0) {
      newSelection = [id];
    } else if (selectedIds.length === 1) {
      const attacker = participants.find(
        (p) => (p.player?.id ?? p.team?.id) === selectedIds[0]
      );
      if (attacker && canChallenge(attacker, participant)) {
        newSelection = [selectedIds[0], id];
      } else {
        setInvalidId(id);
        setTimeout(() => setInvalidId(null), 1500);
        return;
      }
    } else if (selectedIds.length === 2) {
      newSelection = [selectedIds[1], id];
    }

    onSelect(newSelection);
  };

  // отдельная функция для карточки игрока
  const renderPlayerCard = (p: Participant) => {
    const id = p.player?.id ?? p.team?.id;
    const statusClass = getPlayerClass(p);

    const playerMatches = matches.filter(
      (m) =>
        m.player1?.id === id ||
        m.player2?.id === id ||
        m.team1?.id === id ||
        m.team2?.id === id
    );

    const lastMatch = playerMatches.sort(
      (a, b) => b.date.getTime() - a.date.getTime()
    )[0];

    let daysWithoutGames: number | null = null;
    if (lastMatch) {
      const now = new Date();
      const diffMs = now.getTime() - lastMatch.date.getTime();
      daysWithoutGames = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    }

    return (
      <div
        key={p.id}
        className={`pyramid-player ${
          selectedIds.includes(id ?? -1) ? "selected" : ""
        } ${statusClass} ${invalidId === id ? "shake" : ""}`}
        onClick={() => id && handleClick(id, p)}
      >
        {daysWithoutGames !== null && (
          <div className="days-counter">{daysWithoutGames}д</div>
        )}

        {p.level && p.position && (
          <div className="player-position">
            {p.level} - {p.position}
          </div>
        )}

        <div className="player-name">
          {(p.splitName ?? []).map((line, i) => {
            let statusIcon = "";
            let iconClass = "";

            if (lastMatch && id) {
              const status = getPlayerStatusIcon(id, lastMatch);
              statusIcon = status.icon;
              iconClass = status.className;
            }

            return (
              <div key={i} className={`player-line ${iconClass}`}>
                {line}
                {i === 1 && statusIcon && (
                  <span className="status-icon">{statusIcon}</span>
                )}
              </div>
            );
          })}
        </div>

        <div className="player-ntrp">{p.ntrp ? p.ntrp : "?"}</div>

        {onShowHistory && (
          <button
            className="history-btn"
            onClick={(e) => {
              e.stopPropagation();
              onShowHistory(p.player?.id ?? p.team?.id);
            }}
          >
            📜
          </button>
        )}

        {invalidId === id && (
          <div className="invalid-tooltip">Нельзя вызвать этого игрока</div>
        )}
      </div>
    );
  };

  return (
    <div className="pyramid-container">
      {/* Пирамида */}
      {Object.entries(levels).map(([level, players]) => {
        const sortedPlayers = [...players].sort(
          (a, b) => (a.position ?? 0) - (b.position ?? 0)
        );

        return (
          <div key={level} className="pyramid-row" data-level={`Уровень ${level}`}>
            {sortedPlayers.map(renderPlayerCard)}
          </div>
        );
      })}

      {/* Скамейка */}
      {bench.length > 0 && (
        <div className="pyramid-row bench-row" data-level="Скамейка">
          {bench.map(renderPlayerCard)}
        </div>
      )}
    </div>
  );
}