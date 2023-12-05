import React from "react";
import { Gist } from "../../../models/gist.model";

interface GistGistCardProps {
  gist: Gist;
  selectedGistId?: string | null;
  onGistSelected?: (id: string | null) => void;
}

export function GistCard({ gist, selectedGistId, onGistSelected }: GistGistCardProps) {
  return (
    <div className="gist">
      <label>
        <input
          type="radio"
          name="gist"
          value={gist.id}
          checked={selectedGistId === gist.id}
          onChange={(_) => onGistSelected && onGistSelected(gist.id)}
        />
        &nbsp;{gist.title}
        <div className="gist__detail">
          <ul style={{ margin: "5px 15px" }}>
            {gist.files.map((file) => (
              <li key={file.filename}>
                {file.filename} ({file.language})
              </li>
            ))}
          </ul>
          <div>Last Updated {gist.lastUpdated.toLocaleString()}</div>
        </div>
      </label>
    </div>
  );
}
