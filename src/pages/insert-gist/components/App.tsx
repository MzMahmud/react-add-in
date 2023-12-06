import React, { useEffect, useState } from "react";
import useSettingsContext from "../../../contexts/settings";
import { Gist, getHtmlContent } from "../../../models/gist.model";
import { getGistWithContent, getUserPublicGists } from "../../../services/gist";
import { setSelectedDataAsHtml } from "../../../services/office";
import { GistSelector } from "./GistSelector";

export function App() {
  const { settings, updateSettings } = useSettingsContext();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedGistId, setSelectedGistId] = useState<string | null>(null);
  const [gists, setGists] = useState<Gist[]>([]);

  const [githubUsername, setGithubUsername] = useState<string>("");

  useEffect(() => {
    if (settings == null) {
      setErrorMessage("No github username is set!");
      return;
    }
    setErrorMessage(null);
    async function fetchGists() {
      if (settings == null) {
        return;
      }
      const newGists = await getUserPublicGists(settings.githubUsername);
      setGists(newGists);
    }
    fetchGists();
  }, [settings]);

  const insertGist = async () => {
    if (selectedGistId == null) {
      setErrorMessage("No gist is selected!");
      return;
    }
    const gistRes = await getGistWithContent(selectedGistId);
    if (gistRes.status === "ERROR") {
      setErrorMessage(gistRes.message);
      return;
    }
    const htmlContent = getHtmlContent(gistRes.value);
    const res = await setSelectedDataAsHtml(htmlContent);
    if (res.status === "ERROR") {
      setErrorMessage(res.message);
      return;
    }
    setErrorMessage(null);
  };

  const saveGithubUsernmae = () => {
    if (githubUsername.length === 0) {
      setErrorMessage("No github username is set!");
      return;
    }
    setErrorMessage(null);
    updateSettings({ githubUsername });
  };

  return (
    <main>
      <div className="gists-section">
        <GistSelector gists={gists} selectedGistId={selectedGistId} onGistSelected={setSelectedGistId} />
      </div>
      {errorMessage != null && <div className="error-message">{errorMessage}</div>}

      <div>
        <input
          type="text"
          placeholder="Github Username"
          value={githubUsername}
          onChange={(e) => setGithubUsername(e.target.value)}
        />

        <button disabled={githubUsername === ""} onClick={saveGithubUsernmae}>
          Save
        </button>
      </div>

      <div className="btn-container">
        <div>
          <button
            className="ms-Button ms-Button--primary insert-btn"
            disabled={selectedGistId == null}
            onClick={insertGist}
          >
            <span className="ms-Button-label">Insert</span>
          </button>
        </div>
        <div>
          <button className="ms-Button ms-Button--secondary settings-btn">⚙️</button>
        </div>
      </div>
    </main>
  );
}

export default App;
