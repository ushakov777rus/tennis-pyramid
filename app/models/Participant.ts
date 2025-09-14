// models/Participant.ts

import { Player } from "./Player";
import { Team } from "./Team";

import { maskFullName } from "../utils/maskName";

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
  
  displayName(mask: boolean): string {
    if (this.player) return mask ? maskFullName(this.player.name) : this.player.name;
    if (this.team) return mask ? 
      maskFullName(this.team.player1.name) + "\n" + maskFullName(this.team.player2.name) : 
      this.team.player1.name + "\n" + this.team.player2.name;
    return "Без имени";
  }

  get getId(): number {
    if (this.player) return this.player.id;
    if (this.team) return this.team.id;
    return 0;
  }

  get ntrp(): string | null {
    if (this.player)
      return this.player.ntrp;
    return null;
  }

  splitName(mask: boolean): string[] {
    if (this.player)
      return this.displayName(mask).split(" ");
    return this.displayName(mask).split("\n");
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