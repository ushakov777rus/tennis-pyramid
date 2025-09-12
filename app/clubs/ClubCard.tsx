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
    // Пустая карточка-скелет, если турнира нет (null/undefined)
if (club == null) {
  return (
    <div className="card" onClick={onClick}>
      <div className="card-add">
        +
      </div>
    </div>
  );
}

  return (
    <div className="card"  onClick={onClick} aria-label={`Открыть клуб ${club.name}`}>
      <button className="club-card-main">
        <div className="club-card-logo">
          {club.logo_url ? <img src={club.logo_url} alt={club.name} /> : <span>🏆</span>}
        </div>
        <div className="club-card-info">
          <div className="club-card-name">{club.name}</div>
          {club.city && <div className="club-card-city">{club.city}</div>}
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