import { fetchSettings, saveSettings } from "../../services/settings";
import { getHtmlContent } from "../../models/gist.model";
import { Settings } from "../../models/settings.model";
import { getGistWithContent } from "../../services/gist";
import { displayDialogAsync, registerAction, setSelectedDataAsHtml } from "../../services/office";
import { addQueryParamToUrl, getAbsoluteUrl } from "../../utils/string.util";
import logger from "../../logger";

Office.onReady();

registerAction("insertDefaultGist", insertDefaultGist);

async function insertDefaultGist() {
  const settings = fetchSettings();
  logger.debug("settings", settings);
  const defaultGistId = settings?.defaultGistId;
  if (defaultGistId == null) {
    logger.error("No default gist selected!");
    await openSettingsDialogue();
    return;
  }
  const gistRes = await getGistWithContent(defaultGistId);
  if (gistRes.status === "ERROR") {
    logger.error(`Error fetching default gist with id=${defaultGistId}`, gistRes.message);
    return;
  }
  logger.debug("gist", gistRes.value);
  const htmlContent = getHtmlContent(gistRes.value);
  logger.debug("htmlContent", htmlContent);
  const res = await setSelectedDataAsHtml(htmlContent);
  if (res.status === "ERROR") {
    logger.error(`Error iserting default gist with id=${defaultGistId}`, res.message);
    return;
  }
}

async function openSettingsDialogue() {
  const url = addQueryParamToUrl(getAbsoluteUrl("/settings.html"), {
    errorMessage: "No default gist selected! Please select one.",
  });
  logger.debug("Opening settings dialogue with url", url);
  const dialogOption = { width: 40, height: 50, displayInIframe: true };
  const res = await displayDialogAsync(url, dialogOption);
  if (res.status === "ERROR") {
    logger.error(res.message);
    return;
  }
  const settingsDialog = res.value;
  settingsDialog.addEventHandler(Office.EventType.DialogMessageReceived, async (response) => {
    if ("error" in response) {
      logger.error("dialogue message revived error", response.error);
      return;
    }
    const updatedSettings = JSON.parse(response.message) as Settings;
    await saveSettings(updatedSettings);
    settingsDialog.close();
    insertDefaultGist();
  });
}
