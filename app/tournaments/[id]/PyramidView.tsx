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

  const isAttacker = match.player1?.id === participantId || match.team1?.id === participantId;

  if (isWinner && isAttacker) return { icon: "↑", className: "winner-attacker" };
  if (isWinner && !isAttacker) return { icon: "✖", className: "winner-defender" };
  if (!isWinner && isAttacker) return { icon: "↺", className: "loser-attacker" };
  return { icon: "↓", className: "loser-defender" };
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

    return winnerId === id ? "winner" : "loser";
  };








  return (
    <div className="pyramid-container">
      {Object.entries(levels).map(([level, players]) => {
        // ✅ сортировка игроков по позиции
        const sortedPlayers = [...players].sort(
          (a, b) => (a.position ?? 0) - (b.position ?? 0)
        );

        return (
          <div key={level} className="pyramid-row" data-level={`Уровень ${level}`}>
            {sortedPlayers.map((p) => {
              const statusClass = getPlayerClass(p);
              const id = p.player?.id ?? p.team?.id;

              const playerMatches = matches.filter(
                m =>
                  m.player1?.id === id ||
                  m.player2?.id === id ||
                  m.team1?.id === id ||
                  m.team2?.id === id
              );

              const lastMatch = playerMatches.sort(
                (a, b) => b.date.getTime() - a.date.getTime()
              )[0];

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
                  {daysWithoutGames !== null && (
                    <div className="days-counter">{daysWithoutGames}д</div>
                  )}

                  {p.level && p.position && (
                    <div className="player-position">
                      {p.level} - {p.position}
                    </div>
                  )}

                  <div className="player-name">
                    {(p.splitName ?? []).map((line, i) => {
                      let statusIcon = "";
                      let statusClass = "";

                      if (lastMatch && id) {
                        const status = getPlayerStatusIcon(id, lastMatch);
                        statusIcon = status.icon;
                        statusClass = status.className;
                      }

                      return (
                        <div key={i} className={`player-line ${statusClass}`}>
                          {line}
                          {i === 1 && statusIcon && (
                            <span className="status-icon">{statusIcon}</span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <div className="player-ntrp">{p.ntrp ? p.ntrp : "?"}</div>

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
              );
            })}
          </div>
        );
      })}
    </div>
  );
}