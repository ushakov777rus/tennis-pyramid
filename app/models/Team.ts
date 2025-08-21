import { Player } from "./Player";
import { maskFullName } from "../utils/maskName";

export class Team {
  id: number;
  player1: Player;
  player2: Player;

  constructor(id: number, player1: Player,  player2: Player) {
    this.id = id;
    this.player1 = player1;
    this.player2 = player2;
  }

  displayName(mask: boolean): string {
    return mask ? maskFullName(this.player1.name) + " " + maskFullName(this.player2.name) : this.player1.name + " " + this.player2.name;
  }
  
}