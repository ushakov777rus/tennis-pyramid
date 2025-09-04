"use client";

import { useMemo, useState } from "react";
import { useUser } from "@/app/components/UserContext";
import { Participant } from "@/app/models/Participant";
import { Match } from "@/app/models/Match";
import { SaveIconButton, CancelIconButton } from "@/app/components/IconButtons";

import "./PyramidView.css";
import "./RoundRobinView.css";
import "@/app/components/ParticipantsView.css";

type SwissViewProps = {
  participants: Participant[];
  matches: Match[];
  roundsCount: number; // сколько раундов швейцарки играть
  onSaveScore?: (aId: number, bId: number, score: string) => Promise<void> | void;
};

/* ========= Утилиты ========= */

function isValidParticipant(p: Participant | null | undefined): p is Participant {
  return !!p && (!!p.player || !!p.team);
}

function pid(p: Participant | null | undefined): number | null {
  if (!p) return null;
  return p.getId; // «не трогай getId»
}

function havePlayed(aId: number, bId: number, matches: Match[]) {
  return !!matches.find((m) => {
    const id1 = m.player1?.id ?? m.team1?.id ?? 0;
    const id2 = m.player2?.id ?? m.team2?.id ?? 0;
    return (id1 === aId && id2 === bId) || (id1 === bId && id2 === aId);
  });
}

function findMatchBetween(aId: number, bId: number, matches: Match[]) {
  return matches.find((m) => {
    const id1 = m.player1?.id ?? m.team1?.id ?? 0;
    const id2 = m.player2?.id ?? m.team2?.id ?? 0;
    return (id1 === aId && id2 === bId) || (id1 === bId && id2 === aId);
  });
}

function getMatchScore(aId: number, bId: number, matches: Match[]): string | null {
  const match = findMatchBetween(aId, bId, matches);
  if (!match) return null;
  if (match.scores && match.scores.length > 0) {
    return match.scores.map(([s1, s2]) => `${s1}:${s2}`).join(", ");
  }
  return "—";
}

function isValidScoreFormat(s: string) {
  const trimmed = s.trim();
  if (!trimmed) return false;
  const setRe = /^\s*\d+\s*[:-]\s*\d+\s*$/;
  return trimmed.split(",").every((part) => setRe.test(part.trim()));
}

function NameCell({ p }: { p: Participant }) {
  if (p.player) {
    return <span className="player name-one-line" title={`ID: ${p.player.id}`}>{p.player.name}</span>;
  }
  const a = p.team?.player1?.name ?? "??";
  const b = p.team?.player2?.name ?? "??";
  return (
    <span className="player name-stack" title={`ID: ${p.team?.id}`}>
      <span className="name-line">{a}</span>
      <span className="name-line">{b}</span>
    </span>
  );
}

/* ========= Подсчёт очков и тай-брейков ========= */

type PStats = {
  id: number;
  points: number;     // победы = 1, поражение = 0
  setsDiff: number;   // Δ сетов
  gamesDiff: number;  // Δ геймов
  oppIds: number[];   // соперники
  beatIds: number[];  // побеждённые соперники
};

function emptyPStats(ids: number[]): Map<number, PStats> {
  const m = new Map<number, PStats>();
  ids.forEach((id) => m.set(id, { id, points: 0, setsDiff: 0, gamesDiff: 0, oppIds: [], beatIds: [] }));
  return m;
}

function computeStats(participants: Participant[], matches: Match[]): Map<number, PStats> {
  const ids = participants.map((p) => p.getId);
  const st = emptyPStats(ids);
  for (const m of matches) {
    const aId = m.player1?.id ?? m.team1?.id ?? 0;
    const bId = m.player2?.id ?? m.team2?.id ?? 0;
    if (!aId || !bId) continue;
    const a = st.get(aId)!; const b = st.get(bId)!;
    a.oppIds.push(bId); b.oppIds.push(aId);

    if (!m.scores || m.scores.length === 0) continue;

    let aSets = 0, bSets = 0, aGames = 0, bGames = 0;
    for (const [s1, s2] of m.scores) {
      aGames += s1; bGames += s2;
      if (s1 > s2) aSets++; else if (s2 > s1) bSets++;
    }
    a.setsDiff += (aSets - bSets);
    b.setsDiff += (bSets - aSets);
    a.gamesDiff += (aGames - bGames);
    b.gamesDiff += (bGames - aGames);

    if (aSets > bSets) { a.points += 1; a.beatIds.push(bId); }
    else if (bSets > aSets) { b.points += 1; b.beatIds.push(aId); }
    // ничьи не поддерживаем (теннис), при необходимости: a.points += 0.5; b.points += 0.5;
  }
  return st;
}

function buchholz(st: Map<number, PStats>, id: number) {
  const s = st.get(id)!;
  return s.oppIds.reduce((acc, oid) => acc + (st.get(oid)?.points ?? 0), 0);
}

function sonnebornBerger(st: Map<number, PStats>, id: number) {
  const s = st.get(id)!;
  return s.beatIds.reduce((acc, oid) => acc + (st.get(oid)?.points ?? 0), 0);
}

/* ========= Пейринг швейцарки ========= */

/**
 * Гридовый, но надёжный алгоритм:
 * - Сортируем по очкам (desc), затем по Buchholz, затем по SB, затем по имени.
 * - Идём сверху вниз, пытаясь спарить с первым доступным из той же «очки-группы»,
 *   кто ещё не играл с этим участником. Если не нашли — расширяем поиск вниз (float).
 * - При нечётном количестве: нижний получает BYE (автопобеда).
 */
function swissPairRound(
  participants: Participant[],
  matches: Match[],
  stats: Map<number, PStats>
): Array<[Participant | null, Participant | null]> {
  const sorted = participants.slice().sort((a, b) => {
    const sa = stats.get(a.getId)!;
    const sb = stats.get(b.getId)!;
    if (sb.points !== sa.points) return sb.points - sa.points;
    const ba = buchholz(stats, a.getId);
    const bb = buchholz(stats, b.getId);
    if (bb !== ba) return bb - ba;
    const sba = sonnebornBerger(stats, a.getId);
    const sbb = sonnebornBerger(stats, b.getId);
    if (sbb !== sba) return sbb - sba;
    // стабильность на имени
    const an = a.displayName(false);
    const bn = b.displayName(false);
    return an.localeCompare(bn, "ru");
  });

  const used = new Set<number>();
  const pairs: Array<[Participant | null, Participant | null]> = [];

  const N = sorted.length;
  let i = 0;
  while (i < N) {
    const A = sorted[i];
    const aId = A.getId;
    if (used.has(aId)) {
      i++;
      continue;
    }

    // Найти первого возможного соперника
    let found: Participant | null = null;
    for (let j = i + 1; j < N; j++) {
      const B = sorted[j];
      const bId = B.getId;
      if (used.has(bId)) continue;
      if (!havePlayed(aId, bId, matches)) {
        found = B;
        used.add(aId);
        used.add(bId);
        pairs.push([A, B]);
        break;
      }
    }

    // Не нашли — попробуем downfloat (кто угодно ниже)
    if (!found) {
      // Если ниже все уже играли — дадим BYE (или можно сделать «жёсткий своп» c последним неиспользованным)
      used.add(aId);
      pairs.push([A, null]);
    }

    i++;
  }

  // Если вдруг остался один неиспользованный — он получит BYE
  const remain = sorted.filter((p) => !used.has(p.getId));
  if (remain.length === 1) pairs.push([remain[0], null]);

  return pairs;
}

/* ========= Компонент ========= */

export function SwissView({ participants, matches, roundsCount, onSaveScore }: SwissViewProps) {
  const { user } = useUser();
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>("");
  const [saving, setSaving] = useState(false);

  // Базовая «стабильная» сортировка списка на первый раунд (если нет рейтингов)
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

  // Статы по текущим результатам
  const stats = useMemo(() => computeStats(ordered, matches), [ordered, matches]);

  // Строим пары для всех раундов, используя текущие результаты к моменту рендера
  // (если часть раундов уже сыграна — пейринг следующих будет учитывать набранные очки)
  const swissRounds = useMemo(() => {
    const rounds: Array<Array<[Participant | null, Participant | null]>> = [];
    // На каждый «будущий» раунд смотрим текущие статы — UI всегда показывает «актуальную» следующую сетку
    // (если вы хотите фиксировать пейринг прошлого — храните его отдельно в БД).
    for (let r = 0; r < Math.max(1, roundsCount); r++) {
      const pairs = swissPairRound(ordered, matches, stats);
      rounds.push(pairs);
    }
    return rounds;
  }, [ordered, matches, stats, roundsCount]);

  // Таблица (стоят по текущим статам)
  const standings = useMemo(() => {
    const rows = Array.from(stats.values()).map((s) => {
      const bh = buchholz(stats, s.id);
      const sb = sonnebornBerger(stats, s.id);
      return { ...s, buchholz: bh, sb };
    });
    rows.sort((x, y) => {
      if (y.points !== x.points) return y.points - x.points;
      if (y.buchholz !== x.buchholz) return y.buchholz - x.buchholz;
      if (y.sb !== x.sb) return y.sb - x.sb;
      if (y.setsDiff !== x.setsDiff) return y.setsDiff - x.setsDiff;
      return y.gamesDiff - x.gamesDiff;
    });
    return rows;
  }, [stats]);

  // --- редактирование счёта ---
  const pairKey = (aId: number, bId: number) => `${Math.min(aId, bId)}_${Math.max(aId, bId)}`;
  function startEdit(aId: number, bId: number, currentScore: string | null) {
    const k = pairKey(aId, bId);
    setEditingKey(k);
    setEditValue(currentScore && currentScore !== "—" ? currentScore : "");
  }
  function cancelEdit() { setEditingKey(null); setEditValue(""); }
  async function saveEdit(aId: number, bId: number) {
    if (!isValidScoreFormat(editValue)) { alert('Неверный формат счёта. Пример: "6-4, 4-6, 10-8"'); return; }
    try { setSaving(true); await onSaveScore?.(aId, bId, editValue.trim()); setEditingKey(null); setEditValue(""); }
    finally { setSaving(false); }
  }

  function MatchRow({ a, b }: { a: Participant | null; b: Participant | null }) {
    const aId = pid(a); const bId = pid(b);
    const canEdit = !!aId && !!bId;
    const score = canEdit ? getMatchScore(aId!, bId!, matches) : null;
    const k = canEdit ? pairKey(aId!, bId!) : undefined;
    const isEditing = !!k && editingKey === k;

    return (
      <tr className={`grid-row ${isEditing ? "editing-row" : ""}`}>
        <td>{a ? <NameCell p={a}/> : <span className="player muted">BYE</span>}</td>
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
              >vs</button>
            ) : (
              <div className="score-edit-wrap">
                <input
                  className="score-input"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  placeholder="6-4, 6-4"
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
        <td>{b ? <NameCell p={b}/> : <span className="player muted">BYE</span>}</td>
      </tr>
    );
  }

  return (
    <div className="roundrobin-wrap">
      {/* РАУНДЫ ШВЕЙЦАРКИ */}
      <div className="rounds-grid bracket-grid">
        {swissRounds.map((pairs, rIndex) => (
          <div key={rIndex} className="card">
            <div className="history-table-head">
              <strong>Швейцарка — Раунд {rIndex + 1}</strong>
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
                {pairs.length ? pairs.map(([a,b], i) => <MatchRow key={i} a={a} b={b}/>) :
                  <tr className="grid-row"><td colSpan={3} className="history-empty">Нет пар</td></tr>}
              </tbody>
            </table>
          </div>
        ))}
      </div>

      {/* ТАБЛИЦА УЧАСТНИКОВ */}
      <div className="card" style={{ marginTop: 16 }}>
        <div className="history-table-head"><strong>Таблица</strong></div>
        <table className="round-table">
          <thead>
            <tr className="grid-row">
              <th>#</th>
              <th>Участник</th>
              <th>Очки</th>
              <th>Бухгольц</th>
              <th>Соннеборн–Бергер</th>
              <th>Δ сет</th>
              <th>Δ гейм</th>
            </tr>
          </thead>
          <tbody>
            {standings.map((s, i) => (
              <tr key={s.id} className="grid-row">
                <td>{i + 1}</td>
                <td>
                  <span className="player">
                    {participants.find(p => p.getId === s.id)?.displayName(false) ?? s.id}
                  </span>
                </td>
                <td>{s.points}</td>
                <td>{s.buchholz}</td>
                <td>{s.sb}</td>
                <td>{s.setsDiff}</td>
                <td>{s.gamesDiff}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="hint muted" style={{ marginTop: 8 }}>
          <div>• Порядок: Очки → Бухгольц → Соннеборн–Бергер → Δ сетов → Δ геймов.</div>
          <div>• BYE считается как победа (+1 очко), соперник отсутствует.</div>
        </div>
      </div>
    </div>
  );
}