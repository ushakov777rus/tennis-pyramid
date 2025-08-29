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

export type TournamentContextShape = {
  // meta
  loading: boolean;            // = initialLoading (для обратной совместимости)
  initialLoading: boolean;     // первая загрузка
  refreshing: boolean;         // тихий рефетч (не скрываем таблицы)
  mutating: boolean;           // идёт мутация

  tournamentId: number;

  // данные
  tournament: Tournament | null;
  players: Player[];
  participants: Participant[];
  teams: Team[];
  matches: Match[];

  // действия
  reload: (opts?: { silent?: boolean }) => Promise<void>;
  addMatch: (args: AddMatchArgs) => Promise<void>;
  updateMatch: (m: Match) => Promise<void>;
  deleteMatch: (m: Match) => Promise<void>;

  addPlayerToTournament?: (playerId: number) => Promise<void>;
  removeParticipant?: (participant: Participant) => Promise<void>;
  addTeamToTournament?: (teamId: number, maxLevel?: number) => Promise<void>;
  createAndAddTeamToTournament?: (tournamentId:number, p1: number, p2: number) => Promise<void>;
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

  // новые флаги
  const [initialLoading, setInitialLoading] = useState<boolean>(needInitialFetch);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [mutating, setMutating] = useState<boolean>(false);

  const reload = useCallback(
    async (opts?: { silent?: boolean }) => {
      const silent = !!opts?.silent;
      silent ? setRefreshing(true) : setInitialLoading(true);
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
        silent ? setRefreshing(false) : setInitialLoading(false);
      }
    },
    [tournamentId, user?.id, user?.role]
  );

  // первичная загрузка
  useEffect(() => {
    if (needInitialFetch && !userLoading) {
      void reload(); // НЕ silent
    }
  }, [needInitialFetch, userLoading, reload]);

  // ---- Мутации матчей ----
  const addMatch = useCallback(
    async (args: AddMatchArgs) => {
      setMutating(true);
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
        await reload({ silent: true });
      } finally {
        setMutating(false);
      }
    },
    [reload]
  );

  const updateMatch = useCallback(
    async (m: Match) => {
      setMutating(true);
      try {
        await MatchRepository.updateMatch(m);
        await reload({ silent: true });
      } finally {
        setMutating(false);
      }
    },
    [reload]
  );

  const deleteMatch = useCallback(
    async (m: Match) => {
      setMutating(true);
      try {
        await MatchRepository.deleteMatch(m);
        await reload({ silent: true });
      } finally {
        setMutating(false);
      }
    },
    [reload]
  );

  // ---- Доп. мутации ----
  const addPlayerToTournament = useCallback(
    async (playerId: number) => {
      setMutating(true);
      try {
        await TournamentsRepository.addPlayer(tournamentId, playerId);
        await reload({ silent: true });
      } finally {
        setMutating(false);
      }
    },
    [tournamentId, reload]
  );

  const removeTeam = useCallback(
    async (teamId: number) => {
      setMutating(true);
      try {
        await TeamsRepository.delete(teamId);
        await reload({ silent: true });
      } finally {
        setMutating(false);
      }
    },
    [reload]
  );

  const removeParticipant = useCallback(
    async (participant: Participant) => {
      setMutating(true);
      try {
        await TournamentsRepository.removeParticipant(participant.id);
        if (participant.team) await removeTeam(participant.team.id);
        await reload({ silent: true });
      } finally {
        setMutating(false);
      }
    },
    [reload, removeTeam]
  );

  const createAndAddTeamToTournament = useCallback(
    async (tId: number, p1: number, p2: number) => {
      setMutating(true);
      try {
        const teamId = await TeamsRepository.create(tId, p1, p2);
        if (!teamId) throw new Error("Не удалось создать команду");
        await TournamentsRepository.addTeam(tId, teamId);
        await reload({ silent: true });
      } finally {
        setMutating(false);
      }
    },
    [reload]
  );

  const addTeamToTournament = useCallback(
    async (teamId: number) => {
      setMutating(true);
      try {
        await TournamentsRepository.addTeam(tournamentId, teamId);
        await reload({ silent: true });
      } finally {
        setMutating(false);
      }
    },
    [tournamentId, reload]
  );

  const updatePositions = useCallback(
    async (next: Participant[]) => {
      setMutating(true);
      try {
        await TournamentsRepository.updatePositions(next);
        await reload({ silent: true });
      } finally {
        setMutating(false);
      }
    },
    [reload]
  );

  const value = useMemo<TournamentContextShape>(
    () => ({
      loading: initialLoading,         // обратная совместимость
      initialLoading,
      refreshing,
      mutating,

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
      createAndAddTeamToTournament,
      removeTeam,
      updatePositions,
    }),
    [
      initialLoading,
      refreshing,
      mutating,

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
      createAndAddTeamToTournament,
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