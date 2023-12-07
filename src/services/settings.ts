import { Settings } from "../models/settings.model";
import { getFromRoamingSettings, removeFromRoamingSettings, setToRoamingSettings } from "./office";

const SETTINGS_KEY = "services.settings";

export function fetchSettings() {
  return getFromRoamingSettings<Settings>(SETTINGS_KEY);
}

export function saveSettings(settings: Settings) {
  return setToRoamingSettings(SETTINGS_KEY, settings);
}

export function clearSettings() {
  return removeFromRoamingSettings(SETTINGS_KEY);
}
