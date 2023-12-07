import { fetchSettings, saveSettings } from "../../services/settings";
import { getHtmlContent } from "../../models/gist.model";
import { Settings } from "../../models/settings.model";
import { getGistWithContent } from "../../services/gist";
import { displayDialogAsync, registerAction, setSelectedDataAsHtml } from "../../services/office";
import { addQueryParamToUrl, getAbsoluteUrl } from "../../utils/string.util";

Office.onReady();

registerAction("insertDefaultGist", insertDefaultGist);

async function insertDefaultGist() {
  const settings = fetchSettings();
  const defaultGistId = settings?.defaultGistId;
  if (defaultGistId == null) {
    console.error("No default gist selected!");
    await openSettingsDialogue();
    return;
  }
  const gistRes = await getGistWithContent(defaultGistId);
  if (gistRes.status === "ERROR") {
    console.error(`Error fetching default gist with id=${defaultGistId}`, gistRes.message);
    return;
  }
  const htmlContent = getHtmlContent(gistRes.value);
  const res = await setSelectedDataAsHtml(htmlContent);
  if (res.status === "ERROR") {
    console.error(`Error iserting default gist with id=${defaultGistId}`, res.message);
    return;
  }
}

async function openSettingsDialogue() {
  const url = addQueryParamToUrl(getAbsoluteUrl("/settings.html"), {
    errorMessage: "No default gist selected! Please select one.",
  });
  const dialogOption = { width: 40, height: 50, displayInIframe: true };
  const res = await displayDialogAsync(url, dialogOption);
  if (res.status === "ERROR") {
    console.error(res.message);
    return;
  }
  const settingsDialog = res.value;
  settingsDialog.addEventHandler(Office.EventType.DialogMessageReceived, async (response) => {
    if ("error" in response) {
      console.error("dialogue message revived error", response.error);
      return;
    }
    const updatedSettings = JSON.parse(response.message) as Settings;
    await saveSettings(updatedSettings);
    settingsDialog.close();
    insertDefaultGist();
  });
}
