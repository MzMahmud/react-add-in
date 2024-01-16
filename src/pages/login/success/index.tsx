import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

/* global module, require */

const rootElement: HTMLElement = document.getElementById("container") as HTMLElement;
const root = createRoot(rootElement);

/* Render application after Office initializes */
Office.onReady(() => {
  root.render(<App />);
});

if ((module as any).hot) {
  (module as any).hot.accept("./App", () => {
    const NextApp = require("./App").default;
    root.render(NextApp);
  });
}
