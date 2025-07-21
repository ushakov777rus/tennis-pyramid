"use client";

import { useState } from "react";
import { PyramidWithHistory } from "./components/pyramid";
import { AddMatchForm } from "./components/addmatch";
import { AllMatchesHistory } from "./components/allmatches";

export default function MainPage() {
  const [showForm, setShowForm] = useState(false);
  const [showAllMatches, setShowAllMatches] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div>
      <h1>🎾 Пирамида игроков</h1>

      <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginBottom: "20px" }}>
        <button onClick={() => setShowForm(true)} className="btn btn-primary">
          ➕ Добавить матч
        </button>

        <button onClick={() => setShowAllMatches(true)} className="btn btn-secondary">
          📜 История всех матчей
        </button>
      </div>

      <PyramidWithHistory refreshKey={refreshKey} />

      {/* Модалка с формой добавления матча */}
      {showForm && (
        <div className="modal">
          <div className="modal-content">
            <AddMatchForm
              onMatchAdded={() => {
                setShowForm(false);
                setRefreshKey((prev) => prev + 1);
              }}
            />
            <button onClick={() => setShowForm(false)} className="btn btn-secondary">
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