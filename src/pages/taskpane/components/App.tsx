import React from "react";
import { Gist } from "../../../models/gist.model";
import { GistSelector } from "./GistSelector";

interface AppProps {}

// dummy gist
const gists: Gist[] = [
  {
    id: "fcfa14d60e0448419b106102efe4fbfe",
    lastUpdated: new Date("2023-11-30T11:58:11Z"),
    title: "Fibonacci Function Typescript",
    files: [{ filename: "fibonacci.ts", language: "TypeScript" }],
  },
  {
    id: "ca15c48b96ab21b64e28e2b54a068870",
    lastUpdated: new Date("2023-11-30T05:12:10Z"),
    title: "Hello World Html",
    files: [{ filename: "HelloWorld.html", language: "HTML" }],
  },
  {
    id: "00d436c89c411531832bf7cdbc5cf5fc",
    lastUpdated: new Date("2023-11-30T05:11:07Z"),
    title: "Hello World Markdown",
    files: [{ filename: "HelloWorld.md", language: "Markdown" }],
  },
];

export function App({}: AppProps) {
  return (
    <>
      <GistSelector gists={gists} />
    </>
  );
}

export default App;
