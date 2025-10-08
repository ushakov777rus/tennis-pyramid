"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Participant } from "@/app/models/Participant";
import { Match, PhaseType } from "@/app/models/Match";
import { useFirstHelpTooltip } from "@/app/hooks/useFirstHelpTooltip";
import {
  ScoreKeyboard,
  useScoreKeyboardAvailable,
} from "@/app/components/controls/ScoreKeyboard";
import { ScoreCell, type MatchPhaseFilter } from "./ScoreCell";

import "./RoundRobinTable.css";
import "./PyramidView.css";
import "@/app/components/ParticipantsView.css";

/**
 * Публичные пропсы для таблицы кругового турнира.
 */
export type GroupStageTableProps = {
  participants: Participant[];
  matches: Match[];
  onSaveScore?: (
    aId: number,
    bId: number,
    score: string
  ) => Promise<void> | void;
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
  participants,
  matches,
  onSaveScore,
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
   * Добавляем снизу padding под таблицей, чтобы клавиатура её не перекрывала.
   */
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const bottomGap = keyboardHeight > 0 ? `${keyboardHeight + 16}px` : "0px";
    wrap.style.setProperty("--rr-bottom-gap", bottomGap);
  }, [keyboardHeight]);

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
          a.displayName(false).localeCompare(b.displayName(false), "ru")
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
   * Открывает редактор для пары участников.
   */
  const onStartEdit = useCallback((
    aId: number,
    bId: number,
    currentScore: string | null,
    filter?: MatchPhaseFilter
  ) => {
    const key = pairKey(aId, bId);
    setEditingKey(key);
    setEditValue(currentScore ?? "");
    setEditingCell({
      rowId: aId,
      colId: bId,
    });
    editingInputRef.current = null;
    if (mobileKeyboardAvailable) {
      setMobileKeyboardContext({ aId, bId });
    }
  }, [mobileKeyboardAvailable]);

  /**
   * Отменяет редактирование и сбрасывает вспомогательные состояния.
   */
  const onCancel = useCallback(() => {
    setEditingKey(null);
    setEditValue("");
    editingInputRef.current = null;
    setMobileKeyboardContext(null);
    setEditingCell(null);
  }, []);

  /**
   * Сохраняет введённый счёт с оптимистичным UI.
   */
  const onSave = useCallback(async (
    aId: number,
    bId: number,
    filter?: MatchPhaseFilter
  ) => {
    const currentNode = editingInputRef.current;
    const fallbackValue =
      currentNode instanceof HTMLInputElement ? currentNode.value : editValue;

    const nextValue = (fallbackValue ?? "").trim();

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
  }, [editValue, onSaveScore]);

  /**
   * Показывает подсказку только для самой первой пустой ячейки.
   */
  const firstHelpTooltip = useFirstHelpTooltip();

  /**
   * Компонент ячейки матча для использования в таблице
   */
  const ScoreCellAdapter = useCallback(({ a, b, phaseFilter }: {
    a: Participant | null;
    b: Participant | null;
    phaseFilter?: MatchPhaseFilter;
  }) => {
    const aId = a?.getId;
    const bId = b?.getId;
    
    if (!aId || !bId) {
      return <span className="vs vs-placeholder" aria-hidden>vs</span>;
    }

    const isLowerTriangle = indexById.get(aId)! > indexById.get(bId)!;
    const key = pairKey(aId, bId);
    const isActiveCell = editingKey === key && editingCell?.rowId === aId && editingCell?.colId === bId;

    return (
      <ScoreCell
        a={a}
        b={b}
        phaseFilter={phaseFilter}
        getMatchScore={getMatchScore}
        pairKey={pairKey}
        editingKey={editingKey}
        editValue={editValue}
        setEditValue={setEditValue}
        saving={saving}
        onStartEdit={onStartEdit}
        onSave={onSave}
        onCancel={onCancel}
        inputRef={editingInputRef}
        mobileKeyboardAvailable={mobileKeyboardAvailable}
      />
    );
  }, [
    indexById,
    editingKey,
    editingCell,
    editValue,
    saving,
    getMatchScore,
    onStartEdit,
    onSave,
    onCancel,
    mobileKeyboardAvailable
  ]);

  /**
   * Рендерит ячейку матрицы с использованием универсального ScoreCell
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
    const a = ordered.find(p => p.getId === aId) || null;
    const b = ordered.find(p => p.getId === bId) || null;

    return (
      <td
        data-rr-cell={`${aId}-${bId}`}
        className={`rr-cell ${isLowerTriangle ? '' : 'rr-cell--mirror'} ${!getMatchScore(aId, bId) ? 'rr-empty' : ''}`}
      >
        <ScoreCellAdapter a={a} b={b} />
      </td>
    );
  }

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
              <th className="center rotate"><span>Очки</span></th>
              <th className="center rotate"><span>Геймы</span></th>
              <th className="center rotate"><span>Место</span></th>
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
              void onSave(mobileKeyboardContext.aId, mobileKeyboardContext.bId)
            }
            onCancel={onCancel}
            disabled={saving}
            autoFocus={false}
          />
        )}
      </div>
    </div>
  );
}