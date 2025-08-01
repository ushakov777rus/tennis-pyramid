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
    setsRaw: any, // может быть строка/объект/массив
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
    const [total1, total2] = this.getTotalScore();
    const id1 = this.player1?.id ?? this.team1?.id;
    const id2 = this.player2?.id ?? this.team2?.id;

    if (total1 > total2) {
      if (id1 !== undefined) return id1;
    }
    if (id2 !== undefined) return id2;

    return 0;
  }

  formatResult(): string {
    if (!this.scores || this.scores.length === 0) return "-";
    return this.scores.map(([a, b]) => `${a}-${b}`).join(", ");
  }

  static getWinnerId(scores: [number, number][], id1: number, id2: number): [number, number] {
    const [total1, total2] = scores.reduce<[number, number]>(
      ([sum1, sum2], [s1, s2]) => [sum1 + s1, sum2 + s2],
      [0, 0]
    );

    if (total1 > total2) {
      return [id1, id2];
    }
    return [id2, id1];

  }
}