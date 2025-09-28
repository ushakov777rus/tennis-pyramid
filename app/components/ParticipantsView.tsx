"use client";

import "@/app/components/ParticipantsView.css";
import React, { useMemo, useState } from "react";
import { Player } from "@/app/models/Player";
import { Participant } from "@/app/models/Participant";
import {
  CreateTeamIconButton,
  DeleteIconButton,
  PlusIconButton,
} from "./controls/IconButtons";
import { AdminOnly } from "./RoleGuard";
import { PlayersRepository } from "@/app/repositories/PlayersRepository"; // [NEW] для создания игрока

/* ===================== Типы пропсов (два режима) ===================== */

type TournamentModeProps = {
  mode: "tournament";
  // состояния
  initialLoading: boolean;
  refreshing: boolean;
  mutating: boolean;
  // данные
  isDouble: boolean;
  participants: Participant[]; // участники турнира (Player/Team внутри)
  players: Player[];           // все доступные игроки (для добавления)
  // действия
  onAddPlayerToTournament?: (playerId: number) => void | Promise<void>;
  onRemoveParticipant?: (participant: Participant) => void | Promise<void>;
  onCreateTeam?: (player1Id: number, player2Id: number) => void | Promise<void>;
  canManage?: boolean;
};

type ClubModeProps = {
  mode: "club";
  // состояния
  initialLoading: boolean;
  refreshing: boolean;
  mutating: boolean;
  // данные
  members: Player[]; // члены клуба
  players: Player[]; // все доступные игроки (для добавления в клуб)
  // действия
  onAddPlayerToClub?: (playerId: number) => void | Promise<void>;
  onRemoveMember?: (playerId: number) => void | Promise<void>;
  canManage?: boolean;
};

export type ParticipantsViewProps = TournamentModeProps | ClubModeProps;

/* ===================== Вспомогательные ===================== */

function InlineSpinner() {
  return <span className="inline-spinner" aria-label="Loading" />;
}

function nameOfPlayerOrParticipant(x: Player | Participant): string {
  if ((x as Player).displayName) {
    return (x as Player).displayName(false);
  }
  return (x as Participant).displayName(false);
}

/* ===================== Универсальный UI ===================== */

export function ParticipantsView(props: ParticipantsViewProps) {
  const { initialLoading, refreshing, mutating } = props;

  // Фильтры
  const [leftFilter, setLeftFilter] = useState("");
  const [rightFilter, setRightFilter] = useState("");
  const lf = leftFilter.trim().toLowerCase();
  const rf = rightFilter.trim().toLowerCase();

  // [NEW] Локальный статус «создаём игрока» (не трогаем внешний mutating)
  const [creating, setCreating] = useState(false);
  const canManage = (props as any).canManage ?? false;
  const renderControls = (content: React.ReactNode) => {
    if (!content) return null;
    return canManage ? <>{content}</> : <AdminOnly>{content}</AdminOnly>;
  };

  // TUR: список уже в турнире; CLUB: список членов клуба
  const rightList: (Participant | Player)[] = useMemo(() => {
    if (props.mode === "tournament") {
      return rf
        ? props.participants.filter((p) =>
            p.displayName(false).toLowerCase().includes(rf)
          )
        : props.participants;
    } else {
      return rf
        ? props.members.filter((p) =>
            p.displayName(false).toLowerCase().includes(rf)
          )
        : props.members;
    }
  }, [props, rf]);

  // TUR: свободные игроки = players \ participantIds; CLUB: доступные игроки = players \ memberIds
  const leftBasePlayers: Player[] = useMemo(() => {
    if (props.mode === "tournament") {
      const participantIds = new Set<number>(
        props.participants.flatMap((p) => (p.player ? [p.player.id] : []))
      );
      return props.players.filter((pl) => !participantIds.has(pl.id));
    } else {
      const memberIds = new Set<number>(props.members.map((m) => m.id));
      return props.players.filter((pl) => !memberIds.has(pl.id));
    }
  }, [props]);

  const leftList: Player[] = useMemo(
    () =>
      lf
        ? leftBasePlayers.filter((p) =>
            p.displayName(false).toLowerCase().includes(lf)
          )
        : leftBasePlayers,
    [leftBasePlayers, lf]
  );

  // Поддержка выбора 2 игроков для создания команды (только в турнире 2×)
  const [selectedPlayers, setSelectedPlayers] = useState<Player[]>([]);
  const lastSelectedId = selectedPlayers.length
    ? selectedPlayers[selectedPlayers.length - 1].id
    : undefined;

  const toggleSelectPlayer = (player: Player) => {
    setSelectedPlayers((sel) => {
      if (sel.some((sp) => sp.id === player.id)) return sel.filter((sp) => sp.id !== player.id);
      if (sel.length === 2) return [player];
      return [...sel, player];
    });
  };

  const createTeam = () => {
    if (props.mode !== "tournament") return;
    if (!props.isDouble || !props.onCreateTeam) return;
    if (selectedPlayers.length === 2) {
      void props.onCreateTeam(selectedPlayers[0].id, selectedPlayers[1].id);
      setSelectedPlayers([]);
    }
  };

  // [NEW] Создать игрока по тексту фильтра слева и сразу прикрепить:
  // - в турнир (mode="tournament") через onAddPlayerToTournament
  // - в клуб   (mode="club")      через onAddMember
// [NEW] Создать игрока по тексту фильтра слева и сразу прикрепить:
  const handleCreatePlayerAndAttach = async () => {
    const rawName = leftFilter.trim();
    if (!rawName) return;
    if (props.mode === "tournament" && !props.onAddPlayerToTournament) return;
    if (props.mode === "club" && !props.onAddPlayerToClub) return;

    try {
      setCreating(true);

      const newPlayerId = await PlayersRepository.createNewPlayer(
        { name: rawName, ntrp: "" },
        null // clubId не задаём здесь; членство оформим отдельным вызовом
      );
      if (!newPlayerId) return;

      if (props.mode === "tournament") {
        // 1) всегда добавляем в турнир
        await props.onAddPlayerToTournament?.(newPlayerId);

        // 2) если доступен коллбэк добавления в клуб — добавим и в клуб
        if ("onAddPlayerToClub" in props && typeof (props as any).onAddPlayerToClub === "function") {
          await (props as any).onAddPlayerToClub(newPlayerId);
        }
      } else {
        // режим клуба — добавляем только в клуб
        await props.onAddPlayerToClub?.(newPlayerId);
      }

      // По желанию очистить фильтр, чтобы сразу увидеть обновлённый список
      // setLeftFilter("");
    } finally {
      setCreating(false);
    }
  };

  if (initialLoading) return <p>Загрузка...</p>;

  const maxRows = Math.max(leftList.length, rightList.length);
  
  const leftTitle =
    props.mode === "tournament"
      ? props.isDouble
        ? "Игроки (для пар)"
        : "Игроки"
      : "Игроки (добавить в клуб)";

  const rightTitle =
    props.mode === "tournament" ? "Участники турнира" : "Члены клуба";

  return (
    <table
      className="participants-table"
      aria-busy={refreshing || mutating || creating}
    >
      <colgroup>
        <col style={{ width: "40%" }} />
        <col style={{ width: "10%" }} />
        <col style={{ width: "40%" }} />
        <col style={{ width: "10%" }} />
      </colgroup>

      <thead>
        <tr>
          <th colSpan={2} style={{ width: "50%" }}>
            {leftTitle}
          </th>
          <th colSpan={2} style={{ width: "50%", position: "relative" }}>
            {rightTitle}{" "}
            {refreshing || mutating || creating ? <InlineSpinner /> : null}
          </th>
        </tr>
      </thead>

      <tbody>
        {/* фильтры */}
        <tr>
          <td>
            <input
              type="text"
              className="input input-100"
              placeholder="Фильтр слева (и имя для нового игрока)"
              value={leftFilter}
              onChange={(e) => setLeftFilter(e.target.value)}
            />
          </td>

          {/* Если игрок не найден — показываем кнопку «Создать игрока» и сразу добавляем куда нужно */}
          <td>
            {leftList.length === 0 && leftFilter.trim().length > 0 && ((
              props.mode === "tournament" && props.onAddPlayerToTournament) ||
              (props.mode === "club" && props.onAddPlayerToClub)
            )
              ? renderControls(
                  <PlusIconButton
                    title={
                      props.mode === "tournament"
                        ? "Создать игрока и добавить в турнир"
                        : "Создать игрока и добавить в клуб"
                    }
                    onClick={handleCreatePlayerAndAttach}
                    disabled={mutating || creating}
                  />
                )
              : null}
          </td>

          <td>
            <input
              type="text"
              className="input input-100"
              placeholder="Фильтр справа"
              value={rightFilter}
              onChange={(e) => setRightFilter(e.target.value)}
            />
          </td>
          <td />
        </tr>

        {/* контент списков */}
        {maxRows === 0 ? (
          <tr>
            <td colSpan={4} style={{ textAlign: "center", opacity: 0.7 }}>
              Ничего не найдено
            </td>
          </tr>
        ) : (
          Array.from({ length: maxRows }).map((_, i) => {
            const free = leftList[i]; // Player | undefined
            const inRight = rightList[i]; // Participant | Player | undefined

            // только в турнире 2× есть выбор пары
            const isSelectable =
              props.mode === "tournament" && props.isDouble && !!free;

            const isSelected =
              isSelectable && !!selectedPlayers.find((sp) => sp.id === free!.id);

            const showCreateHere =
              props.mode === "tournament" &&
              props.isDouble &&
              !!free &&
              isSelected &&
              free.id === lastSelectedId &&
              selectedPlayers.length === 2;

            return (
              <tr key={i}>
                {/* левая колонка */}
                <td>
                  {free ? (
                    <span
                      className={`player ${
                        isSelectable ? "clickable" : ""
                      } ${isSelected ? "active" : ""}`}
                      onClick={() =>
                        isSelectable ? toggleSelectPlayer(free) : undefined
                      }
                    >
                      {free.displayName(false)}
                    </span>
                  ) : (
                    ""
                  )}
                </td>

                <td>
                  {renderControls(
                    props.mode === "tournament" ? (
                      props.isDouble ? (
                        showCreateHere && props.onCreateTeam ? (
                          <CreateTeamIconButton
                            title="Создать команду"
                            onClick={createTeam}
                            disabled={mutating || creating}
                          />
                        ) : null
                      ) :
                        free && props.onAddPlayerToTournament ? (
                          <PlusIconButton
                            title="Добавить"
                            onClick={() =>
                              props.onAddPlayerToTournament?.(free.id)
                            }
                            disabled={mutating || creating}
                          />
                        ) : null
                    ) :
                      free && props.onAddPlayerToClub ? (
                        <PlusIconButton
                          title="Добавить в клуб"
                          onClick={() => props.onAddPlayerToClub?.(free.id)}
                          disabled={mutating || creating}
                        />
                      ) : null
                  )}
                </td>

                {/* правая колонка */}
                <td>
                  {inRight ? (
                    <span className="player">
                      {nameOfPlayerOrParticipant(inRight)}
                    </span>
                  ) : (
                    ""
                  )}
                </td>
                <td>
                  {renderControls(
                    inRight &&
                      (props.mode === "tournament"
                        ? props.onRemoveParticipant && (
                            <DeleteIconButton
                              title="Убрать из турнира"
                              onClick={() =>
                                props.onRemoveParticipant?.(inRight as Participant)
                              }
                              disabled={mutating || creating}
                            />
                          )
                        : props.onRemoveMember && (
                            <DeleteIconButton
                              title="Убрать из клуба"
                              onClick={() =>
                                props.onRemoveMember?.((inRight as Player).id)
                              }
                              disabled={mutating || creating}
                            />
                          ))
                  )}
                </td>
              </tr>
            );
          })
        )}
      </tbody>
    </table>
  );
}

/* ===================== Обёртчик для ТУРНИРА ===================== */

import { useTournament } from "@/app/tournaments/[slug]/TournamentProvider";

export function TournamentParticipantsView({ isWizard = false }: { isWizard?: boolean }) {
  const {
    initialLoading,
    refreshing,
    mutating,
    tournament,
    players,
    participants,
    createAndAddTeamToTournament,
    addPlayerToTournament,
    removeParticipant,
  } = useTournament();

  // [NEW] попробуем получить клуб (если есть ClubProvider)
  const clubCtx = useOptionalClub();

  if (!tournament) return <p>Загрузка...</p>;

  const isDouble =
    typeof tournament.isDouble === "function"
      ? tournament.isDouble()
      : tournament.tournament_type === "double";

  return (
    <ParticipantsView
      mode="tournament"
      initialLoading={initialLoading || !tournament}
      refreshing={refreshing}
      mutating={mutating}
      isDouble={isDouble}
      players={isWizard ? [] : players}
      participants={participants}
      onAddPlayerToTournament={addPlayerToTournament}
      onRemoveParticipant={removeParticipant}
      onCreateTeam={
        isDouble && createAndAddTeamToTournament
          ? (p1, p2) => createAndAddTeamToTournament(tournament.id, p1, p2)
          : undefined
      }
      canManage={isWizard}
      // [NEW] пробрасываем "добавить в клуб" только если контекст клуба есть
      {...(clubCtx?.club
        ? { onAddPlayerToClub: clubCtx.addMember }
        : {})}
    />
  );
}

/* ===================== Обёртчик для КЛУБА ===================== */

import { useClub, useOptionalClub } from "@/app/clubs/[slug]/ClubProvider";

export function ClubParticipantsView() {
  const {
    initialLoading,
    refreshing,
    mutating,
    club,
    players,
    members,
    addMember,
    removeMember,
  } = useClub();

  if (!club) return <p>Загрузка...</p>;

  return (
    <ParticipantsView
      mode="club"
      initialLoading={initialLoading || !club}
      refreshing={refreshing}
      mutating={mutating}
      players={players}
      members={members}
      onAddPlayerToClub={addMember}
      onRemoveMember={removeMember}
    />
  );
}
