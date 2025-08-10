"use client";

import { useState, useEffect } from "react";

import { useUser } from "@/app/components/UserContext";  // 👈 добавить

import { AdminOnly } from "@/app/components/RoleGuard"

import { Participant } from "@/app/models/Participant";
import { Match } from "@/app/models/Match";

import "./PyramidView.css";

import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { TournamentsRepository } from "@/app/repositories/TournamentsRepository";

type PyramidViewProps = {
  participants: Participant[];
  maxLevel: number | 15;
  onSelect: (ids: number[]) => void;
  selectedIds: number[];
  onShowHistory?: (participant?: Participant) => void;
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
  maxLevel,
  onSelect,
  selectedIds,
  onShowHistory,
  matches,
}: PyramidViewProps) {
  const { user } = useUser(); // 👈 получаем залогиненного юзера
  const [invalidId, setInvalidId] = useState<number | null>(null);
  const [localParticipants, setLocalParticipants] = useState<Participant[]>(participants);

  // синхронизируем state, если пришли новые participants сверху
  useEffect(() => {
    setLocalParticipants(participants);
  }, [participants]);

  // 🔥 drag-end handler
  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const destLevel = Number(result.destination.droppableId);
    const draggedId = Number(result.draggableId);

    const updated = [...localParticipants];
    const dragged = updated.find((p) => p.id === draggedId);
    if (!dragged) return;

    // bench = 999
    dragged.level = destLevel === 999 ? undefined : destLevel;
    dragged.position = result.destination.index;

    // пересобираем позиции внутри уровня
    const sameLevelPlayers = updated
      .filter((p) => p.level === dragged.level)
      .sort((a, b) => (a.position ?? 0) - (b.position ?? 0));

    sameLevelPlayers.forEach((p, i) => {
      p.position = i + 1;
    });

    // обновляем UI
    setLocalParticipants([...updated]);

    // сохраняем в БД
    TournamentsRepository.updatePosition(dragged);
    TournamentsRepository.updatePositions(updated);
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

const canChallenge = (attacker: Participant, defender: Participant): boolean => {
  if (!defender.level || !defender.position) {
    return false;
  }
  console.log("canChallenge",attacker,defender,maxLevel);

  if (!attacker.level || !attacker.position) {
    return defender.level >= maxLevel-1; 
  }

  if (attacker.level === defender.level) {
    return defender.position < attacker.position; // можно вызвать только "левее"
  }

  if (defender.level === attacker.level - 1) {
    return true; // можно вызвать игрока уровнем выше
  }

  return false;
};

const handleClick = (id: number, participant: Participant) => {
  let newSelection: number[] = [];

  if (
    user?.role === undefined
  ) {
    return; // 👈 выходим, не даём снять выделение
  }

  // 🔥 проверка: если это залогиненный player и он пытается снять себя — запрещаем
  if (
    user?.role === "player" &&
    selectedIds.length > 0 &&
    selectedIds[0] === id
  ) {
    return; // 👈 выходим, не даём снять выделение
  }

  if (selectedIds.includes(id)) {
    newSelection = selectedIds.filter((x) => x !== id);
  } else if (selectedIds.length === 0) {
    newSelection = [id];
  } else if (selectedIds.length === 1) {
    const attacker = localParticipants.find(
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
    if (
      user?.role === "player"
    ){
      const attacker = localParticipants.find(
        (p) => (p.player?.id ?? p.team?.id) === selectedIds[0]
      );

      if (attacker && canChallenge(attacker, participant)) {
        newSelection = [selectedIds[0], id];
      } else {
        setInvalidId(id);
        setTimeout(() => setInvalidId(null), 1500);
        return;
      }
    }
    else {
      newSelection = [selectedIds[1], id];
    }
  }

  onSelect(newSelection);
};

  // карточка игрока
const renderPlayerCard = (p: Participant, index: number) => {
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
    <Draggable key={p.id} draggableId={String(p.id)} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}   // только позиционирование
          className={`pyramid-player ${
            selectedIds.includes(id ?? -1) ? "selected" : ""
          } ${statusClass} ${invalidId === id ? "shake" : ""}`}
          onClick={() => id && handleClick(id, p)}  // ✅ клик работает
        >
          {daysWithoutGames !== null && (
            <div className="days-counter">{daysWithoutGames}д</div>
          )}

          <div className="player-position">
            {p.level && p.position ? `${p.level} - ${p.position}` : "Z"}
          </div>

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
          <div className="player-bottom-line">
            {/* 🔥 drag-handle — только за этот блок можно тянуть */}
            
            <div className="drag-handle" {...provided.dragHandleProps}>
              ⠿
            </div>
            
            <div className="player-ntrp">{p.ntrp ? p.ntrp : "?"}</div>

            {onShowHistory && (
              <button
                className="history-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  onShowHistory(p);
                }}
              >
                📜
              </button>
            )}
            
          </div>

          {invalidId === id && (
            <div className="invalid-tooltip">Нельзя вызвать этого игрока</div>
          )}
          
        </div>
      )}
    </Draggable>
  );
};

  // группировка по уровням + bench
  const levels: Record<number, Participant[]> = {};
  for (let i = 1; i <= 15; i++) {
    levels[i] = [];
  }
  const bench: Participant[] = [];

  localParticipants.forEach((p) => {
    if (!p.level) {
      bench.push(p);
    } else {
      levels[p.level].push(p);
    }
  });

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="pyramid-container">
        {/* Уровни */}
        {Object.entries(levels).map(([level, players]) => (
          <Droppable droppableId={level} direction="horizontal" key={level}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="card pyramid-row"
                data-level={`Уровень ${level}`}
              >
                {[...players]
                  .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
                  .map((p, i) => renderPlayerCard(p, i))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}

        {/* Скамейка */}
        <Droppable droppableId="999" direction="horizontal">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="pyramid-row bench-row"
              data-level="Скамейка"
            >
              {bench.map((p, i) => renderPlayerCard(p, i))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
    </DragDropContext>
  );
}