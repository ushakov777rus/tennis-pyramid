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
import { Participant } from "@/app/models/Participant";
import { Match, PhaseType } from "@/app/models/Match";

import { PlayersRepository } from "@/app/repositories/PlayersRepository";
import { TournamentsRepository } from "@/app/repositories/TournamentsRepository";
import { TeamsRepository } from "@/app/repositories/TeamsRepository";
import { MatchRepository } from "@/app/repositories/MatchRepository";
import { useUser } from "@/app/components/UserContext";

/** Аргументы «1 RPC: добавить матч + при необходимости свапнуть позиции в пирамиде» */
export type AddMatchAndMaybeSwapArgs = {
  date: Date;
  type: Tournament["tournament_type"];
  scores: any;
  aId: number;
  bId: number;
  winnerId: number | null;
  loserId: number | null;
  doSwap: boolean;
  phase?: PhaseType;
  groupIndex?: number | null;
  roundIndex?: number | null;
};

type InitialData = {
  tournamentId: number;
  tournament?: Tournament | null;
  players?: Player[];
  participants?: Participant[];
  teams?: Team[];
  matches?: Match[];
};

/** Старый путь создания матча (оставлен для совместимости с другими видами схем) */
type AddMatchArgs = {
  date: Date;
  type: Tournament["tournament_type"];
  scores: [number, number][];
  player1: number | null;
  player2: number | null;
  team1: number | null;
  team2: number | null;
  tournamentId: number;
  phase?: PhaseType;
  groupIndex?: number | null;
  roundIndex?: number | null;
};

export type TournamentContextShape = {
  // meta
  loading: boolean;
  initialLoading: boolean;
  refreshing: boolean;
  mutating: boolean;

  tournamentId: number;

  // данные
  tournament: Tournament | null;
  players: Player[];
  participants: Participant[];
  teams: Team[];
  matches: Match[];

  // действия
  reload: (opts?: { silent?: boolean }) => Promise<void>;

  // классические мутации (оставлены как есть)
  addMatch: (args: AddMatchArgs) => Promise<void>;
  updateMatch: (m: Match) => Promise<void>;
  deleteMatch: (m: Match) => Promise<void>;

  addPlayerToTournament?: (playerId: number) => Promise<void>;
  removeParticipant?: (participant: Participant) => Promise<void>;
  addTeamToTournament?: (teamId: number, maxLevel?: number) => Promise<void>;
  createAndAddTeamToTournament?: (tournamentId:number, p1: number, p2: number) => Promise<void>;
  removeTeam?: (teamId: number) => Promise<void>;
  updatePositions: (next: Participant[]) => Promise<void>;

  // быстрый путь
  addMatchAndMaybeSwap: (args: AddMatchAndMaybeSwapArgs) => Promise<void>;
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

  // source of truth
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

  // флаги загрузок
  const [initialLoading, setInitialLoading] = useState<boolean>(needInitialFetch);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [mutating, setMutating] = useState<boolean>(false);

  /** Глобальный перезахват данных. Используем экономно (после сложных мутаций или на отдельных вкладках). */
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
      void reload(); // НЕ silent — показываем спиннер
    }
  }, [needInitialFetch, userLoading, reload]);

  // ---- Мутации матчей (старая ветка) ----
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
          args.tournamentId,
          {
            phase: args.phase,
            groupIndex: args.groupIndex ?? null,
            roundIndex: args.roundIndex ?? null,
          }
        );
        // медленный путь — полный silent reload
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
        const saved = await MatchRepository.updateMatch(m);
        // быстрый локальный патч без reload
        setMatches((prev) => prev.map((x) => (x.id === saved.id ? saved : x)));
      } finally {
        setMutating(false);
      }
    },
    []
  );

  const deleteMatch = useCallback(
    async (m: Match) => {
      setMutating(true);
      try {
        await MatchRepository.deleteMatch(m);
        // быстрый локальный патч без reload
        setMatches((prev) => prev.filter((x) => x.id !== m.id));
      } finally {
        setMutating(false);
      }
    },
    []
  );

  // ---- Прочие мутации (оставил reload: они реже и затрагивают много сущностей) ----
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

  /** Массовое обновление позиций (используется dnd в PyramidView). */
  const updatePositions = useCallback(
    async (next: Participant[]) => {
      setMutating(true);
      try {
        await TournamentsRepository.updatePositions(next);
        // быстро апдейтим локально без полного рефетча:
        setParticipants(next.map((p) => p));
      } finally {
        setMutating(false);
      }
    },
    []
  );

  // ---- Быстрый путь: один RPC + оптимистичные локальные апдейты ----
  const addMatchAndMaybeSwap = useCallback(
    async (args: AddMatchAndMaybeSwapArgs) => {
      setMutating(true);
      try {
        const matchId = await TournamentsRepository.addMatchAndMaybeSwap({
          tournamentId,
          isSingle: tournament?.isSingle() ?? true,
          aId: args.aId,
          bId: args.bId,
          winnerId: args.winnerId,
          loserId: args.loserId,
          scores: args.scores,
          date: args.date,
          phase: args.phase ?? null,
          groupIndex: args.groupIndex ?? null,
          roundIndex: args.roundIndex ?? null,
          doSwap: args.doSwap,
        });

        // 1) Оптимистично дописываем матч (настоящий экземпляр Match + участники)
        if (matchId) {
          const isSingle = tournament?.isSingle() ?? true;

          // находим участников по их id (aId/bId — это id игрока или команды)
          const findPartByEntityId = (entityId: number) =>
            participants.find((p) => p.getId === entityId);

          const aPart = findPartByEntityId(args.aId);
          const bPart = findPartByEntityId(args.bId);

          const player1 = isSingle ? aPart?.player : undefined;
          const player2 = isSingle ? bPart?.player : undefined;
          const team1   = !isSingle ? aPart?.team   : undefined;
          const team2   = !isSingle ? bPart?.team   : undefined;

          // создаём экземпляр Match
          const optimistic = new Match(
            matchId,
            (isSingle ? "single" : "double") as any,
            new Date(args.date),
            args.scores,
            tournament!,
            player1,
            player2,
            team1,
            team2
          );

          // проставляем фазовые поля (если нужны)
          (optimistic as any).phase       = args.phase ?? null;
          (optimistic as any).groupIndex  = args.groupIndex ?? null;
          (optimistic as any).roundIndex  = args.roundIndex ?? null;

          // ⚠️ ДОБАВКА: проставим "сырые" id так же, как их отдаёт Supabase
          if (isSingle) {
            (optimistic as any).player1_id = player1?.id ?? null;
            (optimistic as any).player2_id = player2?.id ?? null;
            // на всякий случай занулим team-поля
            (optimistic as any).team1_id   = null;
            (optimistic as any).team2_id   = null;
          } else {
            (optimistic as any).team1_id   = team1?.id ?? null;
            (optimistic as any).team2_id   = team2?.id ?? null;
            (optimistic as any).player1_id = null;
            (optimistic as any).player2_id = null;
          }

          // (по желанию) унифицируем поле tournament_id — некоторые вьюхи читают его напрямую
          (optimistic as any).tournament_id = tournamentId;

          // кладём матч в состояние - ОБНОВЛЯЕМ МАТЧИ
          setMatches((prev) => [...prev, optimistic]);
        }

        // 2) Если был свап — локально меняем level/position у двух участников
        if (args.doSwap && args.winnerId && args.loserId) {
          setParticipants((prev) => {
            // Унифицированный способ получить ключ сравнения (player/team id)
            const pid = (p: Participant) => p.player?.id ?? p.team?.id ?? 0;

            const wIdx = prev.findIndex((p) => pid(p) === args.winnerId);
            const lIdx = prev.findIndex((p) => pid(p) === args.loserId);
            if (wIdx === -1 || lIdx === -1) return prev; // не нашли — ничего не меняем

            const w = prev[wIdx];
            const l = prev[lIdx];

            // создаём новые инстансы для двух участников — без мутаций «на месте»
            const wNext = new Participant({
              id: w.id,
              level: l.level,                 // <— меняем местами
              position: l.position,           // <— меняем местами
              player: w.player,
              team: w.team,
            });

            const lNext = new Participant({
              id: l.id,
              level: w.level,                 // <— меняем местами
              position: w.position,           // <— меняем местами
              player: l.player,
              team: l.team,
            });

            const next = [...prev];
            next[wIdx] = wNext;
            next[lIdx] = lNext;
            return next; // новая ссылка на массив + новые ссылки на 2 элемента
          });
        }
      } finally {
        setMutating(false);
      }
    },
    [tournamentId, tournament, participants]
  );

  const value = useMemo<TournamentContextShape>(
    () => ({
      loading: initialLoading,
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

      // стандартные экшены
      addMatch,
      updateMatch,
      deleteMatch,

      addPlayerToTournament,
      removeParticipant,
      addTeamToTournament,
      createAndAddTeamToTournament,
      removeTeam,
      updatePositions,

      // быстрый экшен
      addMatchAndMaybeSwap,
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
      addMatchAndMaybeSwap,
    ]
  );

  return <TournamentContext.Provider value={value}>{children}</TournamentContext.Provider>;
}

export function useTournament(): TournamentContextShape {
  const ctx = useContext(TournamentContext);
  if (!ctx) throw new Error("useTournament must be used within TournamentProvider");
  return ctx;
}