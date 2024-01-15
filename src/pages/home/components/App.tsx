import React, { useState } from "react";
import { getAbsoluteUrl } from "../../../utils/string.util";
import { displayDialogAsync } from "../../../services/office";

export function App() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const openLoginDialogue = async () => {
    const url = getAbsoluteUrl("/login.html");
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
      settingsDialog.close();
    });
  };

  return (
    <main>
      <div className="gists-section">
        <div>You are not logged in. Please Login!</div>
        <div className="btn-container">
          <button className="ms-Button ms-Button--secondary settings-btn" onClick={openLoginDialogue}>
            Login
          </button>
        </div>
      </div>
      {errorMessage != null && <div className="error-message">{errorMessage}</div>}
    </main>
  );
}

export default App;
