"use client";

import { useCallback, type ReactNode } from "react";

import { Match } from "@/app/models/Match";
import { MatchHistoryView } from "@/app/components/matches/MatchHistoryView";

import { useMatches } from "./MatchesProvider";

import "./page.css";
import "@/app/components/matches/MatchHistoryView.css";
import { useUser } from "../components/UserContext";
import { useDictionary } from "@/app/components/LanguageProvider";

export function MatchesClient() {
  const {
    matches,
    loading,
    error,
    initialLoaded,
    updateMatch,
    deleteMatch,
  } = useMatches();
  const { matchesPage, common } = useDictionary();

  const handleEditMatch = useCallback(
    async (updated: Match) => {
      try {
        await updateMatch(updated);
      } catch (e) {
        alert(matchesPage.updateFailed);
      }
    },
    [updateMatch]
  );

  const handleDeleteMatch = useCallback(
    async (match: Match) => {
      try {
        await deleteMatch(match);
      } catch (e) {
        alert(matchesPage.deleteFailed);
      }
    },
    [deleteMatch]
  );

  const showLoader = loading && !initialLoaded;

  let content: ReactNode = null;
  if (showLoader) {
    content = <p>{matchesPage.loading}</p>;
  } else if (error) {
    content = <div style={{ color: "#f04438" }}>{matchesPage.errorPrefix} {error}</div>;
  } else {
    content = (
      <MatchHistoryView
        matches={matches}
        onEditMatch={handleEditMatch}
        onDeleteMatch={handleDeleteMatch}
      />
    );
  }

  const { user } = useUser();
  const className = user ? "page-container-no-padding" : "page-container";

  return (
    <div className={className}>
      <h1 className="page-title">{matchesPage.title}</h1>

      <div className="page-content-container">{content}</div>
    </div>
  );
}
