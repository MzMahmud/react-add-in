import { useSignalEffect } from "@preact/signals-react";
import React, { useState } from "react";
import { GistSelector } from "../../../common/components/GistSelector/GistSelector";
import { Gist, getHtmlContent } from "../../../models/gist.model";
import { Settings } from "../../../models/settings.model";
import { getGistWithContent, getUserPublicGists } from "../../../services/gist";
import { displayDialogAsync, setSelectedDataAsHtml } from "../../../services/office";
import { $settings, updateSettings } from "../../../signals/settings";
import { addQueryParamToUrl, getAbsoluteUrl } from "../../../utils/string.util";

export function App() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedGistId, setSelectedGistId] = useState<string | null>(null);
  const [gists, setGists] = useState<Gist[]>([]);

  useSignalEffect(() => {
    if ($settings.value == null) {
      setErrorMessage("No github username is set!");
      setGists([]);
      setSelectedGistId(null);
      return;
    }
    const settings = $settings.value;
    setErrorMessage(null);
    async function fetchGists() {
      setGists(await getUserPublicGists(settings.githubUsername));
      setSelectedGistId(settings.defaultGistId);
    }
    fetchGists();
  });

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

  const openSettingsDialogue = async () => {
    const url = addQueryParamToUrl(getAbsoluteUrl("/settings.html"), $settings.value ?? {});
    const dialogOption = { width: 40, height: 50, displayInIframe: true };
    const res = await displayDialogAsync(url, dialogOption);
    if (res.status === "ERROR") {
      setErrorMessage(res.message);
      return;
    }
    const settingsDialog = res.value;
    settingsDialog.addEventHandler(Office.EventType.DialogMessageReceived, async (response) => {
      if ("error" in response) {
        console.error("dialogue message revived error", response.error);
        return;
      }
      const updatedSettings = JSON.parse(response.message) as Settings;
      await updateSettings(updatedSettings);
      settingsDialog.close();
    });
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
          <button className="ms-Button ms-Button--secondary settings-btn" onClick={openSettingsDialogue}>
            ⚙️
          </button>
        </div>
      </div>
    </main>
  );
}

export default App;
