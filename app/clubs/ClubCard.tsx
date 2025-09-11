"use client";

import "./clubs.css";
import { Club } from "@/app/repositories/ClubRepository";

type Props = {
  club: Club | null;
  onOpen?: () => void;
  onDelete?: () => void;
};

export function ClubCard({ club, onOpen, onDelete }: Props) {
    // Пустая карточка-скелет, если турнира нет (null/undefined)
if (club == null) {
  return (
    <div className="card">
      <div className="card-add">
        +
      </div>
    </div>
  );
}

  return (
    <div className="card club-card">
      <button className="club-card-main" onClick={onOpen} aria-label={`Открыть клуб ${club.name}`}>
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

      {onDelete && (
        <div className="club-card-actions">
          <button className="club-card-delete" onClick={onDelete}>Удалить</button>
        </div>
      )}
    </div>
  );
}