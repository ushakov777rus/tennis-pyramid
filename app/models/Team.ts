import { Player } from "./Player";
import { maskTeamName } from "../utils/maskName";

export class Team {
  id: number;
  name: string;
  player1: Player;
  player2: Player;

  constructor(id: number, name: string, player1: Player,  player2: Player) {
    this.id = id;
    this.name = name;
    this.player1 = player1;
    this.player2 = player2;
  }

  displayName(mask: boolean): string {
    if (this.name) return mask ? maskTeamName(this.name) : this.name;
    return "Без имени";
  }
  
}