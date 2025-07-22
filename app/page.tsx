"use client";

import { useState } from "react";
import { PyramidWithHistory } from "./components/pyramid";
import { AddPlayerForm } from "./components/addplayer";
import { AddMatchForm } from "./components/addmatch";
import { AllMatchesHistory } from "./components/allmatches";

export default function MainPage() {
  const [showAddMatch, setShowAddMatch] = useState(false);
  const [showAddPlayer, setShowAddPlayer] = useState(false);
  const [showAllMatches, setShowAllMatches] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="container">
      <h1>🎾 Пирамида игроков</h1>

      <div className="button-bar">
        <button onClick={() => setShowAddPlayer(true)} className="btn btn-primary">
          ➕ Добавить игрока
        </button>

        <button onClick={() => setShowAddMatch(true)} className="btn btn-primary">
          ➕ Добавить матч
        </button>

        <button onClick={() => setShowAllMatches(true)} className="btn btn-primary">
          📜 История всех матчей
        </button>
      </div>

      <PyramidWithHistory refreshKey={refreshKey} />

      {/* Модалка с формой добавления игрока */}
      {showAddPlayer && (
        <div className="modal">
          <div className="modal-content">
            <AddPlayerForm
              onPlayerAdded={() => {
                setShowAddPlayer(false);
                setRefreshKey((prev) => prev + 1);
              }}
            />
            <button onClick={() => setShowAddPlayer(false)} className="btn btn-secondary">
              Закрыть
            </button>
          </div>
        </div>
      )}

      {/* Модалка с формой добавления матча */}
      {showAddMatch && (
        <div className="modal">
          <div className="modal-content">
            <AddMatchForm
              onMatchAdded={() => {
                setShowAddMatch(false);
                setRefreshKey((prev) => prev + 1);
              }}
            />
            <button onClick={() => setShowAddMatch(false)} className="btn btn-secondary">
              Закрыть
            </button>
          </div>
        </div>
      )}

      {/* Модалка с историей всех матчей */}
      {showAllMatches && (
        <div className="modal">
          <div className="modal-content">
            <AllMatchesHistory />
            <button onClick={() => setShowAllMatches(false)} className="btn btn-secondary">
              Закрыть
            </button>
          </div>
        </div>
      )}
    </div>
  );
}