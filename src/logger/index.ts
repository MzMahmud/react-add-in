import pino, { Level, LogEvent } from "pino";
import { setToRoamingSettings, getFromRoamingSettings } from "../services/office";

const logger = pino({
  level: "trace",
  browser: {
    serialize: true,
    asObject: true,
    transmit: { send },
  },
  timestamp: pino.stdTimeFunctions.isoTime,
});

async function send(level: Level, logEvent: LogEvent) {
  saveToRomingSettings(logEvent);
}

const logKey = "USER_LOGS";

async function saveToRomingSettings(logEvent: LogEvent) {
  const logs: LogEvent[] = getFromRoamingSettings(logKey) ?? [];
  logs.push(logEvent);
  setToRoamingSettings(logKey, logs);
}

export function fetchLogs(): LogEvent[] {
  return getFromRoamingSettings(logKey) ?? [];
}

export default logger;
