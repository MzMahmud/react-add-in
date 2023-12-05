import React, { useEffect, useState } from "react";
import { Gist } from "../../../models/gist.model";
import { setSelectedDataAsHtml } from "../../../services/office";
import { GistSelector } from "./GistSelector";
import { Settings } from "../../../models/settings.model";
import { getUserPublicGists } from "../../../services/gist";

interface AppProps {}

const settings: Settings = { githubUsername: "alfred" };

export function App({}: AppProps) {
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
    const gist = gists.find((gist) => gist.id === selectedGistId);
    if (gist == null) {
      setErrorMessage("Gist not found!");
      return;
    }
    setErrorMessage(null);
    setSelectedDataAsHtml(gist.title);
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
