import React from "react";
import { messageParent } from "../../../services/office";

export default function App() {
  const urlSearchParams = new URLSearchParams(window.location.search);
  const code = urlSearchParams.get("code");
  if (code == null) {
    return <h1>Login failed!</h1>;
  }
  messageParent(code);
  return <h1>Login Success code={code}</h1>;
}
