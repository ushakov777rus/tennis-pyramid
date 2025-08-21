"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import type { Tournament } from "@/app/models/Tournament";
import type { Player } from "@/app/models/Player";
import type { Team } from "@/app/models/Team";
import type { Participant } from "@/app/models/Participant";
import type { Match } from "@/app/models/Match";

import { PlayersRepository } from "@/app/repositories/PlayersRepository";
import { TournamentsRepository } from "@/app/repositories/TournamentsRepository";
import { TeamsRepository } from "@/app/repositories/TeamsRepository";
import { MatchRepository } from "@/app/repositories/MatchRepository";

import { useUser } from "@/app/components/UserContext";

type InitialData = {
  tournamentId: number;
  tournament?: Tournament | null;
  players?: Player[];
  participants?: Participant[];
  teams?: Team[];
  matches?: Match[];
};

type AddMatchArgs = {
  date: Date;
  type: Tournament["tournament_type"];
  scores: [number, number][];
  player1: number | null;
  player2: number | null;
  team1: number | null;
  team2: number | null;
  tournamentId: number;
};

type TournamentContextShape = {
  // meta
  loading: boolean;
  tournamentId: number;

  // данные
  tournament: Tournament | null;
  players: Player[];
  participants: Participant[];
  teams: Team[];
  matches: Match[];

  // действия
  reload: () => Promise<void>;
  addMatch: (args: AddMatchArgs) => Promise<void>;
  updateMatch: (m: Match) => Promise<void>;
  deleteMatch: (m: Match) => Promise<void>;

  // примеры мутаций участников/команд (опционально)
  addPlayerToTournament?: (playerId: number) => Promise<void>;
  removeParticipant?: (participantId: number) => Promise<void>;
  addTeamToTournament?: (teamId: number, maxLevel?: number) => Promise<void>;
  createTeam?: (tournamentId:number, p1: number, p2: number) => Promise<void>;
  removeTeam?: (teamId: number) => Promise<void>;
  updatePositions: (next: Participant[]) => Promise<void>;
};

const TournamentContext = createContext<TournamentContextShape | null>(null);

export function TournamentProvider({
  initial,
  children,
}: {
  initial: InitialData;
  children: React.ReactNode;
}) {
  const { user, loading: userLoading } = useUser();
  const { tournamentId } = initial;

  const [loading, setLoading] = useState<boolean>(false);
  const [tournament, setTournament] = useState<Tournament | null>(initial.tournament ?? null);
  const [players, setPlayers] = useState<Player[]>(initial.players ?? []);
  const [participants, setParticipants] = useState<Participant[]>(initial.participants ?? []);
  const [teams, setTeams] = useState<Team[]>(initial.teams ?? []);
  const [matches, setMatches] = useState<Match[]>(initial.matches ?? []);

  const needInitialFetch =
    !initial.tournament ||
    !initial.players ||
    !initial.participants ||
    !initial.teams ||
    !initial.matches;

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const [t, ps, parts, ts, ms] = await Promise.all([
        TournamentsRepository.getTournamentById(tournamentId),
        PlayersRepository.loadAccessiblePlayers(user?.id, user?.role),
        TournamentsRepository.loadParticipants(tournamentId),
        TeamsRepository.loadTournamentTeams(tournamentId),
        MatchRepository.loadMatches(tournamentId),
      ]);
      setTournament(t);
      setPlayers(ps);
      setParticipants(parts);
      setTeams(ts);
      setMatches(ms);
    } finally {
      setLoading(false);
    }
  }, [tournamentId, user?.id, user?.role]);

  useEffect(() => {
    if (needInitialFetch && !userLoading) {
      void reload();
    }
  }, [needInitialFetch, userLoading, reload]);

  // ---- Мутации матчей ----
  const addMatch = useCallback(
    async (args: AddMatchArgs) => {
      setLoading(true);
      try {
        await MatchRepository.addMatch(
          args.date,
          args.type,
          args.scores,
          args.player1,
          args.player2,
          args.team1,
          args.team2,
          args.tournamentId
        );
        await reload();
      } finally {
        setLoading(false);
      }
    },
    [reload]
  );

  const updateMatch = useCallback(
    async (m: Match) => {
      setLoading(true);
      try {
        await MatchRepository.updateMatch(m);
        await reload();
      } finally {
        setLoading(false);
      }
    },
    [reload]
  );

  const deleteMatch = useCallback(
    async (m: Match) => {
      setLoading(true);
      try {
        await MatchRepository.deleteMatch(m);
        await reload();
      } finally {
        setLoading(false);
      }
    },
    [reload]
  );

  // ---- Примеры доп. мутаций ----
  const addPlayerToTournament = useCallback(
    async (playerId: number) => {
      setLoading(true);
      try {
        await TournamentsRepository.addPlayer(tournamentId, playerId);
        await reload();
      } finally {
        setLoading(false);
      }
    },
    [tournamentId, reload]
  );

  const removeParticipant = useCallback(
    async (participantId: number) => {
      setLoading(true);
      try {
        await TournamentsRepository.removeParticipant(participantId);
        await reload();
      } finally {
        setLoading(false);
      }
    },
    [reload]
  );

  const addTeamToTournament = useCallback(
    async (teamId: number, maxLevel = 15) => {
      setLoading(true);
      try {
        await TournamentsRepository.addTeam(tournamentId, teamId, maxLevel);
        await reload();
      } finally {
        setLoading(false);
      }
    },
    [tournamentId, reload]
  );

  const createTeam = useCallback(
    async (tournamentId: number, p1: number, p2: number) => {
      setLoading(true);
      try {
        await TeamsRepository.create(tournamentId, p1, p2);
        await reload();
      } finally {
        setLoading(false);
      }
    },
    [reload]
  );

  const removeTeam = useCallback(
    async (teamId: number) => {
      setLoading(true);
      try {
        await TeamsRepository.delete(teamId);
        await reload();
      } finally {
        setLoading(false);
      }
    },
    [reload]
  );

  const updatePositions = useCallback(
    async (next: Participant[]) => {
      setLoading(true);
      try {
        await TournamentsRepository.updatePositions(next);
        await reload();
      } finally {
        setLoading(false);
      }
    },
    [reload]
  );

  const value = useMemo<TournamentContextShape>(
    () => ({
      loading,
      tournamentId,
      tournament,
      players,
      participants,
      teams,
      matches,
      reload,
      addMatch,
      updateMatch,
      deleteMatch,
      addPlayerToTournament,
      removeParticipant,
      addTeamToTournament,
      createTeam,
      removeTeam,
      updatePositions,
    }),
    [
      loading,
      tournamentId,
      tournament,
      players,
      participants,
      teams,
      matches,
      reload,
      addMatch,
      updateMatch,
      deleteMatch,
      addPlayerToTournament,
      removeParticipant,
      addTeamToTournament,
      createTeam,
      removeTeam,
      updatePositions,
    ]
  );

  return (
    <TournamentContext.Provider value={value}>
      {children}
    </TournamentContext.Provider>
  );
}

export function useTournament(): TournamentContextShape {
  const ctx = useContext(TournamentContext);
  if (!ctx) throw new Error("useTournament must be used within TournamentProvider");
  return ctx;
}