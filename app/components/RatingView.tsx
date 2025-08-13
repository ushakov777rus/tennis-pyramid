"use client";

import { useMemo, useState, useEffect } from "react";

import { Participant } from "@/app/models/Participant";
import { Match } from "@/app/models/Match";

import "./RatingView.css";
import { useTournament } from "@/app/tournaments/[id]/TournamentProvider";

type RatingViewProps = {
  matches: Match[];
  onShowHistory?: (participant?: Participant) => void;
};

// локальный бейдж с подсказкой (для не-круговых форматов)
function BadgeWithTip({ titleText, tooltip }: { titleText: string; tooltip: string }) {
  const [open, setOpen] = useState(false);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    const touch =
      "ontouchstart" in window ||
      (navigator as any).maxTouchPoints > 0 ||
      (navigator as any).msMaxTouchPoints > 0;
    setIsTouch(!!touch);
  }, []);

  return (
    <span className="badge-with-tip">
      <span className="badge-title" title={isTouch ? undefined : tooltip}>
        {titleText}
      </span>
      {isTouch && (
        <>
          <button type="button" className="tip-btn" aria-label="Пояснение" onClick={() => setOpen((v) => !v)}>
            i
          </button>
          {open && (
            <div className="tip-popover" role="dialog" aria-label="Подсказка">
              <div className="tip-popover-content">{tooltip}</div>
              <button type="button" className="tip-close" aria-label="Закрыть" onClick={() => setOpen(false)}>
                ×
              </button>
            </div>
          )}
        </>
      )}
    </span>
  );
}

export function RatingView({ matches, onShowHistory }: RatingViewProps) {
  const { loading, tournament, participants } = useTournament();

  // ===== helpers =====
  const now = Date.now();

  const pastMatches = useMemo(
    () => (matches ?? []).filter((m) => m?.date && m.date.getTime() <= now),
    [matches, now]
  );

  const getName = (p: Participant) =>
    p.player
      ? p.player.name
      : `${p.team?.player1?.name ?? "?"} + ${p.team?.player2?.name ?? "?"}`;

  const sideIds = (m: Match) => ({
    p1: m.player1?.id ?? m.team1?.id,
    p2: m.player2?.id ?? m.team2?.id,
  });

  const tookPart = (participantId: number, m: Match) => {
    const { p1, p2 } = sideIds(m);
    return p1 === participantId || p2 === participantId;
  };

  const isOnSide1 = (participantId: number, m: Match) =>
    (m.player1?.id ?? m.team1?.id) === participantId;

  const winnerId = (m: Match) => m.getWinnerId?.();

  /** ====== КРУГОВОЙ: игры/победы/выигранные сеты на участника ====== */
  type StatRow = { id: number; name: string; games: number; wins: number; setsWon: number };

  const roundRobinStats: StatRow[] = useMemo(() => {
    if (!participants.length || !pastMatches.length) return [];

    const byId = new Map<number, StatRow>();
    for (const p of participants) {
      byId.set(p.getId, {
        id: p.getId,
        name: getName(p),
        games: 0,
        wins: 0,
        setsWon: 0,
      });
    }

    const winnerFromScores = (sets?: [number, number][]): 1 | 2 | null => {
      if (!sets || !sets.length) return null;
      let s1 = 0;
      let s2 = 0;
      for (const [x, y] of sets) {
        if (x > y) s1++;
        else if (y > x) s2++;
      }
      if (s1 === s2) return null;
      return s1 > s2 ? 1 : 2;
    };

    for (const m of pastMatches) {
      const a = m.player1?.id ?? m.team1?.id;
      const b = m.player2?.id ?? m.team2?.id;
      if (!a || !b) continue;
      if (!byId.has(a) || !byId.has(b)) continue;

      const sa = byId.get(a)!;
      const sb = byId.get(b)!;

      // + игры
      sa.games += 1;
      sb.games += 1;

      // + победы
      const w = winnerId(m);
      if (w === a) sa.wins += 1;
      else if (w === b) sb.wins += 1;
      else {
        const who = winnerFromScores(m.scores as [number, number][]);
        if (who === 1) sa.wins += 1;
        else if (who === 2) sb.wins += 1;
      }

      // + выигранные сеты
      for (const [x, y] of (m.scores ?? []) as [number, number][]) {
        if (x > y) sa.setsWon += 1;
        else if (y > x) sb.setsWon += 1;
      }
    }

    // сортировка: по победам ↓, затем по сетам ↓, затем по матчам ↓, затем по имени
    return Array.from(byId.values()).sort((x, y) => {
      if (y.wins !== x.wins) return y.wins - x.wins;
      if (y.setsWon !== x.setsWon) return y.setsWon - x.setsWon;
      if (y.games !== x.games) return y.games - x.games;
      return x.name.localeCompare(y.name, "ru");
    });
  }, [participants, pastMatches]);

  // лидеры для подсветки
  const { maxWins, maxSetsWon } = useMemo(() => {
    let mw = 0;
    let ms = 0;
    for (const s of roundRobinStats) {
      if (s.wins > mw) mw = s.wins;
      if (s.setsWon > ms) ms = s.setsWon;
    }
    return { maxWins: mw, maxSetsWon: ms };
  }, [roundRobinStats]);

  /** ====== ТИТУЛЫ (для НЕ-круговых форматов) — оставлены как прежде ====== */
  type LeadersRow = { title: string; winners: Participant[]; tooltip: string };

  const leaders = useMemo<LeadersRow[]>(() => {
    if (!participants.length) return [];

    // 🥖 Бублик-мастер — больше всего сетов 6:0
    const bagelsByPid = new Map<number, number>();
    for (const p of participants) {
      let cnt = 0;
      for (const m of pastMatches) {
        if (!tookPart(p.getId, m)) continue;
        const on1 = isOnSide1(p.getId, m);
        for (const [a, b] of m.scores ?? []) {
          const my = on1 ? a : b;
          const opp = on1 ? b : a;
          if (my === 6 && opp === 0) cnt++;
        }
      }
      bagelsByPid.set(p.getId, cnt);
    }
    const maxBagels = Math.max(...bagelsByPid.values(), 0);
    const bagelWinners = maxBagels > 0 ? participants.filter((p) => (bagelsByPid.get(p.getId) ?? 0) === maxBagels) : [];

    // 🧱 Стена — максимальный вин-стрик
    const streakByPid = new Map<number, number>();
    for (const p of participants) {
      const ms = pastMatches
        .filter((m) => tookPart(p.getId, m))
        .sort((a, b) => a.date.getTime() - b.date.getTime());
      let cur = 0;
      let best = 0;
      for (const m of ms) {
        const w = winnerId(m);
        if (!w) continue;
        if (w === p.getId) best = Math.max(best, ++cur);
        else cur = 0;
      }
      streakByPid.set(p.getId, best);
    }
    const maxStreak = Math.max(...streakByPid.values(), 0);
    const wallWinners = maxStreak > 0 ? participants.filter((p) => (streakByPid.get(p.getId) ?? 0) === maxStreak) : [];

    // 🐝 Гриндер — больше всего матчей за последние 7 дней (как в исходнике: фактически все прошедшие матчи)
    const recentCountByPid = new Map<number, number>();
    for (const p of participants) {
      let cnt = 0;
      for (const m of pastMatches) {
        if (tookPart(p.getId, m)) cnt++;
      }
      recentCountByPid.set(p.getId, cnt);
    }
    const maxRecent = Math.max(...recentCountByPid.values(), 0);
    const grinderWinners = maxRecent > 0 ? participants.filter((p) => (recentCountByPid.get(p.getId) ?? 0) === maxRecent) : [];

    // ⚡ Удачливый нападающий — победы на стороне 1
    const successfulAttacksByPid = new Map<number, number>();
    for (const p of participants) {
      let cnt = 0;
      for (const m of pastMatches) {
        if (!tookPart(p.getId, m)) continue;
        if (isOnSide1(p.getId, m) && winnerId(m) === p.getId) cnt++;
      }
      successfulAttacksByPid.set(p.getId, cnt);
    }
    const maxSuccessfulAttacks = Math.max(...successfulAttacksByPid.values(), 0);
    const luckyAttackers =
      maxSuccessfulAttacks > 0
        ? participants.filter((p) => (successfulAttacksByPid.get(p.getId) ?? 0) === maxSuccessfulAttacks)
        : [];

    // 🙃 Неудачный нападающий — поражения на стороне 1
    const failedAttacksByPid = new Map<number, number>();
    for (const p of participants) {
      let cnt = 0;
      for (const m of pastMatches) {
        if (!tookPart(p.getId, m)) continue;
        const onAttack = isOnSide1(p.getId, m);
        const w = winnerId(m);
        if (onAttack && w && w !== p.getId) cnt++;
      }
      failedAttacksByPid.set(p.getId, cnt);
    }
    const maxFailedAttacks = Math.max(...failedAttacksByPid.values(), 0);
    const unluckyAttackers =
      maxFailedAttacks > 0
        ? participants.filter((p) => (failedAttacksByPid.get(p.getId) ?? 0) === maxFailedAttacks)
        : [];

    // 🎢 Трёхсетовый боец — матчи в 3+ сета
    const threeSetMatchesByPid = new Map<number, number>();
    for (const p of participants) {
      let cnt = 0;
      for (const m of pastMatches) {
        if (!tookPart(p.getId, m)) continue;
        const setsCount = (m.scores ?? []).length;
        if (setsCount >= 3) cnt++;
      }
      threeSetMatchesByPid.set(p.getId, cnt);
    }
    const maxThreeSet = Math.max(...threeSetMatchesByPid.values(), 0);
    const threeSetWarriors =
      maxThreeSet > 0
        ? participants.filter((p) => (threeSetMatchesByPid.get(p.getId) ?? 0) === maxThreeSet)
        : [];

    // 🛡 Железный защитник — победы на стороне 2
    const defenseWinsByPid = new Map<number, number>();
    for (const p of participants) {
      let cnt = 0;
      for (const m of pastMatches) {
        if (!tookPart(p.getId, m)) continue;
        const onDefense = !isOnSide1(p.getId, m);
        if (onDefense && winnerId(m) === p.getId) cnt++;
      }
      defenseWinsByPid.set(p.getId, cnt);
    }
    const maxDefenseWins = Math.max(...defenseWinsByPid.values(), 0);
    const ironDefenders =
      maxDefenseWins > 0
        ? participants.filter((p) => (defenseWinsByPid.get(p.getId) ?? 0) === maxDefenseWins)
        : [];

    // 🪫 Неудачный защитник — поражения на стороне 2
    const defenseLossesByPid = new Map<number, number>();
    for (const p of participants) {
      let cnt = 0;
      for (const m of pastMatches) {
        if (!tookPart(p.getId, m)) continue;
        const onDefense = !isOnSide1(p.getId, m);
        const w = winnerId(m);
        if (onDefense && w && w !== p.getId) cnt++;
      }
      defenseLossesByPid.set(p.getId, cnt);
    }
    const maxDefenseLosses = Math.max(...defenseLossesByPid.values(), 0);
    const unluckyDefenders =
      maxDefenseLosses > 0
        ? participants.filter((p) => (defenseLossesByPid.get(p.getId) ?? 0) === maxDefenseLosses)
        : [];

    const rows: LeadersRow[] = [];
    if (bagelWinners.length)
      rows.push({ title: "🥖 Бублик-мастер", winners: bagelWinners, tooltip: "Больше всего сетов, выигранных 6:0." });
    if (wallWinners.length)
      rows.push({ title: "🧱 Стена", winners: wallWinners, tooltip: "Самая длинная серия побед подряд." });
    if (grinderWinners.length)
      rows.push({ title: "🐝 Гриндер", winners: grinderWinners, tooltip: "Больше всего матчей за последние 7 дней." });
    if (luckyAttackers.length)
      rows.push({
        title: "⚡ Удачливый нападающий",
        winners: luckyAttackers,
        tooltip: "Больше всего побед в роли атакующего (сторона player1/team1).",
      });
    if (unluckyAttackers.length)
      rows.push({
        title: "🙃 Неунывающий драчун",
        winners: unluckyAttackers,
        tooltip: "Больше всего поражений в роли атакующего (сторона player1/team1).",
      });
    if (threeSetWarriors.length)
      rows.push({ title: "🎢 Трёхсетовый боец", winners: threeSetWarriors, tooltip: "Больше всего матчей в 3 сета." });
    if (ironDefenders.length)
      rows.push({
        title: "🛡 Железный защитник",
        winners: ironDefenders,
        tooltip: "Больше всего побед, играя в защите (сторона player2/team2).",
      });
    if (unluckyDefenders.length)
      rows.push({
        title: "🪫 Неудачный защитник",
        winners: unluckyDefenders,
        tooltip: "Больше всего поражений, играя в защите (сторона player2/team2).",
      });

    return rows;
  }, [participants, pastMatches]);

  // ====== таблицы ======

  const roundRobinTable = useMemo(() => {
    if (!roundRobinStats.length) return <p>Пока нет сыгранных матчей.</p>;
    return (
      <table className="history-table">
        <thead className="history-table-head">
          <tr>
            <th style={{ textAlign: "left" }}>Игрок / Пара</th>
            <th style={{ textAlign: "right" }}>Матчей</th>
            <th style={{ textAlign: "right" }}>Побед</th>
            <th style={{ textAlign: "right" }}>Сеты+</th>
          </tr>
        </thead>
        <tbody>
          {roundRobinStats.map((s) => {
            const isLeaderWins = s.wins === maxWins && maxWins > 0;
            const isLeaderSets = s.setsWon === maxSetsWon && maxSetsWon > 0;
            const badges =
              (isLeaderWins ? "🏆 по победам" : "") +
              (isLeaderWins && isLeaderSets ? " • " : "") +
              (isLeaderSets ? "🎾 по сетам" : "");

            return (
              <tr
                key={s.id}
                className={[
                  isLeaderWins ? "leader-wins" : "",
                  isLeaderSets ? "leader-sets" : "",
                ].join(" ").trim()}
                title={badges || undefined}
              >
                <td>
                  <span className="chip" title={`ID: ${s.id}`}>{s.name}</span>
                  {badges && (
                    <span className="tournament-badge" style={{ marginLeft: 8 }}>
                      {badges}
                    </span>
                  )}
                </td>
                <td style={{ textAlign: "right" }}>{s.games}</td>
                <td style={{ textAlign: "right", fontWeight: isLeaderWins ? 700 : 600 }}>{s.wins}</td>
                <td style={{ textAlign: "right", fontWeight: isLeaderSets ? 700 : 600 }}>{s.setsWon}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  }, [roundRobinStats, maxWins, maxSetsWon]);

  const leadersTable = useMemo(() => {
    if (leaders.length === 0) {
      return <p>Пока нет лидеров — сыграйте ещё немного 😉</p>;
    }
    return (
      <table className="history-table">
        <thead className="history-table-head">
          <tr>
            <th>Игрок(и)</th>
            <th>Титул</th>
          </tr>
        </thead>
        <tbody>
          {leaders.map((row, idx) =>
            row.winners.map((p) => (
              <tr key={`${row.title}-${p.getId}-${idx}`}>
                <td>
                  <button
                    type="button"
                    className="player-link"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (p.player) onShowHistory?.(p);
                    }}
                    disabled={!p.player}
                    aria-label={
                      p.player
                        ? `Показать историю матчей: ${getName(p)}`
                        : `${getName(p)} — история доступна только для одиночных игроков`
                    }
                    title={
                      p.player
                        ? "История матчей"
                        : "История доступна только для одиночных игроков"
                    }
                  >
                    {getName(p)}
                  </button>
                </td>
                <td>
                  <BadgeWithTip titleText={row.title} tooltip={row.tooltip} />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    );
  }, [leaders, onShowHistory]);

  // ===== render =====
  if (loading) return <p>Загрузка…</p>;
  if (!tournament) return <p>Турнир не найден</p>;

  const isRoundRobin = tournament.format === "round_robin";

  return (
    <div className="history-wrap">
      {participants.length === 0 ? (
        <p>Пока нет участников.</p>
      ) : isRoundRobin ? (
        roundRobinTable
      ) : (
        leadersTable
      )}
    </div>
  );
}