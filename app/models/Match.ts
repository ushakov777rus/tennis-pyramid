import { Team } from "./Team";
import { Player } from "./Player";
import { Tournament, TournamentType } from "./Tournament";

export class Match {
  id: number;
  type: TournamentType;
  date: Date;
  scores: [number, number][]; 
  tournament: Tournament;
  player1?: Player;
  player2?: Player;
  team1?: Team;
  team2?: Team;

  constructor(
    id: number,
    type: TournamentType,
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

    if (this.scores.length === 0) {
      return 0;
    }

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

    // одиночный матч
    if (this.player1 && this.player2) {
      if (sets1 > sets2) {
        return this.player1.id;
      }
      if (sets2 > sets1) {
        return this.player2.id;
      }
      return 0; // ничья / не определён
    }

    // парный матч
    if (this.team1 && this.team2) {
      if (sets1 > sets2) {
        return this.team1.id;
      }
      if (sets2 > sets1) {
        return this.team2.id;
      }
      return 0; // ничья / не определён
    }

    return 0;
  }

  formatResult(): string {
    if (!this.scores || this.scores.length === 0) return "-";
    return this.scores.map(([a, b]) => `${a}-${b}`).join(", ");
  }

  static getWinnerId(scores: [number, number][], id1: number, id2: number): [number, number] {
    if (scores.length === 0) {
      return [0, 0];
    }

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

  // Универсальный парсер: "6-4, 4:6, 10-8" -> [[6,4],[4,6],[10,8]]
  static parseScoreStringFlexible(score: string): [number, number][] {
    return score
      .split(",")
      .map((setStr) => setStr.trim())
      .filter(Boolean)
      .map((setStr) => {
        // принимаем и "-" и ":"
        const parts = setStr.split(/[-:]/).map((n) => parseInt(n.trim(), 10));
        if (parts.length !== 2 || parts.some((x) => Number.isNaN(x))) {
          throw new Error(`Неверный формат сета: "${setStr}" (ожидается "6-4" или "6:4")`);
        }
        return [parts[0], parts[1]] as [number, number];
      });
  }

  static isValidScoreFormat(v: string) {
      if (!v) return false;
      const sets = v.split(",").map((s) => s.trim());
      const re = /^\d{1,2}-\d{1,2}$/;
      return sets.every((s) => re.test(s));
  }

}