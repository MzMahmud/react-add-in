import React from "react";
import { Gist } from "../../../models/gist.model";
import { GistCard } from "./GistCard";

interface GistSelectorProps {
  gists: Gist[];
}

export function GistSelector({ gists }: GistSelectorProps) {
  if (gists.length == 0) {
    return <div className="error-message">No gists found!</div>;
  }
  return (
    <>
      {gists.map((gist) => (
        <GistCard key={gist.id} gist={gist} />
      ))}
    </>
  );
}
