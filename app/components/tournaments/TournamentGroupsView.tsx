"use client";

import {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import "./TournamentGroupsView.css";

import { Participant } from "@/app/models/Participant";
import { useTournament } from "@/app/tournaments/[slug]/TournamentProvider";
import { useDictionary } from "@/app/components/LanguageProvider";
import { KebabIconButton, PlusIconButton } from "../controls/IconButtons";

type LocalAssignments = Record<number, number | null>;

const MOBILE_BREAKPOINT = 900;

export function TournamentGroupsView() {
  const {
    participants,
    tournament,
    groupsAssignments,
    matches,
    updateGroupsAssignments,
    mutating,
  } = useTournament();
  const { tournaments } = useDictionary();
  const viewText = tournaments.groupsView;

  const groupsCount = Math.max(
    1,
    Number(
      (tournament?.settings?.groupsplayoff as any)?.participantsInGroupCount ?? 2
    )
  );

  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.innerWidth < MOBILE_BREAKPOINT;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const media = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`);
    const handleChange = (event: MediaQueryListEvent | MediaQueryList) => {
      setIsMobile(event.matches);
    };

    handleChange(media);
    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, []);

  const initialAssignments = useMemo<LocalAssignments>(() => {
    const base: LocalAssignments = {};
    participants.forEach((participant) => {
      const id = participant.getId;
      base[id] =
        typeof groupsAssignments[id] === "number"
          ? groupsAssignments[id]
          : null;
    });
    return base;
  }, [participants, groupsAssignments]);

  const [localAssignments, setLocalAssignments] = useState<LocalAssignments>(
    initialAssignments
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [assignMenuTarget, setAssignMenuTarget] = useState<number | null>(
    null
  );
  const [actionMenuTarget, setActionMenuTarget] = useState<number | null>(
    null
  );
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const [openGroups, setOpenGroups] = useState<number[]>([]);

  useEffect(() => {
    setOpenGroups(Array.from({ length: groupsCount }, (_, index) => index));
  }, [groupsCount]);

  useEffect(() => {
    setLocalAssignments(initialAssignments);
    setSearchTerm("");
    setAssignMenuTarget(null);
    setActionMenuTarget(null);
  }, [initialAssignments]);

  useEffect(() => {
    if (actionMenuTarget == null) return;
    const handleOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;
      if (target.closest("[data-groups-menu]") || target.closest("[data-menu-trigger]") ) {
        return;
      }
      setActionMenuTarget(null);
    };

    document.addEventListener("mousedown", handleOutside, true);
    return () => document.removeEventListener("mousedown", handleOutside, true);
  }, [actionMenuTarget]);

  const capacityPerGroup = useMemo(() => {
    if (groupsCount <= 0) return participants.length || 0;
    return Math.ceil(participants.length / groupsCount) || participants.length;
  }, [participants.length, groupsCount]);

  const { groupMembers, unassigned } = useMemo(() => {
    const groups = Array.from({ length: groupsCount }, () => [] as Participant[]);
    const unassignedList: Participant[] = [];

    for (const participant of participants) {
      const entityId = participant.getId;
      const groupIndex = localAssignments[entityId];
      if (
        typeof groupIndex === "number" &&
        groupIndex >= 0 &&
        groupIndex < groupsCount
      ) {
        groups[groupIndex].push(participant);
      } else {
        unassignedList.push(participant);
      }
    }

    const sortByName = (list: Participant[]) =>
      list
        .slice()
        .sort((a, b) => a.displayName(false).localeCompare(b.displayName(false), "ru"));

    return {
      groupMembers: groups.map(sortByName),
      unassigned: sortByName(unassignedList),
    };
  }, [participants, localAssignments, groupsCount]);

  const filteredUnassigned = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return unassigned;
    return unassigned.filter((participant) =>
      participant.displayName(false).toLowerCase().includes(term)
    );
  }, [unassigned, searchTerm]);

  const isDirty = useMemo(() => {
    const assignedOnly: Record<number, number> = {};
    Object.entries(localAssignments).forEach(([key, value]) => {
      if (typeof value === "number") {
        assignedOnly[Number(key)] = value;
      }
    });

    const savedKeys = Object.keys(groupsAssignments);
    const localKeys = Object.keys(assignedOnly);
    if (savedKeys.length !== localKeys.length) return true;
    return localKeys.some((key) => groupsAssignments[Number(key)] !== assignedOnly[Number(key)]);
  }, [localAssignments, groupsAssignments]);

  const handleAssign = useCallback(
    (participantId: number, groupIndex: number | null) => {
      setLocalAssignments((prev) => ({ ...prev, [participantId]: groupIndex }));
    },
    []
  );

  const handleAutoDistribute = useCallback(() => {
    const nextAssignments: LocalAssignments = { ...localAssignments };
    const lengths = groupMembers.map((group) => group.length);
    const queue = unassigned.slice();

    queue.forEach((participant) => {
      const id = participant.getId;
      let targetIndex = 0;
      let min = lengths[0] ?? 0;
      for (let i = 1; i < groupsCount; i += 1) {
        if (lengths[i] < min) {
          min = lengths[i];
          targetIndex = i;
        }
      }

      if (lengths[targetIndex] >= capacityPerGroup) {
        // если все группы заполнены, размещаем в последнюю доступную
        const fallback = lengths.findIndex((len) => len < capacityPerGroup);
        if (fallback >= 0) {
          targetIndex = fallback;
        }
      }

      lengths[targetIndex] += 1;
      nextAssignments[id] = targetIndex;
    });

    setLocalAssignments(nextAssignments);
  }, [localAssignments, unassigned, groupMembers, groupsCount, capacityPerGroup]);

  const handleSave = useCallback(async () => {
    const payload: Record<number, number> = {};
    Object.entries(localAssignments).forEach(([key, value]) => {
      if (typeof value === "number") {
        payload[Number(key)] = value;
      }
    });
    try {
      await updateGroupsAssignments(payload);
    } catch (error) {
      console.error("Failed to update groups assignments", error);
      alert(viewText.errors.saveFailed);
    }
  }, [localAssignments, updateGroupsAssignments, viewText.errors.saveFailed]);

  const handleCancel = useCallback(() => {
    setLocalAssignments(initialAssignments);
  }, [initialAssignments]);

  const groupNames = useMemo(() =>
    Array.from({ length: groupsCount }, (_, index) =>
      viewText.labels.groupTitle.replace("{index}", String(index + 1))
    ),
  [groupsCount, viewText.labels.groupTitle]);

  const renderParticipantLabel = (participant: Participant) => (
    <span className="groups-participant-name">
      {participant.displayName(false)}
    </span>
  );

  const renderGroupActions = (
    participant: Participant,
    currentGroupIndex: number | null
  ) => {
    const id = participant.getId;
    const isMenuOpen = actionMenuTarget === id;
    const openMenu = () => {
      setAssignMenuTarget(null);
      setActionMenuTarget((prev) => (prev === id ? null : id));
    };

    return (
      <div className="groups-participant-actions">
        <KebabIconButton
          type="button"
          title={viewText.actions.menuTitle}
          aria-label={viewText.actions.menuTitle}
          onClick={openMenu}
          data-menu-trigger
        />
        {isMenuOpen && (
          <div className="groups-menu" data-groups-menu>
            <div className="groups-menu__title">{viewText.actions.moveTo}</div>
            {groupNames.map((name, index) => {
              const isCurrent = currentGroupIndex === index;
              const isFull =
                groupMembers[index].length >= capacityPerGroup && !isCurrent;
              return (
                <button
                  key={index}
                  type="button"
                  className="groups-menu__item"
                  onClick={() => {
                    setActionMenuTarget(null);
                    if (isCurrent) return;
                    handleAssign(participant.getId, index);
                  }}
                  disabled={isFull || isCurrent}
                >
                  {name}
                </button>
              );
            })}
            <div className="groups-menu__divider" />
            <button
              type="button"
              className="groups-menu__item groups-menu__item--danger"
              onClick={() => {
                setActionMenuTarget(null);
                handleAssign(participant.getId, null);
              }}
            >
              {viewText.actions.remove}
            </button>
          </div>
        )}
      </div>
    );
  };

  const renderAssignMenu = (participant: Participant) => {
    const id = participant.getId;
    const isOpen = assignMenuTarget === id;
    return (
      <div className="groups-participant-actions">
        <PlusIconButton
          type="button"
          title={viewText.actions.addToGroup}
          aria-label={viewText.actions.addToGroup}
          onClick={() => {
            setActionMenuTarget(null);
            setAssignMenuTarget((prev) => (prev === id ? null : id));
          }}
          data-menu-trigger
        />
        {isOpen && (
          <div className="groups-menu" data-groups-menu>
            <div className="groups-menu__title">{viewText.actions.addToGroup}</div>
            {groupNames.map((name, index) => {
              const isFull = groupMembers[index].length >= capacityPerGroup;
              return (
                <button
                  key={index}
                  type="button"
                  className="groups-menu__item"
                  onClick={() => {
                    setAssignMenuTarget(null);
                    handleAssign(participant.getId, index);
                  }}
                  disabled={isFull}
                >
                  {name}
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  const renderGroupColumn = (groupIndex: number) => {
    const members = groupMembers[groupIndex];
    const header = viewText.labels.groupHeader
      .replace("{index}", String(groupIndex + 1))
      .replace("{count}", String(members.length))
      .replace("{capacity}", String(capacityPerGroup));

    const body = (
      <div className="groups-column-body">
        {members.length === 0 ? (
          <div className="groups-empty">{viewText.labels.emptyGroup}</div>
        ) : (
          members.map((participant) => (
            <div key={participant.getId} className="groups-unnussigned-row">
              <div
                className="player"
              >
                {renderParticipantLabel(participant)}              
              </div>
              <div>
                {renderGroupActions(participant, groupIndex)}
              </div>
            </div>
          ))
        )}
      </div>
    );

    if (!isMobile) {
      return (
        <div key={groupIndex} className="groups-column card">
          <div className="card-title">{header}</div>
          {body}
        </div>
      );
    }

    return (
      <div key={groupIndex} className="groups-column card">
        <div className="card-title">{header}</div>
        {openGroups.includes(groupIndex) && body}
      </div>
    );
  };

  return (
    <div className="groups-view">
      <div className="groups-toolbar">
        <h2 className="groups-title">{viewText.title}</h2>
        <div className="groups-toolbar-actions">
          <button
            type="button"
            className="btn-base"
            onClick={handleAutoDistribute}
            disabled={mutating || unassigned.length === 0}
          >
            {viewText.actions.autoDistribute}
          </button>
          <button
            type="button"
            className="btn-base"
            onClick={handleCancel}
            disabled={!isDirty || mutating}
          >
            {viewText.actions.cancel}
          </button>
          <button
            type="button"
            className="btn-base"
            onClick={handleSave}
            disabled={!isDirty || mutating || matches.length > 0 || tournament?.isActive()}
          >
            {viewText.actions.save}
          </button>
        </div>
      </div>

      <div className="groups-columns">
        <div className="groups-column groups-column--unassigned card">
          <div className="card-title">
            {viewText.labels.unassignedHeader.replace("{count}", String(unassigned.length))}
          </div>

          <div className="groups-column-body">
            <div className="groups-search">
              <input
                ref={searchInputRef}
                type="text"
                className="input"
                value={searchTerm}
                placeholder={viewText.labels.searchPlaceholder}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </div>

            {filteredUnassigned.length === 0 ? (
              <div className="groups-empty">{viewText.labels.noUnassigned}</div>
            ) : (
              filteredUnassigned.map((participant) => (
                <div key={participant.getId} className="groups-unnussigned-row">
                  <div
                    className="player"
                  >
                    {renderParticipantLabel(participant)}                  
                  </div>
                  <div>
                    {renderAssignMenu(participant)}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="card-container">
          {groupMembers.map((_, groupIndex) => (
            <Fragment key={groupIndex}>{renderGroupColumn(groupIndex)}</Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
