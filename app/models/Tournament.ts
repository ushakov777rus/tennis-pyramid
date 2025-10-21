// models/Tournament.ts

import { Club } from "./Club";

/** Тип турнира */
export enum TournamentType {
  Single = "single",
  Double = "double",
}

/** Статус турнира */
export enum TournamentStatus {
  Draft = "draft",               // черновик
  Registration = "registration", // идёт набор
  Ongoing = "ongoing",           // в процессе
  Finished = "finished",         // завершён
}

/** Формат турнира */
export enum TournamentFormat {
  Pyramid = "pyramid",
  RoundRobin = "round_robin",
  SingleElimination = "single_elimination",
  DoubleElimination = "double_elimination",
  GroupsPlayoff = "groups_playoff",
  Swiss = "swiss",
  Custom = "custom",
}

/** Опции для селектов (с первым пунктом «любой …» удобно для фильтров) */
export const FORMAT_OPTIONS = [
  { value: "" },
  { value: TournamentFormat.Pyramid },
  { value: TournamentFormat.RoundRobin },
  { value: TournamentFormat.SingleElimination },
  { value: TournamentFormat.DoubleElimination },
  { value: TournamentFormat.GroupsPlayoff },
  { value: TournamentFormat.Swiss },
  { value: TournamentFormat.Custom },
];

export const TYPE_OPTIONS = [
  { value: "" },
  { value: TournamentType.Single },
  { value: TournamentType.Double },
];

export const STATUS_OPTIONS = [
  { value: "" },
  { value: TournamentStatus.Draft },
  { value: TournamentStatus.Registration },
  { value: TournamentStatus.Ongoing },
  { value: TournamentStatus.Finished },
];

/** Данные для создания турнира (без id) */
export type TournamentCreateInput = {
  name: string;
  format: TournamentFormat;
  tournament_type: TournamentType;
  start_date: string | null;
  end_date: string | null;
  /** необязателен: по умолчанию Draft, если не передан */
  status?: TournamentStatus;
  /** кто создал (в БД может быть creator_id) */
  creator_id: number | null;
  /** true - видят абсолютно все, false - только организатор и участники */
  is_public: boolean;
  club: Club | null;
  settings?: any;
  owner_token?: string | null;
  regulation?: string | null;
};

/** Данные для частичного обновления турнира */
export type TournamentUpdateInput = Partial<{
  name: string;
  format: TournamentFormat;
  tournament_type: TournamentType;
  start_date: string | null;
  end_date: string | null;
  status: TournamentStatus;
}>;

export class Tournament {
  id: number;
  name: string;
  format: TournamentFormat;
  start_date: string | null;
  end_date: string | null;
  status: TournamentStatus;
  tournament_type: TournamentType;
  is_public: boolean;
  creator_id: number | null;
  slug:string;
  club: Club | null;
  settings?: any;
  ownerToken: string | null;
  regulation: string | null;
  
  constructor(
    id: number,
    name: string,
    format: TournamentFormat,
    status: TournamentStatus,
    tournament_type: TournamentType,
    start_date: string | null,
    end_date: string | null,
    is_public: boolean = false,
    creator_id: number | null,
    slug: string,
    club: Club | null,
    settings?: any,
    ownerToken: string | null = null,
    regulation: string | null = null
  ) {
    this.id = id;
    this.name = name;
    this.format = format;
    this.start_date = start_date;
    this.end_date = end_date;
    this.status = status;
    this.tournament_type = tournament_type;
    this.is_public = is_public;
    this.creator_id = creator_id;
    this.settings = settings;
    this.club = club;
    this.slug = slug;
    this.ownerToken = ownerToken;
    this.regulation = regulation;
  }

  // ---------- Транзиции статусов ----------

  /** Открыть набор участников (из Draft) */
  openRegistration() {
    if (this.status === TournamentStatus.Draft) {
      this.status = TournamentStatus.Registration;
      this.start_date = null; // дата турнира ещё не началась
      this.end_date = null;
    }
  }

  /** Старт турнира (из Draft или Registration) */
  start() {
    if (
      this.status === TournamentStatus.Draft ||
      this.status === TournamentStatus.Registration
    ) {
      this.status = TournamentStatus.Ongoing;
      this.start_date = new Date().toISOString();
    }
  }

  /** Завершить турнир (из Ongoing) */
  finish() {
    if (this.status === TournamentStatus.Ongoing) {
      this.status = TournamentStatus.Finished;
      this.end_date = new Date().toISOString();
    }
  }

  /** Сбросить в черновик */
  resetToDraft() {
    this.status = TournamentStatus.Draft;
    this.start_date = null;
    this.end_date = null;
  }

  // ---------- Boolean-хелперы ----------

  // Статус
  isDraft(): boolean {
    return this.status === TournamentStatus.Draft;
  }
  isRegistration(): boolean {
    return this.status === TournamentStatus.Registration;
  }
  isActive(): boolean {
    return this.status === TournamentStatus.Ongoing;
  }
  isFinished(): boolean {
    return this.status === TournamentStatus.Finished;
  }

  // Тип
  isSingle(): boolean {
    return this.tournament_type === TournamentType.Single;
  }
  isDouble(): boolean {
    return this.tournament_type === TournamentType.Double;
  }

  // Формат
  isPyramid(): boolean {
    return this.format === TournamentFormat.Pyramid;
  }
  isRoundRobin(): boolean {
    return this.format === TournamentFormat.RoundRobin;
  }
  isSingleElimination(): boolean {
    return this.format === TournamentFormat.SingleElimination;
  }
  isDoubleElimination(): boolean {
    return this.format === TournamentFormat.DoubleElimination;
  }
  isGroupsPlayoff(): boolean {
    return this.format === TournamentFormat.GroupsPlayoff;
  }
  isSwiss(): boolean {
    return this.format === TournamentFormat.Swiss;
  }

  isCustom(): boolean {
    return this.format === TournamentFormat.Custom;
  }

}
