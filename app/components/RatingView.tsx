"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";

import { PlayersRepository } from "@/app/repositories/PlayersRepository";
import { TournamentsRepository } from "@/app/repositories/TournamentsRepository";
import { TeamsRepository } from "@/app/repositories/TeamsRepository";

import { Participant } from "@/app/models/Participant";
import { Tournament } from "@/app/models/Tournament";
import { Team } from "@/app/models/Team";
import { Match } from "@/app/models/Match";

type RatingViewProps = { matches: Match[] };

export function RatingView({ matches }: RatingViewProps) {
  const params = useParams<{ id: string }>();
  const tournamentId = Number(params?.id);

  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadData() {
    setLoading(true);
    const [t, tournamentParticipants, allTeams] = await Promise.all([
      TournamentsRepository.getTournamentById(tournamentId),
      TournamentsRepository.loadParticipants(tournamentId),
      TeamsRepository.loadAll(),
    ]);
    setTournament(t);
    setParticipants(tournamentParticipants);
    setTeams(allTeams);
    setLoading(false);
  }

  useEffect(() => {
    if (tournamentId) loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tournamentId]);

  // ===== helpers =====
  const now = Date.now();
  const weekAgo = now - 7 * 24 * 60 * 60 * 1000;

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

  const opponentOf = (participantId: number, m: Match): number | undefined => {
    const { p1, p2 } = sideIds(m);
    if (p1 === participantId) return p2;
    if (p2 === participantId) return p1;
    return undefined;
  };

  const winnerId = (m: Match) => m.getWinnerId?.();

  const pastMatches = (matches ?? []).filter(
    (m) => m?.date && m.date.getTime() <= now
  );

  // ===== лидеры по номинациям =====
  type LeadersRow = { title: string; winners: string[]; tooltip: string };

  const leaders = useMemo<LeadersRow[]>(() => {
    if (!participants.length) return [];

    const levelByPid = new Map<number, number | undefined>();
    for (const p of participants) levelByPid.set(p.id, p.level ?? undefined);

    // 🥖 Бублик-мастер
    const bagelsByPid = new Map<number, number>();
    for (const p of participants) {
      let cnt = 0;
      for (const m of pastMatches) {
        if (!tookPart(p.getId, m)) continue;
        const on1 = isOnSide1(p.getId, m);
        for (const [a, b] of m.scores ?? []) {
          const my = on1 ? a : b;
          const opp = on1 ? b : a;
          if (my === 6 && opp === 0) {
            cnt++;
          }
        }
      }
      bagelsByPid.set(p.id, cnt);
    }

    const maxBagels = Math.max(...bagelsByPid.values(), 0);
    console.log("maxBagels:", maxBagels,bagelsByPid);
    const bagelWinners =
      maxBagels > 0
        ? participants
            .filter((p) => (bagelsByPid.get(p.id) ?? 0) === maxBagels)
            .map(getName)
        : [];

    // 🧱 Стена — вин-стрик
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
    const wallWinners =
      maxStreak > 0
        ? participants
            .filter((p) => (streakByPid.get(p.id) ?? 0) === maxStreak)
            .map(getName)
        : [];

    // 🐝 Гриндер — матчи за 7 дней
    const recentCountByPid = new Map<number, number>();
    for (const p of participants) {
      let cnt = 0;
      for (const m of pastMatches) {
        
        if (tookPart(p.getId, m)) cnt++;
      }
      recentCountByPid.set(p.id, cnt);
    }
    const maxRecent = Math.max(...recentCountByPid.values(), 0);
    const grinderWinners =
      maxRecent > 0
        ? participants
            .filter((p) => (recentCountByPid.get(p.id) ?? 0) === maxRecent)
            .map(getName)
        : [];

    console.log("recentCountByPid:", recentCountByPid);

    // 👑 Гигант-киллер
    const upsetsByPid = new Map<number, number>();
    for (const p of participants) {
      let cnt = 0;
      const myLevel = levelByPid.get(p.id);
      if (myLevel == null) {
        upsetsByPid.set(p.id, 0);
        continue;
      }
      for (const m of pastMatches) {
        if (!tookPart(p.getId, m)) continue;
        if (winnerId(m) !== p.getId) continue;
        const oppId = opponentOf(p.getId, m);
        if (!oppId) continue;
        const oppLevel = levelByPid.get(oppId);
        if (oppLevel == null) continue;
        if (oppLevel < myLevel) cnt++;
      }
      upsetsByPid.set(p.id, cnt);
    }
    const maxUpsets = Math.max(...upsetsByPid.values(), 0);
    const giantKillers =
      maxUpsets > 0
        ? participants
            .filter((p) => (upsetsByPid.get(p.id) ?? 0) === maxUpsets)
            .map(getName)
        : [];

    // 💔 Король тай-брейков
    const tbWinsByPid = new Map<number, number>();
    const tbTotalByPid = new Map<number, number>();
    for (const p of participants) {
      let wins = 0,
        tot = 0;
      for (const m of pastMatches) {
        if (!tookPart(p.getId, m)) continue;
        const on1 = isOnSide1(p.getId, m);
        for (const [a, b] of m.scores ?? []) {
          const isTB = (a === 7 && b === 6) || (a === 6 && b === 7);
          if (!isTB) continue;
          tot++;
          const my = on1 ? a : b;
          const opp = on1 ? b : a;
          if (my === 7 && opp === 6) wins++;
        }
      }
      tbWinsByPid.set(p.id, wins);
      tbTotalByPid.set(p.id, tot);
    }
    const tbCandidates = participants
      .filter((p) => (tbTotalByPid.get(p.id) ?? 0) >= 3)
      .map((p) => ({
        pid: p.id,
        rate:
          (tbWinsByPid.get(p.id) ?? 0) /
          Math.max(1, tbTotalByPid.get(p.id) ?? 1),
        wins: tbWinsByPid.get(p.id) ?? 0,
      }));
    const bestRate =
      tbCandidates.length > 0
        ? Math.max(...tbCandidates.map((c) => c.rate))
        : 0;
    const tbKings = tbCandidates
      .filter((c) => Math.abs(c.rate - bestRate) < 1e-9)
      .sort((a, b) => b.wins - a.wins)
      .map((c) => getName(participants.find((p) => p.id === c.pid)!));

    // 🔋 Железный
    const ironByPid = new Map<
      number,
      { avgLostPerSet: number; sets: number; matches: number }
    >();
    for (const p of participants) {
      let lostGames = 0;
      let sets = 0;
      let matches = 0;
      for (const m of pastMatches) {
        if (!tookPart(p.getId, m)) continue;
        matches++;
        const on1 = isOnSide1(p.getId, m);
        for (const [a, b] of m.scores ?? []) {
          const my = on1 ? a : b;
          const opp = on1 ? b : a;
          lostGames += opp;
          sets++;
        }
      }
      if (matches >= 5 && sets > 0) {
        ironByPid.set(p.id, {
          avgLostPerSet: lostGames / sets,
          sets,
          matches,
        });
      }
    }
    const ironCandidates = Array.from(ironByPid.entries()).map(
      ([pid, v]) => ({ pid, ...v })
    );
    const bestIron =
      ironCandidates.length > 0
        ? Math.min(...ironCandidates.map((c) => c.avgLostPerSet))
        : Infinity;
    const ironWinners =
      bestIron !== Infinity
        ? ironCandidates
            .filter((c) => Math.abs(c.avgLostPerSet - bestIron) < 1e-9)
            .sort((a, b) => b.sets - a.sets)
            .map((c) => getName(participants.find((p) => p.id === c.pid)!))
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
        tooltip: "Больше всего матчей за турнир.",
      });
    if (giantKillers.length)
      rows.push({
        title: "👑 Гигант-киллер",
        winners: giantKillers,
        tooltip:
          "Больше всего побед над соперниками выше по пирамиде (меньший уровень).",
      });
    if (tbKings.length)
      rows.push({
        title: "💔 Король тай-брейков",
        winners: tbKings,
        tooltip:
          "Лучший процент побед в сетах 7:6 / 6:7 при минимум 3 тай-брейках.",
      });
    if (ironWinners.length)
      rows.push({
        title: "🔋 Железный",
        winners: ironWinners,
        tooltip:
          "Минимум средних потерянных геймов за сет (учитываются все сеты, минимум 5 матчей).",
      });

    return rows;
  }, [participants, pastMatches, weekAgo]);

  // ===== render =====
  if (loading) return <p>Загрузка…</p>;
  if (!tournament) return <p>Турнир не найден</p>;

  return (
    <div className="history-wrap">
      <h3>🏆 Доска почёта турнира</h3>
      {leaders.length === 0 ? (
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
              row.winners.map((name) => (
                <tr key={`${idx}-${name}`}>
                  <td>{name}</td>
                  <td>
                    <span
                      className="badge-with-tip"
                      title={row.tooltip}
                    >
                      {row.title}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}