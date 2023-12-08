import React, { useEffect, useState } from "react";
import useSettingsContext from "../../../contexts/settings";
import { Gist, getHtmlContent } from "../../../models/gist.model";
import { getGistWithContent, getUserPublicGists } from "../../../services/gist";
import { displayDialogAsync, setSelectedDataAsHtml } from "../../../services/office";
import { GistSelector } from "../../../common/components/GistSelector/GistSelector";
import { addQueryParamToUrl, getAbsoluteUrl } from "../../../utils/string.util";
import { Settings } from "../../../models/settings.model";

export function App() {
  const { settings, updateSettings } = useSettingsContext();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedGistId, setSelectedGistId] = useState<string | null>(null);
  const [gists, setGists] = useState<Gist[]>([]);

  useEffect(() => {
    if (settings == null) {
      setErrorMessage("No github username is set!");
      setGists([]);
      setSelectedGistId(null);
      return;
    }
    setErrorMessage(null);
    async function fetchGists() {
      if (settings == null) return;
      setGists(await getUserPublicGists(settings.githubUsername));
      setSelectedGistId(settings.defaultGistId);
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

  const openSettingsDialogue = async () => {
    const url = addQueryParamToUrl(getAbsoluteUrl("/settings.html"), settings ?? {});
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

  const openIframeDialog = async () => {
    const url = getAbsoluteUrl("iframe-dialog.html");
    const dialogOption = { width: 40, height: 50, displayInIframe: true };
    console.warn("openIframeDialog", url);
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
      <div>
        <button className="ms-Button ms-Button--secondary settings-btn" onClick={openIframeDialog}>
          iframe-dialog
        </button>
      </div>
    </main>
  );
}

export default App;
