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

type InitialData = {
  /** Обязателен: ID текущего турнира */
  tournamentId: number;

  /** Необязательно (можно не передавать — провайдер сам загрузит при монтировании) */
  tournament?: Tournament | null;
  players?: Player[];
  participants?: Participant[];
  teams?: Team[];
  matches?: Match[];
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
  updateMatch: (m: Match) => Promise<void>;
  deleteMatch: (m: Match) => Promise<void>;

  // (опционально пригодится дальше — примеры мутаций участников/команд)
  addPlayerToTournament?: (playerId: number) => Promise<void>;
  removeParticipant?: (participantId: number) => Promise<void>;
  addTeamToTournament?: (teamId: number, maxLevel?: number) => Promise<void>;
  createTeam?: (name: string, p1: number, p2: number) => Promise<void>;
  removeTeam?: (teamId: number) => Promise<void>;
};

const TournamentContext = createContext<TournamentContextShape | null>(null);

export function TournamentProvider({
  initial,
  children,
}: {
  initial: InitialData;
  children: React.ReactNode;
}) {
  const { tournamentId } = initial;

  // единое состояние (источник правды)
  const [loading, setLoading] = useState<boolean>(false);
  const [tournament, setTournament] = useState<Tournament | null>(
    initial.tournament ?? null
  );
  const [players, setPlayers] = useState<Player[]>(initial.players ?? []);
  const [participants, setParticipants] = useState<Participant[]>(
    initial.participants ?? []
  );
  const [teams, setTeams] = useState<Team[]>(initial.teams ?? []);
  const [matches, setMatches] = useState<Match[]>(initial.matches ?? []);

  const needInitialFetch =
    !initial.tournament ||
    !initial.players ||
    !initial.participants ||
    !initial.teams ||
    !initial.matches;

  /** Полная перезагрузка всех зависимых данных */
  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const [t, ps, parts, ts, ms] = await Promise.all([
        TournamentsRepository.getTournamentById(tournamentId),
        PlayersRepository.loadAll(),
        TournamentsRepository.loadParticipants(tournamentId),
        TeamsRepository.loadAll(),
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
  }, [tournamentId]);

  /** Первая загрузка, если на страницу не передали initial-данные */
  useEffect(() => {
    if (needInitialFetch) {
      // без await — не блокируем рендер
      reload();
    }
  }, [needInitialFetch, reload]);

  // ---- Мутации матчей (под модалку истории) ----
  const updateMatch = useCallback(
    async (m: Match) => {
      setLoading(true);
      try {
        await MatchRepository.updateMatch(m);
        // Можно сделать оптимистическое обновление тут (по id), но для простоты — полный reload:
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

  // ---- Примеры доп. мутаций (на будущее/повторное использование) ----
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
    async (name: string, p1: number, p2: number) => {
      setLoading(true);
      try {
        await TeamsRepository.create(name, p1, p2);
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
      updateMatch,
      deleteMatch,
      addPlayerToTournament,
      removeParticipant,
      addTeamToTournament,
      createTeam,
      removeTeam,
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
      updateMatch,
      deleteMatch,
      addPlayerToTournament,
      removeParticipant,
      addTeamToTournament,
      createTeam,
      removeTeam,
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