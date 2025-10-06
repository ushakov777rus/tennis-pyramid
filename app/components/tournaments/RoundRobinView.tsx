"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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

import "./PyramidView.css";    // чипы/бейджи/карточки
import "./RoundRobinView.css"; // добавь стили для .rr-matrix, .rr-score (white-space: pre-line)
import "@/app/components/ParticipantsView.css";

/* =======================================================================
   Константы для “липких” первых колонок
   ======================================================================= */
const INDEX_COL_WIDTH = 30; // px — ширина колонки с номерами (можно поменять)

/* =======================================================================
   Props
   ======================================================================= */

type RoundRobinViewProps = {
  participants: Participant[];
  matches: Match[];
  onSaveScore?: (
    aId: number,
    bId: number,
    score: string
  ) => Promise<void> | void;
};

/* =======================================================================
   Утилиты
   ======================================================================= */

/** Валидный участник: либо одиночный игрок, либо пара */
function isValidParticipant(
  p: Participant | null | undefined
): p is Participant {
  return !!p && (!!p.player || !!p.team);
}

/** Ключ пары (порядок не важен) */
const pairKey = (aId: number, bId: number) =>
  `${Math.min(aId, bId)}_${Math.max(aId, bId)}`;

const formatDisplay = (sets: Array<[number, number]>): string => {
  if (!sets.length) return "—";
  return sets.map(([a, b]) => `${a}/${b}`).join("\n");
};

const formatInput = (sets: Array<[number, number]>): string => {
  if (!sets.length) return "";
  return sets.map(([a, b]) => `${a}-${b}`).join(", ");
};

const orientScores = (match: Match, perspectiveId: number): Array<[number, number]> => {
  const id1 = match.player1?.id ?? match.team1?.id;
  const id2 = match.player2?.id ?? match.team2?.id;
  if (!match.scores || match.scores.length === 0) return [];

  if (id1 === perspectiveId) return match.scores.slice();
  if (id2 === perspectiveId)
    return match.scores.map(([a, b]) => [b, a]);
  return match.scores.slice();
};

/** Ищем матч между участниками */
function findMatch(aId: number, bId: number, matches: Match[]): Match | null {
  return (
    matches.find((m) => {
      const id1 = m.player1?.id ?? m.team1?.id;
      const id2 = m.player2?.id ?? m.team2?.id;
      return (id1 === aId && id2 === bId) || (id1 === bId && id2 === aId);
    }) ?? null
  );
}

/** Получить отображаемые счёты (обычный/перевёрнутый) и значение для инпута */
function getMatchScores(
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

/** Подсчёт статистики игрока по всем матчам (очки и геймы) */
function computeStatsFor(
  meId: number,
  ids: number[],
  matches: Match[]
): { points: number; gamesFor: number; gamesAgainst: number } {
  let points = 0;
  let gamesFor = 0;
  let gamesAgainst = 0;

  for (const oppId of ids) {
    if (oppId === meId) continue;
    const m = findMatch(meId, oppId, matches);
    if (!m || !m.scores || m.scores.length === 0) continue;

    // считаем геймы
    for (const [sA, sB] of m.scores) {
      const id1 = m.player1?.id ?? m.team1?.id;
      const amFirst = id1 === meId;
      const my = amFirst ? sA : sB;
      const opp = amFirst ? sB : sA;
      console.log("gamesFor += my", my);
      gamesFor += my;
      gamesAgainst += opp;
    }

    // победа/поражение по количеству выигранных сетов
    let mySets = 0;
    let oppSets = 0;
    for (const [sA, sB] of m.scores) {
      const id1 = m.player1?.id ?? m.team1?.id;
      const amFirst = id1 === meId;
      const my = amFirst ? sA : sB;
      const opp = amFirst ? sB : sA;
      if (my > opp) mySets++;
      if (opp > my) oppSets++;
    }
    if (mySets > oppSets) points += 1; // 1 очко за победу
  }

  return { points, gamesFor, gamesAgainst };
}

/* =======================================================================
   Компонент
   ======================================================================= */

export function RoundRobinView({
  participants,
  matches,
  onSaveScore,
}: RoundRobinViewProps) {
  // ---------- состояние редактирования ----------
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>("");
  const [saving, setSaving] = useState(false);

  const mobileKeyboardAvailable = useScoreKeyboardAvailable();
  const [mobileKeyboardContext, setMobileKeyboardContext] = useState<{
    aId: number;
    bId: number;
  } | null>(null);

  const editingInputRef =
    useRef<HTMLInputElement | HTMLDivElement | null>(null);
  const keyboardHostRef = useRef<HTMLDivElement | null>(null);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

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

  // ---------- порядок игроков (стабильно по имени) ----------
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

  // id-шники и мапы
  const ids = useMemo(() => ordered.map((p) => p.getId), [ordered]);
  const indexById = useMemo(() => {
    const m = new Map<number, number>();
    ids.forEach((id, i) => m.set(id, i));
    return m;
  }, [ids]);

  // ---------- таблица мест ----------
  const standings = useMemo(() => {
    const rows = ids.map((id) => {
      const s = computeStatsFor(id, ids, matches);
      return {
        id,
        ...s,
        diff: s.gamesFor - s.gamesAgainst,
        name: ordered[indexById.get(id)!].displayName(false),
      };
    });

    // место: очки → разница геймов → геймы за → имя
    const sorted = rows.slice().sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      if (b.diff !== a.diff) return b.diff - a.diff;
      if (b.gamesFor !== a.gamesFor) return b.gamesFor - a.gamesFor;
      return a.name.localeCompare(b.name, "ru");
    });

    const placeById = new Map<number, number>();
    sorted.forEach((row, idx) => placeById.set(row.id, idx + 1));

    return { rows, placeById };
  }, [ids, matches, ordered, indexById]);

  // ---------- редактирование ----------
  function startEdit(
    aId: number,
    bId: number,
    currentScore: string | null
  ) {
    const k = pairKey(aId, bId);
    setEditingKey(k);
    setEditValue(currentScore ?? "");
    editingInputRef.current = null;
    if (mobileKeyboardAvailable) {
      setMobileKeyboardContext({ aId, bId });
    }
  }

  function cancelEdit() {
    setEditingKey(null);
    setEditValue("");
    editingInputRef.current = null;
    setMobileKeyboardContext(null);
  }

  async function saveEdit(aId: number, bId: number, raw?: string) {
    const currentNode = editingInputRef.current;
    const fallbackValue =
      currentNode instanceof HTMLInputElement ? currentNode.value : editValue;

    const nextValue = (raw ?? fallbackValue ?? "").trim();

    // Допускаем как "6-4, 4-6, 10-8", так и "6/4, 4/6, 10/8"
    const normalized = nextValue.replaceAll("/", "-");
    if (!Match.isValidScoreFormat(normalized)) {
      alert('Неверный формат счёта. Примеры: "6-4, 4-6" или "6/4, 4/6"');
      return;
    }

    try {
      setSaving(true);
      await onSaveScore?.(aId, bId, normalized);
      setEditingKey(null);
      setEditValue("");
      editingInputRef.current = null;
      setMobileKeyboardContext(null);
    } finally {
      setSaving(false);
    }
  }

  // ---------- ячейки матрицы ----------
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

    // нижний треугольник: обычный счёт
    // верхний треугольник: перевёрнутый счёт
    const isLowerTriangle = rIndex > cIndex;

    const scores = getMatchScores(aId, bId, matches);
    if (!scores) {
      // нет матча — показываем кнопку добавления только в нижнем треугольнике
      if (isLowerTriangle) {
        const k = pairKey(aId, bId);
        const isEditing = editingKey === k;
        const showHelp = !isEditing && firstHelpTooltip();
        return (
          <td className={`rr-cell ${isEditing ? "editing" : ""}`}>
            {!isEditing ? (
              <div className="score-cell__button-wrap">
                {showHelp && <div className="help-tooltip">Введите счёт</div>}
                <button
                  type="button"
                  className="vs vs-click"
                  onClick={() => startEdit(aId, bId, null)}
                  title="Добавить счёт"
                  aria-label="Добавить счёт"
                >
                  vs
                </button>
              </div>
            ) : (
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
                  onFocus={(e) => {
                    if (mobileKeyboardAvailable) e.currentTarget.blur();
                  }}
                  onKeyDown={(e) => {
                    if (!mobileKeyboardAvailable) {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        saveEdit(aId, bId);
                      }
                      if (e.key === "Escape") {
                        e.preventDefault();
                        cancelEdit();
                      }
                    }
                  }}
                  onChange={(e) => {
                    if (!mobileKeyboardAvailable) {
                      setEditValue(e.target.value);
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
            )}
          </td>
        );
      }
      // верхний треугольник без матча — пустая ячейка
      return <td className="rr-empty" />;
    }

    const k = pairKey(aId, bId);
    const isEditing = editingKey === k;

    if (isLowerTriangle) {
      // обычный счёт + возможность редактирования
      return (
        <td className={`rr-cell ${isEditing ? "editing" : ""}`}>
          {scores.display !== "—" ? (
            <button
              type="button"
              className="rr-score"
              onClick={() => startEdit(aId, bId, scores.input || null)}
              title="Изменить счёт"
            >
              {scores.display}
            </button>
          ) : (
            <div className="score-cell__button-wrap">
              <div className="help-tooltip">Введите счёт</div>
              <button
                type="button"
                className="vs vs-click"
                onClick={() => startEdit(aId, bId, null)}
                title="Добавить счёт"
                aria-label="Добавить счёт"
              >
                vs
              </button>
            </div>
          )}

          {isEditing && (
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
                onFocus={(e) => {
                  if (mobileKeyboardAvailable) e.currentTarget.blur();
                }}
                onKeyDown={(e) => {
                  if (!mobileKeyboardAvailable) {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      saveEdit(aId, bId);
                    }
                    if (e.key === "Escape") {
                      e.preventDefault();
                      cancelEdit();
                    }
                  }
                }}
                onChange={(e) => {
                  if (!mobileKeyboardAvailable) {
                    setEditValue(e.target.value);
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
          )}
        </td>
      );
    }

    // верхний треугольник: показываем перевёрнутый счёт; клик также открывает редактирование нормального
    return (
      <td className="rr-cell rr-cell--mirror">
        {scores.mirror !== "—" ? (
          <button
            type="button"
            className="rr-score rr-score--mirror"
            onClick={() => startEdit(aId, bId, scores.input || null)}
            title="Изменить счёт"
          >
            {scores.mirror}
          </button>
        ) : (
          <span className="rr-dash">—</span>
        )}
      </td>
    );
  }

  // первый тултип для “vs”
  const firstHelpTooltip = useFirstHelpTooltip();
  const extraBottomPadding = keyboardHeight > 0 ? keyboardHeight + 16 : 0;

  /* =====================================================================
     Рендер
     ===================================================================== */

  return (
    <div
      className="roundrobin-wrap"
      style={extraBottomPadding ? { paddingBottom: extraBottomPadding } : undefined}
    >
      <div className="rr-scroll">
        <table className="rr-matrix round-table">
          <thead>
            <tr>
              {/* Липкая колонка № */}
              <th
                className="center"
                style={{
                  position: "sticky",
                  left: 0,
                  zIndex: 4, // выше второй колонки и тела
                  width: INDEX_COL_WIDTH,
                  minWidth: INDEX_COL_WIDTH,
                  background: "var(--background)",
                  border: "1px solid rgba(166, 255, 0, .3)",
                }}
              >
                #
              </th>

              {/* Липкая колонка Игроки */}
              <th
                className="left"
                style={{
                  position: "sticky",
                  left: INDEX_COL_WIDTH,
                  zIndex: 3,
                  background: "var(--background)",
                  border: "1px solid rgba(166, 255, 0, .3)",
                }}
              >
                Игроки
              </th>

              {ordered.map((_, i) => (
                <th key={i} className="center">{i + 1}</th>
              ))}

              <th className="center">Очки</th>
              <th className="center">Геймы</th>
              <th className="center">Место</th>
            </tr>
          </thead>

          <tbody>
            {ordered.map((pa, r) => {
              const aId = pa.getId;
              const st = standings.rows.find((x) => x.id === aId)!;
              const place = standings.placeById.get(aId)!;

              return (
                <tr key={aId} className={editingKey ? "card--no-transition" : ""}>
                  {/* Номер участника — липкая первая колонка */}
                  <td
                    className="center rr-index"
                    style={{
                      position: "sticky",
                      left: 0,
                      zIndex: 2,
                      width: INDEX_COL_WIDTH,
                      minWidth: INDEX_COL_WIDTH,
                      background: "var(--background)",
                      border: "1px solid rgba(166, 255, 0, .3)",
                    }}
                  >
                    {r + 1}
                  </td>

                  {/* Имя игрока — липкая вторая колонка */}
                  <td
                    className="left"
                    style={{
                      position: "sticky",
                      left: INDEX_COL_WIDTH,
                      zIndex: 1,
                      background: "var(--background)",
                      border: "1px solid rgba(166, 255, 0, .3)",
                    }}
                  >
                    <span className="rr-participant">{pa.displayName(false)}</span>
                  </td>

                  {/* Ячейки соперников */}
                  {ordered.map((pb, c) => (
                    <Cell
                      key={`${aId}_${pb.getId}`}
                      aId={aId}
                      bId={pb.getId}
                      rIndex={r}
                      cIndex={c}
                    />
                  ))}

                  {/* Статистика по строке */}
                  <td className="center">{st.points}</td>
                  <td className="center">
                    {st.gamesFor}:{st.gamesAgainst}
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
              void saveEdit(
                mobileKeyboardContext.aId,
                mobileKeyboardContext.bId
              )
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
