"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { Participant } from "@/app/models/Participant";
import { Match, PhaseType } from "@/app/models/Match";

import { SaveIconButton, CancelIconButton } from "@/app/components/controls/IconButtons";
import { ScoreKeyboard, useScoreKeyboardAvailable } from "@/app/components/controls/ScoreKeyboard";
import { useFirstHelpTooltip } from "@/app/hooks/useFirstHelpTooltip";
// NEW import
import { ScoreCell } from "./ScoreCell";


/* Сетка групп рисуется компонентом матрицы */
import { GroupStageTable } from "./GroupStageTable";
/* ⬇️ Новый импорт вынесенного блока плей-офф */
import { PlayoffStageTable } from "./PlayoffStageTable";

import "./PyramidView.css";
import "./RoundRobinTable.css";
import "./EliminationBracket.css";
import "@/app/components/ParticipantsView.css";

/* ========================= TYPES, HELPERS — без изменений ========================= */

type MatchPhaseFilter = {
  phase?: PhaseType;
  groupIndex?: number | null;
  roundIndex?: number | null;
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

function isValidParticipant(p: Participant | null | undefined): p is Participant {
  return !!p && (!!p.player || !!p.team);
}

function nextPow2(n: number) { let p = 1; while (p < n) p <<= 1; return p; }

function matchPhaseOk(m: Match, f?: MatchPhaseFilter): boolean {
  if (!f) return true;
  if (f.phase && (m as any).phase !== f.phase) return false;
  if (f.phase === PhaseType.Group && f.groupIndex != null && (m as any).groupIndex !== f.groupIndex) return false;
  if (f.phase === PhaseType.Playoff && f.roundIndex != null && (m as any).roundIndex !== f.roundIndex) return false;
  return true;
}
function findMatchBetween(aId: number, bId: number, matches: Match[], filter?: MatchPhaseFilter): Match | undefined {
  return matches.find((m) => {
    const id1 = m.player1?.id ?? m.team1?.id ?? 0;
    const id2 = m.player2?.id ?? m.team2?.id ?? 0;
    if (!((id1 === aId && id2 === bId) || (id1 === bId && id2 === aId))) return false;
    return matchPhaseOk(m, filter);
  });
}
function stringifyScore(m: Match): string | null {
  if (m.scores && m.scores.length > 0) {
    return m.scores.map(([s1, s2]) => `${s1}:${s2}`).join(", ");
  }
  return null;
}
function getMatchScore(aId: number, bId: number, matches: Match[], filter?: MatchPhaseFilter): string | null {
  const match = findMatchBetween(aId, bId, matches, filter);
  return match ? stringifyScore(match) : null;
}
function isValidScoreFormat(s: string) {
  const trimmed = s.trim();
  if (!trimmed) return false;
  const setRe = /^\s*\d+\s*[:-]\s*\d+\s*$/;
  return trimmed.split(",").every((part) => setRe.test(part.trim()));
}
function distributeIntoGroups(items: Participant[], groupsCount: number, mode: "simple" | "snake"): Participant[][] {
  const groups: Participant[][] = Array.from({ length: groupsCount }, () => []);
  if (mode === "simple") {
    items.forEach((p, i) => groups[i % groupsCount].push(p));
  } else {
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
type GroupStats = { id: number; name: string; wins: number; setsDiff: number; gamesDiff: number; };
function computeGroupStats(group: Participant[], matches: Match[]): GroupStats[] {
  const map = new Map<number, GroupStats>();
  
  for (const p of group) 
    map.set(p.getId, { id: p.getId, name: p.displayName(), wins: 0, setsDiff: 0, gamesDiff: 0 });

  for (let i = 0; i < group.length; i++) {
    for (let j = i + 1; j < group.length; j++) {
      const a = group[i], b = group[j];
      const aId = a.getId, bId = b.getId;
      const m = findMatchBetween(aId, bId, matches);
      if (!m || !m.scores || m.scores.length === 0) continue;

      let aSets = 0, bSets = 0, aGames = 0, bGames = 0;
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
function isCompletedMatch(m?: Match | undefined): boolean { return !!(m && m.scores && m.scores.length > 0); }
function countCompletedPairsInGroup(group: Participant[], matches: Match[]): number {
  let done = 0;
  for (let i = 0; i < group.length; i++) {
    for (let j = i + 1; j < group.length; j++) {
      const aId = group[i].getId, bId = group[j].getId;
      if (isCompletedMatch(findMatchBetween(aId, bId, matches))) done++;
    }
  }
  return done;
}
function isGroupStarted(group: Participant[], matches: Match[]): boolean {
  return countCompletedPairsInGroup(group, matches) > 0;
}
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
    if (!isGroupStarted(group, matchesPerGroup[gi])) { out.push(null); return; }
    const slot = stats[place]; if (!slot) { out.push(null); return; }
    out.push(group.find(pp => pp.getId === slot.id) ?? null);
  }

  for (const gi of order) pick(gi, 0);
  if (topK >= 2) for (const gi of [...order].reverse()) pick(gi, 1);
  for (let place = 3; place <= topK; place++) {
    const wave = place % 2 === 1 ? order : [...order].reverse();
    for (const gi of wave) pick(gi, place - 1);
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
function pairWinnerId(
  a: Participant | null,
  b: Participant | null,
  matches: Match[],
  filter?: { phase?: PhaseType; groupIndex?: number | null; roundIndex?: number | null }
): number | null {
  const aId = a?.getId; 
  const bId = b?.getId;
  
  if (aId && !bId) return aId;
  if (!aId && bId) return bId;
  if (!aId || !bId) return null;
  const m = findMatchBetween(aId, bId, matches, filter);
  if (!m) return null;
  const w = m.getWinnerId?.();
  return w && w > 0 ? w : null;
}

/* ============================== MAIN COMPONENT ============================== */

export function GroupPlusPlayoffView({
  participants,
  matches,
  onSaveScore,
  groupsCount = 2,
  advancePerGroup = 2,
  seeding = "snake",
}: GroupPlusPlayoffViewProps) {
  // состояния для (опционального) редактирования плей-офф
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const editingInputRef = useRef<HTMLInputElement | HTMLDivElement | null>(null);
  const mobileKeyboardAvailable = useScoreKeyboardAvailable();
  const [mobileKeyboardContext, setMobileKeyboardContext] = useState<{
    aId: number;
    bId: number;
    phaseFilter?: { phase?: PhaseType; groupIndex?: number | null; roundIndex?: number | null };
  } | null>(null);
  const firstHelpTooltip = useFirstHelpTooltip();

  const pairKey = useCallback((aId: number, bId: number) => `${Math.min(aId, bId)}_${Math.max(aId, bId)}`, []);
  const startEdit = useCallback((aId: number, bId: number, currentScore: string | null) => {
    const k = pairKey(aId, bId);
    setEditingKey(k);
    setEditValue(currentScore && currentScore !== "—" ? currentScore : "");
    editingInputRef.current = null;
  }, [pairKey, editingInputRef]);
  const cancelEdit = useCallback(() => {
    setEditingKey(null);
    setEditValue("");
    editingInputRef.current = null;
    setMobileKeyboardContext(null);
  }, [editingInputRef]);
  const saveEdit = useCallback(async (aId: number, bId: number, phaseFilter?: { phase?: PhaseType; groupIndex?: number | null; roundIndex?: number | null }, raw?: string) => {
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
        ? { phase: phaseFilter.phase!, groupIndex: phaseFilter.groupIndex ?? null, roundIndex: phaseFilter.roundIndex ?? null }
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

  // Адаптер для PlayoffBlock: сохраняем прежний контракт (a, b, phaseFilter),
// но внутрь прокидываем все нужные зависимости MatchCellBase.
const PlayoffMatchCell: React.FC<{
  a: Participant | null;
  b: Participant | null;
  phaseFilter?: { phase?: PhaseType; groupIndex?: number | null; roundIndex?: number | null };
}> = ({ a, b, phaseFilter }) => (
  <ScoreCell
    a={a}
    b={b}
    phaseFilter={phaseFilter}
    // helpers/state
    getMatchScore={(aId, bId, f) => getMatchScore(aId, bId, matches, f)}
    pairKey={pairKey}
    editingKey={editingKey}
    editValue={editValue}
    setEditValue={setEditValue}
    saving={saving}
    inputRef={editingInputRef}
    mobileKeyboardAvailable={mobileKeyboardAvailable}
    onStartEdit={(aId, bId, currentScore, f) => {
      startEdit(aId, bId, currentScore);
      if (mobileKeyboardAvailable) {
        setMobileKeyboardContext({ aId, bId, phaseFilter: f });
      }
    }}
    onSave={(aId, bId, f) => saveEdit(aId, bId, f)}
    onCancel={cancelEdit}
  />
);


  const ordered = useMemo(
    () => participants.filter(isValidParticipant).slice().sort((a, b) => a.displayName(false).localeCompare(b.displayName(false), "ru")),
    [participants]
  );
  const groups = useMemo(() => distributeIntoGroups(ordered, Math.max(1, groupsCount), seeding), [ordered, groupsCount, seeding]);
  const groupMatches: Match[][] = useMemo(
    () => groups.map((_, gi) => matches.filter(m => (m as any).phase === PhaseType.Group && (m as any).groupIndex === gi)),
    [groups, matches]
  );
  const groupStats = useMemo(() => groups.map((g, gi) => computeGroupStats(g, groupMatches[gi])), [groups, groupMatches]);
  const qualifiers = useMemo(
    () => makePlayoffQualifiersFromFiltered(groups, groupStats, advancePerGroup, groupMatches),
    [groups, groupStats, advancePerGroup, groupMatches]
  );
  const playoffRounds = useMemo(() => buildSingleElimPairs(qualifiers), [qualifiers]);

  const resolvedPlayoff = useMemo(() => {
    const copy = playoffRounds.map(r => r.map(([a, b]) => [a, b] as [Participant | null, Participant | null]));
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

  /** Разложение сетов по строкам для таблицы матча плей-офф */
  function getOrientedSetsFor(
    a: Participant | null,
    b: Participant | null,
    phaseFilter: { phase?: PhaseType; groupIndex?: number | null; roundIndex?: number | null }
  ) {
    const aId = a?.getId;
    const bId = b?.getId;
    if (!aId || !bId) return null;

    const m = findMatchBetween(aId, bId, matches, phaseFilter);
    if (!m || !m.scores || m.scores.length === 0) return null;

    const id1 = m.player1?.id ?? m.team1?.id;
    const aFirst = id1 === aId;
    const s1 = m.scores[0], s2 = m.scores[1], s3 = m.scores[2];

    const val = (s?: [number, number], first?: boolean) => (s ? (first ? s[0] : s[1]) : null);

    return {
      aRow: [val(s1, aFirst), val(s2, aFirst), val(s3, aFirst)],
      bRow: [val(s1, !aFirst), val(s2, !aFirst), val(s3, !aFirst)],
    };
  }

  /** Заголовок раунда плей-офф */
  const roundLabel = useCallback((roundIndex: number, pairsCount: number) => {
    if (pairsCount === 0) return `Раунд ${roundIndex + 1}`;
    const isLast = roundIndex === resolvedPlayoff.length - 1;
    if (pairsCount === 1) return "Финал";
    return `1/${pairsCount}`;
  }, [resolvedPlayoff]);

  /** Маленький редактор ячейки (тот же, что был): бейдж/кнопка vs/инпут */
  const MatchCell = useCallback(({
    a, b, phaseFilter
  }: {
    a: Participant | null;
    b: Participant | null;
    phaseFilter?: { phase?: PhaseType; groupIndex?: number | null; roundIndex?: number | null };
  }) => {
    const aId = a?.getId;
    const bId = b?.getId;
    const canEdit = !!aId && !!bId;
    const score = canEdit ? getMatchScore(aId!, bId!, matches, phaseFilter) : null;
    const k = canEdit ? pairKey(aId!, bId!) : undefined;
    const isEditing = !!k && editingKey === k;
    const shouldShowHelpTooltip = canEdit && !score && !isEditing;

    return (
      <div className="score-cell">
        {canEdit ? (
          score ? (
            <span className="badge">{score}</span>
          ) : !isEditing ? (
            <div className="score-cell__button-wrap">
              {shouldShowHelpTooltip && <div className="help-tooltip">Введите счёт</div>}
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
                ref={(node) => { editingInputRef.current = node; }}
                placeholder="6-4, 4-6, 10-8"
                pattern="[0-9\\s,:-]*"
                autoFocus={!mobileKeyboardAvailable}
                onFocus={(e) => { if (mobileKeyboardAvailable) e.currentTarget.blur(); }}
                onKeyDown={(e) => {
                  if (!mobileKeyboardAvailable) {
                    if (e.key === "Enter") { e.preventDefault(); saveEdit(aId!, bId!, phaseFilter); }
                    if (e.key === "Escape") { e.preventDefault(); cancelEdit(); }
                  }
                }}
                onChange={(e) => { if (!mobileKeyboardAvailable) setEditValue(e.target.value); }}
              />
              {!mobileKeyboardAvailable && (
                <>
                  <SaveIconButton className="lg" title="Сохранить счёт" onClick={() => saveEdit(aId!, bId!, phaseFilter)} disabled={saving} />
                  <CancelIconButton className="lg" title="Отмена" onClick={cancelEdit} disabled={saving} />
                </>
              )}
            </div>
          )
        ) : (
          <span className="vs vs-placeholder" aria-hidden>vs</span>
        )}
      </div>
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

  /* ---------------------------------- UI ---------------------------------- */

  function GroupBlock({ gIndex, group }: { gIndex: number; group: Participant[] }) {
    const matchesForGroup = groupMatches[gIndex];
    return (
      <div className={`${editingKey ? "card--no-transition" : ""}`.trim()}>
        <div className="history-table-head">
          <strong>Группа {String.fromCharCode(65 + gIndex)}</strong>
        </div>

        <GroupStageTable
          participants={group}
          matches={matchesForGroup}
          onSaveScore={(aId, bId, score) =>
            onSaveScore?.(aId, bId, score, { phase: PhaseType.Group, groupIndex: gIndex, roundIndex: null })
          }
        />
      </div>
    );
  }

  return (
    <div className="roundrobin-wrap">
      {/* ГРУППЫ */}
      <div className="rounds-grid">
        {groups.map((g, gi) => (
          <GroupBlock key={gi} gIndex={gi} group={g} />
        ))}
      </div>

      {/* ПЛЕЙ-ОФФ */}
      <div style={{ marginTop: 16 }}>
        <PlayoffStageTable
          resolvedPlayoff={resolvedPlayoff}
          matches={matches}
          roundLabel={roundLabel}
          pairWinnerId={pairWinnerId}
          getOrientedSetsFor={getOrientedSetsFor}
          MatchCell={PlayoffMatchCell}
        />
      </div>

      {/* Мобильная клавиатура — оставлена для совместимости */}
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
