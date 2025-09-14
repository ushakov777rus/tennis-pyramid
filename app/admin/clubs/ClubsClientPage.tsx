// app/admin/clubs/ClubsClientPage.tsx
"use client";

import { useUser } from "@/app/components/UserContext";
import { ClubsProvider } from "@/app/clubs/ClubsProvider";
import { ClubsClient } from "@/app/clubs/ClubsClient";

export function ClubsClientPage() {
  const { user } = useUser();
  const creatorId = user ? user.id : null;

  return (
    <ClubsProvider 
      key={creatorId ?? "none"} 
      creatorId={creatorId}
    >
      <ClubsClient creatorId={creatorId} />
    </ClubsProvider>
  );
}