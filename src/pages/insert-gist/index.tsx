import React from "react";
import { createRoot } from "react-dom/client";
import { SettingsContextProvider } from "../../contexts/settings";
import App from "./components/App";

/* global module, require */

const rootElement: HTMLElement = document.getElementById("container") as HTMLElement;
const root = createRoot(rootElement);

/* Render application after Office initializes */
Office.onReady(() => {
  root.render(
    <SettingsContextProvider>
      <App />
    </SettingsContextProvider>
  );
});

if ((module as any).hot) {
  (module as any).hot.accept("./components/App", () => {
    const NextApp = require("./components/App").default;
    root.render(NextApp);
  });
}
