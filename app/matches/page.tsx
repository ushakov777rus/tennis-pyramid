"use client";

import { useEffect, useState } from "react";

import { MatchRepository } from "@/app/repositories/MatchRepository";

import { Match } from "@/app/models/Match";

import { AdminOnly } from "@/app/components/RoleGuard"
import { NavigationBar } from "@/app/components/NavigationBar";
import { MatchHistoryView } from "@/app/components/MatchHistoryView";

import "./page.css";
import "@/app/components/MatchHistory.css";

export default function MatchListView() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const list = await MatchRepository.loadAll();
      setMatches(list);
      setLoading(false);
    }
    load();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm(`Удалить матч #${id}?`)) return;
    await MatchRepository.deleteMatch(matches.filter((m) => m.id !== id)[0]);
    setMatches(matches.filter((m) => m.id !== id));
  };

  if (loading) return <p>Загрузка матчей...</p>;
  if (!matches.length) return <p>Пока нет матчей</p>;

  return (
    <div className="page-container">
      <NavigationBar />

      <h1 className="page-title">Список матчей</h1>

      <div className="page-content-container">

            <MatchHistoryView
              player={null}
              matches={matches}
              showTournament={true}
              onEditMatch={(updated) => {
                // тут обновляем через MatchRepository
                MatchRepository.updateMatch(updated);
              }}
              onDeleteMatch={(m) => {
                // тут удаляем через MatchRepository
                console.log("Удаление:", m);
                MatchRepository.deleteMatch(m);
              }}
            />

    </div>
    </div>
  );
}