import { Match } from "./Match";
import { maskFullName } from "../utils/maskName";

export class Player {
  id: number;
  name: string;
  phone: string | null;
  sex: string | null;
  ntrp: string | null;

  constructor({id, name, phone, sex, ntrp}: {id: number, name: string, phone: string | null, sex: string | null, ntrp: string | null}) {
    this.id = id;
    this.name = name;
    this.phone = phone;
    this.sex = sex;
    this.ntrp = ntrp;
  }

  displayName(mask: boolean = false): string {
    if (this.name) return mask ? maskFullName(this.name) : this.name;
    return "Без имени";
  }
  

  // ⬇️ агрегатор по игрокам
static getPlayerStats(
  matches: Match[]
): Record<number, { matches: number; wins: number; winrate: number }> {
  const stats: Record<number, { matches: number; wins: number; winrate: number }> = {};

  matches.forEach((m) => {
    const participants: Player[] = [];

    if (m.type === "single") {
      if (m.player1) participants.push(m.player1);
      if (m.player2) participants.push(m.player2);
    } else if (m.type === "double") {
      if (m.team1?.player1) participants.push(m.team1.player1);
      if (m.team1?.player2) participants.push(m.team1.player2);
      if (m.team2?.player1) participants.push(m.team2.player1);
      if (m.team2?.player2) participants.push(m.team2.player2);
    }

    // всем участникам увеличиваем количество матчей
    participants.forEach((p) => {
      if (!stats[p.id]) stats[p.id] = { matches: 0, wins: 0, winrate: 0 };
      stats[p.id].matches++;
    });

    // победителю увеличиваем победы
    const winnerId = m.getWinnerId();
    if (winnerId && stats[winnerId]) {
      stats[winnerId].wins++;
    }
  });

  // === считаем винрейт для каждого игрока ===
  Object.values(stats).forEach((s) => {
    s.winrate = s.matches > 0 ? (s.wins / s.matches) * 100 : 0;
  });

  return stats;
}







}