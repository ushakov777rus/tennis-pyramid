"use client";

import { useMemo, useState } from "react";
import type { KeyboardEvent } from "react";

import { Participant } from "@/app/models/Participant";
import type { Match } from "@/app/models/Match";
import { User, UserRole } from "@/app/models/Users";

import "./RatingView.css";
import { useOptionalTournament } from "@/app/tournaments/[slug]/TournamentProvider";
import { useOptionalClub } from "@/app/clubs/[slug]/ClubProvider";
import { useOptionalMatches } from "@/app/matches/MatchesProvider";
import { UserProfileModal } from "@/app/components/UserProfileModal";
import type { UserProfileStats } from "./UserProfileView";

type ParticipantStats = {
  games: number;
  wins: number;
};

type CardData = {
  id: number;
  name: string;
  games: number;
  wins: number;
  title: string;
  participant: Participant;
  hasHistory: boolean;
  rank: number;
};

const EMPTY_PARTICIPANTS: Participant[] = [];
const EMPTY_MATCHES: Match[] = [];

export function RatingView() {
  const tournamentCtx = useOptionalTournament();
  const clubCtx = useOptionalClub();
  const matchesCtx = useOptionalMatches();

  const tournament = tournamentCtx?.tournament ?? null;
  const participants = tournamentCtx?.participants ?? EMPTY_PARTICIPANTS;
  const tournamentMatches = tournamentCtx?.matches ?? EMPTY_MATCHES;
  const tournamentLoading = tournamentCtx?.loading ?? false;
  const clubMatches = clubCtx?.matches ?? EMPTY_MATCHES;

  const [profileOpen, setProfileOpen] = useState(false);
  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [profileStats, setProfileStats] = useState<UserProfileStats | undefined>();
  const [profileMatches, setProfileMatches] = useState<Match[]>([]);
  const resolvedMatches: Match[] = useMemo(() => {
    if (tournament) {
      return tournamentMatches;
    }

    if (clubCtx?.club) {
      return clubMatches;
    }

    const allMatches = matchesCtx?.matches ?? EMPTY_MATCHES;
    return allMatches.length ? allMatches : EMPTY_MATCHES;
  }, [
    tournament,
    tournamentMatches,
    clubCtx?.club,
    clubMatches,
    matchesCtx?.matches,
  ]);

  const pastMatches = useMemo(() => {
    const now = Date.now();
    return resolvedMatches.filter((match) => match?.date && match.date.getTime() <= now);
  }, [resolvedMatches]);

  const matchesInitialLoaded = matchesCtx?.initialLoaded ?? false;
  const matchesError = matchesCtx?.error ?? null;
  const matchesLoading = matchesCtx?.loading ?? false;

  const isInitialLoading = tournament
    ? tournamentLoading && !participants.length && !tournamentMatches.length
    : matchesLoading && !matchesInitialLoaded;

  const statsById = useMemo(() => {
    const map = new Map<number, ParticipantStats>();

    for (const participant of participants) {
      const id = participant.getId;
      if (!map.has(id)) {
        map.set(id, { games: 0, wins: 0 });
      }
    }

    for (const match of pastMatches) {
      const sideA = match.player1?.id ?? match.team1?.id;
      const sideB = match.player2?.id ?? match.team2?.id;

      if (sideA && map.has(sideA)) {
        map.get(sideA)!.games += 1;
      }
      if (sideB && map.has(sideB)) {
        map.get(sideB)!.games += 1;
      }

      const winner = match.getWinnerId();
      if (winner && map.has(winner)) {
        map.get(winner)!.wins += 1;
      }
    }

    return map;
  }, [participants, pastMatches]);

  const titlesById = useMemo(() => {
    const titles = new Map<number, string[]>();
    if (!participants.length || !pastMatches.length) {
      return titles;
    }

    const tookPart = (participantId: number, match: Match) => {
      const sideA = match.player1?.id ?? match.team1?.id;
      const sideB = match.player2?.id ?? match.team2?.id;
      return sideA === participantId || sideB === participantId;
    };

    const isOnSide1 = (participantId: number, match: Match) =>
      (match.player1?.id ?? match.team1?.id) === participantId;

    const winnerId = (match: Match) => match.getWinnerId();

    const pushTitle = (participant: Participant, title: string) => {
      const key = participant.getId;
      if (!titles.has(key)) {
        titles.set(key, []);
      }
      const list = titles.get(key)!;
      if (!list.includes(title)) {
        list.push(title);
      }
    };

    const registerWinners = (title: string, ids: number[]) => {
      if (!ids.length) return;
      for (const participant of participants) {
        if (ids.includes(participant.getId)) {
          pushTitle(participant, title);
        }
      }
    };

    const bagelsById = new Map<number, number>();
    for (const participant of participants) {
      let count = 0;
      for (const match of pastMatches) {
        if (!tookPart(participant.getId, match)) continue;
        const onFirstSide = isOnSide1(participant.getId, match);
        for (const [a, b] of match.scores ?? []) {
          const mine = onFirstSide ? a : b;
          const theirs = onFirstSide ? b : a;
          if (mine === 6 && theirs === 0) {
            count += 1;
          }
        }
      }
      bagelsById.set(participant.getId, count);
    }
    const bagelValues = Array.from(bagelsById.values());
    const maxBagels = bagelValues.length ? Math.max(...bagelValues) : 0;
    if (maxBagels > 0) {
      const winners = Array.from(bagelsById.entries())
        .filter(([, value]) => value === maxBagels)
        .map(([id]) => id);
      registerWinners("🥖 Бублик-мастер", winners);
    }

    const streakById = new Map<number, number>();
    for (const participant of participants) {
      const participantMatches = pastMatches
        .filter((match) => tookPart(participant.getId, match))
        .sort((a, b) => a.date.getTime() - b.date.getTime());
      let current = 0;
      let best = 0;
      for (const match of participantMatches) {
        if (winnerId(match) === participant.getId) {
          current += 1;
          if (current > best) best = current;
        } else {
          current = 0;
        }
      }
      streakById.set(participant.getId, best);
    }
    const streakValues = Array.from(streakById.values());
    const maxStreak = streakValues.length ? Math.max(...streakValues) : 0;
    if (maxStreak > 0) {
      const winners = Array.from(streakById.entries())
        .filter(([, value]) => value === maxStreak)
        .map(([id]) => id);
      registerWinners("🧱 Стена", winners);
    }

    const matchesById = new Map<number, number>();
    for (const participant of participants) {
      let count = 0;
      for (const match of pastMatches) {
        if (tookPart(participant.getId, match)) count += 1;
      }
      matchesById.set(participant.getId, count);
    }
    const matchValues = Array.from(matchesById.values());
    const maxMatches = matchValues.length ? Math.max(...matchValues) : 0;
    if (maxMatches > 0) {
      const winners = Array.from(matchesById.entries())
        .filter(([, value]) => value === maxMatches)
        .map(([id]) => id);
      registerWinners("🐝 Самый активный", winners);
    }

    const attackWinsById = new Map<number, number>();
    for (const participant of participants) {
      let count = 0;
      for (const match of pastMatches) {
        if (!tookPart(participant.getId, match)) continue;
        if (isOnSide1(participant.getId, match) && winnerId(match) === participant.getId) {
          count += 1;
        }
      }
      attackWinsById.set(participant.getId, count);
    }
    const attackValues = Array.from(attackWinsById.values());
    const maxAttack = attackValues.length ? Math.max(...attackValues) : 0;
    if (maxAttack > 0) {
      const winners = Array.from(attackWinsById.entries())
        .filter(([, value]) => value === maxAttack)
        .map(([id]) => id);
      registerWinners("⚡ Удачливый нападающий", winners);
    }

    const attackLossesById = new Map<number, number>();
    for (const participant of participants) {
      let count = 0;
      for (const match of pastMatches) {
        if (!tookPart(participant.getId, match)) continue;
        const winner = winnerId(match);
        if (isOnSide1(participant.getId, match) && winner && winner !== participant.getId) {
          count += 1;
        }
      }
      attackLossesById.set(participant.getId, count);
    }
    const attackLossValues = Array.from(attackLossesById.values());
    const maxAttackLoss = attackLossValues.length ? Math.max(...attackLossValues) : 0;
    if (maxAttackLoss > 0) {
      const winners = Array.from(attackLossesById.entries())
        .filter(([, value]) => value === maxAttackLoss)
        .map(([id]) => id);
      registerWinners("🙃 Неунывающий драчун", winners);
    }

    const longMatchById = new Map<number, number>();
    for (const participant of participants) {
      let count = 0;
      for (const match of pastMatches) {
        if (!tookPart(participant.getId, match)) continue;
        if ((match.scores ?? []).length >= 3) {
          count += 1;
        }
      }
      longMatchById.set(participant.getId, count);
    }
    const longMatchValues = Array.from(longMatchById.values());
    const maxLongMatches = longMatchValues.length ? Math.max(...longMatchValues) : 0;
    if (maxLongMatches > 0) {
      const winners = Array.from(longMatchById.entries())
        .filter(([, value]) => value === maxLongMatches)
        .map(([id]) => id);
      registerWinners("🎢 Трёхсетовый боец", winners);
    }

    const defenseWinsById = new Map<number, number>();
    for (const participant of participants) {
      let count = 0;
      for (const match of pastMatches) {
        if (!tookPart(participant.getId, match)) continue;
        const onDefense = !isOnSide1(participant.getId, match);
        if (onDefense && winnerId(match) === participant.getId) {
          count += 1;
        }
      }
      defenseWinsById.set(participant.getId, count);
    }
    const defenseWinValues = Array.from(defenseWinsById.values());
    const maxDefenseWins = defenseWinValues.length ? Math.max(...defenseWinValues) : 0;
    if (maxDefenseWins > 0) {
      const winners = Array.from(defenseWinsById.entries())
        .filter(([, value]) => value === maxDefenseWins)
        .map(([id]) => id);
      registerWinners("🛡 Железный защитник", winners);
    }

    const defenseLossById = new Map<number, number>();
    for (const participant of participants) {
      let count = 0;
      for (const match of pastMatches) {
        if (!tookPart(participant.getId, match)) continue;
        const onDefense = !isOnSide1(participant.getId, match);
        const winner = winnerId(match);
        if (onDefense && winner && winner !== participant.getId) {
          count += 1;
        }
      }
      defenseLossById.set(participant.getId, count);
    }
    const defenseLossValues = Array.from(defenseLossById.values());
    const maxDefenseLoss = defenseLossValues.length ? Math.max(...defenseLossValues) : 0;
    if (maxDefenseLoss > 0) {
      const winners = Array.from(defenseLossById.entries())
        .filter(([, value]) => value === maxDefenseLoss)
        .map(([id]) => id);
      registerWinners("🪫 Неудачный защитник", winners);
    }

    return titles;
  }, [participants, pastMatches]);

  const cardsData = useMemo(() => {
    const data: Omit<CardData, "rank">[] = [];

    for (const participant of participants) {
      const id = participant.getId;
      const stats = statsById.get(id) ?? { games: 0, wins: 0 };
      const titles = titlesById.get(id) ?? [];
      const titleText = titles.length ? titles.join(" • ") : "Без титула";

      data.push({
        id,
        name: participant.displayName(false),
        games: stats.games,
        wins: stats.wins,
        title: titleText,
        participant,
        hasHistory: Boolean(participant.player),
      });
    }

    const sorted = data.sort((a, b) => {
      if (b.wins !== a.wins) return b.wins - a.wins;
      if (b.games !== a.games) return b.games - a.games;
      return a.name.localeCompare(b.name, "ru");
    });

    return sorted.map((item, index) => ({ ...item, rank: index + 1 }));
  }, [participants, statsById, titlesById]);

  if (isInitialLoading) return <p>Загрузка…</p>;
  if (tournamentCtx && !tournament) return <p>Турнир не найден</p>;
  if (!tournament && matchesError) {
    return <p style={{ color: "#f04438" }}>{matchesError}</p>;
  }

  return (
    <div className="rating-view">
      {cardsData.length === 0 ? (
        <p>Пока нет участников.</p>
      ) : (
        <div className="card-grid rating-grid">
          {cardsData.map((card) => {
            const canOpen = Boolean(card.hasHistory && card.participant.player);

            const handleCardClick = () => {
              if (!canOpen) return;
              const player = card.participant.player;
              if (!player) return;

              const user = new User({
                id: player.id ?? 0,
                name: player.name ?? "Игрок",
                role: UserRole.Player,
                player,
              });

              const baseStats = statsById.get(card.id) ?? { games: 0, wins: 0 };
              const games = baseStats.games;
              const wins = baseStats.wins;
              const profileStatsValue: UserProfileStats = {
                wins,
                losses: Math.max(0, games - wins),
                winRate: games > 0 ? Math.round((wins / games) * 100) : 0,
                rank: card.rank,
              };

              const playerMatches = resolvedMatches
                .filter((match) => {
                  const playerId = player.id;
                  if (!playerId) return false;
                  return (
                    match.player1?.id === playerId ||
                    match.player2?.id === playerId ||
                    match.team1?.player1?.id === playerId ||
                    match.team1?.player2?.id === playerId ||
                    match.team2?.player1?.id === playerId ||
                    match.team2?.player2?.id === playerId
                  );
                })
                .sort((a, b) => b.date.getTime() - a.date.getTime());

              setProfileUser(user);
              setProfileStats(profileStatsValue);
              setProfileMatches(playerMatches);
              setProfileOpen(true);
            };

            const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
              if (!canOpen) return;
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                handleCardClick();
              }
            };

            return (
              <article
                key={card.id || card.name}
                className={`card rating-card${canOpen ? " rating-card--clickable" : ""}`}
                role={canOpen ? "button" : undefined}
                tabIndex={canOpen ? 0 : undefined}
                onClick={handleCardClick}
                onKeyDown={handleKeyDown}
                aria-disabled={canOpen ? undefined : true}
              >
                <header className="card-head rating-card__header">
                  <h3 className="card-title rating-card__name" style={{ whiteSpace: "pre-line" }}>
                    {card.name}
                  </h3>
                  <span className="rating-card__title">{card.title}</span>
                </header>

                <div className="rating-card__body">
                  <div className="card-row rating-card__row">
                    <span className="rating-card__label">Матчей</span>
                    <span className="rating-card__value">{card.games}</span>
                  </div>
                  <div className="card-row rating-card__row rating-card__row--last">
                    <span className="rating-card__label">Побед</span>
                    <span className="rating-card__value rating-card__value--wins">{card.wins}</span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <UserProfileModal
        isOpen={profileOpen}
        onClose={() => {
          setProfileOpen(false);
          setProfileUser(null);
          setProfileStats(undefined);
          setProfileMatches([]);
        }}
        user={profileUser}
        stats={profileStats}
        matches={profileMatches}
      />
    </div>
  );
}
