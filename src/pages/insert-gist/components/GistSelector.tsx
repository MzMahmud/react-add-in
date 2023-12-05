import React from "react";
import { Gist } from "../../../models/gist.model";
import { GistCard } from "./GistCard";

interface GistSelectorProps {
  gists: Gist[];
  selectedGistId: string | null;
  onGistSelected?: (id: string | null) => void;
}

export function GistSelector({ gists, selectedGistId, onGistSelected }: GistSelectorProps) {
  if (gists.length == 0) {
    return <div className="error-message">No gists found!</div>;
  }
  return (
    <>
      {gists.map((gist) => (
        <GistCard
          key={gist.id}
          gist={gist}
          selectedGistId={selectedGistId}
          onGistSelected={(id) => onGistSelected && onGistSelected(id)}
        />
      ))}
    </>
  );
}
