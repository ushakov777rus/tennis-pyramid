"use client";

import "./GroupStageTable.css";
import "./PyramidView.css";
import "@/app/components/ParticipantsView.css";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Participant } from "@/app/models/Participant";
import { Match, PhaseType } from "@/app/models/Match";
import { useFirstHelpTooltip } from "@/app/hooks/useFirstHelpTooltip";
import {
  useScoreKeyboardAvailable,
} from "@/app/components/controls/ScoreKeyboard";


/**
 * Публичные пропсы для таблицы кругового турнира.
 */
export type GroupStageTableProps = {
  groupParticipants: Participant[];
  groupMatches: Match[];
  groupIndex?: number;
  onSaveScore?: (
    aId: number,
    bId: number,
    score: string
  ) => Promise<void> | void;
  /** Компонент для ввода счёта (как в PlayoffStageTable) */
  ScoreCellAdapter: React.FC<{
    a: Participant | null;
    b: Participant | null;
    scoreString: string | null;
    phaseFilter?: { phase?: PhaseType; groupIndex?: number | null; roundIndex?: number | null };
  }>;
};

/**
 * Координаты ячейки, которая сейчас редактируется.
 */
type EditingCell = {
  rowId: number;
  colId: number;
};

/**
 * Оптимистичный (локальный) ввод счёта в формате, совпадающем с бэкендом.
 */
type PendingEntry = {
  aId: number;
  bId: number;
  scores: [number, number][];
  raw: string;
};

/**
 * Гарантируем, что работаем только с корректными участниками:
 * либо одиночный игрок, либо команда.
 *
 * @param participant Кандидат из API.
 * @returns true, если участник существует и имеет валидные данные.
 */
function isValidParticipant(
  participant: Participant | null | undefined
): participant is Participant {
  return !!participant && (!!participant.player || !!participant.team);
}

/**
 * Генерирует стабильный ключ для пары ID вне зависимости от порядка.
 *
 * @param aId ID первого участника.
 * @param bId ID второго участника.
 * @returns Стабильный ключ в формате "меньший_больший".
 */
const pairKey = (aId: number, bId: number) =>
  `${Math.min(aId, bId)}_${Math.max(aId, bId)}`;

/**
 * Форматирует список сетов для отображения (многострочно), например: "6/4".
 *
 * @param sets Набор сетов в "строчной" ориентации.
 * @returns Многострочная строка для вывода.
 */
const formatDisplay = (sets: Array<[number, number]>): string => {
  if (!sets.length) return "—";
  return sets.map(([a, b]) => `${a}/${b}`).join("\n");
};

/**
 * Форматирует список сетов для ввода, например: "6-4, 4-6".
 *
 * @param sets Набор сетов в "строчной" ориентации.
 * @returns Строка, разделённая запятыми.
 */
const formatInput = (sets: Array<[number, number]>): string => {
  if (!sets.length) return "";
  return sets.map(([a, b]) => `${a}-${b}`).join(", ");
};

/**
 * Отзеркаливает счёт для противоположной перспективы (для колонки).
 *
 * @param sets Сеты в "строчной" ориентации.
 * @returns Те же сеты, но со свапнутыми значениями.
 */
const flipSets = (sets: Array<[number, number]>) =>
  sets.map(([a, b]) => [b, a] as [number, number]);

/**
 * Находит матч между двумя участниками, если он существует.
 *
 * @param aId ID первого участника.
 * @param bId ID второго участника.
 * @param matches Полный список матчей турнира.
 * @returns Найденный матч или null, если его пока нет.
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
 * Строит удобные для отображения/ввода строки, ориентируя счёт под строку и колонку.
 *
 * @param aId ID участника в строке.
 * @param bId ID участника в колонке.
 * @param matches Полный список матчей.
 * @returns Строки display/mirror/input или null, если матча нет.
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
 * Поворачивает сырые сеты матча под точку зрения заданного участника.
 *
 * @param match Сырой матч.
 * @param perspectiveId ID участника, под которого ориентируем счёт.
 * @returns Массив сетов, где первый элемент — геймы данного участника.
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
 * Агрегирует статистику кругового турнира для участника.
 *
 * @param meId ID участника, для которого считаем статистику.
 * @param ids Упорядоченный список ID всех участников.
 * @param matches Список матчей турнира.
 * @param pending Необязательная карта оптимистичных результатов.
 * @returns Очки (победы), геймы за и против.
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
 * React-компонент: рисует матрицу кругового турнира с инлайн-редактированием.
 *
 * @param props Пропсы с состоянием турнира.
 * @returns JSX-разметка таблицы с редактированием счёта.
 */
export function GroupStageTable({
  groupParticipants: participants,
  groupMatches: matches,
  groupIndex,
  ScoreCellAdapter: ScoreCell,
}: GroupStageTableProps) {
  /** Текущая редактируемая пара (ключ из двух ID). */
  const [editingKey, setEditingKey] = useState<string | null>(null);
  /** Текущее текстовое значение вводимого счёта. */
  const [editValue, setEditValue] = useState<string>("");
  /** Флаг отправки счёта. */
  const [saving, setSaving] = useState(false);

  /** Нужно ли показывать кастомную цифровую клавиатуру (мобайл). */
  const mobileKeyboardAvailable = useScoreKeyboardAvailable();
  /** Контекст для мобильной клавиатуры: какие ID сейчас редактируются. */
  const [mobileKeyboardContext, setMobileKeyboardContext] = useState<{
    aId: number;
    bId: number;
  } | null>(null);

  /** Ссылка на инпут редактирования (десктоп). */
  const editingInputRef = useRef<HTMLInputElement | HTMLDivElement | null>(null);
  /** Ссылка на обёртку (чтобы менять нижний отступ под клавиатуру). */
  const wrapRef = useRef<HTMLDivElement | null>(null);
  /** Ссылка на контейнер клавиатуры (для измерения высоты). */
  const keyboardHostRef = useRef<HTMLDivElement | null>(null);
  /** Ссылка на таблицу (чтобы находить активные ячейки). */
  const tableRef = useRef<HTMLTableElement | null>(null);
  /** Текущая высота кастомной клавиатуры. */
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  /** Какая ячейка редактируется (для скролла/позиционирования). */
  const [editingCell, setEditingCell] = useState<EditingCell | null>(null);
  /** Оптимистично введённые счёты до подтверждения сервером. */
  const [pendingScores, setPendingScores] = useState<Map<string, PendingEntry>>(new Map());

  /**
   * Измеряем высоту клавиатуры, чтобы зарезервировать под неё место.
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
   * Сбрасываем оптимистичные записи, когда с сервера пришли реальные матчи.
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
   * Скроллим окно так, чтобы активная ячейка была видна при появлении клавиатуры.
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
   * Упорядоченный список валидных участников для детерминированного рендера.
   */
  const ordered = useMemo(
    () =>
      participants
        .filter(isValidParticipant)
        .slice()
        .sort((a, b) =>
          a.displayName().localeCompare(b.displayName(), "ru")
        ),
    [participants]
  );

  /**
   * Список идентификаторов участников (для удобства).
   */
  const ids = useMemo(() => ordered.map((participant) => participant.getId), [ordered]);

  /**
   * Быстрый доступ к индексу участника по ID.
   */
  const indexById = useMemo(() => {
    const map = new Map<number, number>();
    ids.forEach((id, index) => map.set(id, index));
    return map;
  }, [ids]);

  /**
   * Подсчитываем таблицу мест (очки, разница геймов, места) с учётом оптимистичных данных.
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
   * Возвращает видимые счёты либо из оптимистичного кэша, либо из сохранённых матчей.
   */
  const getMatchScore = useCallback(
    (aId: number, bId: number): string | null => {
      const key = pairKey(aId, bId);
      const pending = pendingScores.get(key);
      if (pending) {
        const rowSets = pending.aId === aId ? pending.scores : flipSets(pending.scores);
        return formatDisplay(rowSets);
      }

      const scores = getMatchScoresFromMatches(aId, bId, matches);
      return scores?.display || null;
    },
    [pendingScores, matches]
  );

  /**
   * Показывает подсказку только для самой первой пустой ячейки.
   */
  const firstHelpTooltip = useFirstHelpTooltip();

  /**
   * Рендерит ячейку матрицы с использованием переданного ScoreCellAdapter
   */
  function ScoreCellWrapper({
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
      return <div className="rr-diag" aria-hidden />;
    }

    const isLowerTriangle = rIndex > cIndex;
    const a = ordered.find(p => p.getId === aId) || null;
    const b = ordered.find(p => p.getId === bId) || null;

    return (
      <div
        data-rr-cell={`${aId}-${bId}`}
        className={`rr-cell ${isLowerTriangle ? '' : 'rr-cell--mirror'} ${!getMatchScore(aId, bId) ? 'rr-empty' : ''}`}
      >
        <ScoreCell 
          a={a} 
          b={b} 
          scoreString={getMatchScore(aId, bId)}
          phaseFilter={{ phase: PhaseType.Group }} />
      </div>
    );
  }

  return (
    <div className={`card ${editingKey ? "card--no-transition" : ""}`.trim()}>
      {groupIndex !== undefined && groupIndex !== null && (
        <div className="rr-header">
          <strong>Группа {String.fromCharCode(65 + groupIndex)}</strong>
        </div>)
      }

<div 
  ref={tableRef} 
  className="rr-matrix" 
  style={{
    '--participants-count': ordered.length
  } as React.CSSProperties}
>
  {/* Заголовки - должны быть в первой строке */}
  <div className="rr-index-header center" style={{ gridColumn: 1, gridRow: 1 }}>#</div>
  <div className="rr-name-header left" style={{ gridColumn: 2, gridRow: 1 }}>Игроки</div>
  
  {ordered.map((_, index) => (
    <div 
      key={index} 
      className="center rr-header-score"
      style={{ gridColumn: index + 3, gridRow: 1 }}
    >
      {index + 1}
    </div>
  ))}
  
  <div 
    className="center rotate" 
    style={{ gridColumn: ordered.length + 3, gridRow: 1 }}
  >
    <span>Очки</span>
  </div>
  <div 
    className="center rotate" 
    style={{ gridColumn: ordered.length + 4, gridRow: 1 }}
  >
    <span>Геймы</span>
  </div>
  <div 
    className="center rotate" 
    style={{ gridColumn: ordered.length + 5, gridRow: 1 }}
  >
    <span>Место</span>
  </div>

  {/* Данные */}
  {ordered.map((participant, rowIndex) => {
    const aId = participant.getId;
    const stats = standings.rows.find((row) => row.id === aId)!;
    const place = standings.placeById.get(aId)!;
    
    const gridRow = rowIndex + 2; // +2 потому что заголовки в строке 1

    return (
      <React.Fragment key={aId}>
        {/* Индекс */}
        <div
          data-rr-cell={`${aId}-${aId}`}
          className={`center rr-index-cell ${editingKey ? "card--no-transition" : ""}`}
          style={{ gridColumn: 1, gridRow }}
        >
          {rowIndex + 1}
        </div>

        {/* Имя игрока */}
        <div 
          className={`left rr-name-cell ${editingKey ? "card--no-transition" : ""}`}
          style={{ gridColumn: 2, gridRow }}
        >
          <span className="rr-participant">{participant.displayName(false)}</span>
        </div>

        {/* Ячейки с противниками */}
        {ordered.map((opponent, colIndex) => (
          <div
            key={`${aId}_${opponent.getId}`}
            style={{ gridColumn: colIndex + 3, gridRow }}
            className={editingKey ? "card--no-transition" : ""}
          >
            <ScoreCellWrapper
              aId={aId}
              bId={opponent.getId}
              rIndex={rowIndex}
              cIndex={colIndex}
            />
          </div>
        ))}

        {/* Очки */}
        <div 
          className={`center ${editingKey ? "card--no-transition" : ""}`}
          style={{ gridColumn: ordered.length + 3, gridRow }}
        >
          {stats.points}
        </div>

        {/* Геймы */}
        <div 
          className={`center ${editingKey ? "card--no-transition" : ""}`}
          style={{ gridColumn: ordered.length + 4, gridRow }}
        >
          {stats.gamesFor}:{stats.gamesAgainst}
        </div>

        {/* Место */}
        <div 
          className={`center ${editingKey ? "card--no-transition" : ""}`}
          style={{ gridColumn: ordered.length + 5, gridRow }}
        >
          {place}
        </div>
      </React.Fragment>
    );
  })}
</div>
    </div>
  );
}