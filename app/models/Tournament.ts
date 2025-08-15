// models/Tournament.ts

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
}

/** Опции для селектов (с первым пунктом «любой …» удобно для фильтров) */
export const FORMAT_OPTIONS = [
  { value: "", label: "Любой формат" },
  { value: TournamentFormat.Pyramid, label: "Пирамида" },
  { value: TournamentFormat.RoundRobin, label: "Круговой" },
  { value: TournamentFormat.SingleElimination, label: "Олимпийка" },
  { value: TournamentFormat.DoubleElimination, label: "Двойная олим." },
  { value: TournamentFormat.GroupsPlayoff, label: "Группы + плей-офф" },
  { value: TournamentFormat.Swiss, label: "Швейцарка" },
] as const;

export const TYPE_OPTIONS = [
  { value: "", label: "Любой тип" },
  { value: TournamentType.Single, label: "Одиночный" },
  { value: TournamentType.Double, label: "Парный" },
] as const;

export const STATUS_OPTIONS = [
  { value: "", label: "Любой статус" },
  { value: TournamentStatus.Draft, label: "Черновик" },
  { value: TournamentStatus.Registration, label: "Идёт набор" },
  { value: TournamentStatus.Ongoing, label: "Идёт" },
  { value: TournamentStatus.Finished, label: "Завершён" },
] as const;

/** Словари лейблов для UI */
const FORMAT_LABELS_RU: Record<TournamentFormat, string> = {
  [TournamentFormat.Pyramid]: "Пирамида",
  [TournamentFormat.RoundRobin]: "Круговой турнир",
  [TournamentFormat.SingleElimination]: "Плей-офф (1 вылет)",
  [TournamentFormat.DoubleElimination]: "Плей-офф (2 вылета)",
  [TournamentFormat.GroupsPlayoff]: "Группы + плей-офф",
  [TournamentFormat.Swiss]: "Швейцарская система",
};

const STATUS_LABELS_RU: Record<TournamentStatus, string> = {
  [TournamentStatus.Draft]: "Черновик",
  [TournamentStatus.Registration]: "Идёт набор",
  [TournamentStatus.Ongoing]: "Идёт турнир",
  [TournamentStatus.Finished]: "Завершён",
};

const TYPE_LABELS_RU: Record<TournamentType, string> = {
  [TournamentType.Single]: "Одиночный",
  [TournamentType.Double]: "Парный",
};

export class Tournament {
  id: number;
  name: string;
  format: TournamentFormat;
  start_date: string | null;
  end_date: string | null;
  status: TournamentStatus;
  tournament_type: TournamentType;

  constructor(
    id: number,
    name: string,
    format: TournamentFormat,
    status: TournamentStatus,
    tournament_type: TournamentType,
    start_date: string | null,
    end_date: string | null
  ) {
    this.id = id;
    this.name = name;
    this.format = format;
    this.start_date = start_date;
    this.end_date = end_date;
    this.status = status;
    this.tournament_type = tournament_type;
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

  // ---------- Геттеры лейблов для UI ----------

  /** RU-лейбл статуса */
  getStatus(): string {
    return STATUS_LABELS_RU[this.status] ?? "Неизвестно";
  }

  /** RU-лейбл формата */
  getFormat(): string {
    return FORMAT_LABELS_RU[this.format] ?? "Неизвестный формат";
  }

  /** RU-лейбл типа турнира */
  getType(): string {
    return TYPE_LABELS_RU[this.tournament_type] ?? "Неизвестный тип";
  }
}