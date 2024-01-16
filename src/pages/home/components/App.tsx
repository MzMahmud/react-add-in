import React, { useEffect, useState } from "react";
import { getAbsoluteUrl } from "../../../utils/string.util";
import { displayDialogAsync } from "../../../services/office";
import { getAuthToken } from "../../../services/auth";

export function App() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);

  useEffect(() => {
    const token = window.localStorage.getItem("authToken");
    if (token != null) {
      setAuthToken(JSON.stringify(JSON.parse(token), null, 2));
    }
  }, []);

  const openLoginDialogue = async () => {
    const url = getAbsoluteUrl("/login.html");
    const dialogOption: Office.DialogOptions = { width: 40, height: 50, displayInIframe: true };
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
      const authToken = response.message;
      window.localStorage.setItem("authToken", authToken);
      setAuthToken(JSON.stringify(JSON.parse(authToken), null, 2));
      settingsDialog.close();
    });
  };

  // Microsoft recommend to use non iframe dialogue for login because some providers do not allow their page to be opened in iframe.
  // https://learn.microsoft.com/en-us/office/dev/add-ins/develop/auth-with-office-dialog-api
  // Also this is simpler to implement. We can use the dialogue to directly open login provider page instead of using iframe.
  const openLoginDialogueNonIframe = async () => {
    const clientId = "08365e2f-e5b6";
    const redirectUrl = "https://localhost:5000/login/success.html";
    const loginProviderUrl = `https://localhost:8080/login?client_id=${clientId}&redirect_url=${redirectUrl}&scope=code`;
    const dialogOption: Office.DialogOptions = {
      width: 40,
      height: 50,
      displayInIframe: false,
      promptBeforeOpen: false,
    };
    const res = await displayDialogAsync(loginProviderUrl, dialogOption);
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
      const authCode = response.message;
      const authToken = await getAuthToken(authCode, clientId);
      window.localStorage.setItem("authToken", JSON.stringify(authToken));
      setAuthToken(JSON.stringify(authToken, null, 2));
      settingsDialog.close();
    });
  };

  const onLogout = () => {
    window.localStorage.removeItem("authToken");
    setAuthToken(null);
  };

  return (
    <main>
      {authToken == null && (
        <div className="gists-section">
          <div>You are not logged in. Please Login!</div>
          <div className="btn-container">
            <button className="ms-Button ms-Button--secondary settings-btn" onClick={openLoginDialogueNonIframe}>
              Login
            </button>
          </div>
        </div>
      )}
      {authToken != null && (
        <div>
          Logged In
          <pre>{authToken}</pre>
          <div className="btn-container">
            <button className="ms-Button ms-Button--secondary settings-btn" onClick={onLogout}>
              Logout
            </button>
          </div>
        </div>
      )}
      {errorMessage != null && <div className="error-message">{errorMessage}</div>}
    </main>
  );
}

export default App;
