"use client";

import { useEffect, useState } from "react";

import { MatchRepository } from "@/app/repositories/MatchRepository";
import { Match } from "@/app/models/Match";

import { NavigationBar } from "@/app/components/NavigationBar";
import { MatchHistoryView } from "@/app/components/MatchHistoryView";

import "./page.css";
import "@/app/components/MatchHistoryView.css";

export default function MatchListView() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async function load() {
      setLoading(true);
      try {
        const list = await MatchRepository.loadAll();
        setMatches(list);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // ✅ Оптимистичное редактирование
  const handleEditMatchSave = async (updated: Match) => {
    try {
      await MatchRepository.updateMatch(updated);
      setMatches((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
    } catch (e) {
      console.error("Не удалось обновить матч", e);
      alert("Не удалось обновить матч");
    }
  };

  // ✅ Оптимистичное удаление
  const handleDeleteMatch = async (m: Match) => {
    try {
      await MatchRepository.deleteMatch(m);
      setMatches((prev) => prev.filter((x) => x.id !== m.id));
    } catch (e) {
      console.error("Не удалось удалить матч", e);
      alert("Не удалось удалить матч");
    }
  };


  return (
    <div className="page-container">
      <h1 className="page-title">Список матчей</h1>

      <div className="page-content-container">
        <MatchHistoryView
          matches={matches}
          onEditMatch={handleEditMatchSave}
          onDeleteMatch={handleDeleteMatch}
        />
      </div>
    </div>
  );
}