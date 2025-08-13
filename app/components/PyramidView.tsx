"use client";

import { useState, useEffect } from "react";
import { useUser } from "@/app/components/UserContext";
import { Participant } from "@/app/models/Participant";
import { Match } from "@/app/models/Match";
import "./PyramidView.css";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";

type PyramidViewProps = {
  participants: Participant[];
  maxLevel: number | 15;
  onSelect: (ids: number[]) => void;
  selectedIds: number[];
  onShowHistory?: (participant?: Participant) => void;
  matches: Match[];
  /** Сохранение пересчитанных позиций — реализует родитель/провайдер */
  onPositionsChange?: (next: Participant[]) => Promise<void> | void;
};

function getPlayerStatusIcon(
  participantId: number,
  match: Match
): { icon: string; className: string; title: string } {
  const winnerId = match.getWinnerId();
  const isWinner = winnerId === participantId;
  const isAttacker =
    match.player1?.id === participantId || match.team1?.id === participantId;

  if (isWinner && isAttacker)
    return { icon: " ↑", className: "winner-attacker", title: "Атаковал и выиграл" };
  if (isWinner && !isAttacker)
    return { icon: " ✖", className: "winner-defender", title: "Защищался и выиграл" };
  if (!isWinner && isAttacker)
    return { icon: " ↺", className: "loser-attacker", title: "Атаковал и проиграл" };
  return { icon: " ↓", className: "loser-defender", title: "Защищался и проиграл" };
}

export function PyramidView({
  participants,
  maxLevel,
  onSelect,
  selectedIds,
  onShowHistory,
  matches,
  onPositionsChange,
}: PyramidViewProps) {
  const { user } = useUser();

  const [invalidId, setInvalidId] = useState<number | null>(null);
  const [localParticipants, setLocalParticipants] = useState<Participant[]>([]);

  // нормализуем порядок входящих участников
  useEffect(() => {
    const sorted = [...participants].sort((a, b) => {
      const la = a.level ?? Number.POSITIVE_INFINITY;
      const lb = b.level ?? Number.POSITIVE_INFINITY;
      if (la !== lb) return la - lb;
      const pa = a.position ?? Number.POSITIVE_INFINITY;
      const pb = b.position ?? Number.POSITIVE_INFINITY;
      return pa - pb;
    });
    setLocalParticipants(sorted);
  }, [participants]);

  const buildByLevel = (items: Participant[]) => {
    const byLevel: Record<string, Participant[]> = {};
    for (let i = 1; i <= Number(maxLevel); i++) byLevel[String(i)] = [];
    const benchKey = "999";
    byLevel[benchKey] = [];

    items.forEach((p) => {
      const key = p.level ? String(p.level) : benchKey;
      byLevel[key].push(p);
    });
    return byLevel;
  };

  const onDragStart = () => document.body.classList.add("dnd-active");

  const handleDragEnd = async (result: DropResult) => {
    document.body.classList.remove("dnd-active");
    const { source, destination, draggableId } = result;
    if (!destination) return;

    const srcLevel = String(source.droppableId);
    const dstLevel = String(destination.droppableId);
    if (srcLevel === dstLevel && source.index === destination.index) return;

    const items = [...localParticipants];
    const dragged = items.find((p) => p.id === Number(draggableId));
    if (!dragged) return;

    const byLevel = buildByLevel(items);

    const srcArr = byLevel[srcLevel];
    const [removed] = srcArr.splice(source.index, 1);

    const dstArr = byLevel[dstLevel];
    dstArr.splice(destination.index, 0, removed);

    const next: Participant[] = [];
    for (let i = 1; i <= Number(maxLevel); i++) {
      const key = String(i);
      byLevel[key].forEach((p, idx) => {
        p.level = i;
        p.position = idx + 1;
        next.push(p);
      });
    }
    byLevel["999"].forEach((p, idx) => {
      p.level = undefined;
      p.position = idx + 1;
      next.push(p);
    });

    setLocalParticipants(next);
    // сохраняет родитель (через провайдер)
    await onPositionsChange?.(next);
  };

  const getPlayerClass = (participant: Participant): string => {
    const id = participant.player?.id ?? participant.team?.id;
    if (!id) return "";

    const playerMatches = matches.filter(
      (m) =>
        m.scores.length &&
        (m.player1?.id === id ||
          m.player2?.id === id ||
          m.team1?.id === id ||
          m.team2?.id === id)
    );

    if (playerMatches.length === 0) return "";

    const lastMatch = playerMatches.sort(
      (a, b) => b.date.getTime() - a.date.getTime()
    )[0];

    return lastMatch.getWinnerId() === id ? "winner" : "loser";
  };

  const canChallenge = (attacker: Participant, defender: Participant): boolean => {
    if (!defender.level || !defender.position) return false;

    if (!attacker.level || !attacker.position) {
      return defender.level >= Number(maxLevel) - 1;
    }

    if (attacker.level === defender.level) {
      return defender.position < attacker.position;
    }

    if (defender.level === attacker.level - 1) {
      return true;
    }

    return false;
  };

  const handleClick = (id: number, participant: Participant) => {
    let newSelection: number[] = [];

    if (user?.role === undefined) return;

    if (user?.role === "player" && selectedIds.length > 0 && selectedIds[0] === id) {
      return;
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
      if (user?.role === "player") {
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
      } else {
        newSelection = [selectedIds[1], id];
      }
    }

    onSelect(newSelection);
  };

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

    const now = new Date();

    const lastMatch = playerMatches
      .filter((m) => m.date.getTime() <= now.getTime())
      .sort((a, b) => b.date.getTime() - a.date.getTime())[0] || null;

    let daysWithoutGames: number | null = null;
    if (lastMatch) {
      const diffMs = Date.now() - lastMatch.date.getTime();
      daysWithoutGames = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    }

    return (
      <Draggable key={p.id} draggableId={String(p.id)} index={index}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            style={provided.draggableProps.style as React.CSSProperties}
            className={`pyramid-player ${
              selectedIds.includes(id ?? -1) ? "selected" : ""
            } ${statusClass} ${invalidId === id ? "shake" : ""}`}
            onClick={() => id && handleClick(id, p)}
          >
            <div className="player-top-line">
              {daysWithoutGames !== null && (
                <div className="days-counter">{daysWithoutGames}д</div>
              )}

              <div className="player-position">
                {p.level != null && p.position != null
                  ? `${p.level} - ${p.position}`
                  : `Z - ${p.position ?? "?"}`}
              </div>
            </div>

            <div className="player-name">
              {(() => {
                const lines = p.splitName ?? [];
                const status = lastMatch && id ? getPlayerStatusIcon(id, lastMatch) : null;

                return lines.map((line: string, i: number) => (
                  <div key={i} className={`player-line ${status?.className ?? ""}`}>
                    {line}
                    {i === 1 && status && (
                      <span
                        className="status-icon"
                        title={status.title}
                        aria-label={status.title}
                      >
                        {status.icon}
                      </span>
                    )}
                  </div>
                ));
              })()}
            </div>

            <div className="player-bottom-line">
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
                  <svg width="14" height="14" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
                    <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
                  </svg>
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

  const byLevel = buildByLevel(localParticipants);

  return (
    <DragDropContext onDragStart={onDragStart} onDragEnd={handleDragEnd}>
      <div className="pyramid-container">
        {Array.from({ length: Number(maxLevel) }, (_, i) => String(i + 1)).map((levelKey) => (
          <Droppable droppableId={levelKey} direction="horizontal" key={levelKey}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="card pyramid-row"
                data-level={`Уровень ${levelKey}`}
              >
                {byLevel[levelKey].map((p, i) => renderPlayerCard(p, i))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}

        <Droppable droppableId="999" direction="horizontal">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="card pyramid-row bench-row"
              data-level="Скамейка"
            >
              {byLevel["999"].map((p, i) => renderPlayerCard(p, i))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
    </DragDropContext>
  );
}