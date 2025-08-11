// models/Participant.ts

import { Player } from "./Player";
import { Team } from "./Team";

/** Базовый класс — то, что реально хранится в БД */
export class ParticipantBase {
  id: number;
  level?: number;
  position?: number;
  player?: Player;
  team?: Team;

  constructor({
    id,
    level,
    position,
    player,
    team,
  }: {
    id: number;
    level?: number;
    position?: number;
    player?: Player;
    team?: Team;
  }) {
    this.id = id;
    this.level = level;
    this.position = position;
    this.player = player;
    this.team = team;
  }
}

/** Класс с методами */
export class Participant extends ParticipantBase {
  get displayName(): string {
    if (this.player) return this.player.name;
    if (this.team) return this.team.name;
    return "Без имени";
  }

  get getId(): number {
    if (this.player) return this.player.id;
    if (this.team) return this.team.id;
    return 0;
  }

  get ntrp(): string | undefined {
    return this.player?.ntrp;
  }

  get splitName(): string[] {
    return this.displayName.split(" ");
  }
}

/** Тип под "сырые данные" из Supabase */
export type ParticipantRow = {
  id: number;
  level?: number;
  position?: number;
  players?: {
    id: number;
    name: string;
    ntrp: string;
    phone: string;
    sex: string;
  }; // <-- объект, не массив
  teams?: {
    id: number;
    name: string;
    player1?: {
      id: number;
      name: string;
      ntrp: string;
      phone: string;
      sex: string;
    }[];
    player2?: {
      id: number;
      name: string;
      ntrp: string;
      phone: string;
      sex: string;
    }[];
  }[];
};