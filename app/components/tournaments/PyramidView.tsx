"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
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
import React from "react";

type PyramidViewProps = {
  participants: Participant[];
  onSelect: (ids: number[]) => void;
  selectedIds: number[];
  onShowHistory?: (participant?: Participant) => void;
  matches: Match[];
  onPositionsChange?: (next: Participant[]) => Promise<void> | void;
  maxLevel: number;
};

// Функция получения статуса игрока (вынесена из компонента)
const getPlayerStatusIcon = (
  participantId: number,
  match: Match
): { icon: string; className: string; title: string } => {
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
};

// Мемоизированный компонент
export const PyramidView = React.memo(function PyramidView({
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

  // === КЭШ ДЛЯ ОПТИМИЗАЦИИ ===
  const matchesCache = useRef(new Map<number, Match[]>());
  const lastMatchCache = useRef(new Map<number, Match | null>());
  const statusClassCache = useRef(new Map<number, string>());
  const daysWithoutGamesCache = useRef(new Map<number, number | null>());

  // Сбрасываем кэш при изменении matches
  useEffect(() => {
    matchesCache.current.clear();
    lastMatchCache.current.clear();
    statusClassCache.current.clear();
    daysWithoutGamesCache.current.clear();
  }, [matches]);

  // === Мемоизация вычислений ===
  const totalLevels = useMemo(() => {
    const fromData = participants.length
      ? participants.reduce((m, p) => Math.max(m, p.level ?? 0), 0)
      : 0;
    return Math.max(Number(maxLevel) || 0, fromData);
  }, [participants, maxLevel]);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const CARD = 110;
  const [perRow, setPerRow] = useState(3);

  // Оптимизированный ResizeObserver
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    
    const handleResize = () => {
      const w = el.clientWidth;
      const next = Math.max(1, Math.floor(w / CARD));
      setPerRow(next);
    };

    const ro = new ResizeObserver(() => {
      requestAnimationFrame(handleResize);
    });
    
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Оптимизированная сортировка участников
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

  // Мемоизированные утилиты
  const chunk = useCallback(<T,>(arr: T[], size: number): T[][] => {
    const rows: T[][] = [];
    for (let i = 0; i < arr.length; i += size) rows.push(arr.slice(i, i + size));
    return rows;
  }, []);

  const parseDroppableId = useCallback((id: string) => {
    const [levelKey, rowStr] = id.split(":");
    return { levelKey, rowIndex: Number(rowStr) || 0 };
  }, []);

  const buildByLevel = useCallback((items: Participant[]) => {
    const byLevel: Record<string, Participant[]> = {};
    for (let i = 1; i <= totalLevels; i++) byLevel[String(i)] = [];
    byLevel["999"] = [];

    items.forEach((p) => {
      const key = p.level ? String(p.level) : "999";
      (byLevel[key] ??= []).push(p);
    });
    return byLevel;
  }, [totalLevels]);

  const onDragStart = useCallback(() => {
    document.body.classList.add("dnd-active");
  }, []);

  // Оптимизированный handleDragEnd
  const handleDragEnd = useCallback(async (result: DropResult) => {
    document.body.classList.remove("dnd-active");
    const { source, destination, draggableId } = result;
    if (!destination) return;

    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const items = [...localParticipants];
    const byLevel = buildByLevel(items);

    const { levelKey: srcLevelKey, rowIndex: srcRowIndex } = parseDroppableId(String(source.droppableId));
    const srcLinearIndexPre = srcRowIndex * perRow + source.index;
    const srcArrLinear = byLevel[srcLevelKey] ?? (byLevel[srcLevelKey] = []);
    const srcLinearIndex = Math.min(srcLinearIndexPre, Math.max(0, srcArrLinear.length - 1));

    const [removed] = srcArrLinear.splice(srcLinearIndex, 1);

    const { levelKey: dstLevelKey, rowIndex: dstRowIndex } = parseDroppableId(String(destination.droppableId));
    const dstArrLinear = byLevel[dstLevelKey] ?? (byLevel[dstLevelKey] = []);

    let dstLinearIndex = dstRowIndex * perRow + destination.index;

    if (srcLevelKey === dstLevelKey && srcLinearIndex < dstLinearIndex) {
      dstLinearIndex -= 1;
    }
    dstLinearIndex = Math.max(0, Math.min(dstLinearIndex, dstArrLinear.length));

    dstArrLinear.splice(dstLinearIndex, 0, removed);

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
  }, [localParticipants, buildByLevel, parseDroppableId, perRow, totalLevels, onPositionsChange]);

  // Оптимизированная функция получения матчей игрока
  const getPlayerMatches = useCallback((participantId: number): Match[] => {
    if (matchesCache.current.has(participantId)) {
      return matchesCache.current.get(participantId)!;
    }
    
    const playerMatches = matches.filter(
      m => m.scores.length && 
      (m.player1?.id === participantId || m.player2?.id === participantId ||
       m.team1?.id === participantId || m.team2?.id === participantId)
    );
    
    matchesCache.current.set(participantId, playerMatches);
    return playerMatches;
  }, [matches]);

  // Оптимизированная функция получения последнего матча
  const getLastMatch = useCallback((participantId: number): Match | null => {
    if (lastMatchCache.current.has(participantId)) {
      return lastMatchCache.current.get(participantId)!;
    }

    const playerMatches = getPlayerMatches(participantId);
    const nowTs = Date.now();

    // Выбираем лучший матч без сортировки массива (не мутируем кеш)
    const last = playerMatches
      .filter(m => m.date.getTime() <= nowTs)
      .reduce<Match | null>((acc, m) => {
        if (!acc) return m;
        const dt = m.date.getTime() - acc.date.getTime();
        if (dt > 0) return m;          // m новее по дате
        if (dt < 0) return acc;        // acc новее по дате
        // даты равны — тай-брейк по id (предполагаем, что больший id == более поздняя вставка)
        return (m.id ?? 0) > (acc.id ?? 0) ? m : acc;
      }, null);

    lastMatchCache.current.set(participantId, last);
    return last;
  }, [getPlayerMatches]);

  // Оптимизированная функция получения дней без игр
  const getDaysWithoutGames = useCallback((participantId: number): number | null => {
    if (daysWithoutGamesCache.current.has(participantId)) {
      return daysWithoutGamesCache.current.get(participantId)!;
    }

    const lastMatch = getLastMatch(participantId);
    let daysWithoutGames: number | null = null;
    
    if (lastMatch) {
      const diffMs = Date.now() - lastMatch.date.getTime();
      daysWithoutGames = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    }

    daysWithoutGamesCache.current.set(participantId, daysWithoutGames);
    return daysWithoutGames;
  }, [getLastMatch]);

  const getPlayerClass = useCallback((participant: Participant): string => {
    const id = participant.player?.id ?? participant.team?.id;
    if (!id) return "";

    if (statusClassCache.current.has(id)) {
      return statusClassCache.current.get(id)!;
    }

    const playerMatches = getPlayerMatches(id);
    if (playerMatches.length === 0) {
      statusClassCache.current.set(id, "");
      return "";
    }

    const lastMatch = getLastMatch(id);
    let result = "";

    if (!lastMatch || lastMatch.getWinnerId() === 0) {
      result = "draw";
    } else {
      result = lastMatch.getWinnerId() === id ? "winner" : "loser";
    }

    statusClassCache.current.set(id, result);
    return result;
  }, [getPlayerMatches, getLastMatch]);

  const canChallenge = useCallback((attacker: Participant, defender: Participant): boolean => {
    if (!defender.level || !defender.position) return false;
    if (!attacker.level || !attacker.position) return defender.level >= totalLevels - 1;
    if (attacker.level === defender.level) return defender.position < attacker.position;
    if (defender.level === attacker.level - 1) return true;
    return false;
  }, [totalLevels]);

  const handleClick = useCallback((id: number, participant: Participant) => {
    let newSelection: number[] = [];
    if (user?.role === undefined) return;
    if (user?.role === "player" && selectedIds.length > 0 && selectedIds[0] === id) return;

    if (selectedIds.includes(id)) {
      newSelection = selectedIds.filter((x) => x !== id);
    } else if (selectedIds.length === 0) {
      newSelection = [id];
    } else if (selectedIds.length === 1) {
      const attacker = localParticipants.find((p) => (p.player?.id ?? p.team?.id) === selectedIds[0]);
      if (attacker && canChallenge(attacker, participant)) {
        newSelection = [selectedIds[0], id];
      } else {
        setInvalidId(id);
        setTimeout(() => setInvalidId(null), 1500);
        return;
      }
    } else if (selectedIds.length === 2) {
      if (user?.role === "player") {
        const attacker = localParticipants.find((p) => (p.player?.id ?? p.team?.id) === selectedIds[0]);
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
  }, [user?.role, selectedIds, localParticipants, canChallenge, onSelect]);

  // Мемоизированный рендер карточки игрока
  const renderPlayerCard = useCallback((p: Participant, indexInRow: number) => {
    const id = p.player?.id ?? p.team?.id;
    if (!id) return null;

    const statusClass = getPlayerClass(p);
    const lastMatch = getLastMatch(id);
    const daysWithoutGames = getDaysWithoutGames(id);

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
              selectedIds.includes(id) ? "selected" : ""
            } ${statusClass} ${invalidId === id ? "shake" : ""}`}
            onClick={() => handleClick(id, p)}
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
                const status = lastMatch ? getPlayerStatusIcon(id, lastMatch) : null;
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
                    onShowHistory?.(p);
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
  }, [getPlayerClass, getLastMatch, getDaysWithoutGames, selectedIds, invalidId, handleClick, onShowHistory]);

  const byLevel = useMemo(() => buildByLevel(localParticipants), [localParticipants, buildByLevel]);

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
});