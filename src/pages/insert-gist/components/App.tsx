import React, { useEffect, useState } from "react";
import { Gist, getHtmlContent } from "../../../models/gist.model";
import { Settings } from "../../../models/settings.model";
import { getGistWithContent, getUserPublicGists } from "../../../services/gist";
import { setSelectedDataAsHtml } from "../../../services/office";
import { GistSelector } from "./GistSelector";

const settings: Settings = { githubUsername: "MzMahmud" };

export function App() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedGistId, setSelectedGistId] = useState<string | null>(null);
  const [gists, setGists] = useState<Gist[]>([]);

  useEffect(() => {
    async function fetchGists() {
      const newGists = await getUserPublicGists(settings.githubUsername);
      setGists(newGists);
    }
    fetchGists();
  }, []);

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

  return (
    <main>
      <div className="gists-section">
        <GistSelector gists={gists} selectedGistId={selectedGistId} onGistSelected={setSelectedGistId} />
      </div>
      {errorMessage != null && <div className="error-message">{errorMessage}</div>}
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
