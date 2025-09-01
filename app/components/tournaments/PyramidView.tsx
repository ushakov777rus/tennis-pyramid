"use client";

import { useState, useEffect, useMemo, useRef } from "react";
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
  onSelect: (ids: number[]) => void;
  selectedIds: number[];
  onShowHistory?: (participant?: Participant) => void;
  matches: Match[];
  onPositionsChange?: (next: Participant[]) => Promise<void> | void;
  maxLevel: number; // визуальный максимум уровней
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
  onSelect,
  selectedIds,
  onShowHistory,
  matches,
  onPositionsChange,
  maxLevel,
}: PyramidViewProps) {
  const { user } = useUser();

  const [invalidId, setInvalidId] = useState<number | null>(null);
  const [localParticipants, setLocalParticipants] = useState<Participant[]>([]);

  // === Сколько уровней реально показываем ===
  const totalLevels = useMemo(() => {
    const fromData = participants.length
      ? participants.reduce((m, p) => Math.max(m, p.level ?? 0), 0)
      : 0;
    return Math.max(Number(maxLevel) || 0, fromData);
  }, [participants, maxLevel]);

  // === Сколько карточек помещается в строку ===
  const containerRef = useRef<HTMLDivElement | null>(null);
  const CARD = 110; // ширина карточки + горизонтальный gap (подстрой)
  const [perRow, setPerRow] = useState(3);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const w = entry.contentRect.width;
      const next = Math.max(1, Math.floor(w / CARD));
      setPerRow(next);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // === Упорядочим входящих участников по level/position ===
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

  // === Утилиты ===
  const chunk = <T,>(arr: T[], size: number): T[][] => {
    const rows: T[][] = [];
    for (let i = 0; i < arr.length; i += size) rows.push(arr.slice(i, i + size));
    return rows;
  };

  const parseDroppableId = (id: string) => {
    // droppableId формата "<levelKey>:<rowIndex>"
    const [levelKey, rowStr] = id.split(":");
    return { levelKey, rowIndex: Number(rowStr) || 0 };
  };

  const buildByLevel = (items: Participant[]) => {
    const byLevel: Record<string, Participant[]> = {};
    for (let i = 1; i <= totalLevels; i++) byLevel[String(i)] = [];
    byLevel["999"] = []; // скамейка

    items.forEach((p) => {
      const key = p.level ? String(p.level) : "999";
      (byLevel[key] ??= []).push(p);
    });
    return byLevel;
  };

  const onDragStart = () => document.body.classList.add("dnd-active");

  const handleDragEnd = async (result: DropResult) => {
    document.body.classList.remove("dnd-active");
    const { source, destination, draggableId } = result;
    if (!destination) return;

    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const items = [...localParticipants];
    const byLevel = buildByLevel(items);

    // --- Источник: переводим (row, index) в "линейный" индекс внутри уровня
    const { levelKey: srcLevelKey, rowIndex: srcRowIndex } = parseDroppableId(String(source.droppableId));
    const srcLinearIndexPre = srcRowIndex * perRow + source.index;
    const srcArrLinear = byLevel[srcLevelKey] ?? (byLevel[srcLevelKey] = []);
    const srcLinearIndex = Math.min(srcLinearIndexPre, Math.max(0, srcArrLinear.length - 1));

    const [removed] = srcArrLinear.splice(srcLinearIndex, 1);

    // --- Приёмник: тоже считаем линейный индекс
    const { levelKey: dstLevelKey, rowIndex: dstRowIndex } = parseDroppableId(String(destination.droppableId));
    const dstArrLinear = byLevel[dstLevelKey] ?? (byLevel[dstLevelKey] = []);

    let dstLinearIndex = dstRowIndex * perRow + destination.index;

    // если перетаскиваем в тот же уровень и удалили элемент ДО будущего места — индекс сдвигается на -1
    if (srcLevelKey === dstLevelKey && srcLinearIndex < dstLinearIndex) {
      dstLinearIndex -= 1;
    }
    dstLinearIndex = Math.max(0, Math.min(dstLinearIndex, dstArrLinear.length));

    dstArrLinear.splice(dstLinearIndex, 0, removed);

    // --- Пересчёт level/position и обновление состояния
    const next: Participant[] = [];
    for (let level = 1; level <= totalLevels; level++) {
      const key = String(level);
      (byLevel[key] ?? []).forEach((p, idx) => {
        p.level = level;
        p.position = idx + 1;
        next.push(p);
      });
    }
    (byLevel["999"] ?? []).forEach((p, idx) => {
      p.level = undefined;
      p.position = idx + 1;
      next.push(p);
    });

    setLocalParticipants(next);
    await onPositionsChange?.(next);
  };

  // === Вспомогательные методы (как у тебя) ===
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

    const lastMatch = playerMatches.sort((a, b) => b.date.getTime() - a.date.getTime())[0];
    return lastMatch.getWinnerId() === id ? "winner" : "loser";
  };

  const canChallenge = (attacker: Participant, defender: Participant): boolean => {
    if (!defender.level || !defender.position) return false;
    if (!attacker.level || !attacker.position) return defender.level >= totalLevels - 1;
    if (attacker.level === defender.level) return defender.position < attacker.position;
    if (defender.level === attacker.level - 1) return true;
    return false;
  };

  const handleClick = (id: number, participant: Participant) => {
    let newSelection: number[] = [];
    if (user?.role === undefined) return;
    if (user?.role === "player" && selectedIds.length > 0 && selectedIds[0] === id) return;

    if (selectedIds.includes(id)) {
      newSelection = selectedIds.filter((x) => x !== id);
    } else if (selectedIds.length === 0) {
      newSelection = [id];
    } else if (selectedIds.length === 1) {
      const attacker = localParticipants.find((p) => (p.player?.id ?? p.team?.id) === selectedIds[0]);
      if (attacker && canChallenge(attacker, participant)) newSelection = [selectedIds[0], id];
      else {
        setInvalidId(id);
        setTimeout(() => setInvalidId(null), 1500);
        return;
      }
    } else if (selectedIds.length === 2) {
      if (user?.role === "player") {
        const attacker = localParticipants.find((p) => (p.player?.id ?? p.team?.id) === selectedIds[0]);
        if (attacker && canChallenge(attacker, participant)) newSelection = [selectedIds[0], id];
        else {
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

  const renderPlayerCard = (p: Participant, indexInRow: number) => {
    const id = p.player?.id ?? p.team?.id;
    const statusClass = getPlayerClass(p);

    const now = new Date();
    const playerMatches = matches.filter(
      (m) => m.player1?.id === id || m.player2?.id === id || m.team1?.id === id || m.team2?.id === id
    );
    const lastMatch = playerMatches
      .filter((m) => m.date.getTime() <= now.getTime())
      .sort((a, b) => b.date.getTime() - a.date.getTime())[0] || null;

    let daysWithoutGames: number | null = null;
    if (lastMatch) {
      const diffMs = Date.now() - lastMatch.date.getTime();
      daysWithoutGames = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    }
    const inactivityClass =
      daysWithoutGames !== null && daysWithoutGames >= 36
        ? "inactive-36"
        : daysWithoutGames !== null && daysWithoutGames >= 15
        ? "inactive-15"
        : "";

    return (
      <Draggable key={p.id} draggableId={String(p.id)} index={indexInRow}>
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
                <div className={`days-counter ${inactivityClass}`}>{daysWithoutGames}д</div>
              )}
              <div className="player-position">
                {p.level != null && p.position != null ? `${p.level} - ${p.position}` : `Z - ${p.position ?? "?"}`}
              </div>
            </div>

            <div className="player-name">
              {(() => {
                const lines = p.splitName(false) ?? [];
                const status = lastMatch && id ? getPlayerStatusIcon(id, lastMatch) : null;
                return lines.map((line: string, i: number) => (
                  <div key={i} className={`player-line ${status?.className ?? ""}`}>
                    {line}
                    {i === 1 && status && (
                      <span className="status-icon" title={status.title} aria-label={status.title}>
                        {status.icon}
                      </span>
                    )}
                  </div>
                ));
              })()}
            </div>

            <div className="player-bottom-line">
              <div className="drag-handle" {...provided.dragHandleProps}>⠿</div>
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

            {invalidId === id && <div className="invalid-tooltip">Нельзя вызвать этого игрока</div>}
          </div>
        )}
      </Draggable>
    );
  };

  // === Группируем участников по уровням ===
  const byLevel = useMemo(() => buildByLevel(localParticipants), [localParticipants]);

  return (
    <DragDropContext onDragStart={onDragStart} onDragEnd={handleDragEnd}>
      <div className="pyramid-container" ref={containerRef}>
        {Array.from({ length: totalLevels }, (_, i) => String(i + 1)).map((levelKey) => {
          const rows = chunk(byLevel[levelKey] ?? [], perRow);
          return (
            <div className="card pyramid-row" data-level={`Уровень ${levelKey}`} key={levelKey}>
              {rows.map((row, rIdx) => (
                <Droppable droppableId={`${levelKey}:${rIdx}`} direction="horizontal" key={`${levelKey}:${rIdx}`}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="pyramid-row-line"
                    >
                      {row.map((p, i) => renderPlayerCard(p, i))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              ))}
              {/* если последняя строка пустая (например, уровень пуст) — всё равно рисуем пустой droppable */}
              {rows.length === 0 && (
                <Droppable droppableId={`${levelKey}:0`} direction="horizontal" key={`${levelKey}:0-empty`}>
                  {(provided) => (
                    <div ref={provided.innerRef} {...provided.droppableProps} className="pyramid-row-line">
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              )}
            </div>
          );
        })}

        {/* Скамейка: тоже строками */}
        {(() => {
          const benchRows = chunk(byLevel["999"] ?? [], perRow);
          return (
            <div className="card pyramid-row bench-level" data-level="Скамейка">
              {benchRows.map((row, rIdx) => (
                <Droppable droppableId={`999:${rIdx}`} direction="horizontal" key={`999:${rIdx}`}>
                  {(provided) => (
                    <div ref={provided.innerRef} {...provided.droppableProps} className="pyramid-row-line">
                      {row.map((p, i) => renderPlayerCard(p, i))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              ))}
              {benchRows.length === 0 && (
                <Droppable droppableId={`999:0`} direction="horizontal" key={`999:0-empty`}>
                  {(provided) => (
                    <div ref={provided.innerRef} {...provided.droppableProps} className="pyramid-row-line">
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              )}
            </div>
          );
        })()}
      </div>
    </DragDropContext>
  );
}