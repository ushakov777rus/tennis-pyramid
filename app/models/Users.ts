export enum UserRole  {
    SiteAdmin = "site_admin",
    TournamentAdmin = "tournament_admin",
    Player = "player",
}

export class User {
  id!: number;
  name!: string;
  role!: UserRole;
  // пароль в объект не включаем по умолчанию
  constructor(row: any) {
    this.id = row.id;
    this.name = row.name;
    this.role = row.role as UserRole;
  }
}
