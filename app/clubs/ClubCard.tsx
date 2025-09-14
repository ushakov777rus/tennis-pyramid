"use client";

import "./clubs.css";
import { Club } from "../models/Club";
import { ApplyIconButton, DeleteIconButton } from "../components/IconButtons";
import { AdminOnly, PlayerOnly } from "../components/RoleGuard";
import { ClubFallbackLogo } from "./ClubLogo";

type Props = {
  club: Club | null;
  displayName: boolean;
  onClick?: () => void;
  onDelete?: (clubId: number) => void;
};

export function ClubCard({ club, displayName, onClick, onDelete }: Props) {
const className = `card card-800px ${onClick ? "clickable" : ""}`;

if (club == null) {
  return (
    <div className={className} onClick={onClick}>
      <div>Клубы не найдены, для того чтобы начать работу - создайте клуб и добавьте в него игроков</div>
      <div className="card-add">
        +
      </div>
    </div>
  );
}

  return (
    <div className={className} onClick={onClick} aria-label={`Открыть клуб ${club.name}`}>
      <div className="card-head">
        {displayName && (
          <h3>{club.name}</h3>
        )}

        <div className="match-card-date">{club.city}</div>
      </div>
      
      
      <button className="club-card-main">
        <div className="club-card-logo">
          {club.logo_url
            ? <img src={club.logo_url} alt={club.name} />
            : <ClubFallbackLogo title={club.name} className="club-fallback" />}
        </div>
        <div className="club-card-info">
          <div className="club-card-meta">Участников: {club.members_count ?? 0}</div>
          <div className="club-card-meta">Турниров: {club.tournaments_count ?? 0}</div>
          {club.description && <div className="club-card-desc" title={club.description}>{club.description}</div>}
        </div>
      </button>

      <PlayerOnly>
        <ApplyIconButton
          title="Подать заявку на участие"
          onClick={(e) => {
            e.stopPropagation();

          }}
        />
      </PlayerOnly>

      <AdminOnly>
        <div className="card-bottom-toolbar">
          {onDelete && (
            <DeleteIconButton
              title="Удалить турнир"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(club.id);
              }}
            />
          )}
        </div>
      </AdminOnly>
      
    </div>
  );
}