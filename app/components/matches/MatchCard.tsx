"use client";

import "./MatchCard.css";

import { formatDate } from "@/app/components/Utils";
import { Match } from "@/app/models/Match";
import {
  CommentIconButton,
  DeleteIconButton,
  EditIconButton,
  LikeIconButton,
  SaveIconButton,
  CancelIconButton,
} from "@/app/components/controls/IconButtons";
import { AdminOnly } from "../RoleGuard";
import { useEffect, useMemo, useState } from "react";
import { useDictionary } from "@/app/components/LanguageProvider";
import type { CSSProperties, MouseEvent as ReactMouseEvent } from "react";

type MatchCardProps = {
  match: Match;
  onClick?: () => void;
  onEdit?: (updated: Match) => Promise<void> | void;
  onDelete?: (match: Match) => void;
};

const MAX_SETS_TO_EDIT = 3; // два сета + тай-брейк

export function MatchCard({ match, onClick, onEdit, onDelete }: MatchCardProps) {
  // состояние для временного тултипа "Пока не реализовано"
  const [showTooltip, setShowTooltip] = useState(false);
  const [showComment, setShowComment] = useState(false); // показываем тултип с комментарием
  const [isEditing, setIsEditing] = useState(false);
  const { matchCard: matchCardText } = useDictionary();
  const scoreSets: Array<[number | string | null, number | string | null]> = Array.isArray(match.scores)
    ? (match.scores as any[])
    : [];

  const buildDraftSets = (
    source: Array<[number | string | null, number | string | null]>
  ): [string, string][] => {
    const normalized = (source ?? [])
      .slice(0, MAX_SETS_TO_EDIT)
      .map(([a, b]) => [a != null ? String(a) : "", b != null ? String(b) : ""] as [string, string]);

    while (normalized.length < MAX_SETS_TO_EDIT) {
      normalized.push(["", ""]);
    }

    return normalized;
  };

  const commentText = useMemo(() => {
    const raw = (match as any).comment as string | null | undefined;
    return raw && raw.trim().length > 0 ? raw.trim() : matchCardText.comment;
  }, [match, matchCardText.comment]);

  const hasComment = useMemo(() => {
    const raw = (match as any).comment as string | null | undefined;
    return !!raw && raw.trim().length > 0;
  }, [match]);

  const [draftSets, setDraftSets] = useState<[string, string][]>(() => buildDraftSets(scoreSets));
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // обновляем черновик при смене матча (например, после сохранения)
  useEffect(() => {
    if (isEditing) return;
    setDraftSets(buildDraftSets(Array.isArray(match.scores) ? (match.scores as any[]) : []));
    setError(null);
  }, [match, isEditing]);

  // нормализуем массив сетов для отображения
  const sets = scoreSets;

  const handleScoreInputChange = (setIdx: number, playerIdx: 0 | 1, value: string) => {
    const trimmed = value.replace(/[^\d]/g, "");
    if (trimmed.length > 2) return;
    setDraftSets((prev) => {
      const next = prev.map(([a, b]) => [a, b] as [string, string]);
      if (!next[setIdx]) {
        next[setIdx] = ["", ""];
      }
      const current = next[setIdx];
      if (playerIdx === 0) next[setIdx] = [trimmed, current[1]];
      else next[setIdx] = [current[0], trimmed];
      return next;
    });
  };

  // безопасный доступ к счёту
  const getScore = (setIdx: number, playerIdx: 0 | 1) => {
    const set = sets[setIdx];
    if (!set) return "";
    const v = set[playerIdx];
    return (v ?? "") as string | number;
  };

  // определяем победителя конкретного сета
  const getWinner = (setIdx: number): 0 | 1 | null => {
    const set = sets[setIdx];
    if (!set) return null;
    const [a, b] = set.map((v) => (typeof v === "number" ? v : parseInt(String(v)) || 0));
    if (a > b) return 0;
    if (b > a) return 1;
    return null;
  };

  // определяем победителя всего матча (по логике модели)
  const matchWinnerId = match.getWinnerId();

  const handleEditClick = (e: ReactMouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (!onEdit) {
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 2000);
      return;
    }
    setDraftSets(buildDraftSets(scoreSets));
    setIsEditing(true);
    setError(null);
  };

  const handleCancelEdit = (e?: ReactMouseEvent<HTMLButtonElement>) => {
    if (e) e.stopPropagation();
    setIsEditing(false);
    setDraftSets(buildDraftSets(scoreSets));
    setError(null);
  };

  const handleSaveEdit = async (e: ReactMouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (!onEdit) return;
    const sanitized = draftSets
      .map(([a, b]) => [a.trim(), b.trim()] as [string, string])
      .filter(([a, b]) => a !== "" || b !== "");

    const nextScores: [number, number][] = [];
    for (const [aStr, bStr] of sanitized) {
      if (aStr === "" || bStr === "") {
        setError(matchCardText.setsIncomplete);
        return;
      }
      const a = parseInt(aStr, 10);
      const b = parseInt(bStr, 10);
      if (Number.isNaN(a) || Number.isNaN(b)) {
        setError(matchCardText.scoreNumbersOnly);
        return;
      }
      nextScores.push([a, b]);
    }

    setSaving(true);
    setError(null);
    try {
      const updated = new Match(
        match.id,
        match.type,
        new Date(match.date),
        nextScores,
        match.tournament,
        match.player1,
        match.player2,
        match.team1,
        match.team2
      );
      updated.phase = match.phase;
      updated.groupIndex = match.groupIndex;
      updated.roundIndex = match.roundIndex;
      await onEdit(updated);
      setIsEditing(false);
      setDraftSets(buildDraftSets((updated.scores as any[]) ?? []));
    } catch (err: any) {
      console.error("MatchCard: update failed", err);
      setError(err?.message ?? matchCardText.saveFailed);
    } finally {
      setSaving(false);
    }
  };

  const cardClickHandler = isEditing ? undefined : onClick;

  return (
    <div
      className={`card match-card${cardClickHandler ? " clickable" : ""}`}
      onClick={cardClickHandler}
      role={cardClickHandler ? "button" : undefined}
    >
      {/* заголовок карточки */}
      <div className="card-header">
        <div></div>
        <h3>{match.tournament.name}</h3>
        <div className="match-card-date">{formatDate(match.date)}</div>
      </div>

      {isEditing ? (
        <div className="match-card-body match-card-body--editing" onClick={(e) => e.stopPropagation()}>
          <div className="card-row match-card-row match-card-row--editing">
            <div className="avatar">{(match.player1?.displayName()?.[0] ?? "U").toUpperCase()}</div>
            <div className="player">{match.player1?.displayName() ?? match.team1?.displayName()}</div>
            {draftSets.map((set, i) => (
              <div key={`edit-a-${i}`} className="cell cell--score">
                <input
                  type="text"
                  maxLength={2}
                  className="input match-card-score-input"
                  value={set[0]}
                  onChange={(e) => handleScoreInputChange(i, 0, e.target.value)}
                  placeholder={matchCardText.scorePlaceholder}
                  disabled={saving}
                />
              </div>
            ))}
          </div>

          <div className="card-row match-card-row match-card-row--editing">
            <div className="avatar">{(match.player2?.displayName()?.[0] ?? "U").toUpperCase()}</div>
            <div className="player">{match.player2?.displayName() ?? match.team2?.displayName()}</div>
            {draftSets.map((set, i) => (
              <div key={`edit-b-${i}`} className="cell cell--score">
                <input
                  type="text"
                  maxLength={2}
                  className="input match-card-score-input"
                  value={set[1]}
                  onChange={(e) => handleScoreInputChange(i, 1, e.target.value)}
                placeholder={matchCardText.scorePlaceholder}
                disabled={saving}
              />
              </div>
            ))}
          </div>
          {error && <div className="match-card-edit__error">{error}</div>}
        </div>
      ) : (
        <div className="match-card-body">
          {/* строка игрока A */}
          <div
            className="card-row match-card-row"
            style={{ "--sets-count": 3 } as CSSProperties}
          >
            <div
              className={`avatar ${
                matchWinnerId && matchWinnerId === match.player1?.id ? "match-winner" : ""
              }`}
            >
              {(match.player1?.displayName()?.[0] ?? "U").toUpperCase()}
            </div>

            <div className="player">
              {match.player1?.displayName() ?? match.team1?.displayName()}
            </div>

            {Array.from({ length: MAX_SETS_TO_EDIT }).map((_, i) => {
              const winner = getWinner(i);
              return (
                <div
                  key={`a-${i}`}
                  className={`cell cell--score ${winner === 0 ? "winner" : ""}`}
                >
                  {getScore(i, 0)}
                </div>
              );
            })}
          </div>

          {/* строка игрока B */}
          <div
            className="card-row match-card-row"
            style={{ "--sets-count": 3 } as CSSProperties}
          >
            <div
              className={`avatar ${
                matchWinnerId && matchWinnerId === match.player2?.id ? "match-winner" : ""
              }`}
            >
              {(match.player2?.displayName()?.[0] ?? "U").toUpperCase()}
            </div>

            <div className="player">
              {match.player2?.displayName() ?? match.team2?.displayName()}
            </div>

            {Array.from({ length: MAX_SETS_TO_EDIT }).map((_, i) => {
              const winner = getWinner(i);
              return (
                <div
                  key={`b-${i}`}
                  className={`cell cell--score ${winner === 1 ? "winner" : ""}`}
                >
                  {getScore(i, 1)}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {isEditing ? (
        <AdminOnly>
          <div className="card-bottom-toolbar">
            <SaveIconButton
              title={matchCardText.save}
              onClick={handleSaveEdit}
              disabled={saving}
            />
            <CancelIconButton
              title={matchCardText.cancel}
              onClick={handleCancelEdit}
              disabled={saving}
            />
          </div>
        </AdminOnly>
      ) : (
        <div className="card-bottom-toolbar">
          <LikeIconButton
            title={matchCardText.like}
            onClick={(e) => {
              e.stopPropagation();
              setShowTooltip(true);
              setTimeout(() => setShowTooltip(false), 2000);
            }}
          />

          <div className="comment-btn-wrap">
            <CommentIconButton
              title={matchCardText.comment}
              onClick={(e) => {
                e.stopPropagation();
                if (!hasComment) return;
                setShowComment((prev) => !prev);
              }}
              disabled={!hasComment}
            />
            {showComment && (
              <div className="comment-tooltip comment-tooltip--button help-tooltip">
                {commentText}
              </div>
            )}
          </div>

          <AdminOnly>
            <EditIconButton
              title={matchCardText.edit}
              onClick={handleEditClick}
              disabled={saving}
            />

            {onDelete && (
              <DeleteIconButton
                title={matchCardText.delete}
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(match);
                }}
              />
            )}
          </AdminOnly>

          {showTooltip && <div className="invalid-tooltip">{matchCardText.tooltipPending}</div>}
        </div>
      )}
    </div>
  );
}
