import React from "react";

const loginProviderUrl =
  "http://localhost:8080/login?client_id=08365e2f-e5b6&redirect_url=https://localhost:3000/oauth/success&scope=code";

export function App() {
  return (
    <main>
      <div>
        <iframe src={loginProviderUrl} width={600} height={350}></iframe>
      </div>
    </main>
  );
}

export default App;
