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
  // saveToRomingSettings(logEvent);
  // saveToServer(logEvent);
  saveToLocalStorage(logEvent);
}

const officeAppId = "37888a34-0cd6-4204-ae9c-e8e2f0c2eaea";
const logKey = `office-app-${officeAppId}-logs`;

async function saveToRomingSettings(logEvent: LogEvent) {
  const logs: LogEvent[] = getFromRoamingSettings(logKey) ?? [];
  logs.push(logEvent);
  setToRoamingSettings(logKey, logs);
}

async function saveToServer(logEvent: LogEvent) {
  fetch("/api/logs", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(logEvent),
  });
}

function saveToLocalStorage(logEvent: LogEvent) {
  const logs: LogEvent[] = fetchLogsFromLocalStorage();
  logs.push(logEvent);
  window.localStorage.setItem(logKey, JSON.stringify(logs));
}

export function fetchLogs(): LogEvent[] {
  return getFromRoamingSettings(logKey) ?? [];
}

export function fetchLogsFromLocalStorage(): LogEvent[] {
  const logsStr = window.localStorage.getItem(logKey) ?? "[]";
  return JSON.parse(logsStr);
}

export default logger;
