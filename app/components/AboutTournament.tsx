// app/tournaments/[slug]/components/AboutTournament.tsx
"use client";

import "./AboutTournament.css";
import { useTournament } from "@/app/tournaments/[slug]/TournamentProvider";
import { UserCard } from "@/app/components/UserCard";
import { UserRole } from "../models/Users";
import { useDictionary } from "@/app/components/LanguageProvider";
import { EditIconButton, SaveIconButton, CancelIconButton } from "./controls/IconButtons";
import React, { useEffect, useRef, useState } from "react";

export function AboutTournament({ canManage = false }: { canManage?: boolean }) {
  const { tournament, creator, updateRegulation, mutating } = useTournament();
  const { aboutTournament } = useDictionary();
  const [isEditing, setIsEditing] = useState(false);
  const [draftRegulation, setDraftRegulation] = useState<string>("");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null); // авто-ресайз textarea

  const {
    organizer_name,
    organizer_phone,
    organizer_email,
    organizer_whatsapp,
    organizer_telegram,
  } = tournament as any;

  // Контакты организатора: сначала из турнира, потом fallback к creator
  const orgName = organizer_name ?? (creator?.displayName ? creator.displayName(false) : creator?.displayName) ?? aboutTournament.organizerFallback;
  //const orgRole = (creator?.role as any) ?? "tournament_admin";
  const orgPhone = organizer_phone ?? (creator as any)?.phone ?? null;
  const orgEmail = organizer_email ?? (creator as any)?.email ?? null;
  const orgWa = organizer_whatsapp ?? null; // если не указано, UserCard сам возьмёт phone
  const orgTg = organizer_telegram ?? (creator as any)?.telegram ?? null;

  useEffect(() => {
    if (!isEditing) {
      setDraftRegulation(tournament?.regulation ?? "");
    }
  }, [tournament?.regulation, isEditing]);

  useEffect(() => {
    // поддерживаем высоту textarea равной контенту
    if (!isEditing) return;
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = `${el.scrollHeight}px`;
    }
  }, [tournament?.regulation, isEditing]);

  if (!tournament) {
    return <div className="card about-card">{aboutTournament.noData}</div>;
  }

  const startEdit = () => {
    setDraftRegulation(tournament.regulation ?? "");
    setIsEditing(true);
  };

  const cancelEdit = () => {
    setDraftRegulation(tournament.regulation ?? "");
    setIsEditing(false);
  };

  const saveRegulation = async () => {
    if (!updateRegulation) return;
    await updateRegulation(draftRegulation.trim() ? draftRegulation : null);
    setIsEditing(false);
  };

  const showRegulationCard = !!tournament.regulation || isEditing || canManage;

  return (
    <div className="page-content-container card-800px">
      <section className="card-grid">
        <UserCard
          fullName={orgName}
          role={UserRole.TournamentAdmin}
          phone={orgPhone}
          email={orgEmail}
          whatsapp={orgWa}
          telegram={orgTg}
          className="mt-1"
        />
      </section>

      {showRegulationCard ? (
        <div className="card about-text">
          <div className="regulation-header">
            <h3>{aboutTournament.regulationTitle}</h3>
            {canManage ? (
              <div className="regulation-actions">
                {isEditing ? (
                  <>
                    <SaveIconButton
                      title={aboutTournament.saveRegulation}
                      onClick={saveRegulation}
                      disabled={mutating}
                    />
                    <CancelIconButton
                      title={aboutTournament.cancelRegulation}
                      onClick={cancelEdit}
                      disabled={mutating}
                    />
                  </>
                ) : (
                  <EditIconButton
                    title={aboutTournament.editRegulation}
                    onClick={startEdit}
                  />
                )}
              </div>
            ) : null}
          </div>
          {isEditing ? (
            <textarea
              className="input regulation-textarea"
              value={draftRegulation}
              placeholder={aboutTournament.regulationPlaceholder}
              onChange={(e) => {
                // синхронизируем черновик и высоту textarea
                setDraftRegulation(e.target.value);
                const el = textareaRef.current;
                if (el) {
                  el.style.height = "auto";
                  el.style.height = `${el.scrollHeight}px`;
                }
              }}
              rows={8}
              ref={textareaRef}
            />
          ) : (
            <p className="muted about-regulation-text">
              {tournament.regulation || aboutTournament.regulationPlaceholder}
            </p>
          )}
        </div>
      ) : null}
    </div>
  );
}
