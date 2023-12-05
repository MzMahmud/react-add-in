import React from "react";
import { Gist } from "../../../models/gist.model";

interface GistGistCardProps {
  gist: Gist;
}

export function GistCard({ gist }: GistGistCardProps) {
  return (
    <div className="gist">
      <label>
        <input type="radio" name="gist" />
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
