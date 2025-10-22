"use client";

import type { Participant } from "@/app/models/Participant";

type ParticipantLabelProps = {
  participant: Participant;
  showRating?: boolean;
};

export function ParticipantLabel({ participant, showRating = false }: ParticipantLabelProps) {
  return (
    <div className="player">
      <span style={{display: "inline-flex"}}>{participant.displayName(false)}</span>
      {showRating && typeof participant.ntrp === "string" && participant.ntrp.trim().length > 0 && (
        <span className="badge">{participant.ntrp}</span>
      )}
    </div>
  );
}
