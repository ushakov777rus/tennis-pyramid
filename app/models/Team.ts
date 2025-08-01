import { Player } from "./Player";

export class Team {
  id: number;
  teamName: string;
  player1: Player;
  player2: Player;

  constructor(id: number, teamName: string, player1: Player,  player2: Player) {
    this.id = id;
    this.teamName = teamName;
    this.player1 = player1;
    this.player2 = player2;
  }
}