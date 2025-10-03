"use client";

import { useEffect, useMemo, useState } from "react";
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
import { PlayersRepository } from "@/app/repositories/PlayersRepository";
import { MatchRepository } from "@/app/repositories/MatchRepository";
import { useUser } from "./UserContext";

type ParticipantStats = {
  games: number;
  wins: number;
};

type CardData = {
  id: number;
  players: Player[];
  games: number;
  wins: number;
  title?: string;
  hasHistory: boolean;
  rank: number;
  displayName: string;
};

type RatingScope = "tournament" | "club" | "global";

type RatingSubject = {
  id: number;
  players: Player[];
  hasHistory: boolean;
};

const EMPTY_PARTICIPANTS: Participant[] = [];
const EMPTY_MATCHES: Match[] = [];

export function RatingView() {
  const tournamentCtx = useOptionalTournament();
  const clubCtx = useOptionalClub();
  const matchesCtx = useOptionalMatches();
  const { user } = useUser();

  const tournament = tournamentCtx?.tournament ?? null;
  const participants = tournamentCtx?.participants ?? EMPTY_PARTICIPANTS;
  const tournamentMatches = tournamentCtx?.matches ?? EMPTY_MATCHES;
  const tournamentInitialLoading = tournamentCtx?.initialLoading ?? false;

  const club = clubCtx?.club ?? null;
  const clubMembers = clubCtx?.members ?? [];
  const clubMatches = clubCtx?.matches ?? EMPTY_MATCHES;
  const clubInitialLoading = clubCtx?.initialLoading ?? false;

  const matchesInitialLoaded = matchesCtx?.initialLoaded ?? false;
  const matchesError = matchesCtx?.error ?? null;
  const matchesLoading = matchesCtx?.loading ?? false;
  const matchesFromCtx = matchesCtx?.matches ?? EMPTY_MATCHES;

  const scope: RatingScope = tournament ? "tournament" : club ? "club" : "global";

  const [globalPlayers, setGlobalPlayers] = useState<Player[]>([]);
  const [globalMatches, setGlobalMatches] = useState<Match[]>([]);
  const [globalLoading, setGlobalLoading] = useState<boolean>(false);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [filterPlayer, setFilterPlayer] = useState<{ name: string }>({ name: "" });
  const [profileOpen, setProfileOpen] = useState(false);
  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [profileStats, setProfileStats] = useState<UserProfileStats | undefined>();
  const [profileMatches, setProfileMatches] = useState<Match[]>([]);

  useEffect(() => {
    if (scope !== "global") return;

    let cancelled = false;
    const needPlayers = globalPlayers.length === 0;
    const hasContextMatches = matchesFromCtx.length > 0;
    const needMatches = !hasContextMatches && globalMatches.length === 0;

    if (!needPlayers && !needMatches) {
      setGlobalError(null);
      return;
    }

    setGlobalLoading(true);

    const load = async () => {
      try {
        const [players, matches] = await Promise.all([
          needPlayers ? PlayersRepository.loadAll() : Promise.resolve(globalPlayers),
          needMatches ? MatchRepository.loadAll() : Promise.resolve(globalMatches),
        ]);

        if (cancelled) return;

        if (needPlayers) {
          setGlobalPlayers(players);
        }
        if (needMatches) {
          setGlobalMatches(matches);
        }

        setGlobalError(null);
      } catch (error) {
        console.error("RatingView: failed to load global rating data", error);
        if (!cancelled) {
          setGlobalError("Не удалось загрузить данные для рейтинга");
        }
      } finally {
        if (!cancelled) {
          setGlobalLoading(false);
        }
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, [scope, matchesFromCtx.length, globalPlayers.length, globalMatches.length]);

  const scopedMatches: Match[] = useMemo(() => {
    if (scope === "tournament") return tournamentMatches;
    if (scope === "club") return clubMatches;
    if (matchesFromCtx.length > 0) return matchesFromCtx;
    return globalMatches;
  }, [scope, tournamentMatches, clubMatches, matchesFromCtx, globalMatches]);

  const pastMatches = useMemo(() => {
    const now = Date.now();
    return scopedMatches.filter((match) => match?.date && match.date.getTime() <= now);
  }, [scopedMatches]);

  const playersFromMatches = useMemo(() => {
    const map = new Map<number, Player>();

    const register = (player?: Player) => {
      if (!player || !player.id) return;
      if (!map.has(player.id)) {
        map.set(player.id, player);
      }
    };

    for (const match of scopedMatches) {
      register(match.player1);
      register(match.player2);
      register(match.team1?.player1);
      register(match.team1?.player2);
      register(match.team2?.player1);
      register(match.team2?.player2);
    }

    return Array.from(map.values());
  }, [scopedMatches]);

  const subjects = useMemo<RatingSubject[]>(() => {
    if (scope === "tournament") {
      return participants.map((participant) => {
        const players = participant.player
          ? [participant.player]
          : [participant.team?.player1, participant.team?.player2].filter(
              (p): p is Player => Boolean(p)
            );

        return {
          id: participant.getId,
          players,
          hasHistory: Boolean(participant.player || participant.team),
        };
      });
    }

    if (scope === "club") {
      return clubMembers.map((player) => ({
        id: player.id,
        players: [player],
        hasHistory: true,
      }));
    }

    const basePlayers = globalPlayers.length ? globalPlayers : playersFromMatches;

    return basePlayers.map((player) => ({
      id: player.id,
      players: [player],
      hasHistory: true,
    }));
  }, [scope, participants, clubMembers, globalPlayers, playersFromMatches]);

  const statsById = useMemo(() => {
    const map = new Map<number, ParticipantStats>();

    for (const subject of subjects) {
      if (!map.has(subject.id)) {
        map.set(subject.id, { games: 0, wins: 0 });
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
  }, [subjects, pastMatches]);

  const titlesById = useMemo(() => {
    if (scope !== "tournament") {
      return new Map<number, string[]>();
    }

    return calculateParticipantTitles({
      participants,
      matches: pastMatches,
      tournament,
    });
  }, [scope, participants, pastMatches, tournament]);

  const cardsData = useMemo(() => {
    const data = subjects.map((subject) => {
      const stats = statsById.get(subject.id) ?? { games: 0, wins: 0 };
      const titles = titlesById.get(subject.id) ?? [];
      const titleText =
        titles.length > 0
          ? titles.join(" • ")
          : scope === "tournament"
          ? "Без титула"
          : undefined;

      const displayName =
        subject.players
          .map((player) => player.displayName?.() ?? player.name ?? "Без имени")
          .join(" / ") || "Без имени";

      return {
        id: subject.id,
        players: subject.players,
        games: stats.games,
        wins: stats.wins,
        title: titleText,
        hasHistory: subject.hasHistory,
        displayName,
      };
    });

    const sorted = data.sort((a, b) => {
      if (b.wins !== a.wins) return b.wins - a.wins;
      if (b.games !== a.games) return b.games - a.games;
      return a.displayName.localeCompare(b.displayName, "ru");
    });

    return sorted.map((item, index) => ({
      id: item.id,
      players: item.players,
      games: item.games,
      wins: item.wins,
      title: item.title,
      hasHistory: item.hasHistory,
      rank: index + 1,
      displayName: item.displayName,
    }));
  }, [subjects, statsById, titlesById, scope]);

  const filteredCards = useMemo(() => {
    const query = filterPlayer.name?.trim().toLowerCase();
    if (!query) return cardsData;

    return cardsData.filter((card) => {
      if (card.displayName.toLowerCase().includes(query)) return true;
      return card.players.some((player) => {
        const name = player.displayName?.() ?? player.name ?? "";
        return name.toLowerCase().includes(query);
      });
    });
  }, [cardsData, filterPlayer.name]);

  const scopeLoading =
    scope === "tournament"
      ? tournamentInitialLoading
      : scope === "club"
      ? clubInitialLoading
      : globalLoading || (matchesLoading && !matchesInitialLoaded);

  const isInitialLoading = scopeLoading && cardsData.length === 0;

  const scopeError =
    scope === "global" && cardsData.length === 0
      ? globalError ?? matchesError
      : null;

  if (tournamentCtx && !tournament) return <p>Турнир не найден</p>;
  if (isInitialLoading) return <p>Загрузка…</p>;
  if (scopeError) {
    return <p style={{ color: "#f04438" }}>{scopeError}</p>;
  }

  const className = user || club || tournament ? "page-container-no-padding" : "page-container";

  const noParticipants = cardsData.length === 0;
  const noMatchesForSearch = !noParticipants && filteredCards.length === 0;

  return (
    <div className={className}>
    <div className="page-content-container">
      <div className="card players-controls page-toolbar">
        <input
          name="player-name"
          type="text"
          className="input"
          placeholder="Поиск"
          value={filterPlayer.name || ""}
          onChange={(e) => setFilterPlayer({ ...filterPlayer, name: e.target.value })}
          suppressHydrationWarning
        />
      </div>

      {noParticipants ? (
        <p>Пока нет участников.</p>
      ) : noMatchesForSearch ? (
        <p>Игроки не найдены.</p>
      ) : (
        <div className="card-grid-one-column">
          {filteredCards.map((card) => {
            const players = card.players;
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

              const playerMatches = scopedMatches
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
                key={card.id}
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
    </div>
  );
}
