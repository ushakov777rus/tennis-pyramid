"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Participant } from "@/app/models/Participant";
import { Match } from "@/app/models/Match";
import {
  SaveIconButton,
  CancelIconButton,
} from "@/app/components/controls/IconButtons";
import { useFirstHelpTooltip } from "@/app/hooks/useFirstHelpTooltip";
import {
  ScoreKeyboard,
  useScoreKeyboardAvailable,
} from "@/app/components/controls/ScoreKeyboard";

import "./RoundRobinTable.css";
import "./PyramidView.css";
import "@/app/components/ParticipantsView.css";

/**
 * Public props for the round-robin table.
 */
export type RoundRobinTableProps = {
  participants: Participant[];
  matches: Match[];
  onSaveScore?: (
    aId: number,
    bId: number,
    score: string
  ) => Promise<void> | void;
};

/**
 * Keeps track of the cell coordinates that are currently being edited.
 */
type EditingCell = {
  rowId: number;
  colId: number;
};

/**
 * Optimistic score entry that mirrors the format returned by the backend.
 */
type PendingEntry = {
  aId: number;
  bId: number;
  scores: [number, number][];
  raw: string;
};

/**
 * Ensures we work only with participants that have either a single player or a team.
 *
 * @param participant Candidate entity coming from the API.
 * @returns True when a participant is present and has a valid payload.
 */
function isValidParticipant(
  participant: Participant | null | undefined
): participant is Participant {
  return !!participant && (!!participant.player || !!participant.team);
}

/**
 * Generates a stable key for a pair of IDs regardless of order.
 *
 * @param aId First participant ID.
 * @param bId Second participant ID.
 * @returns Stable map key in the format smaller_larger.
 */
const pairKey = (aId: number, bId: number) =>
  `${Math.min(aId, bId)}_${Math.max(aId, bId)}`;

/**
 * Formats a list of sets for human-readable display such as "6/4".
 *
 * @param sets Collection of set scores oriented for the current row.
 * @returns Multiline string representation.
 */
const formatDisplay = (sets: Array<[number, number]>): string => {
  if (!sets.length) return "—";
  return sets.map(([a, b]) => `${a}/${b}`).join("\n");
};

/**
 * Formats a list of sets for input usage such as "6-4, 4-6".
 *
 * @param sets Collection of set scores oriented for the current row.
 * @returns Comma separated representation.
 */
const formatInput = (sets: Array<[number, number]>): string => {
  if (!sets.length) return "";
  return sets.map(([a, b]) => `${a}-${b}`).join(", ");
};

/**
 * Mirrors the score for the opposite perspective of a match.
 *
 * @param sets Source scores in "row" orientation.
 * @returns The same sets, but with swapped columns.
 */
const flipSets = (sets: Array<[number, number]>) =>
  sets.map(([a, b]) => [b, a] as [number, number]);

/**
 * Resolves a match between two participants if it exists.
 *
 * @param aId First participant identifier.
 * @param bId Second participant identifier.
 * @param matches Full matches list for the tournament.
 * @returns Stored match or null when it does not exist yet.
 */
function findMatch(aId: number, bId: number, matches: Match[]): Match | null {
  return (
    matches.find((match) => {
      const id1 = match.player1?.id ?? match.team1?.id;
      const id2 = match.player2?.id ?? match.team2?.id;
      return (id1 === aId && id2 === bId) || (id1 === bId && id2 === aId);
    }) ?? null
  );
}

/**
 * Builds display/input friendly scores by orienting data for the given row.
 *
 * @param aId Row participant identifier.
 * @param bId Column participant identifier.
 * @param matches Full matches list.
 * @returns Display/mirror/input strings or null when no match is recorded.
 */
function getMatchScoresFromMatches(
  aId: number,
  bId: number,
  matches: Match[]
): { display: string; mirror: string; input: string } | null {
  const match = findMatch(aId, bId, matches);
  if (!match) return null;
  const rowSets = orientScores(match, aId);
  const colSets = orientScores(match, bId);
  return {
    display: formatDisplay(rowSets),
    mirror: formatDisplay(colSets),
    input: formatInput(rowSets),
  };
}

/**
 * Adapts the raw match scores to the perspective of the requested participant.
 *
 * @param match Raw match entity.
 * @param perspectiveId Participant identifier used as the "row" point of view.
 * @returns Array of sets where the first value represents the requested participant.
 */
const orientScores = (match: Match, perspectiveId: number): Array<[number, number]> => {
  const id1 = match.player1?.id ?? match.team1?.id;
  const id2 = match.player2?.id ?? match.team2?.id;
  if (!match.scores || match.scores.length === 0) return [];

  if (id1 === perspectiveId) return match.scores.slice();
  if (id2 === perspectiveId)
    return match.scores.map(([a, b]) => [b, a]);
  return match.scores.slice();
};

/**
 * Aggregates round-robin statistics for a participant.
 *
 * @param meId Participant identifier for whom the stats are calculated.
 * @param ids Ordered list of participant identifiers.
 * @param matches Tournament matches list.
 * @param pending Optional map with optimistic results.
 * @returns Wins, games for and against for the participant.
 */
function computeStatsFor(
  meId: number,
  ids: number[],
  matches: Match[],
  pending?: Map<string, PendingEntry>
): { points: number; gamesFor: number; gamesAgainst: number } {
  let points = 0;
  let gamesFor = 0;
  let gamesAgainst = 0;

  for (const oppId of ids) {
    if (oppId === meId) continue;
    const key = pairKey(meId, oppId);
    const pendingEntry = pending?.get(key);

    let oriented: Array<[number, number]> | null = null;

    if (pendingEntry) {
      const base = pendingEntry.scores;
      oriented = pendingEntry.aId === meId ? base : flipSets(base);
    } else {
      const match = findMatch(meId, oppId, matches);
      if (!match || !match.scores || match.scores.length === 0) continue;
      const id1 = match.player1?.id ?? match.team1?.id;
      const amFirst = id1 === meId;
      oriented = match.scores.map(([sA, sB]) => (amFirst ? [sA, sB] : [sB, sA])) as Array<[
        number,
        number
      ]>;
    }

    if (!oriented || oriented.length === 0) continue;

    let mySets = 0;
    let oppSets = 0;

    for (const [my, opp] of oriented) {
      gamesFor += my;
      gamesAgainst += opp;
      if (my > opp) mySets += 1;
      else if (opp > my) oppSets += 1;
    }

    if (mySets > oppSets) points += 1;
  }

  return { points, gamesFor, gamesAgainst };
}

/**
 * React component that renders the round-robin matrix together with inline editing.
 *
 * @param props Component props describing the tournament state.
 * @returns JSX markup for the table with inline score editing.
 */
export function RoundRobinTable({
  participants,
  matches,
  onSaveScore,
}: RoundRobinTableProps) {
  /** Tracks the pair that is currently being edited. */
  const [editingKey, setEditingKey] = useState<string | null>(null);
  /** Holds the textual representation of the score being edited. */
  const [editValue, setEditValue] = useState<string>("");
  /** Reflects whether the score submission is in progress. */
  const [saving, setSaving] = useState(false);

  /** Tells whether the custom numeric keyboard should be shown. */
  const mobileKeyboardAvailable = useScoreKeyboardAvailable();
  /** Stores ids for which the mobile keyboard is active. */
  const [mobileKeyboardContext, setMobileKeyboardContext] = useState<{
    aId: number;
    bId: number;
  } | null>(null);

  /** Reference to the editable input field for desktop editing. */
  const editingInputRef = useRef<HTMLInputElement | HTMLDivElement | null>(null);
  /** Reference to the wrapper to update padding when the keyboard is visible. */
  const wrapRef = useRef<HTMLDivElement | null>(null);
  /** Reference to the keyboard host node to measure the footer panel. */
  const keyboardHostRef = useRef<HTMLDivElement | null>(null);
  /** Reference to the matrix table to locate active cells. */
  const tableRef = useRef<HTMLTableElement | null>(null);
  /** Keeps the current height of the custom keyboard panel. */
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  /** Remembers which table cell is being edited to position the keyboard. */
  const [editingCell, setEditingCell] = useState<EditingCell | null>(null);
  /** Stores optimistic scores until the server confirms them. */
  const [pendingScores, setPendingScores] = useState<Map<string, PendingEntry>>(new Map());

  /**
   * Measures the custom keyboard height so we can reserve space beneath the table.
   */
  useEffect(() => {
    if (!mobileKeyboardAvailable || !mobileKeyboardContext) {
      setKeyboardHeight(0);
      return;
    }

    const host = keyboardHostRef.current;
    if (!host) return;

    const getKeyboardNode = () => host.querySelector<HTMLElement>(".score-kb");

    const updateHeight = () => {
      const node = getKeyboardNode();
      if (!node) return;
      const next = Math.ceil(node.getBoundingClientRect().height);
      setKeyboardHeight((prev) => (prev === next ? prev : next));
    };

    updateHeight();

    let observer: ResizeObserver | null = null;
    let resizeHandler: (() => void) | null = null;
    let fallbackId: number | null = null;

    if (typeof ResizeObserver !== "undefined") {
      const node = getKeyboardNode();
      if (node) {
        observer = new ResizeObserver(updateHeight);
        observer.observe(node);
      }
    }

    if (typeof window !== "undefined") {
      resizeHandler = () => updateHeight();
      window.addEventListener("resize", resizeHandler);

      if (!observer) {
        fallbackId = window.setInterval(updateHeight, 250);
      }
    }

    return () => {
      observer?.disconnect();
      if (resizeHandler && typeof window !== "undefined") {
        window.removeEventListener("resize", resizeHandler);
      }
      if (fallbackId != null && typeof window !== "undefined") {
        window.clearInterval(fallbackId);
      }
    };
  }, [mobileKeyboardAvailable, mobileKeyboardContext]);

  /**
   * Drops optimistic scores once the backend returns authoritative match records.
   */
  useEffect(() => {
    if (!pendingScores.size) return;
    setPendingScores((prev) => {
      if (!prev.size) return prev;
      const next = new Map(prev);
      let changed = false;
      for (const [key, entry] of prev) {
        const actual = getMatchScoresFromMatches(entry.aId, entry.bId, matches);
        if (actual && actual.display !== "—") {
          next.delete(key);
          changed = true;
        }
      }
      return changed ? next : prev;
    });
  }, [matches, pendingScores]);

  /**
   * Reserves additional padding below the matrix so the keyboard does not overlap content.
   */
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const bottomGap = keyboardHeight > 0 ? `${keyboardHeight + 16}px` : "0px";
    wrap.style.setProperty("--rr-bottom-gap", bottomGap);
  }, [keyboardHeight]);

  /**
   * Scrolls the matrix so that the active cell stays visible when the keyboard slides in.
   */
  useEffect(() => {
    if (!mobileKeyboardAvailable || !editingCell) return;
    const table = tableRef.current;
    if (!table) return;

    const cell = table.querySelector<HTMLElement>(
      `[data-rr-cell="${editingCell.rowId}-${editingCell.colId}"]`
    );
    if (!cell) return;

    const rect = cell.getBoundingClientRect();
    const viewportPadding = 24;
    const availableBottom = window.innerHeight - (keyboardHeight || 0) - viewportPadding;
    let delta = 0;

    if (rect.bottom > availableBottom) {
      delta = rect.bottom - availableBottom;
    } else if (rect.top < viewportPadding) {
      delta = rect.top - viewportPadding;
    }

    if (Math.abs(delta) > 1) {
      window.scrollBy({ top: delta, behavior: "smooth" });
    }
  }, [mobileKeyboardAvailable, editingCell, keyboardHeight, mobileKeyboardContext]);

  /**
   * Ordered list of valid participants for deterministic rendering.
   */
  const ordered = useMemo(
    () =>
      participants
        .filter(isValidParticipant)
        .slice()
        .sort((a, b) =>
          a.displayName(false).localeCompare(b.displayName(false), "ru")
        ),
    [participants]
  );

  /**
   * Convenience list of participant identifiers.
   */
  const ids = useMemo(() => ordered.map((participant) => participant.getId), [ordered]);

  /**
   * Provides quick access to participant positions by identifier.
   */
  const indexById = useMemo(() => {
    const map = new Map<number, number>();
    ids.forEach((id, index) => map.set(id, index));
    return map;
  }, [ids]);

  /**
   * Calculates standings (points, game difference and placements) with optimistic updates.
   */
  const standings = useMemo(() => {
    const rows = ids.map((id) => {
      const stats = computeStatsFor(id, ids, matches, pendingScores);
      return {
        id,
        ...stats,
        diff: stats.gamesFor - stats.gamesAgainst,
        name: ordered[indexById.get(id)!].displayName(false),
      };
    });

    const sorted = rows.slice().sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      if (b.diff !== a.diff) return b.diff - a.diff;
      if (b.gamesFor !== a.gamesFor) return b.gamesFor - a.gamesFor;
      return a.name.localeCompare(b.name, "ru");
    });

    const placeById = new Map<number, number>();
    sorted.forEach((row, index) => placeById.set(row.id, index + 1));

    return { rows, placeById };
  }, [ids, matches, ordered, indexById, pendingScores]);

  /**
   * Resolves visible scores either from optimistic cache or from persisted matches.
   */
  const getScoresFor = useCallback(
    (rowId: number, colId: number) => {
      const key = pairKey(rowId, colId);
      const pending = pendingScores.get(key);
      if (pending) {
        const rowSets = pending.aId === rowId ? pending.scores : flipSets(pending.scores);
        const colSets = pending.aId === colId ? pending.scores : flipSets(pending.scores);
        return {
          display: formatDisplay(rowSets),
          mirror: formatDisplay(colSets),
          input: formatInput(rowSets),
        };
      }

      return getMatchScoresFromMatches(rowId, colId, matches);
    },
    [pendingScores, matches]
  );

  /**
   * Opens the editor for a specific pair of participants.
   *
   * @param aId Row participant identifier.
   * @param bId Column participant identifier.
   * @param currentScore Score to prefill or null when empty.
   * @param anchor Optional cell coordinates to maintain scroll state.
   */
  function startEdit(
    aId: number,
    bId: number,
    currentScore: string | null,
    anchor?: EditingCell
  ) {
    const key = pairKey(aId, bId);
    setEditingKey(key);
    setEditValue(currentScore ?? "");
    setEditingCell({
      rowId: anchor?.rowId ?? aId,
      colId: anchor?.colId ?? bId,
    });
    editingInputRef.current = null;
    if (mobileKeyboardAvailable) {
      setMobileKeyboardContext({ aId, bId });
    }
  }

  /**
   * Cancels inline editing and resets helpers.
   */
  function cancelEdit() {
    setEditingKey(null);
    setEditValue("");
    editingInputRef.current = null;
    setMobileKeyboardContext(null);
    setEditingCell(null);
  }

  /**
   * Persists the entered score with optimistic UI feedback.
   *
   * @param aId Row participant identifier.
   * @param bId Column participant identifier.
   * @param raw Optional score override (used by the mobile keyboard).
   */
  async function saveEdit(aId: number, bId: number, raw?: string) {
    const currentNode = editingInputRef.current;
    const fallbackValue =
      currentNode instanceof HTMLInputElement ? currentNode.value : editValue;

    const nextValue = (raw ?? fallbackValue ?? "").trim();

    const normalized = nextValue.replaceAll("/", "-");
    if (!Match.isValidScoreFormat(normalized)) {
      alert('Неверный формат счёта. Примеры: "6-4, 4-6" или "6/4, 4/6"');
      return;
    }

    const key = pairKey(aId, bId);
    const parsedScores = Match.parseScoreStringFlexible(normalized);

    setPendingScores((prev) => {
      const next = new Map(prev);
      next.set(key, { aId, bId, scores: parsedScores, raw: normalized });
      return next;
    });

    setEditingKey(null);
    setEditValue("");
    editingInputRef.current = null;
    setMobileKeyboardContext(null);
    setEditingCell(null);

    try {
      setSaving(true);
      await onSaveScore?.(aId, bId, normalized);
    } catch (_error) {
      setPendingScores((prev) => {
        if (!prev.has(key)) return prev;
        const next = new Map(prev);
        next.delete(key);
        return next;
      });
      alert("Не удалось сохранить счёт. Попробуйте ещё раз.");
    } finally {
      setSaving(false);
    }
  }

  /**
   * Renders a matrix cell, handling sticky layout, editing state and optimistic data.
   */
  function Cell({
    aId,
    bId,
    rIndex,
    cIndex,
  }: {
    aId: number;
    bId: number;
    rIndex: number;
    cIndex: number;
  }) {
    if (aId === bId) {
      return <td className="rr-diag" aria-hidden />;
    }

    const isLowerTriangle = rIndex > cIndex;
    const key = pairKey(aId, bId);
    const isEditing = editingKey === key;
    const isActiveCell = isEditing && editingCell?.rowId === aId && editingCell?.colId === bId;

    const renderEditor = () => (
      <div className="score-edit-wrap">
        <input
          className="input score-input"
          value={editValue}
          readOnly={mobileKeyboardAvailable}
          ref={(node) => {
            editingInputRef.current = node;
          }}
          placeholder="6-4, 4-6, 10-8"
          pattern="[0-9\\s,/:-]*"
          inputMode={mobileKeyboardAvailable ? "numeric" : undefined}
          autoFocus={!mobileKeyboardAvailable}
          onFocus={(event) => {
            if (mobileKeyboardAvailable) event.currentTarget.blur();
          }}
          onKeyDown={(event) => {
            if (!mobileKeyboardAvailable) {
              if (event.key === "Enter") {
                event.preventDefault();
                saveEdit(aId, bId);
              }
              if (event.key === "Escape") {
                event.preventDefault();
                cancelEdit();
              }
            }
          }}
          onChange={(event) => {
            if (!mobileKeyboardAvailable) {
              setEditValue(event.target.value);
            }
          }}
        />

        {!mobileKeyboardAvailable && (
          <>
            <SaveIconButton
              className="lg"
              title="Сохранить счёт"
              aria-label="Сохранить счёт"
              onClick={() => saveEdit(aId, bId)}
              disabled={saving}
            />
            <CancelIconButton
              className="lg"
              title="Отмена"
              aria-label="Отмена"
              onClick={cancelEdit}
              disabled={saving}
            />
          </>
        )}
      </div>
    );

    const makeButton = (
      handler: () => void,
      {
        withTooltip = true,
      }: { withTooltip?: boolean } = {}
    ) => {
      const shouldShowHelp = withTooltip && !isActiveCell && firstHelpTooltip();
      return (
        <div className="score-cell__button-wrap">
          {shouldShowHelp && <div className="help-tooltip">Введите счёт</div>}
          <button
            type="button"
            className="vs vs-click"
            onClick={handler}
            title="Добавить счёт"
            aria-label="Добавить счёт"
          >
            vs
          </button>
        </div>
      );
    };

    const scores = getScoresFor(aId, bId);
    if (!scores) {
      if (isLowerTriangle) {
        return (
          <td
            data-rr-cell={`${aId}-${bId}`}
            className={`rr-cell ${isActiveCell ? "editing" : ""}`}
          >
            {isActiveCell
              ? renderEditor()
              : makeButton(() =>
                  startEdit(aId, bId, null, { rowId: aId, colId: bId })
                )}
          </td>
        );
      }

      return (
        <td
          data-rr-cell={`${aId}-${bId}`}
          className={`rr-cell rr-cell--mirror rr-empty ${isActiveCell ? "editing" : ""}`}
        >
          {isActiveCell
            ? renderEditor()
            : makeButton(() =>
                startEdit(aId, bId, null, { rowId: aId, colId: bId })
              )}
        </td>
      );
    }

    if (isLowerTriangle) {
      return (
        <td
          data-rr-cell={`${aId}-${bId}`}
          className={`rr-cell ${isActiveCell ? "editing" : ""}`}
        >
          {!isActiveCell && (
            scores.display !== "—"
              ? (
                  <button
                    type="button"
                    className="rr-score"
                    onClick={() =>
                      startEdit(aId, bId, scores.input || null, {
                        rowId: aId,
                        colId: bId,
                      })
                    }
                    title="Изменить счёт"
                  >
                    {scores.display}
                  </button>
                )
              : makeButton(() =>
                  startEdit(aId, bId, null, { rowId: aId, colId: bId })
                )
          )}
          {isActiveCell && renderEditor()}
        </td>
      );
    }

    return (
      <td
        data-rr-cell={`${aId}-${bId}`}
        className={`rr-cell rr-cell--mirror ${isActiveCell ? "editing" : ""}`}
      >
        {!isActiveCell && (
          scores.display !== "—"
            ? (
                <button
                  type="button"
                  className="rr-score rr-score--mirror"
                  onClick={() =>
                    startEdit(aId, bId, scores.input || null, {
                      rowId: aId,
                      colId: bId,
                    })
                  }
                  title="Изменить счёт"
                >
                  {scores.display}
                </button>
              )
            : makeButton(() =>
                startEdit(aId, bId, null, { rowId: aId, colId: bId })
              )
        )}
        {isActiveCell && renderEditor()}
      </td>
    );
  }

  /**
   * Shows the tooltip only for the very first empty cell.
   */
  const firstHelpTooltip = useFirstHelpTooltip();

  return (
    <div ref={wrapRef} className="roundrobin-wrap">
      <div className="rr-scroll">
        <table ref={tableRef} className="rr-matrix round-table">
          <thead>
            <tr>
              <th className="center rr-header-index">#</th>
              <th className="left rr-header-name">Игроки</th>
              {ordered.map((_, index) => (
                <th key={index} className="center">
                  {index + 1}
                </th>
              ))}
              <th className="center">Очки</th>
              <th className="center">Геймы</th>
              <th className="center">Место</th>
            </tr>
          </thead>

          <tbody>
            {ordered.map((participant, rowIndex) => {
              const aId = participant.getId;
              const stats = standings.rows.find((row) => row.id === aId)!;
              const place = standings.placeById.get(aId)!;

              return (
                <tr key={aId} className={editingKey ? "card--no-transition" : ""}>
                  <td
                    data-rr-cell={`${aId}-${aId}`}
                    className="center rr-index-cell"
                  >
                    {rowIndex + 1}
                  </td>

                  <td className="left rr-name-cell">
                    <span className="rr-participant">{participant.displayName(false)}</span>
                  </td>

                  {ordered.map((opponent, colIndex) => (
                    <Cell
                      key={`${aId}_${opponent.getId}`}
                      aId={aId}
                      bId={opponent.getId}
                      rIndex={rowIndex}
                      cIndex={colIndex}
                    />
                  ))}

                  <td className="center">{stats.points}</td>
                  <td className="center">
                    {stats.gamesFor}:{stats.gamesAgainst}
                  </td>
                  <td className="center">{place}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div ref={keyboardHostRef}>
        {mobileKeyboardAvailable && mobileKeyboardContext && (
          <ScoreKeyboard
            inputRef={editingInputRef}
            value={editValue}
            onChange={setEditValue}
            onSave={() =>
              void saveEdit(mobileKeyboardContext.aId, mobileKeyboardContext.bId, editValue)
            }
            onCancel={cancelEdit}
            disabled={saving}
            autoFocus={false}
          />
        )}
      </div>
    </div>
  );
}
