// app/lib/logger.ts
type Level = "trace"|"debug"|"info"|"warn"|"error";
const LEVEL_ORDER: Record<Level,number> = { trace:0, debug:1, info:2, warn:3, error:4 };

const ENABLED = typeof window !== "undefined" && process.env.NEXT_PUBLIC_LOGS !== "off";
const THRESHOLD: Level = (process.env.NEXT_PUBLIC_LOG_LEVEL as Level) || "info";

function emit(level: Level, msg: string, meta?: unknown) {
  if (!ENABLED) return;
  if (LEVEL_ORDER[level] < LEVEL_ORDER[THRESHOLD]) return;

  // dev: видно в консоли
  if (process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line no-console
    (console as any)[level === "trace" ? "debug" : level](msg, meta ?? "");
  }
  // prod: отправка на сервер (Beacon предпочтителен)
  try {
    const payload = JSON.stringify({ level, msg, meta, ts: Date.now() });
    navigator.sendBeacon?.("/api/logs", payload) ||
      fetch("/api/logs", { method: "POST", headers: { "Content-Type": "application/json" }, body: payload });
  } catch {}
}

export const log = {
  trace: (m: string, meta?: unknown) => emit("trace", m, meta),
  debug: (m: string, meta?: unknown) => emit("debug", m, meta),
  info:  (m: string, meta?: unknown) => emit("info",  m, meta),
  warn:  (m: string, meta?: unknown) => emit("warn",  m, meta),
  error: (m: string, meta?: unknown) => emit("error", m, meta),
};