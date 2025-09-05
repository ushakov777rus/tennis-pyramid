"use client";

import { useMemo, useState } from "react";

import { Participant } from "@/app/models/Participant";
import { Match } from "@/app/models/Match";

import { SaveIconButton, CancelIconButton } from "@/app/components/IconButtons";

import "./PyramidView.css";
import "./RoundRobinView.css";
import "@/app/components/ParticipantsView.css";
// BUILD_MANIFEST не используется — убрал импорт

type GroupPlusPlayoffViewProps = {
  participants: Participant[];
  matches: Match[];
  onSaveScore?: (aId: number, bId: number, score: string) => Promise<void> | void;

  groupsCount?: number;          // число групп
  advancePerGroup?: number;      // сколько выходят из группы
  seeding?: "simple" | "snake";  // распределение по группам
};

/* ====================== УТИЛИТЫ / HELPERS ====================== */

/** Валиден ли участник (игрок или команда) */
function isValidParticipant(p: Participant | null | undefined): p is Participant {
  return !!p && (!!p.player || !!p.team);
}

/** Безопасно получить ID участника (null если слота нет) */
function pid(p: Participant | null | undefined): number | null {
  return p ? p.getId : null;
}

/** Следующая степень двойки ≥ n (для размера сетки) */
function nextPow2(n: number) {
  let p = 1;
  while (p < n) p <<= 1;
  return p;
}

/** Человекочитаемое имя участника (игрок или команда) */
function nameOf(p: Participant): string {
  if (p.player) return p.player.name;
  const a = p.team?.player1?.name ?? "??";
  const b = p.team?.player2?.name ?? "??";
  return `${a} + ${b}`;
}

/** Найти матч между участниками с ID aId и bId (игроки/команды) */
function findMatchBetween(aId: number, bId: number, matches: Match[]): Match | undefined {
  return matches.find((m) => {
    const id1 = m.player1?.id ?? m.team1?.id ?? 0;
    const id2 = m.player2?.id ?? m.team2?.id ?? 0;
    return (id1 === aId && id2 === bId) || (id1 === bId && id2 === aId);
  });
}

/** Есть ли в массиве матчей парный матч ровно между a и b */
function hasPairMatch(a: Participant | null, b: Participant | null, matches: Match[]) {
  const aId = pid(a), bId = pid(b);
  return !!(aId && bId && findMatchBetween(aId, bId, matches));
}

/** Отрендерить счёт матча в виде "6:4, 4:6, 10:8" или null */
function getMatchScore(aId: number, bId: number, matches: Match[]): string | null {
  const match = findMatchBetween(aId, bId, matches);
  if (!match) return null;
  if (match.scores && match.scores.length > 0) {
    return match.scores.map(([s1, s2]) => `${s1}:${s2}`).join(", ");
  }
  return null;
}

/** Валидатор формата счёта: "6-4, 4-6, 10-8" и т.п. */
function isValidScoreFormat(s: string) {
  const trimmed = s.trim();
  if (!trimmed) return false;
  const setRe = /^\s*\d+\s*[:-]\s*\d+\s*$/;
  return trimmed.split(",").every((part) => setRe.test(part.trim()));
}

/** Ячейка с именем участника */
function NameCell({ p }: { p: Participant }) {
  return <span className="player">{p.displayName(false)}</span>;
}

/* ---------- ГРУППОВАЯ СТАДИЯ ---------- */

/** Разложение по группам (simple / snake) */
function distributeIntoGroups(items: Participant[], groupsCount: number, mode: "simple"|"snake"): Participant[][] {
  const groups: Participant[][] = new Array(groupsCount).fill(null).map(() => []);
  if (mode === "simple") {
    items.forEach((p, i) => groups[i % groupsCount].push(p));
  } else {
    // snake: 0..g-1, затем g-1..0, и т.д.
    let idx = 0, dir = 1;
    for (const p of items) {
      groups[idx].push(p);
      idx += dir;
      if (idx === groupsCount) { idx = groupsCount - 1; dir = -1; }
      else if (idx < 0) { idx = 0; dir = 1; }
    }
  }
  return groups;
}

/** Расписание "кругов" (round-robin) для одной группы (circle method) */
function buildRoundRobin(units: Participant[]): Participant[][][] {
  const list: (Participant | null)[] = units.slice();
  if (list.length % 2 === 1) list.push(null); // BYE
  const n = list.length;
  const roundsCount = n - 1;
  const rounds: Participant[][][] = [];
  for (let r = 0; r < roundsCount; r++) {
    const pairs: Participant[][] = [];
    for (let i = 0; i < n / 2; i++) {
      const a = list[i];
      const b = list[n - 1 - i];
      if (a && b) pairs.push([a, b]);
    }
    rounds.push(pairs);
    const fixed = list[0];
    const tail = list.slice(1);
    tail.unshift(tail.pop()!);
    list.splice(0, list.length, fixed, ...tail);
  }
  return rounds;
}

/** Аггрегация статистики группы и сортировка: wins → Δsets → Δgames */
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
      const a = group[i]; const b = group[j];
      const aId = a.getId; const bId = b.getId;
      const m = findMatchBetween(aId, bId, matches);
      if (!m || !m.scores || m.scores.length === 0) continue;

      let aSets = 0, bSets = 0;
      let aGames = 0, bGames = 0;
      for (const [s1, s2] of m.scores) {
        aGames += s1; bGames += s2;
        if (s1 > s2) aSets++; else if (s2 > s1) bSets++;
      }

      // победитель — по сетам
      if (aSets > bSets) map.get(aId)!.wins += 1; else if (bSets > aSets) map.get(bId)!.wins += 1;

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

/* ---------- ПЛЕЙ-ОФФ: ВТЯЖКА И УТОЧНЕНИЕ ПАР ---------- */

/** Матч считается "сыгранным", если у него есть хотя бы один сет */
function isCompletedMatch(m?: Match | undefined): boolean {
  return !!(m && m.scores && m.scores.length > 0);
}

/** Сколько пар в группе уже сыграно (по факту наличия счёта) */
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

/** Группа "стартовала", если сыгран хотя бы один матч */
function isGroupStarted(group: Participant[], matches: Match[]): boolean {
  return countCompletedPairsInGroup(group, matches) > 0;
}

/** Составить очередь квалификантов в плей-офф из топ-K каждой группы.
 *  ВАЖНО: если в группе ещё нет ни одного сыгранного матча — квоты этой группы заполняем null.
 *  Посев — "A1, B2, C1, D2, …" (чередование волн с реверсом).
 */
function makePlayoffQualifiers(
  groups: Participant[][],
  statsPerGroup: GroupStats[][],
  topK: number,
  matches: Match[]
): (Participant | null)[] {
  const out: (Participant | null)[] = [];
  const G = groups.length;
  const order: number[] = Array.from({ length: G }, (_, i) => i);

  function pick(gi: number, place: number) {
    const group = groups[gi];
    const stats = statsPerGroup[gi];

    // если в группе ещё НИ ОДНОГО матча — откладываем определение слота
    if (!isGroupStarted(group, matches)) {
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

  // 3-и, 4-е и т.д.: нечётные — прямой порядок, чётные — реверс
  for (let place = 3; place <= topK; place++) {
    const wave = place % 2 === 1 ? order : [...order].reverse();
    for (const gi of wave) pick(gi, place - 1);
  }

  return out;
}

/** Сформировать сетку Single Elimination из входящих слотов (с padding до степени двойки) */
function buildSingleElimPairs(entrants: (Participant | null)[]) {
  const size = nextPow2(entrants.length || 1);
  const padded = entrants.slice();
  while (padded.length < size) padded.push(null);
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

/** Победитель пары (если матч уже есть и у него определён победитель) */
function pairWinnerId(a: Participant | null, b: Participant | null, matches: Match[]): number | null {
  const aId = pid(a); const bId = pid(b);
  if (aId && !bId) return aId;      // автопроход при пустом оппоненте
  if (!aId && bId) return bId;
  if (!aId || !bId) return null;
  const m = findMatchBetween(aId, bId, matches);
  if (!m) return null;
  const w = m.getWinnerId?.();
  return w && w > 0 ? w : null;
}

/* ====================== КОМПОНЕНТ ====================== */

export function GroupPlusPlayoffView({
  participants,
  matches,
  onSaveScore,
  groupsCount = 2,
  advancePerGroup = 2,
  seeding = "snake",
}: GroupPlusPlayoffViewProps) {
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>("");
  const [saving, setSaving] = useState(false);

  /** Ключ пары, чтобы выделять редактируемую строку */
  const pairKey = (aId: number, bId: number) => `${Math.min(aId, bId)}_${Math.max(aId, bId)}`;

  /** Начать редактирование счёта между участниками */
  function startEdit(aId: number, bId: number, currentScore: string | null) {
    const k = pairKey(aId, bId);
    setEditingKey(k);
    setEditValue(currentScore && currentScore !== "—" ? currentScore : "");
  }
  function cancelEdit() { setEditingKey(null); setEditValue(""); }
  async function saveEdit(aId: number, bId: number) {
    if (!isValidScoreFormat(editValue)) { alert('Неверный формат счёта. Пример: "6-4, 4-6, 10-8"'); return; }
    try {
      setSaving(true);
      await onSaveScore?.(aId, bId, editValue.trim());
      setEditingKey(null); setEditValue("");
    } finally { setSaving(false); }
  }

  /* ---------- Деривативы от входных данных ---------- */
  const ordered = useMemo(
    () =>
      participants
        .filter(isValidParticipant)
        .slice()
        .sort((a, b) => a.displayName(false).localeCompare(b.displayName(false), "ru")),
    [participants]
  );

  const groups = useMemo(
    () => distributeIntoGroups(ordered, Math.max(1, groupsCount), seeding),
    [ordered, groupsCount, seeding]
  );

  const groupRounds = useMemo(() => groups.map(g => buildRoundRobin(g)), [groups]);

  const groupStats = useMemo(() => groups.map(g => computeGroupStats(g, matches)), [groups, matches]);

  const qualifiers = useMemo(
    () => makePlayoffQualifiers(groups, groupStats, advancePerGroup, matches),
    [groups, groupStats, advancePerGroup, matches]
  );

  const playoffRounds = useMemo(() => buildSingleElimPairs(qualifiers), [qualifiers]);

  /** Проставляем победителей в верхние раунды по мере появления результатов */
  const resolvedPlayoff = useMemo(() => {
    const copy = playoffRounds.map(r => r.map(([a,b]) => [a,b] as [Participant|null, Participant|null]));
    for (let r = 1; r < copy.length; r++) {
      const prev = copy[r - 1];
      for (let i = 0; i < copy[r].length; i++) {
        const w1 = pairWinnerId(prev[i * 2][0], prev[i * 2][1], matches);
        const w2 = pairWinnerId(prev[i * 2 + 1][0], prev[i * 2 + 1][1], matches);
        copy[r][i][0] = w1 ? ordered.find(p => p.getId === w1) ?? null : null;
        copy[r][i][1] = w2 ? ordered.find(p => p.getId === w2) ?? null : null;
      }
    }
    return copy;
  }, [playoffRounds, matches, ordered]);

  /* ---------- Ячейка "Счёт": бейдж, кнопка vs, режим редактирования ---------- */
  function MatchCell({ a, b }: { a: Participant | null; b: Participant | null }) {
    const aId = pid(a); const bId = pid(b);
    const canEdit = !!aId && !!bId;
    const score = canEdit ? getMatchScore(aId!, bId!, matches) : null;
    const k = canEdit ? pairKey(aId!, bId!) : undefined;
    const isEditing = !!k && editingKey === k;

    return (
      <td className="score-cell">
        {canEdit ? (
          score ? (
            <span className="badge">{score}</span>
          ) : !isEditing ? (
            <button
              type="button"
              className="vs vs-click"
              onClick={() => startEdit(aId!, bId!, score)}
              title="Добавить счёт"
              aria-label="Добавить счёт"
            >
              vs
            </button>
          ) : (
            <div className="score-edit-wrap">
              <input
                className="input score-input"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                placeholder="6-4, 4-6, 10-8"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") { e.preventDefault(); saveEdit(aId!, bId!); }
                  if (e.key === "Escape") { e.preventDefault(); cancelEdit(); }
                }}
              />
              <SaveIconButton className="lg" title="Сохранить счёт" aria-label="Сохранить счёт" onClick={() => saveEdit(aId!, bId!)} disabled={saving}/>
              <CancelIconButton className="lg" title="Отмена" aria-label="Отмена" onClick={cancelEdit} disabled={saving}/>
            </div>
          )
        ) : (
          // когда хотя бы один слот пуст — показываем нейтральный плейсхолдер
          <span className="vs vs-placeholder" aria-hidden>vs</span>
        )}
      </td>
    );
  }

  /* ---------- Универсальная строка пары: используется и в группах, и в плей-офф ---------- */
  function PairRow({
    a, b, nullText,
  }: {
    a: Participant | null;
    b: Participant | null;
    nullText: string; // "BYE" для групп, "Ожидается" для плей-офф
  }) {
    const aId = pid(a);
    const bId = pid(b);
    const k = aId !== null && bId !== null ? pairKey(aId, bId) : null;
    const isEditing = k !== null && editingKey === k;

    return (
      <tr className={`grid-row ${isEditing ? "editing-row" : ""}`}>
        <td>{a ? <NameCell p={a} /> : <span className="player muted">{nullText}</span>}</td>
        <MatchCell a={a} b={b} />
        <td>{b ? <NameCell p={b} /> : <span className="player muted">{nullText}</span>}</td>
      </tr>
    );
  }

  /* ---------- Таблица одной группы (раунды + таблица лидеров) ---------- */
  function GroupBlock({ gIndex, group }: { gIndex: number; group: Participant[] }) {
    const rounds = groupRounds[gIndex];
    const stats = groupStats[gIndex];

    return (
      <div className="card">
        <div className="history-table-head">
          <strong>Группа {String.fromCharCode(65 + gIndex)}</strong>
        </div>

        {/* Раунды группы */}
        <div className="rounds-grid">
          {rounds.map((pairs, r) => (
            <table key={r} className="round-table">
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
                    <PairRow key={i} a={a} b={b} nullText="BYE" />
                  ))
                ) : (
                  <tr className="grid-row">
                    <td colSpan={3} className="history-empty">Нет пар</td>
                  </tr>
                )}
              </tbody>
            </table>
          ))}
        </div>

        {/* Таблица группы */}
        <table className="round-table" style={{ marginTop: 12 }}>
          <thead>
            <tr className="grid-row-group-playoff">
              <th>Участник</th><th>W</th><th>Δсет</th><th>Δгейм</th>
            </tr>
          </thead>
          <tbody>
            {stats.map((s) => (
              <tr key={s.id} className="grid-row-group-playoff">
                <td><span className="player">{s.name}</span></td>
                <td>{s.wins}</td>
                <td>{s.setsDiff}</td>
                <td>{s.gamesDiff}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  /* ---------- Отрисовка плей-офф (все раунды) ---------- */
  function PlayoffBlock() {
    return (
      <div className="rounds-grid">
        {resolvedPlayoff.map((pairs, rIndex) => (
          <div key={rIndex} className="card">
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
                    <PairRow key={i} a={a} b={b} nullText="Ожидается" />
                  ))
                ) : (
                  <tr className="grid-row"><td colSpan={3} className="history-empty">Нет пар</td></tr>
                )}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    );
  }

  /* ---------- Корневой рендер ---------- */
  return (
    <div className="roundrobin-wrap">
      {/* ГРУППЫ */}
      <div className="rounds-grid">
        {groups.map((g, gi) => <GroupBlock key={gi} gIndex={gi} group={g}/>)}
      </div>

      {/* ПЛЕЙ-ОФФ */}
      <div style={{ marginTop: 16 }}>
        <PlayoffBlock/>
      </div>

      <div className="hint muted" style={{ marginTop: 8 }}>
        <div>• Порядок в таблице: победы → разница сетов → разница геймов.</div>
        <div>• Посев плей-офф: крест-накрест (A1–B2, B1–A2, …). Включите «snake» для более ровного распределения по группам.</div>
      </div>
    </div>
  );
}