import React, { useEffect, useState } from "react";
import { GistSelector } from "../../../common/components/GistSelector/GistSelector";
import useSettingsContext from "../../../contexts/settings";
import logger, { fetchLogs, fetchLogsFromLocalStorage } from "../../../logger";
import { Gist, getHtmlContent } from "../../../models/gist.model";
import { Settings } from "../../../models/settings.model";
import { getGistWithContent, getUserPublicGists } from "../../../services/gist";
import { displayDialogAsync, setSelectedDataAsHtml } from "../../../services/office";
import { addQueryParamToUrl, getAbsoluteUrl } from "../../../utils/string.util";

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
    logger.debug("Insert this gist", gistRes.value);
    const htmlContent = getHtmlContent(gistRes.value);
    logger.debug("HTML Content", htmlContent);
    const res = await setSelectedDataAsHtml(htmlContent);
    if (res.status === "ERROR") {
      setErrorMessage(res.message);
      return;
    }
    setErrorMessage(null);
  };

  const openSettingsDialogue = async () => {
    const url = addQueryParamToUrl(getAbsoluteUrl("/settings.html"), settings ?? {});
    logger.debug("Opening settings dialogue with url", url);
    const dialogOption = { width: 40, height: 50, displayInIframe: true };
    const res = await displayDialogAsync(url, dialogOption);
    if (res.status === "ERROR") {
      logger.error(res.message);
      setErrorMessage(res.message);
      return;
    }
    const settingsDialog = res.value;
    settingsDialog.addEventHandler(Office.EventType.DialogMessageReceived, async (response) => {
      if ("error" in response) {
        logger.error("dialogue message revived error", response.error);
        return;
      }
      const updatedSettings = JSON.parse(response.message) as Settings;
      logger.debug("updatedSettings", updatedSettings);
      await updateSettings(updatedSettings);
      settingsDialog.close();
    });
  };

  const getLogs = async () => {
    const logs = fetchLogsFromLocalStorage();
    console.log("logs", logs);
    const logLines = `<pre><code>${logs.map((log) => JSON.stringify(log)).join("\n")}</code></pre>`;
    const res = await setSelectedDataAsHtml(logLines);
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
          <button className="ms-Button ms-Button--secondary settings-btn" onClick={openSettingsDialogue}>
            ⚙️
          </button>
        </div>
      </div>
      <div style={{ marginTop: "5px", textAlign: "center" }}>
        <button className="ms-Button ms-Button--secondary settings-btn" onClick={getLogs}>
          Get Logs
        </button>
      </div>
    </main>
  );
}

export default App;
