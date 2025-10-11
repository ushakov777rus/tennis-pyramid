import { Team } from "./Team";
import { Player } from "./Player";
import { Tournament, TournamentType } from "./Tournament";

export enum PhaseType {
  Group = "group",
  Playoff = "playoff",
  Swiss = "swiss"
}

export type MatchPhase = {
  phase: PhaseType;
  groupIndex: number | null;
  roundIndex: number | null;
};

export const DEFAULT_MATCH_PHASE: MatchPhase = {
  phase: PhaseType.Group, // или другое значение по умолчанию
  groupIndex: null,
  roundIndex: null
};


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
  phase?: PhaseType;
  groupIndex?: number | null;
  roundIndex?: number | null;

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
    let games1 = 0;
    let games2 = 0;

    for (const [s1, s2] of this.scores) {
      if (s1 > s2) {
        sets1++;
      } else if (s2 > s1) {
        sets2++;
      }
      games1 += s1;
      games2 += s2;
    }

    // 1. Победитель по сетам
    if (sets1 > sets2) {
      return this.getEntityId(1);
    }
    if (sets2 > sets1) {
      return this.getEntityId(2);
    }

    // 2. При равных сетах - победитель по геймам
    if (games1 > games2) {
      return this.getEntityId(1);
    }
    if (games2 > games1) {
      return this.getEntityId(2);
    }

    return 0; // ничья
  }

  // Вспомогательный метод для получения ID сущности
  private getEntityId(playerNumber: number): number {
    if (playerNumber === 1) {
      return this.player1?.id || this.team1?.id || 0;
    } else {
      return this.player2?.id || this.team2?.id || 0;
    }
  }
  
  formatResult(): string | null {
    if (this.scores && this.scores.length > 0) {
      return this.scores.map(([s1, s2]) => `${s1}:${s2}`).join("\n");
    }
    return "—";
  }

  static getWinnerId(scores: [number, number][], id1: number, id2: number): [number, number] {
    if (scores.length === 0) {
      return [0, 0];
    }

    let sets1 = 0;
    let sets2 = 0;
    let games1 = 0;
    let games2 = 0;

    for (const [s1, s2] of scores) {
      if (s1 > s2) {
        sets1++;
      } else if (s2 > s1) {
        sets2++;
      }
      // Считаем общее количество геймов
      games1 += s1;
      games2 += s2;
    }

    // Определяем победителя по сетам
    if (sets1 > sets2) {
      return [id1, id2]; // первый — победитель
    } else if (sets2 > sets1) {
      return [id2, id1]; // второй — победитель
    }

    // Если сеты равны, определяем победителя по геймам
    if (games1 > games2) {
      return [id1, id2]; // первый — победитель по геймам
    } else if (games2 > games1) {
      return [id2, id1]; // второй — победитель по геймам
    }

    // Если и геймы равны - ничья
    return [0, 0];
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