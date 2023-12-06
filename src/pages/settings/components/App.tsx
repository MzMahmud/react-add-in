import React, { useEffect, useRef, useState } from "react";
import { GistSelector } from "../../../common/components/GistSelector/GistSelector";
import { Gist } from "../../../models/gist.model";
import { Settings } from "../../../models/settings.model";
import { getUserPublicGists } from "../../../services/gist";
import { messageParent } from "../../../services/office";
import styles from "./App.module.css";

function getSearchParam<T>(paramName: string, defaultValue: T) {
  const params = new URLSearchParams(window.location.search);
  return params.get(paramName) ?? defaultValue;
}

export function App() {
  const [githubUsername, setGithubUsername] = useState(getSearchParam("githubUsername", ""));
  const [gists, setGists] = useState<Gist[]>([]);
  const [defaultGistId, setDefaultGistId] = useState<string | null>(getSearchParam("defaultGistId", null));
  const isFirstLoad = useRef(true);

  useEffect(() => {
    async function fetchGists() {
      if (githubUsername === "") {
        setGists([]);
      } else {
        setGists(await getUserPublicGists(githubUsername));
      }
      if (isFirstLoad.current) isFirstLoad.current = false;
      else setDefaultGistId(null);
    }
    fetchGists();
  }, [githubUsername]);

  const isSettingsInvalid = () => githubUsername === "";

  const saveSettings = () => {
    if (isSettingsInvalid()) {
      return;
    }
    const settings: Settings = { githubUsername, defaultGistId };
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
      <div className={styles.gistsSection}>
        <GistSelector gists={gists} selectedGistId={defaultGistId} onGistSelected={setDefaultGistId} />
      </div>
      <div className={styles.buttonContainer}>
        <button className="ms-Button ms-Button--primary" disabled={isSettingsInvalid()} onClick={saveSettings}>
          <span className="ms-Button-label">Save</span>
        </button>
      </div>
    </section>
  );
}

export default App;
