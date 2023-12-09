/* File: service/office.ts
 * Description: This file manages application settings, such as GitHub username and the ID of the
 * gist added through "Insert default gist". The settings are stored in Office.context.roamingSettings.
 */

import { Settings } from "../models/settings.model";
import { getFromRoamingSettings, removeFromRoamingSettings, setToRoamingSettings } from "./office";

const SETTINGS_KEY = "services.settings";

export function fetchSettings() {
  return getFromRoamingSettings<Settings>(SETTINGS_KEY);
}

export function saveSettings(settings: Settings | null) {
  return setToRoamingSettings(SETTINGS_KEY, settings);
}

export function clearSettings() {
  return removeFromRoamingSettings(SETTINGS_KEY);
}
