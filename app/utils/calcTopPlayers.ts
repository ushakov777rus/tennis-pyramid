// utils/calcTopPlayers.ts
import { Match } from "@/app/models/Match";
import { Player } from "@/app/models/Player";
import { Team } from "@/app/models/Team";

type PlayerStats = {
  player: Player;
  games: number;
  wins: number;
};

export function calcTopPlayers(matches: Match[]) {
  const stats = new Map<number, PlayerStats>(); // key = player.id

  const addGame = (p?: Player | null) => {
    if (!p) return;
    const s = stats.get(p.id) ?? { player: p, games: 0, wins: 0 };
    // если объект Player пришёл «посвежее», обновим ссылку
    s.player = p;
    s.games += 1;
    stats.set(p.id, s);
  };

  const addWin = (p?: Player | null) => {
    if (!p) return;
    const s = stats.get(p.id) ?? { player: p, games: 0, wins: 0 };
    s.player = p;
    s.wins += 1;
    stats.set(p.id, s);
  };

  for (const m of matches) {
    // пропустим матчи без сетов
    if (!m.scores || m.scores.length === 0) continue;

    // посчитаем выигранные сеты каждой стороны
    let sets1 = 0, sets2 = 0;
    for (const [a, b] of m.scores) {
      if (a > b) sets1++; else if (b > a) sets2++;
    }

    // соберём игроков по сторонам
    const side1: (Player | undefined)[] =
      m.type === "single"
        ? [m.player1]
        : [m.team1?.player1, m.team1?.player2];

    const side2: (Player | undefined)[] =
      m.type === "single"
        ? [m.player2]
        : [m.team2?.player1, m.team2?.player2];

    // всем участникам — +1 игра
    side1.forEach(addGame);
    side2.forEach(addGame);

    // победителям — +1 победа
    if (sets1 > sets2) {
      side1.forEach(addWin);
    } else if (sets2 > sets1) {
      side2.forEach(addWin);
    }
    // при равенстве сетов победителя не начисляем
  }

  // найдём лидеров
  let mostPlayed: PlayerStats | null = null;
  let mostWins: PlayerStats | null = null;

  for (const s of stats.values()) {
    if (!mostPlayed || s.games > mostPlayed.games) mostPlayed = s;
    if (!mostWins || s.wins > mostWins.wins) mostWins = s;
  }

  return { mostPlayed, mostWins, all: Array.from(stats.values()) };
}