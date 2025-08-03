"use client";

import { useState } from "react";
import { MatchListView } from "./MatchListView";
import { PlayerListView } from "./PlayerListView";
import { TournamentListView } from "./TournamentListView";
import { UserBadge } from "./components/UserBadge";
import "./MainPage.css";

export default function MainPage() {
  const [activeTab, setActiveTab] =
    useState<"matches" | "players" | "tournaments">("tournaments");

  return (
    <main className="main-container">
      <UserBadge /> {/* ← наш бейджик сверху слева */}
      <h1>Панель управления</h1>

      <div className="tabs">
        <button
          className={activeTab === "tournaments" ? "tab active" : "tab"}
          onClick={() => setActiveTab("tournaments")}
        >
          Турниры
        </button>

        <button
          className={activeTab === "matches" ? "tab active" : "tab"}
          onClick={() => setActiveTab("matches")}
        >
          Одиночные матчи
        </button>

        <button
          className={activeTab === "players" ? "tab active" : "tab"}
          onClick={() => setActiveTab("players")}
        >
          Игроки
        </button>
      </div>

      <div className="tab-content">
        {activeTab === "tournaments" && <TournamentListView />}
        {activeTab === "matches" && <MatchListView />}
        {activeTab === "players" && <PlayerListView />}     
      </div>
    </main>
  );
}