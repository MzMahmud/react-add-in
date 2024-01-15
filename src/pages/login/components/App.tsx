import axios from "axios";
import React, { useState, useEffect } from "react";
import { messageParent } from "../../../services/office";

const clientId = "08365e2f-e5b6";
const redirectUrl = "https://localhost:5000/login-success.html";
const loginProviderUrl = `http://localhost:8080/login?client_id=${clientId}&redirect_url=${redirectUrl}&scope=code`;

async function getAccessToken(code: string) {
  const authTokenReqBody = {
    code,
    client_id: clientId,
  };
  const res = await axios.post("http://localhost:8080/api/auth/token", authTokenReqBody);
  messageParent(JSON.stringify(res.data));
}

export function App() {
  useEffect(() => {
    const onMessage = async (event: MessageEvent<string>) => {
      getAccessToken(event.data);
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
