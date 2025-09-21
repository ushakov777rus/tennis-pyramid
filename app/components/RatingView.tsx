"use client";

import { useMemo, useState } from "react";
import type { KeyboardEvent } from "react";

import { Participant } from "@/app/models/Participant";
import type { Match } from "@/app/models/Match";
import type { Player } from "@/app/models/Player";
import { User, UserRole } from "@/app/models/Users";

import "./RatingView.css";
import { useOptionalTournament } from "@/app/tournaments/[slug]/TournamentProvider";
import { useOptionalClub } from "@/app/clubs/[slug]/ClubProvider";
import { useOptionalMatches } from "@/app/matches/MatchesProvider";
import { UserProfileModal } from "@/app/components/UserProfileModal";
import { PlayerCard } from "@/app/components/players/PlayerCard";
import type { UserProfileStats } from "./UserProfileView";
import { calculateParticipantTitles } from "./rating/calculateParticipantTitles";

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

  const titlesById = useMemo(
    () =>
      calculateParticipantTitles({
        participants,
        matches: pastMatches,
        tournament,
      }),
    [participants, pastMatches, tournament]
  );

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
        hasHistory: Boolean(participant.player || participant.team),
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
    <div className="page-content-container">
      {cardsData.length === 0 ? (
        <p>Пока нет участников.</p>
      ) : (
        <div className="card-grid-one-column">
          {cardsData.map((card) => {
            const players = card.participant.player
              ? [card.participant.player]
              : [card.participant.team?.player1, card.participant.team?.player2].filter(
                  (p): p is Player => Boolean(p)
                );

            if (!players.length) return null;

            const isTeam = players.length > 1;
            const primaryPlayer = players[0];

            const matchesCount = card.games;
            const wins = card.wins;
            const winrateValue = matchesCount > 0 ? (wins / matchesCount) * 100 : 0;
            const canOpen = card.hasHistory && !isTeam;

            const handleCardClick = () => {
              if (!canOpen) return;

              const user = new User({
                id: primaryPlayer.id ?? 0,
                name: primaryPlayer.name ?? "Игрок",
                role: UserRole.Player,
                player: primaryPlayer,
              });

              const profileStatsValue: UserProfileStats = {
                wins,
                losses: Math.max(0, matchesCount - wins),
                winRate: Math.round(winrateValue),
                rank: card.rank,
              };

              const playerMatches = resolvedMatches
                .filter((match) => {
                  const playerId = primaryPlayer.id;
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
              <div
                key={card.id || card.name}
                className="rating-card-wrapper"
                role={canOpen ? "button" : undefined}
                tabIndex={canOpen ? 0 : undefined}
                onClick={canOpen ? handleCardClick : undefined}
                onKeyDown={canOpen ? handleKeyDown : undefined}
                aria-disabled={canOpen ? undefined : true}
              >
                <PlayerCard
                  players={players}
                  stats={{
                    matches: matchesCount,
                    wins,
                    winrate: winrateValue,
                  }}
                  titles={card.title}
                />
              </div>
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
