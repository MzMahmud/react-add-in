import React, { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { Settings } from "../models/settings.model";
import { getFromRoamingSettings, removeFromRoamingSettings, setToRoamingSettings } from "../services/office";

type SettingsContextProviderProps = {
  children: ReactNode;
};

type SettingsContextType = {
  settings: Settings | null;
  updateSettings: (settings: Settings) => Promise<void>;
};

const SETTINGS_KEY = "SettingsContext.settings";

export function getSettings() {
  return getFromRoamingSettings<Settings>(SETTINGS_KEY);
}

export function saveSettings(settings: Settings) {
  return setToRoamingSettings(SETTINGS_KEY, settings);
}

export function clearSettings() {
  return removeFromRoamingSettings(SETTINGS_KEY);
}

const SettingsContext = createContext<SettingsContextType>({ settings: null, updateSettings: async () => {} });

export function SettingsContextProvider({ children }: SettingsContextProviderProps) {
  const [settings, setSettings] = useState<Settings | null>(null);
  useEffect(() => {
    setSettings(getSettings());
  }, []);
  const updateSettings = async (settings: Settings) => {
    await saveSettings(settings);
    setSettings(settings);
  };
  return <SettingsContext.Provider value={{ settings, updateSettings }}>{children}</SettingsContext.Provider>;
}

export default function useSettingsContext() {
  return useContext(SettingsContext);
}
