import React, { useEffect } from "react";

export function App() {
  useEffect(() => {
    const onMessage = (event: MessageEvent<string>) => {
      console.warn("message received", event.data);
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);
  return (
    <main style={{ height: "100vh" }}>
      <iframe src="https://localhost:5173/" height={"80%"} width={"100%"} />
    </main>
  );
}

export default App;
