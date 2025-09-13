"use client";

import "./clubs.css";
import { Club } from "../models/Club";
import { DeleteIconButton } from "../components/IconButtons";

type Props = {
  club: Club | null;
  onClick?: () => void;
  onDelete?: (clubId: number) => void;
};

export function ClubCard({ club, onClick, onDelete }: Props) {
const className = `card ${onClick ? "clickable" : ""}`;

if (club == null) {
  return (
    <div className={className} onClick={onClick}>
      <div className="card-add">
        +
      </div>
    </div>
  );
}

  return (
    <div className={className} onClick={onClick} aria-label={`Открыть клуб ${club.name}`}>
      <div className="card-head">
        <h3>{club.name}</h3>
        <div className="match-card-date">{club.city}</div>
      </div>
      
      
      <button className="club-card-main">
        <div className="club-card-logo">
          {club.logo_url ? <img src={club.logo_url} alt={club.name} /> : <span>🏆</span>}
        </div>
        <div className="club-card-info">
          <div className="club-card-meta">Участников: {club.members_count ?? 0}</div>
          {club.description && <div className="club-card-desc" title={club.description}>{club.description}</div>}
        </div>
      </button>

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
      
    </div>
  );
}