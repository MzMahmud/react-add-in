import { signal } from "@preact/signals-react";
import { Settings } from "../models/settings.model";
import { fetchSettings, saveSettings } from "../services/settings";

export const $settings = signal<Settings | null>(null);

Office.onReady(() => {
  updateSettings(fetchSettings());
});

export async function updateSettings(settings: Settings | null) {
  await saveSettings(settings);
  $settings.value = settings;
}
