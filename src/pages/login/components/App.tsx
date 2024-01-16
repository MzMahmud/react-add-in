import React, { useEffect } from "react";
import { getAuthToken } from "../../../services/auth";
import { messageParent } from "../../../services/office";

const clientId = "08365e2f-e5b6";
const redirectUrl = "https://localhost:5000/login-success.html";
const loginProviderUrl = `http://localhost:8080/login?client_id=${clientId}&redirect_url=${redirectUrl}&scope=code`;

export function App() {
  useEffect(() => {
    const onMessage = async (event: MessageEvent<string>) => {
      const authToken = await getAuthToken(event.data, clientId);
      messageParent(JSON.stringify(authToken));
    };
    window.addEventListener("message", onMessage, false);
    return () => window.removeEventListener("message", onMessage, false);
  }, []);
  return (
    <main>
      <div>
        <iframe src={loginProviderUrl} width={600} height={350}></iframe>
      </div>
    </main>
  );
}

export default App;
