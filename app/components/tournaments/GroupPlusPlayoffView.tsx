"use client";

import { useMemo, useState } from "react";

import { Participant } from "@/app/models/Participant";
import { Match } from "@/app/models/Match";

import { SaveIconButton, CancelIconButton } from "@/app/components/IconButtons";

import "./PyramidView.css";
import "./RoundRobinView.css";
import "@/app/components/ParticipantsView.css";
import { BUILD_MANIFEST } from "next/dist/shared/lib/constants";

type GroupPlusPlayoffViewProps = {
  participants: Participant[];
  matches: Match[];
  onSaveScore?: (aId: number, bId: number, score: string) => Promise<void> | void;

  groupsCount?: number;       // число групп (по умолчанию 4)
  advancePerGroup?: number;   // сколько выходят из группы (по умолчанию 2)
  seeding?: "simple" | "snake"; // распределение по группам (по умолчанию "snake")
};

/* ---------------- Утилиты ---------------- */

function isValidParticipant(p: Participant | null | undefined): p is Participant {
  return !!p && (!!p.player || !!p.team);
}

function pid(p: Participant | null | undefined): number | null {
  if (!p) return null;
  return p.getId;
}

function nextPow2(n: number) {
  let p = 1;
  while (p < n) p <<= 1;
  return p;
}

function nameOf(p: Participant): string {
  if (p.player) return p.player.name;
  const a = p.team?.player1?.name ?? "??";
  const b = p.team?.player2?.name ?? "??";
  return `${a} + ${b}`;
}

function findMatchBetween(aId: number, bId: number, matches: Match[]): Match | undefined {
  return matches.find((m) => {
    const id1 = m.player1?.id ?? m.team1?.id ?? 0;
    const id2 = m.player2?.id ?? m.team2?.id ?? 0;
    return (id1 === aId && id2 === bId) || (id1 === bId && id2 === aId);
  });
}

function hasPairMatch(a: Participant | null, b: Participant | null, matches: Match[]) {
  const aId = pid(a), bId = pid(b);
  return !!(aId && bId && findMatchBetween(aId, bId, matches));
}

function getMatchScore(aId: number, bId: number, matches: Match[]): string | null {
  const match = findMatchBetween(aId, bId, matches);
  if (!match) return null;
  if (match.scores && match.scores.length > 0) {
    return match.scores.map(([s1, s2]) => `${s1}:${s2}`).join(", ");
  }
  console.log("getMatchScore", aId, matches);
  return null;
}

function isValidScoreFormat(s: string) {
  const trimmed = s.trim();
  if (!trimmed) return false;
  const setRe = /^\s*\d+\s*[:-]\s*\d+\s*$/;
  return trimmed.split(",").every((part) => setRe.test(part.trim()));
}

function NameCell({ p }: { p: Participant }) {
  return <span className="player">{p.displayName(false)}</span>;
}


/* ---------------- Групповая стадия ---------------- */

/** Разложение по группам */
function distributeIntoGroups(items: Participant[], groupsCount: number, mode: "simple"|"snake"): Participant[][] {
  const groups: Participant[][] = new Array(groupsCount).fill(null).map(() => []);
  if (mode === "simple") {
    items.forEach((p, i) => groups[i % groupsCount].push(p));
  } else {
    // snake (змейка): 0..g-1, затем g-1..0, и т.д.
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

/** Circle method для одной группы */
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

/** Подсчёт статистики группы: победы, дифф. сетов, дифф. геймов */
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

  // сортировка таблицы
  return Array.from(map.values()).sort((x, y) => {
    if (y.wins !== x.wins) return y.wins - x.wins;
    if (y.setsDiff !== x.setsDiff) return y.setsDiff - x.setsDiff;
    return y.gamesDiff - x.gamesDiff;
  });
}

/* ---------------- Плей-офф (Single Elim из квот) ---------------- */

/** Составить плей-офф из топ-K из каждой группы, посев крест-накрест */
function makePlayoffQualifiers(groups: Participant[][], statsPerGroup: GroupStats[][], topK: number): Participant[] {
  const out: Participant[] = [];
  // A1, B2, C1, D2, затем A2, B1, C2, D1 ... по блокам
  const G = groups.length;
  const order: number[] = []; // индекс группы для первой волны (1-е места)
  for (let g = 0; g < G; g++) order.push(g);

  // первая волна: 1-е места по порядку
  for (const gi of order) {
    if (statsPerGroup[gi][0]) {
      const id = statsPerGroup[gi][0].id;
      const p = groups[gi].find((pp) => pp.getId === id);
      if (p) out.push(p);
    }
  }
  // вторая волна: 2-е места — «крест-накрест» (реверс)
  if (topK >= 2) {
    for (const gi of [...order].reverse()) {
      if (statsPerGroup[gi][1]) {
        const id = statsPerGroup[gi][1].id;
        const p = groups[gi].find((pp) => pp.getId === id);
        if (p) out.push(p);
      }
    }
  }
  // если topK > 2 — добавим оставшиеся места по той же логике: 3-и по прямому, 4-е по реверсу и т.д.
  for (let place = 3; place <= topK; place++) {
    const wave = place % 2 === 1 ? order : [...order].reverse();
    for (const gi of wave) {
      if (statsPerGroup[gi][place - 1]) {
        const id = statsPerGroup[gi][place - 1].id;
        const p = groups[gi].find((pp) => pp.getId === id);
        if (p) out.push(p);
      }
    }
  }
  return out;
}

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

function pairWinnerId(a: Participant | null, b: Participant | null, matches: Match[]): number | null {
  const aId = pid(a); const bId = pid(b);
  if (aId && !bId) return aId;
  if (!aId && bId) return bId;
  if (!aId || !bId) return null;
  const m = findMatchBetween(aId, bId, matches);
  if (!m) return null;
  const w = m.getWinnerId?.();
  return w && w > 0 ? w : null;
}

/* ---------------- Компонент ---------------- */

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

  // Стабильная сортировка
  const ordered = useMemo(
    () =>
      participants
        .filter(isValidParticipant)
        .slice()
        .sort((a, b) =>
          a
            .displayName(false)
            .localeCompare(b.displayName(false), "ru")
        ),
    [participants]
  );

  // Разложение по группам
  const groups = useMemo(() => distributeIntoGroups(ordered, Math.max(1, groupsCount), seeding), [ordered, groupsCount, seeding]);

  // Расписание кругов в каждой группе
  const groupRounds = useMemo(() => groups.map(g => buildRoundRobin(g)), [groups]);

  // Таблицы групп
  const groupStats = useMemo(() => groups.map(g => computeGroupStats(g, matches)), [groups, matches]);

  // Квалифицировавшиеся в плей-офф (могут быть «дыры», если мало матчей — т.е. не все определились)
  const qualifiers = useMemo(() => makePlayoffQualifiers(groups, groupStats, advancePerGroup), [groups, groupStats, advancePerGroup]);

  // Пары плей-офф (раунд 0) + последующие раунды
  const playoffRounds = useMemo(() => buildSingleElimPairs(qualifiers), [qualifiers]);

  // Подставим победителей по мере ввода результатов
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

  // --- редактирование счёта (общая логика) ---
  const pairKey = (aId: number, bId: number) => `${Math.min(aId, bId)}_${Math.max(aId, bId)}`;
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

  // Общий рендер матча (кнопка vs → инпут)
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
          <span className="badge muted">—</span>
        )}
      </td>
    );
  }

  // Таблица одной группы (раунды + standings)
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
                {pairs.length ? pairs.map(([a, b], i) => {
                  const aId = a.getId;
                  const bId = b.getId;
                  const k = pairKey(aId, bId);
                  const isEditing = editingKey === k;

                  return (
                    <tr key={i} className={`grid-row ${isEditing ? "editing-row" : ""}`}>
                      <td>{a ? <NameCell p={a}/> : <span className="player muted">BYE</span>}</td>
                      <MatchCell a={a} b={b}/>
                      <td>{b ? <NameCell p={b}/> : <span className="player muted">BYE</span>}</td>
                    </tr>
                  );
                }) : (
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
            <tr className="grid-row">
              <th>#</th><th>Участник</th><th>W</th><th>Δсет</th><th>Δгейм</th>
            </tr>
          </thead>
          <tbody>
            {stats.map((s, i) => (
              <tr key={s.id} className="grid-row">
                <td>{i + 1}</td>
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

  // Отрисовка плей-офф
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
                {pairs.length ? pairs.map(([a,b], i) => (
                  // внутри PlayoffBlock → tbody → pairs.map(...)
                  <tr key={i} className="grid-row">
                    <td>
                      {hasPairMatch(a, b, matches)
                        ? (a ? <NameCell p={a}/> : <span className="player muted">Ожидается</span>)
                        : <span className="player muted">Ожидается</span>}
                    </td>

                    <MatchCell a={a} b={b}/>

                    <td>
                      {hasPairMatch(a, b, matches)
                        ? (b ? <NameCell p={b}/> : <span className="player muted">Ожидается</span>)
                        : <span className="player muted">Ожидается</span>}
                    </td>
                  </tr>
                )) : (
                  <tr className="grid-row"><td colSpan={3} className="history-empty">Нет пар</td></tr>
                )}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    );
  }

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