import React, { useState } from "react";
import styles from "./App.module.css";
import { Settings } from "../../../models/settings.model";
import { messageParent } from "../../../services/office";

export function App() {
  const [githubUsername, setGithubUsername] = useState("");

  const isSettingsInvalid = () => githubUsername === "";

  const saveSettings = () => {
    if (isSettingsInvalid()) {
      return;
    }
    const settings: Settings = { githubUsername };
    messageParent(JSON.stringify(settings));
  };

  return (
    <section className={styles.section}>
      <div>
        <label>
          Github Username
          <input
            type="text"
            name="githubUsername"
            className={styles.formInput}
            value={githubUsername}
            onChange={(e) => setGithubUsername(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>Select Default Gist</label>
      </div>
      <div className={styles.gistsSection}></div>
      <div className={styles.buttonContainer}>
        <button className="ms-Button ms-Button--primary" disabled={isSettingsInvalid()} onClick={saveSettings}>
          <span className="ms-Button-label">Save</span>
        </button>
      </div>
    </section>
  );
}

export default App;
