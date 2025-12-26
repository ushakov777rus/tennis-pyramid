"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { Tournament as TournamentModel, TournamentStatus } from "@/app/models/Tournament";
import type { Tournament } from "@/app/models/Tournament";
import type { Player } from "@/app/models/Player";
import type { Team } from "@/app/models/Team";
import { Participant } from "@/app/models/Participant";
import { Match, MatchCreateInput, PhaseType } from "@/app/models/Match";

import {
  PlayersRepository
} from "@/app/repositories/PlayersRepository";
import {
  TournamentsRepository,
  type TournamentPlain
} from "@/app/repositories/TournamentsRepository";
import { TeamsRepository } from "@/app/repositories/TeamsRepository";
import { MatchRepository } from "@/app/repositories/MatchRepository";
import { useUser } from "@/app/components/UserContext";
import { useDictionary } from "@/app/components/LanguageProvider";

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
  tournamentSlug: string;                         // роутим по slug
  tournamentPlain: TournamentPlain; // получаем с сервера только POJO
  players?: Player[];
  participants?: Participant[];
  teams?: Team[];
  matches?: Match[];
};


export type PhaseMeta = { phase?: PhaseType; roundIndex?: number | null; groupIndex?: number | null };

export type TournamentContextShape = {
  // meta
  loading: boolean;
  initialLoading: boolean;
  refreshing: boolean;
  mutating: boolean;

  tournamentId: number | null;          // до загрузки может быть null
  tournamentSlug: string;

  // данные
  tournament: Tournament | null;
  creator: Player | null;
  players: Player[];
  participants: Participant[];
  teams: Team[];
  matches: Match[];

  // действия
  reload: (opts?: { silent?: boolean }) => Promise<void>;
  setTournamentStatus: (status: TournamentStatus) => void;

  // классические мутации (оставлены как есть)
  addMatch: (args: MatchCreateInput) => Promise<void>;
  updateMatch: (m: Match) => Promise<void>;
  deleteMatch: (m: Match) => Promise<void>;
  findMatchBetween: (aParticipantId: number, bParticipantId: number, meta?: PhaseMeta) => Match | null;
  groupsAssignments: Record<number, number>;
  updateGroupsAssignments: (assignments: Record<number, number>) => Promise<void>;

  addPlayerToTournament?: (playerId: number) => Promise<void>;
  removeParticipant?: (participant: Participant) => Promise<void>;
  addTeamToTournament?: (teamId: number, maxLevel?: number) => Promise<void>;
  createAndAddTeamToTournament?: (tournamentId:number, p1: number, p2: number) => Promise<void>;
  removeTeam?: (teamId: number) => Promise<void>;
  updatePositions: (next: Participant[]) => Promise<void>;

  // быстрый путь
  addMatchAndMaybeSwap: (args: AddMatchAndMaybeSwapArgs) => Promise<void>;

  // регламент
  updateRegulation?: (regulation: string | null) => Promise<void>;
};

const TournamentContext = createContext<TournamentContextShape | null>(null);

// helper: собираем модель из plain-объекта
function toModel(p: TournamentPlain): Tournament {
  return new TournamentModel(
    p.id,
    p.name,
    p.format as any,
    p.status as any,
    p.tournament_type as any,
    p.start_date,
    p.end_date,
    p.is_public,
    p.creator_id,
    p.slug,
    p.club,
    p.settings,
    p.owner_token ?? null,
    p.regulation ?? null
  );
}

export function TournamentProvider({
  initial,
  children,
}: {
  initial: InitialData;
  children: React.ReactNode;
}) {
  const { user, loading: userLoading } = useUser();
  const { tournamentSlug } = initial;
  const { tournaments: tournamentsText } = useDictionary();

  // source of truth (на клиенте храним класс-модель)
  const [creator, setCreator] = useState<Player | null>(null);
  const [tournament, setTournament] = useState<Tournament>(
    toModel(initial.tournamentPlain)
  );
  const [players, setPlayers] = useState<Player[]>(initial.players ?? []);
  const [participants, setParticipants] = useState<Participant[]>(
    initial.participants ?? []
  );
  const [teams, setTeams] = useState<Team[]>(initial.teams ?? []);
  const [matches, setMatches] = useState<Match[]>(initial.matches ?? []);

  const groupsAssignments = useMemo(() => {
    const assignments = (tournament?.settings?.groupsplayoff as any)?.assignments as Record<string, number> | undefined;
    if (!assignments) return {};
    const map: Record<number, number> = {};
    Object.entries(assignments).forEach(([key, value]) => {
      const id = Number(key);
      const groupIndex = typeof value === "number" ? value : Number(value);
      if (!Number.isNaN(id) && Number.isFinite(groupIndex)) {
        map[id] = groupIndex;
      }
    });
    return map;
  }, [tournament?.settings?.groupsplayoff]);

  const needInitialFetch =
    !initial.tournamentPlain ||
    !initial.players ||
    !initial.participants ||
    !initial.teams ||
    !initial.matches;

  const tournamentId = tournament?.id ?? null;

  // флаги загрузок
  const [initialLoading, setInitialLoading] = useState<boolean>(needInitialFetch);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [mutating, setMutating] = useState<boolean>(false);

  /** Перезагрузка по slug: тянем plain и превращаем в модель на клиенте */
  const reload = useCallback(
    async (opts?: { silent?: boolean }) => {
      const silent = !!opts?.silent;
      silent ? setRefreshing(true) : setInitialLoading(true);
      try {
        // 1) турнир по slug → модель
        const tPlain = await TournamentsRepository.getBySlug(tournamentSlug);
        if (!tPlain) {
          console.error("Не удалось загрузить турнир:", tournamentSlug);
          return;
        }

        const t = toModel(tPlain);

        setTournament(t);

        if (!t) {
          setCreator(null);
          setPlayers([]);
          setParticipants([]);
          setTeams([]);
          setMatches([]);
          return;
        }

        try {
          if (tPlain && tPlain.creator_id) {
            const creatorPlayer = await PlayersRepository.findByUserId(tPlain.creator_id);
            setCreator(creatorPlayer ?? null);
          } else {
            setCreator(null);
          }
        } catch (e) {
          console.error("Не удалось загрузить creator (Player):", e);
          setCreator(null);
        }

        // 2) остальное — по id
        const [ps, parts, ts, ms] = await Promise.all([
          PlayersRepository.loadAccessiblePlayers(user?.id, user?.role),
          TournamentsRepository.loadParticipants(t.id),
          TeamsRepository.loadTournamentTeams(t.id),
          MatchRepository.loadMatchesForTournament(t.id),
        ]);
        setPlayers(ps);
        setParticipants(parts);
        setTeams(ts);
        setMatches(ms);
      } finally {
        silent ? setRefreshing(false) : setInitialLoading(false);
      }
    },
    [tournamentSlug, user?.id, user?.role]
  );

  // первичная загрузка
  const initialFetchRef = useRef(false);

  useEffect(() => {
    if (initialFetchRef.current) return;
    if (needInitialFetch && !userLoading) {
      initialFetchRef.current = true;
      void reload();
    }
  }, [needInitialFetch, userLoading, reload]);

  // гарантируем наличие id перед мутациями
  const requireTid = useCallback(async (): Promise<number> => {
    if (tournamentId != null) return tournamentId;
    await reload({ silent: true });
    const tid = (tournament?.id ?? null);
    if (tid == null) {
      throw new Error(tournamentsText.errors.tournamentIdMissing);
    }
    return tid;
  }, [tournamentId, reload, tournament, tournamentsText.errors.tournamentIdMissing]);

  // Оптимистичное добавление матча
  const addMatch = useCallback(
    async (args: MatchCreateInput) => {
      setMutating(true);
      
      // 1. Создаем оптимистичный матч
      const optimisticMatch = new Match(
        -Date.now(), // временный отрицательный ID
        args.type,
        args.date,
        args.scores,
        tournament, // предполагая, что tournament доступен в scope
        args.player1 ? { id: args.player1 } as Player : undefined,
        args.player2 ? { id: args.player2 } as Player : undefined,
        args.team1 ? { id: args.team1 } as Team : undefined,
        args.team2 ? { id: args.team2 } as Team : undefined
      );

      // Добавляем фазовые поля если они есть
      if (args.phase) {
        optimisticMatch.phase = args.phase;
        optimisticMatch.groupIndex = args.groupIndex ?? null;
        optimisticMatch.roundIndex = args.roundIndex ?? null;
      }

      // Помечаем как оптимистичный
      (optimisticMatch as any)._optimistic = true;

      // 2. Сохраняем предыдущее состояние для отката
      const previousMatches = matches;
      
      // 3. Сразу обновляем UI - добавляем матч в начало списка
      setMatches(prev => [optimisticMatch, ...prev]);
      
      try {
        // 4. Отправляем запрос на сервер
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
        
        // 5. После успеха - перезагружаем данные для синхронизации
        await reload({ silent: true });
        
      } catch (error) {
        // 6. В случае ошибки - откатываем к предыдущему состоянию
        setMatches(previousMatches);
        console.error('Failed to add match:', error);
        
        // Показываем сообщение об ошибке
        alert(tournamentsText.alerts.addMatchRetry);
        throw error;
      } finally {
        setMutating(false);
      }
    },
    [reload, matches, tournament, tournamentsText.alerts.addMatchRetry] // зависимости
  );

  const updateMatch = useCallback(
    async (m: Match) => {
      setMutating(true);
      try {
        const saved = await MatchRepository.updateMatch(m);
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
        setMatches((prev) => prev.filter((x) => x.id !== m.id));
      } finally {
        setMutating(false);
      }
    },
    []
  );

  // ---- Прочие мутации ----
  const addPlayerToTournament = useCallback(
    async (playerId: number) => {
      setMutating(true);
      try {
        const tid = await requireTid();
        await TournamentsRepository.addPlayer(tid, playerId);
        await reload({ silent: true });
      } finally {
        setMutating(false);
      }
    },
    [requireTid, reload]
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
        if (!teamId) throw new Error(tournamentsText.errors.createTeamFailed);
        await TournamentsRepository.addTeam(tId, teamId);
        await reload({ silent: true });
      } finally {
        setMutating(false);
      }
    },
    [reload, tournamentsText.errors.createTeamFailed]
  );

  const addTeamToTournament = useCallback(
    async (teamId: number) => {
      setMutating(true);
      try {
        const tid = await requireTid();
        await TournamentsRepository.addTeam(tid, teamId);
        await reload({ silent: true });
      } finally {
        setMutating(false);
      }
    },
    [requireTid, reload]
  );

  /** Массовое обновление позиций (используется dnd в PyramidView). */
  const updatePositions = useCallback(
    async (next: Participant[]) => {
      setMutating(true);
      try {
        await TournamentsRepository.updatePositions(next);
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
        const tid = await requireTid();

        const matchId = await TournamentsRepository.addMatchAndMaybeSwap({
          tournamentId: tid,
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

        const isSingle = tournament?.isSingle() ?? true;

        const findPartByEntityId = (entityId: number) =>
          participants.find((p) => p.getId === entityId);

        const aPart = findPartByEntityId(args.aId);
        const bPart = findPartByEntityId(args.bId);

        const tempId = matchId ?? -Date.now();

        const optimistic = new Match(
          tempId,
          (isSingle ? "single" : "double") as any,
          args.date,
          args.scores,
          tournament!, // ссылка на текущий турнир
          isSingle ? aPart?.player : undefined,
          isSingle ? bPart?.player : undefined,
          !isSingle ? aPart?.team   : undefined,
          !isSingle ? bPart?.team   : undefined
        );
        (optimistic as any).phase      = args.phase ?? null;
        (optimistic as any).groupIndex = args.groupIndex ?? null;
        (optimistic as any).roundIndex = args.roundIndex ?? null;

        setMatches((prev) => [...prev, optimistic]);

        if (args.doSwap && args.winnerId && args.loserId) {
          setParticipants((prev) => {
            const pid = (p: Participant) => p.player?.id ?? p.team?.id ?? 0;
            const wIdx = prev.findIndex((p) => pid(p) === args.winnerId);
            const lIdx = prev.findIndex((p) => pid(p) === args.loserId);
            if (wIdx === -1 || lIdx === -1) return prev;

            const w = prev[wIdx], l = prev[lIdx];
            const wNext = new Participant({ id: w.id, level: l.level, position: l.position, player: w.player, team: w.team });
            const lNext = new Participant({ id: l.id, level: w.level, position: w.position, player: l.player, team: l.team });

            const next = [...prev];
            next[wIdx] = wNext;
            next[lIdx] = lNext;
            return next;
          });
        }

        if (!matchId) {
          setTimeout(() => void reload({ silent: true }), 0);
        }
      } finally {
        setMutating(false);
      }
    },
    [requireTid, tournament, participants, reload]
  );

  const setTournamentStatus = useCallback((status: TournamentStatus) => {
    setTournament((prev) => {
      if (!prev) return prev;
      return new TournamentModel(
        prev.id,
        prev.name,
        prev.format,
        status,
        prev.tournament_type,
        prev.start_date,
        prev.end_date,
        prev.is_public,
        prev.creator_id,
        prev.slug,
        prev.club,
        prev.settings,
        prev.ownerToken ?? null,
        prev.regulation ?? null
      );
    });
  }, []);

  const findMatchBetween = useCallback(
    (aParticipantId: number, bParticipantId: number, meta?: PhaseMeta): Match | null => {
      const tryFind = (useMeta: boolean) =>
        matches.find((m) => {
          const id1 = m.player1?.id ?? m.team1?.id ?? 0;
          const id2 = m.player2?.id ?? m.team2?.id ?? 0;
          const samePair = (id1 === aParticipantId && id2 === bParticipantId) || (id1 === bParticipantId && id2 === aParticipantId);
          if (!samePair) return false;
          if (!useMeta || !meta) return true;
          if (meta.phase && (m as any).phase !== meta.phase) return false;
          if (meta.groupIndex != null && ((m as any).groupIndex ?? null) !== meta.groupIndex) return false;
          if (meta.roundIndex != null && ((m as any).roundIndex ?? null) !== meta.roundIndex) return false;
          return true;
        });

      if (meta) {
        const matchWithMeta = tryFind(true);
        if (matchWithMeta) return matchWithMeta;
      }
      return tryFind(false) ?? null;
    },
    [matches]
  );

  const updateGroupsAssignments = useCallback(
    async (assignments: Record<number, number>) => {
      setMutating(true);
      try {
        const tid = await requireTid();
        const nextSettings = await TournamentsRepository.updateGroupsAssignments(
          tid,
          tournament?.settings,
          assignments
        );

        setTournament((prev) => {
          if (!prev) return prev;
          return new TournamentModel(
            prev.id,
            prev.name,
            prev.format,
            prev.status,
            prev.tournament_type,
            prev.start_date,
            prev.end_date,
            prev.is_public,
            prev.creator_id,
            prev.slug,
            prev.club,
            nextSettings,
            prev.ownerToken ?? null,
            prev.regulation ?? null
          );
        });
      } finally {
        setMutating(false);
      }
    },
    [requireTid, tournament?.settings]
  );

  const updateRegulation = useCallback(
    async (regulation: string | null) => {
      setMutating(true);
      try {
        const tid = await requireTid();
        const updated = await TournamentsRepository.updateRegulation(
          tid,
          regulation
        );

        setTournament((prev) => {
          if (updated) return updated;
          if (!prev) return prev;
          return new TournamentModel(
            prev.id,
            prev.name,
            prev.format,
            prev.status,
            prev.tournament_type,
            prev.start_date,
            prev.end_date,
            prev.is_public,
            prev.creator_id,
            prev.slug,
            prev.club,
            prev.settings,
            prev.ownerToken ?? null,
            regulation
          );
        });
      } finally {
        setMutating(false);
      }
    },
    [requireTid]
  );



  const value = useMemo<TournamentContextShape>(
    () => ({
      loading: initialLoading,
      initialLoading,
      refreshing,
      mutating,

      tournamentId,
      tournamentSlug,

      creator,
      tournament,
      players,
      participants,
      teams,
      matches,

      reload,
      setTournamentStatus,

      // стандартные экшены
      addMatch,
      updateMatch,
      deleteMatch,
      findMatchBetween,
      groupsAssignments,
      updateGroupsAssignments,

      addPlayerToTournament,
      removeParticipant,
      addTeamToTournament,
      createAndAddTeamToTournament,
      removeTeam,
      updatePositions,

      // быстрый экшен
      addMatchAndMaybeSwap,

      updateRegulation,
    }),
    [
      initialLoading,
      refreshing,
      mutating,
      tournamentId,
      tournamentSlug,
      creator,
      tournament,
      players,
      participants,
      teams,
      matches,
      reload,
      setTournamentStatus,
      addMatch,
      updateMatch,
      deleteMatch,
      findMatchBetween,
      groupsAssignments,
      updateGroupsAssignments,
      addPlayerToTournament,
      removeParticipant,
      addTeamToTournament,
      createAndAddTeamToTournament,
      removeTeam,
      updatePositions,
      addMatchAndMaybeSwap,
      updateRegulation,
    ]
  );

  return <TournamentContext.Provider value={value}>{children}</TournamentContext.Provider>;
}

export function useOptionalTournament() {
  return useContext(TournamentContext);
}

export function useTournament(): TournamentContextShape {
  const ctx = useContext(TournamentContext);
  if (!ctx) throw new Error("useTournament must be used within TournamentProvider");
  return ctx;
}
