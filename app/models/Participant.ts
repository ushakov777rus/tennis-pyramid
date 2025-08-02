import { Player } from "./Player";
import { Team } from "./Team";

export class Participant {
  id: number;
  level?: number;
  position?: number;
  player?: Player;
  team?: Team;

  constructor({ id, level, position, player, team }: { id: number; level?: number; position?: number; player?: Player; team?: Team }) {
    this.id = id;
    this.level = level;
    this.position = position;
    this.player = player;
    this.team = team;
  }

  get displayName(): string {
    if (this.player) return this.player.name;
    if (this.team) return this.team.name;
    return "Без имени";
  }

  get ntrp(): string | undefined {
    return this.player?.ntrp;
  }

  get splitName(): string[] {
    return this.displayName.split(" ");
  }
}