export class Tournament {
  id: number;
  name: string;
  start_date?: string | null;
  end_date?: string | null;
  status: "draft" | "ongoing" | "finished";
  tournament_type: "single" | "double";

  constructor(
    id: number,
    name: string,
    status: "draft" | "ongoing" | "finished",
    tournament_type: "single" | "double",
    start_date?: string | null,
    end_date?: string | null,
  ) {
    this.id = id;
    this.name = name;
    this.start_date = start_date;
    this.end_date = end_date;
    this.status = status;
    this.tournament_type = tournament_type;
  }

  // методы управления статусом
  start() {
    if (this.status === "draft") {
      this.status = "ongoing";
      this.start_date = new Date().toISOString();
    }
  }

  finish() {
    if (this.status === "ongoing") {
      this.status = "finished";
      this.end_date = new Date().toISOString();
    }
  }

  resetToDraft() {
    this.status = "draft";
    this.start_date = null;
    this.end_date = null;
  }

  isActive(): boolean {
    return this.status === "ongoing";
  }

  isFinished(): boolean {
    return this.status === "finished";
  }

  getStatus(): string {
    return this.status === "draft"
      ? "Черновик"
      : this.status === "ongoing"
      ? "Идет"
      : "Завершен";
  }

  isSingle(): boolean {
    return this.tournament_type === "single";
  }
}