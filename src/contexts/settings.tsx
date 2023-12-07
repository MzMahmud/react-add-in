import React, { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { Settings } from "../models/settings.model";
import { fetchSettings, saveSettings } from "../services/settings";

type SettingsContextProviderProps = {
  children: ReactNode;
};

type SettingsContextType = {
  settings: Settings | null;
  updateSettings: (settings: Settings) => Promise<void>;
};

const SettingsContext = createContext<SettingsContextType>({ settings: null, updateSettings: async () => {} });

export function SettingsContextProvider({ children }: SettingsContextProviderProps) {
  const [settings, setSettings] = useState<Settings | null>(null);
  useEffect(() => {
    setSettings(fetchSettings());
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
