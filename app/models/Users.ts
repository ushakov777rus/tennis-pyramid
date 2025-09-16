import { Player } from "./Player";

export enum UserRole  {
    SiteAdmin = "site_admin",
    TournamentAdmin = "tournament_admin",
    Player = "player",
    Guest = "guest"
}

export function roleLabel(role: UserRole | null) {
  switch (role) {
    case "site_admin": return "Администратор";
    case "tournament_admin": return "Организатор";
    case "player": return "Игрок";
    default: return "Пользователь";
  }
}

export class User {
  id: number; 
  name: string; 
  role: UserRole; 
  player: Player; 

  // пароль в объект не включаем по умолчанию
  constructor(row: any) {
    this.id = row.id;
    this.name = row.name;
    this.role = row.role as UserRole;
    this.player = row.player;
  }
}
