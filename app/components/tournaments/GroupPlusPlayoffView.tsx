"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { Participant } from "@/app/models/Participant";
import { Match, PhaseType } from "@/app/models/Match";

import { SaveIconButton, CancelIconButton } from "@/app/components/controls/IconButtons";
import { ScoreKeyboard, useScoreKeyboardAvailable } from "@/app/components/controls/ScoreKeyboard";

/* Сетка групп теперь рисуется готовым компонентом матрицы */
import { RoundRobinTable } from "./RoundRobinTable";

import "./PyramidView.css";
import "./RoundRobinView.css";
import "@/app/components/ParticipantsView.css";

/* ========================================================================== */
/*                                    TYPES                                   */
/* ========================================================================== */

/** Фильтр для поиска матча конкретной фазы/ячейки сетки */
type MatchPhaseFilter = {
  phase?: PhaseType;          // PhaseType.Group | PhaseType.Playoff
  groupIndex?: number | null; // индекс группы (для группового этапа)
  roundIndex?: number | null; // индекс раунда плей-офф: 0 — четверть, 1 — полу и т.д.
};

type GroupPlusPlayoffViewProps = {
  participants: Participant[];
  matches: Match[];
  onSaveScore?: (
    aId: number,
    bId: number,
    score: string,
    meta?: { phase: PhaseType; groupIndex?: number | null; roundIndex?: number | null }
  ) => Promise<void> | void;

  groupsCount?: number;
  advancePerGroup?: number;
  seeding?: "simple" | "snake";
};

/* ========================================================================== */
/*                               PURE HELPERS                                 */
/* ========================================================================== */

/** Валиден ли участник (есть player или team) */
function isValidParticipant(p: Participant | null | undefined): p is Participant {
  return !!p && (!!p.player || !!p.team);
}

/** Безопасно получить ID участника (null если слота нет) */
function pid(p: Participant | null | undefined): number | null {
  return p ? p.getId : null;
}

/** Следующая степень двойки ≥ n (для размера сетки single-elim) */
function nextPow2(n: number) {
  let p = 1;
  while (p < n) p <<= 1;
  return p;
}

/** Человекочитаемое имя участника */
function nameOf(p: Participant): string {
  if (p.player) return p.player.name;
  const a = p.team?.player1?.name ?? "??";
  const b = p.team?.player2?.name ?? "??";
  return `${a} + ${b}`;
}

/** Удовлетворяет ли матч фильтру фазы */
function matchPhaseOk(m: Match, f?: MatchPhaseFilter): boolean {
  if (!f) return true;
  if (f.phase && (m as any).phase !== f.phase) return false;
  if (f.phase === PhaseType.Group && f.groupIndex != null && (m as any).groupIndex !== f.groupIndex) return false;
  if (f.phase === PhaseType.Playoff && f.roundIndex != null && (m as any).roundIndex !== f.roundIndex) return false;
  return true;
}

/** Найти матч между участниками с ID aId и bId (игроки/команды) с учётом фазы */
function findMatchBetween(
  aId: number,
  bId: number,
  matches: Match[],
  filter?: MatchPhaseFilter
): Match | undefined {
  return matches.find((m) => {
    const id1 = m.player1?.id ?? m.team1?.id ?? 0;
    const id2 = m.player2?.id ?? m.team2?.id ?? 0;
    if (!((id1 === aId && id2 === bId) || (id1 === bId && id2 === aId))) return false;
    return matchPhaseOk(m, filter);
  });
}

/** Сериализовать счёт матча в вид "6:4, 4:6, 10:8" */
function stringifyScore(m: Match): string | null {
  if (m.scores && m.scores.length > 0) {
    return m.scores.map(([s1, s2]) => `${s1}:${s2}`).join(", ");
  }
  return null;
}

/** Получить счёт между участниками c учётом фазы */
function getMatchScore(
  aId: number,
  bId: number,
  matches: Match[],
  filter?: MatchPhaseFilter
): string | null {
  const match = findMatchBetween(aId, bId, matches, filter);
  return match ? stringifyScore(match) : null;
}

/** Валидация формата: "6-4, 4-6, 10-8" (допускает ':' или '-') */
function isValidScoreFormat(s: string) {
  const trimmed = s.trim();
  if (!trimmed) return false;
  const setRe = /^\s*\d+\s*[:-]\s*\d+\s*$/;
  return trimmed.split(",").every((part) => setRe.test(part.trim()));
}

/** Разложить по группам: simple (по кругу) / snake (змейкой) */
function distributeIntoGroups(items: Participant[], groupsCount: number, mode: "simple" | "snake"): Participant[][] {
  const groups: Participant[][] = Array.from({ length: groupsCount }, () => []);
  if (mode === "simple") {
    items.forEach((p, i) => groups[i % groupsCount].push(p));
  } else {
    // snake: 0..g-1, затем g-1..0, и т.д.
    let idx = 0;
    let dir = 1;
    for (const p of items) {
      groups[idx].push(p);
      idx += dir;
      if (idx === groupsCount) { idx = groupsCount - 1; dir = -1; }
      else if (idx < 0) { idx = 0; dir = 1; }
    }
  }
  return groups;
}

/** Статистика группы: победы → Δсетов → Δгеймов */
type GroupStats = {
  id: number;
  name: string;
  wins: number;
  setsDiff: number;
  gamesDiff: number;
};

function computeGroupStats(group: Participant[], matches: Match[]): GroupStats[] {
  const map = new Map<number, GroupStats>();
  for (const p of group) {
    map.set(p.getId, { id: p.getId, name: nameOf(p), wins: 0, setsDiff: 0, gamesDiff: 0 });
  }

  for (let i = 0; i < group.length; i++) {
    for (let j = i + 1; j < group.length; j++) {
      const a = group[i];
      const b = group[j];
      const aId = a.getId;
      const bId = b.getId;
      const m = findMatchBetween(aId, bId, matches);
      if (!m || !m.scores || m.scores.length === 0) continue;

      let aSets = 0, bSets = 0;
      let aGames = 0, bGames = 0;
      for (const [s1, s2] of m.scores) {
        aGames += s1; bGames += s2;
        if (s1 > s2) aSets++; else if (s2 > s1) bSets++;
      }

      if (aSets > bSets) map.get(aId)!.wins += 1;
      else if (bSets > aSets) map.get(bId)!.wins += 1;

      map.get(aId)!.setsDiff += (aSets - bSets);
      map.get(bId)!.setsDiff += (bSets - aSets);
      map.get(aId)!.gamesDiff += (aGames - bGames);
      map.get(bId)!.gamesDiff += (bGames - aGames);
    }
  }

  return Array.from(map.values()).sort((x, y) => {
    if (y.wins !== x.wins) return y.wins - x.wins;
    if (y.setsDiff !== x.setsDiff) return y.setsDiff - x.setsDiff;
    return y.gamesDiff - x.gamesDiff;
  });
}

/** Матч считается сыгранным, если есть хотя бы один сет */
function isCompletedMatch(m?: Match | undefined): boolean {
  return !!(m && m.scores && m.scores.length > 0);
}

/** Сколько пар внутри группы уже сыграно (по факту наличия счёта) */
function countCompletedPairsInGroup(group: Participant[], matches: Match[]): number {
  let done = 0;
  for (let i = 0; i < group.length; i++) {
    for (let j = i + 1; j < group.length; j++) {
      const aId = group[i].getId;
      const bId = group[j].getId;
      if (isCompletedMatch(findMatchBetween(aId, bId, matches))) done++;
    }
  }
  return done;
}

/** Группа «стартовала», если сыгран хотя бы один матч */
function isGroupStarted(group: Participant[], matches: Match[]): boolean {
  return countCompletedPairsInGroup(group, matches) > 0;
}

/** Квалификанты в плей-офф из топ-K каждой группы (A1, B2, C1, D2, …). Принимает матчи по группам. */
function makePlayoffQualifiersFromFiltered(
  groups: Participant[][],
  statsPerGroup: GroupStats[][],
  topK: number,
  matchesPerGroup: Match[][]
): (Participant | null)[] {
  const out: (Participant | null)[] = [];
  const G = groups.length;
  const order: number[] = Array.from({ length: G }, (_, i) => i);

  function pick(gi: number, place: number) {
    const group = groups[gi];
    const stats = statsPerGroup[gi];

    // квоты не определяем, если группа фактически не началась
    if (!isGroupStarted(group, matchesPerGroup[gi])) {
      out.push(null);
      return;
    }

    const slot = stats[place];
    if (!slot) { out.push(null); return; }
    const p = group.find(pp => pp.getId === slot.id) ?? null;
    out.push(p);
  }

  // 1-е места
  for (const gi of order) pick(gi, 0);

  // 2-е места — реверсом
  if (topK >= 2) {
    for (const gi of [...order].reverse()) pick(gi, 1);
  }

  // 3-и и далее: нечётные волны — прямой порядок, чётные — реверс
  for (let place = 3; place <= topK; place++) {
    const wave = place % 2 === 1 ? order : [...order].reverse();
    for (const gi of wave) pick(gi, place - 1);
  }

  return out;
}

/** Построить пары начального раунда single-elim + пустые верхние раунды */
function buildSingleElimPairs(entrants: (Participant | null)[]) {
  const size = nextPow2(entrants.length || 1);
  const padded = entrants.slice();
  while (padded.length < size) padded.push(null);

  // Раунд 0 — готовые пары; верхние раунды заполняем null-слотами
  const r0: Array<[Participant | null, Participant | null]> = [];
  for (let i = 0; i < size; i += 2) r0.push([padded[i], padded[i + 1]]);

  const rounds: Array<Array<[Participant | null, Participant | null]>> = [r0];
  let cur = r0.length;
  while (cur > 1) {
    rounds.push(new Array(cur / 2).fill(null).map(() => [null, null]));
    cur = cur / 2;
  }
  return rounds;
}

/** Вернуть ID победителя пары (если матч найден и в нём определён победитель) */
function pairWinnerId(
  a: Participant | null,
  b: Participant | null,
  matches: Match[],
  filter?: MatchPhaseFilter
): number | null {
  const aId = pid(a); const bId = pid(b);
  if (aId && !bId) return aId; // автопроход при пустом сопернике
  if (!aId && bId) return bId;
  if (!aId || !bId) return null;

  const m = findMatchBetween(aId, bId, matches, filter);
  if (!m) return null;
  const w = m.getWinnerId?.();
  return w && w > 0 ? w : null;
}

/* ========================================================================== */
/*                               MAIN COMPONENT                               */
/* ========================================================================== */

export function GroupPlusPlayoffView({
  participants,
  matches,
  onSaveScore,
  groupsCount = 2,
  advancePerGroup = 2,
  seeding = "snake",
}: GroupPlusPlayoffViewProps) {

  /* ---------------------------- Локальные состояния (для ПЛЕЙ-ОФФ) ---------------------------- */
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const editingInputRef = useRef<HTMLInputElement | HTMLDivElement | null>(null);
  const mobileKeyboardAvailable = useScoreKeyboardAvailable();
  const [mobileKeyboardContext, setMobileKeyboardContext] = useState<{
    aId: number;
    bId: number;
    phaseFilter?: MatchPhaseFilter;
  } | null>(null);

  /** Ключ пары для режима редактирования (для плей-офф) */
  const pairKey = useCallback((aId: number, bId: number) => {
    return `${Math.min(aId, bId)}_${Math.max(aId, bId)}`;
  }, []);

  /** Начать редактирование (плей-офф) */
  const startEdit = useCallback((aId: number, bId: number, currentScore: string | null) => {
    const k = pairKey(aId, bId);
    setEditingKey(k);
    setEditValue(currentScore && currentScore !== "—" ? currentScore : "");
    editingInputRef.current = null;
  }, [pairKey, editingInputRef]);

  /** Отмена редактирования (плей-офф) */
  const cancelEdit = useCallback(() => {
    setEditingKey(null);
    setEditValue("");
    editingInputRef.current = null;
    setMobileKeyboardContext(null);
  }, [editingInputRef]);

  /** Сохранить счёт (плей-офф) */
  const saveEdit = useCallback(async (aId: number, bId: number, phaseFilter?: MatchPhaseFilter, raw?: string) => {
    const node = editingInputRef.current;
    const draft = node instanceof HTMLInputElement ? node.value : editValue;
    const nextValue = (raw ?? draft ?? "").trim();
    if (!isValidScoreFormat(nextValue)) {
      alert('Неверный формат счёта. Пример: "6-4, 4-6, 10-8"');
      return;
    }
    try {
      setSaving(true);
      const meta = phaseFilter
        ? {
            phase: phaseFilter.phase!,                        // плей-офф всегда задан
            groupIndex: phaseFilter.groupIndex ?? null,
            roundIndex: phaseFilter.roundIndex ?? null,
          }
        : undefined;

      await onSaveScore?.(aId, bId, nextValue, meta);
      setEditingKey(null);
      setEditValue("");
      editingInputRef.current = null;
      setMobileKeyboardContext(null);
    } finally {
      setSaving(false);
    }
  }, [editValue, editingInputRef, onSaveScore]);

  /* --------------------------- Производные данные --------------------------- */

  /** Отсортированные участники (детерминированно) */
  const ordered = useMemo(
    () =>
      participants
        .filter(isValidParticipant)
        .slice()
        .sort((a, b) => a.displayName(false).localeCompare(b.displayName(false), "ru")),
    [participants]
  );

  /** Сформированные группы по выбранной схеме посева */
  const groups = useMemo(
    () => distributeIntoGroups(ordered, Math.max(1, groupsCount), seeding),
    [ordered, groupsCount, seeding]
  );

  /** Матчи по группам (фильтруем из общего массива по phase/groupIndex) */
  const groupMatches: Match[][] = useMemo(() => {
    return groups.map((_, gi) =>
      matches.filter(m => (m as any).phase === PhaseType.Group && (m as any).groupIndex === gi)
    );
  }, [groups, matches]);

  /** Таблица результатов для каждой группы — на основе ТОЛЬКО матчей этой группы */
  const groupStats = useMemo(
    () => groups.map((g, gi) => computeGroupStats(g, groupMatches[gi])),
    [groups, groupMatches]
  );

  /** Очередь квалификантов в плей-офф */
  const qualifiers = useMemo(
    () => makePlayoffQualifiersFromFiltered(groups, groupStats, advancePerGroup, groupMatches),
    [groups, groupStats, advancePerGroup, groupMatches]
  );

  /** Заготовка плей-офф сетки (r0 — пары, далее пустые уровни) */
  const playoffRounds = useMemo(
    () => buildSingleElimPairs(qualifiers),
    [qualifiers]
  );

  /**
   * Проставляем победителей вверх по мере появления результатов плей-офф.
   */
  const resolvedPlayoff = useMemo(() => {
    const copy = playoffRounds.map(r =>
      r.map(([a, b]) => [a, b] as [Participant | null, Participant | null])
    );

    for (let r = 1; r < copy.length; r++) {
      const prev = copy[r - 1];
      for (let i = 0; i < copy[r].length; i++) {
        const w1 = pairWinnerId(prev[i * 2][0], prev[i * 2][1], matches, { phase: PhaseType.Playoff, roundIndex: r - 1 });
        const w2 = pairWinnerId(prev[i * 2 + 1][0], prev[i * 2 + 1][1], matches, { phase: PhaseType.Playoff, roundIndex: r - 1 });
        copy[r][i][0] = w1 ? ordered.find(p => p.getId === w1) ?? null : null;
        copy[r][i][1] = w2 ? ordered.find(p => p.getId === w2) ?? null : null;
      }
    }
    return copy;
  }, [playoffRounds, matches, ordered]);

  /* ----------------------------- Внутренние UI ----------------------------- */

  /** Имя участника (для плей-офф-строки) */
  function NameCell({ p }: { p: Participant }) {
    return <span className="player">{p.displayName(false)}</span>;
  }

  /** Строка пары (универсальна под плей-офф) */
  function PairRow({
    a, b, nullText, children
  }: {
    a: Participant | null;
    b: Participant | null;
    nullText: string;
    children: React.ReactNode;
  }) {
    const aId = pid(a);
    const bId = pid(b);
    const k = aId !== null && bId !== null ? `${Math.min(aId, bId)}_${Math.max(aId, bId)}` : null;
    const isEditing = k !== null && editingKey === k;

    return (
      <tr className={`grid-row ${isEditing ? "editing-row" : ""}`}>
        <td>{a ? <NameCell p={a} /> : <span className="player muted">{nullText}</span>}</td>
        {children}
        <td>{b ? <NameCell p={b} /> : <span className="player muted">{nullText}</span>}</td>
      </tr>
    );
  }

  /** Ячейка счёта (для плей-офф) */
  const MatchCell = useCallback(({
    a, b, phaseFilter
  }: {
    a: Participant | null;
    b: Participant | null;
    phaseFilter?: MatchPhaseFilter;
  }) => {
    const aId = pid(a);
    const bId = pid(b);
    const canEdit = !!aId && !!bId;
    const score = canEdit ? getMatchScore(aId!, bId!, matches, phaseFilter) : null;
    const k = canEdit ? pairKey(aId!, bId!) : undefined;
    const isEditing = !!k && editingKey === k;

    return (
      <td className="score-cell">
        {canEdit ? (
          score ? (
            <span className="badge">{score}</span>
          ) : !isEditing ? (
            <div className="score-cell__button-wrap">
              <button
                type="button"
                className="vs vs-click"
                onClick={() => {
                  startEdit(aId!, bId!, score);
                  if (mobileKeyboardAvailable) {
                    setMobileKeyboardContext({ aId: aId!, bId: bId!, phaseFilter });
                  }
                }}
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
                pattern="[0-9\\s,:-]*"
                autoFocus={!mobileKeyboardAvailable}
                onFocus={(e) => {
                  if (mobileKeyboardAvailable) e.currentTarget.blur();
                }}
                onKeyDown={(e) => {
                  if (!mobileKeyboardAvailable) {
                    if (e.key === "Enter") { e.preventDefault(); saveEdit(aId!, bId!, phaseFilter); }
                    if (e.key === "Escape") { e.preventDefault(); cancelEdit(); }
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
                    onClick={() => saveEdit(aId!, bId!, phaseFilter)}
                    disabled={saving}
                  />
                  <CancelIconButton className="lg" title="Отмена" onClick={cancelEdit} disabled={saving} />
                </>
              )}
            </div>
          )
        ) : (
          <span className="vs vs-placeholder" aria-hidden>vs</span>
        )}
      </td>
    );
  }, [
    pairKey,
    startEdit,
    editValue,
    saveEdit,
    cancelEdit,
    saving,
    editingKey,
    matches,
    mobileKeyboardAvailable,
    setMobileKeyboardContext,
  ]);

  /** Блок ГРУПП: теперь через RoundRobinTable */
  function GroupBlock({ gIndex, group }: { gIndex: number; group: Participant[] }) {
    // Для матрицы — пробрасываем только матчи ЭТОЙ группы
    const matchesForGroup = groupMatches[gIndex];

    return (
      <div className={`${editingKey ? "card--no-transition" : ""}`.trim()}>
        <div className="history-table-head">
          <strong>Группа {String.fromCharCode(65 + gIndex)}</strong>
        </div>

        <RoundRobinTable
          participants={group}
          matches={matchesForGroup}
          onSaveScore={(aId, bId, score) =>
            onSaveScore?.(aId, bId, score, { phase: PhaseType.Group, groupIndex: gIndex, roundIndex: null })
          }
        />
      </div>
    );
  }

  /** Блок ПЛЕЙ-ОФФ: все раунды, с протаскиванием победителей */
  function PlayoffBlock() {
    return (
      <div className="rounds-grid">
        {resolvedPlayoff.map((pairs, rIndex) => (
          <div
            key={rIndex}
            className={`card ${editingKey ? "card--no-transition" : ""}`.trim()}
          >
            <div className="history-table-head">
              <strong>{rIndex === resolvedPlayoff.length - 1 ? "Финал" : `Плей-офф — Раунд ${rIndex + 1}`}</strong>
            </div>
            <table className="round-table">
              <thead>
                <tr className="grid-row">
                  <th>Участник</th>
                  <th>Счёт</th>
                  <th>Участник</th>
                </tr>
              </thead>
              <tbody>
                {pairs.length ? (
                  pairs.map(([a, b], i) => (
                    <tr key={i} className="grid-row">
                      <td>{a ? <NameCell p={a} /> : <span className="player muted">Ожидается</span>}</td>
                      <MatchCell a={a} b={b} phaseFilter={{ phase: PhaseType.Playoff, roundIndex: rIndex }} />
                      <td>{b ? <NameCell p={b} /> : <span className="player muted">Ожидается</span>}</td>
                    </tr>
                  ))
                ) : (
                  <tr className="grid-row">
                    <td colSpan={3} className="history-empty">Нет пар</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    );
  }

  /* ---------------------------------- UI ---------------------------------- */

  return (
    <div className="roundrobin-wrap">
      {/* ГРУППЫ (через RoundRobinTable) */}
      <div className="rounds-grid">
        {groups.map((g, gi) => (
          <GroupBlock key={gi} gIndex={gi} group={g} />
        ))}
      </div>

      {/* ПЛЕЙ-ОФФ */}
      <div style={{ marginTop: 16 }}>
        <PlayoffBlock />
      </div>

      <div className="hint muted" style={{ marginTop: 8 }}>
        <div>• Порядок в таблице групп: победы → разница сетов → разница геймов.</div>
        <div>• Посев плей-офф: крест-накрест из топ-{advancePerGroup} каждой группы. Режим «snake» равномернее распределяет сильных по группам.</div>
      </div>

      {/* Мобильная клавиатура — ТОЛЬКО для плей-офф (RoundRobinTable управляет своей собственой внутри себя) */}
      {mobileKeyboardAvailable && mobileKeyboardContext && (
        <ScoreKeyboard
          inputRef={editingInputRef}
          value={editValue}
          onChange={setEditValue}
          onSave={() =>
            saveEdit(
              mobileKeyboardContext.aId,
              mobileKeyboardContext.bId,
              mobileKeyboardContext.phaseFilter
            )
          }
          onCancel={cancelEdit}
          disabled={saving}
          autoFocus={false}
        />
      )}
    </div>
  );
}
