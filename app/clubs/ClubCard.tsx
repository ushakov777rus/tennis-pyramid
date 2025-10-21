"use client";

import "./clubs.css";
import { Club } from "../models/Club";
import { ApplyIconButton, DeleteIconButton } from "../components/controls/IconButtons";
import { AdminOnly, PlayerOnly } from "../components/RoleGuard";
import { ClubFallbackLogo } from "./ClubLogo";
import { useState } from "react";
import { useDictionary } from "../components/LanguageProvider";

type Props = {
  club: Club | null;
  displayName: boolean;
  onClick?: () => void;
  onDelete?: (clubId: number) => void;
};

export function ClubCard({ club, displayName, onClick, onDelete }: Props) {
  // состояние для временного тултипа "Пока не реализовано"
  const [showTooltip, setShowTooltip] = useState(false);
  const { clubs: clubsText } = useDictionary();
  
  const className = `card card-800px ${onClick ? "clickable" : ""}`;

  if (club == null) {
    return (
      <div>
        <div className="badge-inform">{clubsText.card.emptyBadge}</div>
      
        <div className={className} onClick={onClick}>      
          <div className="card-add">
            +
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={className} onClick={onClick} aria-label={clubsText.card.openAria.replace("{name}", club.name)}>
      <div className="card-header">
        <div>{club.city}</div>
        {displayName && (
          <h3>{club.name}</h3>
        )}
      </div>
      
      
      <button className="club-card-main">
        <div className="club-card-logo">
          {club.logo_url
            ? <img src={club.logo_url} alt={club.name} />
            : <ClubFallbackLogo title={club.name} className="club-fallback" />}
        </div>
        <div className="club-card-info">
          <div className="club-card-meta">{clubsText.card.membersLabel.replace("{count}", String(club.members_count ?? 0))}</div>
          <div className="club-card-meta">{clubsText.card.tournamentsLabel.replace("{count}", String(club.tournaments_count ?? 0))}</div>
          {club.description && <div className="club-card-desc" title={club.description}>{club.description}</div>}
        </div>
      </button>

      <PlayerOnly>
        <ApplyIconButton
          title={clubsText.card.applyTitle}
          onClick={(e) => {
            e.stopPropagation();
            setShowTooltip(true);
            setTimeout(() => setShowTooltip(false), 2000); // показываем тултип на 2 сек
          }}
        />
      </PlayerOnly>

      <AdminOnly>
        <div className="card-bottom-toolbar">
          {onDelete && (
            <DeleteIconButton
              title={clubsText.card.deleteTitle}
              onClick={(e) => {
                e.stopPropagation();
                onDelete(club.id);
              }}
            />
          )}
        </div>
      </AdminOnly>

      {/* тултип "Пока не реализовано" */}
      {showTooltip && <div className="invalid-tooltip">{clubsText.card.tooltip}</div>}
      
    </div>
  );
}
