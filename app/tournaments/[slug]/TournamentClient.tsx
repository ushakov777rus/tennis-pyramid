"use client";

import React, { useCallback, useEffect, useMemo, useState, useRef } from "react";
import { useUser } from "@/app/components/UserContext";
import { usePathname, useSearchParams } from "next/navigation";

import { Tournament, TournamentStatus } from "@/app/models/Tournament";
import { Player } from "@/app/models/Player";
import { Team } from "@/app/models/Team";
import { DEFAULT_MATCH_PHASE, Match, MatchPhase, PhaseType } from "@/app/models/Match";
import { Participant } from "@/app/models/Participant";

import { TournamentCard } from "@/app/components/TournamentCard";
import { LoggedIn } from "@/app/components/RoleGuard";

import { RatingView } from "@/app/components/RatingView";
import { MatchHistoryModal } from "@/app/components/MatchHistoryModal";
import { MatchHistoryView } from "@/app/components/matches/MatchHistoryView";
import { TournamentParticipantsView } from "@/app/components/ParticipantsView";
import { AddMatchCard } from "@/app/components/AddMatchCard";

import { ScrollableTabs, TabItem } from "@/app/components/controls/ScrollableTabs";
import { ScoreKeyboard } from "@/app/components/controls/ScoreKeyboard";

import "./Page.css";

import { useTournament } from "./TournamentProvider";

import { PyramidView } from "@/app/components/tournaments/PyramidView";
import { SingleEliminationView } from "@/app/components/tournaments/SingleEliminationView";
import { DoubleEliminationView } from "@/app/components/tournaments/DoubleEliminationView";
import { GroupPlusPlayoffView } from "@/app/components/tournaments/GroupPlusPlayoffView";
import { RoundRobinView } from "@/app/components/tournaments/RoundRobinView";
import { SwissView } from "@/app/components/tournaments/SwissView";
import { AboutTournament } from "@/app/components/AboutTournament";
import { UserRole } from "@/app/models/Users";
import { SimpleBreadcrumbs } from "@/app/components/controls/BreadCrumbs";
import { OWNER_TOKEN_PREFIX } from "@/app/freetournament/constants"; 

const todayISO = new Date().toISOString().split("T")[0];

type ViewKey = "bracket" | "matches" | "participants" | "results" | "aboutt";

// Тип для состояния клавиатуры
type KeyboardState = {
  isOpen: boolean;
  editingKey: string | null;
  mobileKeyboardContext: { participantA: Participant; participantB: Participant } | null;
  editValue: string;
  phaseFilter: MatchPhase;
};

export default function TournamentClient() {
  const {
    loading,
    tournament,
    participants,
    matches,
    reload,
    addMatch,
    updateMatch,
    deleteMatch,
    updatePositions,
    addMatchAndMaybeSwap,
    setTournamentStatus,
  } = useTournament();

  const { user } = useUser();
  const searchParams = useSearchParams();

  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [historyParticipant, setHistoryParticipant] = useState<Participant | undefined>(undefined);

  const [matchDate, setMatchDate] = useState<string>(todayISO);
  const [matchScore, setMatchScore] = useState<string>("");

  const [view, setView] = useState<ViewKey>("aboutt");

  // Состояние для глобальной клавиатуры
  const [keyboardState, setKeyboardState] = useState<KeyboardState>({
    isOpen: false,
    editingKey: null,
    mobileKeyboardContext: null,
    editValue: "",
    phaseFilter: DEFAULT_MATCH_PHASE,
  });
   
  const [localOwnerToken, setLocalOwnerToken] = useState<string | null>(null);
  
  useEffect(() => {
    if (!tournament?.slug) return;
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(`${OWNER_TOKEN_PREFIX}${tournament?.slug}`);
    setLocalOwnerToken(stored);
  }, [tournament?.slug]);  
  
  const ownerTokenFromTournament = tournament?.ownerToken ?? null;
  const isOwnedByUser = !!(user?.id && tournament?.creator_id && tournament.creator_id === user.id);
  const hasOwnerTokenMatch =
    !!ownerTokenFromTournament &&
    !!localOwnerToken &&
    localOwnerToken === ownerTokenFromTournament;

  const canManage = 
    user?.role === UserRole.SiteAdmin ||
    user?.role === UserRole.TournamentAdmin && isOwnedByUser ||
    hasOwnerTokenMatch;

  console.log("You can manage this tournament:", canManage, user?.role, isOwnedByUser, hasOwnerTokenMatch);
  

  const editingInputRef = useRef<HTMLInputElement>(null);

  const showBracketTab = tournament ? !tournament.isCustom() : true;

  const pathname = usePathname();
  const isWizard = pathname.includes("/freetournament");

  const tabs: TabItem[] = useMemo(() => {
    const items: Array<TabItem | false> = [
      !isWizard && { key: "aboutt", label: "О турнире" },
      showBracketTab && { key: "bracket", label: "Сетка" },
      { key: "matches", label: "Матчи" },
      canManage && {
        key: "participants",
        label: "Участники",
      },
      { key: "results", label: "Рейтинг" },
    ];
    return items.filter(Boolean) as TabItem[];
  }, [showBracketTab, canManage, isWizard]);

  // Синхронизация с URL параметром tab
  useEffect(() => {
    const urlTab = searchParams.get("tab");
    if (urlTab && tabs.some(tab => tab.key === urlTab)) {
      setView(urlTab as ViewKey);
    }
  }, [searchParams, tabs]);

  useEffect(() => {
    if (!tabs.length) return;
    if (tabs.every((tab) => tab.key !== view)) {
      setView(tabs[0].key as ViewKey);
    }
  }, [tabs, view]);

  // если игрок залогинен и участвует — закрепляем как нападающего
  useEffect(() => {
    const isSingle =
      typeof tournament?.isSingle === "function" ? tournament.isSingle() : tournament?.tournament_type === "single";

    if (user?.role === UserRole.Player && user.player.id && isSingle) {
      const isInTournament = participants.some((p) => p.player?.id === user.player.id);
      setSelectedIds(isInTournament ? [user.player.id] : []);
    } else {
      setSelectedIds([]);
    }
  }, [user?.role, user?.player.id, tournament?.tournament_type, participants, tournament]);

  // Доступные для выбора — только участники турнира
  const selectableItems = useMemo(() => {
    if (!tournament) return [] as Array<Player | Team>;
    const isSingle = tournament.isSingle();
    const items = participants
      .map((p) => (isSingle ? p.player : p.team))
      .filter((x): x is Player | Team => !!x);
    const uniq = new Map<number, Player | Team>();
    for (const it of items) uniq.set(it.id, it);
    return Array.from(uniq.values());
  }, [tournament, participants]);

  const options = useMemo(
    () =>
      selectableItems.map((item) => ({
        value: item.id,
        label: item.displayName(false),
      })),
    [selectableItems]
  );

  /** Универсально определяем победителя и проигравшего по счёту и id A/B. */
  const determineWinnerLoser = useCallback(
    (scores: [number, number][], aId: number, bId: number) => {
      const [winner, loser] = Match.getWinnerId(scores, aId, bId);
      if (!winner) return { winnerId: null, loserId: null };
      return { winnerId: winner, loserId: loser };
    },
    []
  );

  /** Быстрое добавление «ручного» матча (карточка сверху) + автосвап для пирамиды. */
  const handleAddMatch = useCallback(async () => {
    if (!tournament) return;
    if (selectedIds.length < 2 || !matchDate) {
      alert("Выбери двух игроков и дату матча");
      return;
    }

    try {
      const scores = Match.parseScoreStringFlexible(matchScore);
      const [aId, bId] = selectedIds;
      const { winnerId, loserId } = determineWinnerLoser(scores, aId, bId);
      const attackerWon = winnerId != null && winnerId === aId;

      await addMatchAndMaybeSwap({
        date: new Date(matchDate),
        type: tournament.tournament_type,
        scores,
        aId,
        bId,
        winnerId,
        loserId,
        doSwap: tournament.isPyramid() && attackerWon,
      });

      // только UI-сброс
      setMatchDate(todayISO);
      setMatchScore("");
      setSelectedIds(user?.role === UserRole.Player && user.player.id ? [user.player.id] : []);
    } catch (e) {
      console.error(e);
      alert("Не удалось добавить матч");
    }
  }, [
    tournament,
    selectedIds,
    matchDate,
    matchScore,
    user?.role,
    user?.player.id,
    addMatchAndMaybeSwap,
    determineWinnerLoser,
  ]);

  /** Сохранение счёта из схем (RR/SE/DE/Groups+PO/Swiss/…) */
  const handleSaveScore = useCallback(
    async (
      aId: number,
      bId: number,
      score: string,
      meta: MatchPhase
    ) => {
      if (!tournament) return;

      try {
        const scores = Match.parseScoreStringFlexible(score);

        // Ищем существующий матч по паре + фазовым полям (если заданы)
        const existing = matches.find((m) => {
          const id1 = m.player1?.id ?? m.team1?.id ?? 0;
          const id2 = m.player2?.id ?? m.team2?.id ?? 0;
          const samePair = (id1 === aId && id2 === bId) || (id1 === bId && id2 === aId);
          if (!samePair) return false;
          if (!meta) return true; // обратная совместимость (старые матчи без phase)
          const phaseOk = (m as any).phase === meta.phase;
          const groupOk =
            meta.phase === PhaseType.Group ? ((m as any).groupIndex ?? null) === (meta.groupIndex ?? null) : true;
          const roundOk =
            meta.phase === PhaseType.Playoff ? ((m as any).roundIndex ?? null) === (meta.roundIndex ?? null) : true;
          return phaseOk && groupOk && roundOk;
        });

        const isSingle =
          typeof tournament.isSingle === "function"
            ? tournament.isSingle()
            : tournament.tournament_type === "single";

        if (existing) {
          // UPDATE: обновляем счёт + (по возможности) фазовые поля
          const updated = { ...existing, scores } as Match;
          if (meta) {
            (updated as any).phase = meta.phase;
            if (meta.phase === PhaseType.Group) {
              (updated as any).groupIndex = meta.groupIndex ?? null;
              (updated as any).roundIndex = null;
            } else if (meta.phase === PhaseType.Playoff) {
              (updated as any).roundIndex = meta.roundIndex ?? null;
              (updated as any).groupIndex = null;
            }
          }
          await updateMatch(updated);
        } else {
          // INSERT: создаём новый матч и сразу проставляем фазу/индексы
          const date = new Date(todayISO);
          let player1: number | null = null;
          let player2: number | null = null;
          let team1: number | null = null;
          let team2: number | null = null;

          if (isSingle) {
            player1 = aId;
            player2 = bId;
          } else {
            team1 = aId;
            team2 = bId;
          }

          await addMatch({
            date,
            type: tournament.tournament_type,
            scores,
            player1,
            player2,
            team1,
            team2,
            tournamentId: tournament.id,
            phase: meta?.phase,
            groupIndex: meta?.phase === PhaseType.Group ? meta.groupIndex ?? null : null,
            roundIndex: meta?.phase === PhaseType.Playoff ? meta.roundIndex ?? null : null,
          });
        }

        // NB: тут остаётся reload(), т.к. это общий путь для разных схем.
        await reload({ silent: true });
      } catch (err) {
        console.error("Ошибка при сохранении счёта:", err);
        alert(err instanceof Error ? err.message : "Не удалось сохранить счёт");
      }
    },
    [tournament, matches, updateMatch, addMatch, reload]
  );

  // Функции для управления глобальной клавиатурой
  const openKeyboard = useCallback((
    editingKey: string,
    context: { participantA: Participant; participantB: Participant },
    initialValue: string,
    phaseFilter: MatchPhase
  ) => {
    setKeyboardState({
      isOpen: true,
      editingKey,
      mobileKeyboardContext: context,
      editValue: initialValue,
      phaseFilter,
    });
  }, []);

  const closeKeyboard = useCallback(() => {
    setKeyboardState({
      isOpen: false,
      editingKey: null,
      mobileKeyboardContext: null,
      editValue: "",
      phaseFilter: DEFAULT_MATCH_PHASE,
    });
  }, []);

  const updateKeyboardValue = useCallback((value: string) => {
    setKeyboardState(prev => ({ ...prev, editValue: value }));
  }, []);

  const handleKeyboardSave = useCallback(async () => {
    if (!keyboardState.mobileKeyboardContext) return;

    const { participantA: aId, participantB: bId } = keyboardState.mobileKeyboardContext;
    const score = keyboardState.editValue.trim();

    if (!score) {
      alert('Введите счёт');
      return;
    }

    try {
      await handleSaveScore(aId.getId, bId.getId, score, keyboardState.phaseFilter);
      closeKeyboard();
    } catch (err) {
      console.error("Ошибка при сохранении счёта:", err);
      alert(err instanceof Error ? err.message : "Не удалось сохранить счёт");
    }
  }, [keyboardState, closeKeyboard]);

  const handleEditMatchSave = useCallback(
    async (updatedMatch: Match) => {
      try {
        await updateMatch(updatedMatch);
      } catch (err) {
        console.error("Ошибка при обновлении матча:", err);
        alert("Не удалось обновить матч");
      }
    },
    [updateMatch]
  );

  const handleDeleteMatch = useCallback(
    async (match: Match) => {
      try {
        await deleteMatch(match);
      } catch (err) {
        console.error("Ошибка при удалении матча:", err);
        alert("Не удалось удалить матч");
      }
    },
    [deleteMatch]
  );

  const handleShowHistoryPlayer = useCallback((participant: Participant) => {
    setHistoryParticipant(participant);
    setHistoryOpen(true);
  }, []);

  if (!tournament) return <p>Загрузка...</p>;

  const isAnon = user?.role === undefined;
  const isPlayerWithFixedAttacker = user?.role === UserRole.Player && !!user?.player.id;
  const className = user ? "page-container-no-padding" : "page-container";

  return (
    <div className={className}>
      {isWizard ? 
        <h1 className="page-title">{tournament.name}</h1> :
        <SimpleBreadcrumbs clubName={tournament.club?.name} tournamentName={tournament.name}/>}

      <div className="page-content-container">
        <div className="card-grid">
          <TournamentCard
            tournament={tournament}
            participantsCount={participants.length}
            matchesCount={matches.length}
            displayName={false}
            onStatusChange={setTournamentStatus}
          />
        </div>

        {/* Контент вкладок */}
        <div>
          <ScrollableTabs
            items={tabs}
            value={view}
            onChange={(k) => setView(k as ViewKey)}
            ariaLabel="Разделы турнира"
          />

          {/* Добавление матча — карточка */}
          {tournament.isPyramid() && tournament.status === TournamentStatus.Ongoing && view === "bracket" && (
            <LoggedIn>
              <AddMatchCard
                options={options}
                selectedIds={selectedIds}
                setSelectedIds={setSelectedIds}
                matchDate={matchDate}
                setMatchDate={setMatchDate}
                matchScore={matchScore}
                setMatchScore={setMatchScore}
                isAnon={isAnon}
                isPlayerWithFixedAttacker={isPlayerWithFixedAttacker}
                onAddMatch={handleAddMatch}
              />
            </LoggedIn>
          )}

          {tournament.isCustom() && tournament.status === TournamentStatus.Ongoing && view === "matches" && (
            <LoggedIn>
              <AddMatchCard
                options={options}
                selectedIds={selectedIds}
                setSelectedIds={setSelectedIds}
                matchDate={matchDate}
                setMatchDate={setMatchDate}
                matchScore={matchScore}
                setMatchScore={setMatchScore}
                isAnon={isAnon}
                isPlayerWithFixedAttacker={isPlayerWithFixedAttacker}
                onAddMatch={handleAddMatch}
              />
            </LoggedIn>
          )}

          <div>
            {view === "bracket" &&             
              <FormatView
                loading={loading}
                tournament={tournament}
                canManage={canManage}
                participants={participants}
                matches={matches}
                selectedIds={selectedIds}
                onSelect={setSelectedIds}
                onShowHistoryPlayer={handleShowHistoryPlayer}
                onSaveScore={handleSaveScore}
                onPositionsChange={updatePositions}
                onGoToParticipants={canManage ? () => setView("participants") : undefined}
                // Передаем функции для управления клавиатурой
                onOpenKeyboard={openKeyboard}
                onCloseKeyboard={closeKeyboard}
                keyboardState={keyboardState}
              />}

            {view === "matches" && 
              <MatchHistoryView 
                matches={matches} 
                onEditMatch={handleEditMatchSave} 
                onDeleteMatch={handleDeleteMatch} />}

            {view === "participants" && canManage &&
              <TournamentParticipantsView isWizard={isWizard}/>}

            {view === "results" && <RatingView />}
            
            {view === "aboutt" && 
              <AboutTournament />}
          </div>
        </div>

        {/* Глобальная клавиатура */}
        {keyboardState.isOpen && (
          <ScoreKeyboard
            inputRef={editingInputRef}
            participantA={keyboardState.mobileKeyboardContext ? keyboardState.mobileKeyboardContext?.participantA.displayName() : ""}
            participantB={keyboardState.mobileKeyboardContext ? keyboardState.mobileKeyboardContext?.participantB.displayName() : ""}
            value={keyboardState.editValue}
            onChange={updateKeyboardValue}
            onSave={handleKeyboardSave}
            onCancel={closeKeyboard}
            disabled={false}
            autoFocus={false}
          />
        )}

        {/* Модалка истории */}
        {historyParticipant && (
          <MatchHistoryModal
            isOpen={historyOpen}
            onClose={() => setHistoryOpen(false)}
            participant={historyParticipant}
            matches={matches}
            onEditMatch={handleEditMatchSave}
            onDeleteMatch={handleDeleteMatch}
          />
        )}
      </div>
    </div>
  );
}

// Вспомогательный мемо-компонент для схемы
export const FormatView = React.memo(function FormatView({
  loading,
  tournament,
  canManage,
  participants,
  matches,
  selectedIds,
  onSelect,
  onShowHistoryPlayer,
  onSaveScore: onSaveScoreRoundRobin,
  onPositionsChange,
  onGoToParticipants,
  onOpenKeyboard,
  onCloseKeyboard,
  keyboardState,
}: {
  loading: boolean;
  tournament: Tournament;
  canManage: boolean;
  participants: Participant[];
  matches: Match[];
  selectedIds: number[];
  onSelect: (ids: number[]) => void;
  onShowHistoryPlayer: (participant: Participant) => void;
  onSaveScore: (
    aId: number,
    bId: number,
    score: string,
    meta: MatchPhase
  ) => void;
  onPositionsChange?: (next: Participant[]) => Promise<void> | void;
  onGoToParticipants?: () => void;
  onOpenKeyboard?: (
    editingKey: string,
    context: { participantA: Participant; participantB: Participant },
    initialValue: string,
    phaseFilter: MatchPhase
  ) => void;
  onCloseKeyboard?: () => void;
  keyboardState?: KeyboardState;
}) {
  const handleShowHistory = useCallback(
    (participant?: Participant) => {
      if (participant) onShowHistoryPlayer(participant);
    },
    [onShowHistoryPlayer]
  );

  if (tournament.isCustom()) {
    return null;
  }

  if ( loading ) {
    return <div>Загрузка</div>;
  }

  if (participants.length === 0) {
    if (onGoToParticipants) {
      return (
        <div className="empty-participants">
          <button type="button" className="btn-base empty-participants__button" onClick={onGoToParticipants}>
            Добавьте участников в турнир
          </button>
        </div>
      );
    }
    return <div>Добавьте участников в турнир</div>;
  }

  if (tournament.isRoundRobin()) {
    return (
      <RoundRobinView 
        participants={participants} 
        matches={matches} 
        canManage={canManage}
        onSaveScore={onSaveScoreRoundRobin}
        onOpenKeyboard={onOpenKeyboard}
        onCloseKeyboard={onCloseKeyboard}
        keyboardState={keyboardState}
      />      
    );
  }

  if (tournament.isSingleElimination()) {
    return (
      <SingleEliminationView 
        participants={participants} 
        matches={matches} 
        canManage={canManage}
        onSaveScore={onSaveScoreRoundRobin}
        onOpenKeyboard={onOpenKeyboard}
        onCloseKeyboard={onCloseKeyboard}
        keyboardState={keyboardState}
      />
    );
  }

  if (tournament.isDoubleElimination()) {
    return (
      <DoubleEliminationView 
        participants={participants} 
        matches={matches} 
        canManage={canManage}
        onSaveScore={onSaveScoreRoundRobin}
        onOpenKeyboard={onOpenKeyboard}
        onCloseKeyboard={onCloseKeyboard}
        keyboardState={keyboardState}
      />
    );
  }

  if (tournament.isGroupsPlayoff()) {
    return (
      <GroupPlusPlayoffView
        participants={participants}
        matches={matches}
        canManage={canManage}
        onSaveScore={onSaveScoreRoundRobin}
        groupsCount={tournament.settings.groupsplayoff ? tournament.settings.groupsplayoff.groupsCount : 2}
        onOpenKeyboard={onOpenKeyboard}
        onCloseKeyboard={onCloseKeyboard}
        keyboardState={keyboardState}
      />
    );
  }

  if (tournament.isSwiss()) {
    return (
      <SwissView 
        participants={participants} 
        matches={matches} 
        canManage={canManage}
        onSaveScore={onSaveScoreRoundRobin} 
        roundsCount={5}
        onOpenKeyboard={onOpenKeyboard}
        onCloseKeyboard={onCloseKeyboard}
        keyboardState={keyboardState}
      />
    );
  }

  // "pyramid" и fallback используют один и тот же обработчик
  return (
    <PyramidView
      participants={participants}
      selectedIds={selectedIds}
      onSelect={onSelect}
      onShowHistory={handleShowHistory}
      matches={matches}
      onPositionsChange={onPositionsChange}
      maxLevel={tournament.settings.pyramid ? tournament.settings.pyramid.maxLevel : 5}
      onOpenKeyboard={onOpenKeyboard}
      onCloseKeyboard={onCloseKeyboard}
      keyboardState={keyboardState}
    />
  );
  
});