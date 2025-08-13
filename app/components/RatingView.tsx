"use client";

import { useMemo, useState, useEffect } from "react";

import { Participant } from "@/app/models/Participant";
import { Match } from "@/app/models/Match";

import "./RatingView.css";

// Берём данные из провайдера
import { useTournament } from "@/app/tournaments/[id]/TournamentProvider";

type RatingViewProps = {
  matches: Match[];
  onShowHistory?: (participant?: Participant) => void;
};

// Небольшой локальный компонент бейджа с подсказкой
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
      {/* На десктопе оставим браузерный title для ховера */}
      <span className="badge-title" title={isTouch ? undefined : tooltip}>
        {titleText}
      </span>

      {/* Кнопка показывается только на тач-устройствах */}
      {isTouch && (
        <>
          <button
            type="button"
            className="tip-btn"
            aria-label="Пояснение"
            onClick={() => setOpen((v) => !v)}
          >
            i
          </button>
          {open && (
            <div className="tip-popover" role="dialog" aria-label="Подсказка">
              <div className="tip-popover-content">{tooltip}</div>
              <button
                type="button"
                className="tip-close"
                aria-label="Закрыть"
                onClick={() => setOpen(false)}
              >
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


  // было: type LeadersRow = { title: string; winners: string[]; tooltip: string };
  // стало:
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
      bagelsByPid.set(p.id, cnt);
    }
    const maxBagels = Math.max(...bagelsByPid.values(), 0);
    const bagelWinners = maxBagels > 0 ? participants.filter((p) => (bagelsByPid.get(p.id) ?? 0) === maxBagels) : [];

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
      streakByPid.set(p.id, best);
    }
    const maxStreak = Math.max(...streakByPid.values(), 0);
    const wallWinners = maxStreak > 0 ? participants.filter((p) => (streakByPid.get(p.id) ?? 0) === maxStreak) : [];

    // 🐝 Гриндер — больше всего матчей за последние 7 дней
    const recentCountByPid = new Map<number, number>();
    for (const p of participants) {
      let cnt = 0;
      for (const m of pastMatches) {
        if (tookPart(p.getId, m)) cnt++;
      }
      recentCountByPid.set(p.id, cnt);
    }
    const maxRecent = Math.max(...recentCountByPid.values(), 0);
    const grinderWinners = maxRecent > 0 ? participants.filter((p) => (recentCountByPid.get(p.id) ?? 0) === maxRecent) : [];

    // ⚡ Удачливый нападающий — больше всего побед, играя на стороне 1 (атака)
    const successfulAttacksByPid = new Map<number, number>();
    for (const p of participants) {
      let cnt = 0;
      for (const m of pastMatches) {
        if (!tookPart(p.getId, m)) continue;
        if (isOnSide1(p.getId, m) && winnerId(m) === p.getId) cnt++;
      }
      successfulAttacksByPid.set(p.id, cnt);
    }
    const maxSuccessfulAttacks = Math.max(...successfulAttacksByPid.values(), 0);
    const luckyAttackers =
      maxSuccessfulAttacks > 0
        ? participants.filter((p) => (successfulAttacksByPid.get(p.id) ?? 0) === maxSuccessfulAttacks)
        : [];

    // 🙃 Неудачный нападающий — больше всего поражений на стороне 1
    const failedAttacksByPid = new Map<number, number>();
    for (const p of participants) {
      let cnt = 0;
      for (const m of pastMatches) {
        if (!tookPart(p.getId, m)) continue;
        const onAttack = isOnSide1(p.getId, m);
        const w = winnerId(m);
        if (onAttack && w && w !== p.getId) cnt++;
      }
      failedAttacksByPid.set(p.id, cnt);
    }
    const maxFailedAttacks = Math.max(...failedAttacksByPid.values(), 0);
    const unluckyAttackers =
      maxFailedAttacks > 0
        ? participants.filter((p) => (failedAttacksByPid.get(p.id) ?? 0) === maxFailedAttacks)
        : [];

    // 🎢 Трёхсетовый боец — больше всего матчей в 3 сета
    const threeSetMatchesByPid = new Map<number, number>();
    for (const p of participants) {
      let cnt = 0;
      for (const m of pastMatches) {
        if (!tookPart(p.getId, m)) continue;
        const setsCount = (m.scores ?? []).length;
        if (setsCount >= 3) cnt++;
      }
      threeSetMatchesByPid.set(p.id, cnt);
    }
    const maxThreeSet = Math.max(...threeSetMatchesByPid.values(), 0);
    const threeSetWarriors =
      maxThreeSet > 0
        ? participants.filter((p) => (threeSetMatchesByPid.get(p.id) ?? 0) === maxThreeSet)
        : [];

    // 🛡 Железный защитник — больше всего побед, играя на стороне 2 (защита)
    const defenseWinsByPid = new Map<number, number>();
    for (const p of participants) {
      let cnt = 0;
      for (const m of pastMatches) {
        if (!tookPart(p.getId, m)) continue;
        const onDefense = !isOnSide1(p.getId, m);
        if (onDefense && winnerId(m) === p.getId) cnt++;
      }
      defenseWinsByPid.set(p.id, cnt);
    }
    const maxDefenseWins = Math.max(...defenseWinsByPid.values(), 0);
    const ironDefenders =
      maxDefenseWins > 0
        ? participants.filter((p) => (defenseWinsByPid.get(p.id) ?? 0) === maxDefenseWins)
        : [];

    // 🪫 Неудачный защитник — больше всего поражений на стороне 2
    const defenseLossesByPid = new Map<number, number>();
    for (const p of participants) {
      let cnt = 0;
      for (const m of pastMatches) {
        if (!tookPart(p.getId, m)) continue;
        const onDefense = !isOnSide1(p.getId, m);
        const w = winnerId(m);
        if (onDefense && w && w !== p.getId) cnt++;
      }
      defenseLossesByPid.set(p.id, cnt);
    }
    const maxDefenseLosses = Math.max(...defenseLossesByPid.values(), 0);
    const unluckyDefenders =
      maxDefenseLosses > 0
        ? participants.filter((p) => (defenseLossesByPid.get(p.id) ?? 0) === maxDefenseLosses)
        : [];

    const rows: LeadersRow[] = [];
    if (bagelWinners.length)
      rows.push({
        title: "🥖 Бублик-мастер",
        winners: bagelWinners,
        tooltip: "Больше всего сетов, выигранных 6:0.",
      });
    if (wallWinners.length)
      rows.push({
        title: "🧱 Стена",
        winners: wallWinners,
        tooltip: "Самая длинная серия побед подряд.",
      });
    if (grinderWinners.length)
      rows.push({
        title: "🐝 Гриндер",
        winners: grinderWinners,
        tooltip: "Больше всего матчей за последние 7 дней.",
      });
    if (luckyAttackers.length)
      rows.push({
        title: "⚡ Удачливый нападающий",
        winners: luckyAttackers,
        tooltip:
          "Больше всего побед в роли атакующего (игрок на стороне player1/team1 и выиграл матч).",
      });
    if (unluckyAttackers.length)
      rows.push({
        title: "🙃 Неунывающий драчун",
        winners: unluckyAttackers,
        tooltip:
          "Больше всего поражений в роли атакующего (игрок на стороне player1/team1 и проиграл матч).",
      });
    if (threeSetWarriors.length)
      rows.push({
        title: "🎢 Трёхсетовый боец",
        winners: threeSetWarriors,
        tooltip: "Больше всего матчей, сыгранных в 3 сета.",
      });
    if (ironDefenders.length)
      rows.push({
        title: "🛡 Железный защитник",
        winners: ironDefenders,
        tooltip: "Больше всего побед, играя в защите (игрок на стороне player2/team2).",
      });
    if (unluckyDefenders.length)
      rows.push({
        title: "🪫 Неудачный защитник",
        winners: unluckyDefenders,
        tooltip: "Больше всего поражений, играя в защите (игрок на стороне player2/team2).",
      });

    return rows;
  }, [participants, pastMatches]);

  // ===== render =====
  if (loading) return <p>Загрузка…</p>;
  if (!tournament) return <p>Турнир не найден</p>;

  return (
    <div className="history-wrap">
      {participants.length === 0 ? (
        <p>Пока нет участников.</p>
      ) : (useMemo(() =>
        (leaders.length === 0 ? (
          <p>Пока нет лидеров — сыграйте ещё немного 😉</p>
        ) : (
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
                  <tr key={`${row.title}-${p.id}-${idx}`}>
                    <td>
                      <button
                        type="button"
                        className="player-link"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Историю показываем только для одиночных участников
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
        )), [leaders])
      )}
    </div>
  );
}