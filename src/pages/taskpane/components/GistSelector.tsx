import React, { useEffect, useState } from "react";
import { Gist } from "../../../models/gist.model";
import { GistCard } from "./GistCard";
import { useTabStyles_unstable } from "@fluentui/react-components";

interface GistSelectorProps {
  gists: Gist[];
  selectedGistId: string | null;
  onGistSelected?: (id: string | null) => void;
}

export function GistSelector({ gists, selectedGistId, onGistSelected }: GistSelectorProps) {
  const [gistId, setGistId] = useState<string | null>(selectedGistId);
  if (gists.length == 0) {
    return <div className="error-message">No gists found!</div>;
  }
  useEffect(() => {
    if (onGistSelected != null) {
      onGistSelected(gistId);
    }
  }, [gistId]);
  return (
    <>
      {gists.map((gist) => (
        <GistCard key={gist.id} gist={gist} selectedGistId={gistId} onGistSelected={(id) => setGistId(id)} />
      ))}
    </>
  );
}
