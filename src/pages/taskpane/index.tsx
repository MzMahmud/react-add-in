import React from "react";
import { createRoot } from "react-dom/client";
import App from "./components/App";

/* global module, require */

const rootElement: HTMLElement = document.getElementById("container");
const root = createRoot(rootElement);

/* Render application after Office initializes */
Office.onReady(() => {
  root.render(<App />);
});

if ((module as any).hot) {
  (module as any).hot.accept("./components/App", () => {
    const NextApp = require("./components/App").default;
    root.render(NextApp);
  });
}
