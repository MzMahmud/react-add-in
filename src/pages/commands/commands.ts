import { getSettings } from "../../contexts/settings";
import { getHtmlContent } from "../../models/gist.model";
import { getGistWithContent } from "../../services/gist";
import { registerAction, setSelectedDataAsHtml } from "../../services/office";

Office.onReady();

registerAction("insertDefaultGist", insertDefaultGist);

async function insertDefaultGist() {
  const settings = getSettings();
  const defaultGistId = settings?.defaultGistId;
  if (defaultGistId == null) {
    console.error("No default gist selected!");
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
