import { Team } from "./Team";
import { Player } from "./Player";
import { Tournament } from "./Tournament";

export class Match {
  id: number;
  type: "single" | "double";
  date: Date;
  scores: [number, number][]; 
  tournament: Tournament;
  player1?: Player;
  player2?: Player;
  team1?: Team;
  team2?: Team;

  constructor(
    id: number,
    type: "single" | "double",
    date: Date,
    setsRaw: [number, number][], // может быть строка/объект/массив
    tournament: Tournament,
    player1?: Player,
    player2?: Player,
    team1?: Team,
    team2?: Team
  ) {
    this.id = id;
    this.type = type;
    this.date = date;

    // ✅ гарантируем, что это массив
    if (!setsRaw) {
      this.scores = [];
    } else if (typeof setsRaw === "string") {
      this.scores = JSON.parse(setsRaw);
    } else {
      this.scores = setsRaw;
    }

    this.tournament = tournament;

    this.player1 = player1;
    this.player2 = player2;

    this.team1 = team1;
    this.team2 = team2;
  }

  getTotalScore(): [number, number] {
    return this.scores.reduce<[number, number]>(
      ([sum1, sum2], [s1, s2]) => [sum1 + s1, sum2 + s2],
      [0, 0]
    );
  }

  getWinnerId(): number {
    let sets1 = 0;
    let sets2 = 0;

    for (const [s1, s2] of this.scores) {
      if (s1 > s2) {
        sets1++;
      } else if (s2 > s1) {
        sets2++;
      }
      // если равные (например, 6–6 без тайбрейка) — сет не засчитывается
    }

    if (sets1 > sets2) {
      if (this.player1)
        return this.player1?.id; // первый — победитель
    }
      
    if (this.player2)
      return this.player2?.id; // первый — победитель

    return 0;
  }

  formatResult(): string {
    if (!this.scores || this.scores.length === 0) return "-";
    return this.scores.map(([a, b]) => `${a}-${b}`).join(", ");
  }

  static getWinnerId(scores: [number, number][], id1: number, id2: number): [number, number] {
    let sets1 = 0;
    let sets2 = 0;

    for (const [s1, s2] of scores) {
      if (s1 > s2) {
        sets1++;
      } else if (s2 > s1) {
        sets2++;
      }
      // если равные (например, 6–6 без тайбрейка) — сет не засчитывается
    }

    if (sets1 > sets2) {
      return [id1, id2]; // первый — победитель
    } else {
      return [id2, id1]; // второй — победитель
    }
  }
}