import { Participant } from "@/app/models/Participant";
import { Match } from "@/app/models/Match";
import "./PyramidView.css"

type PyramidViewProps = {
  participants: Participant[];
  onSelect: (id: number) => void;
  selectedId: number | null;
  onShowHistory?: (id?: number) => void;
  matches: Match[];
};

function getPlayerStatusIcon(participantId: number, match: Match): { icon: string, className: string } {
  const winnerId = match.getWinnerId();
  const isWinner = winnerId === participantId;

  // атакующий = player1, защитник = player2
  const isAttacker = match.player1?.id === participantId || match.team1?.id === participantId;

  if (isWinner && isAttacker) return { icon: "↑", className: "winner-attacker" };   // атаковал и выиграл
  if (isWinner && !isAttacker) return { icon: "✖", className: "winner-defender" }; // защищался и выиграл
  if (!isWinner && isAttacker) return { icon: "↺", className: "loser-attacker" };  // атаковал и проиграл
  return { icon: "↓", className: "loser-defender" };                               // защищался и проиграл
}


export function PyramidView({
  participants,
  onSelect,
  selectedId,
  onShowHistory,
  matches,
}: PyramidViewProps) {
  const levels: Record<number, Participant[]> = {};
  for (let i = 1; i <= 15; i++) {
    levels[i] = [];
  }

  participants.forEach((p) => {
    const lvl = p.level ?? 15;
    levels[lvl].push(p);
  });

  // утилита для определения класса игрока по последнему матчу
  const getPlayerClass = (participant: Participant): string => {
    const id = participant.player?.id ?? participant.team?.id;
    if (!id) return "";

    const playerMatches = matches.filter(
      (m) =>
        m.player1?.id === id ||
        m.player2?.id === id ||
        m.team1?.id === id ||
        m.team2?.id === id
    );

    if (playerMatches.length === 0) return ""; 

    const lastMatch = playerMatches.sort(
      (a, b) => b.date.getTime() - a.date.getTime()
    )[0];

    const winnerId = lastMatch.getWinnerId();

    if (winnerId === id) return "winner"; 
    return "loser"; 
  };

  return (
    <div className="pyramid-container">
      {Object.entries(levels).map(([level, players]) => (
        <div key={level} className="pyramid-row">
          {players.map((p) => {
            const statusClass = getPlayerClass(p);
            const id = p.player?.id ?? p.team?.id;

            // все матчи игрока
            const playerMatches = matches.filter(
              m => m.player1?.id === id || m.player2?.id === id || m.team1?.id === id || m.team2?.id === id
            );

            const lastMatch = playerMatches.sort((a, b) => b.date.getTime() - a.date.getTime())[0];

            // считаем количество дней без игр
            let daysWithoutGames: number | null = null;
            if (lastMatch) {
              const now = new Date();
              const diffMs = now.getTime() - lastMatch.date.getTime();
              daysWithoutGames = Math.floor(diffMs / (1000 * 60 * 60 * 24));
            }

            return (
              <div
                key={p.id}
                className={`pyramid-player ${selectedId === p.id ? "selected" : ""} ${statusClass}`}
                onClick={() => onSelect(p.id)}
              >
                {/* ✅ метка с количеством дней */}
                {daysWithoutGames !== null && (
                  <div className="days-counter">
                    {daysWithoutGames}д
                  </div>
                )}

                {p.level && p.position && (
                  <div className="player-position">
                    {p.level} - {p.position}
                  </div>
                )}

                <div className="player-name">
                  {(p.splitName ?? []).map((line, i) => {
                    const playerLastMatch = lastMatch;

                    let statusIcon = "";
                    let statusClass = "";
                    if (playerLastMatch && id) {
                      const status = getPlayerStatusIcon(id, playerLastMatch);
                      statusIcon = status.icon;
                      statusClass = status.className;
                    }

                    if (i === 1) {
                      return (
                        <div key={i} className={`player-line ${statusClass}`}>
                          {line} {statusIcon && <span className="status-icon">{statusIcon}</span>}
                        </div>
                      );
                    }

                    return (
                      <div key={i} className={`player-line ${statusClass}`}>
                        {line}
                      </div>
                    );
                  })}
                </div>

                <div className="player-ntrp">{p.ntrp ? p.ntrp : "?"}</div>

                {/* кнопка истории */}
                <div>
                  {onShowHistory && (
                    <button
                      className="history-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        onShowHistory(p.player?.id ?? p.team?.id);
                      }}
                    >
                      📜
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}