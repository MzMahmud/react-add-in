import React from "react";
import { Gist } from "../../../models/gist.model";
import styles from "./GistSelector.module.css";

interface GistGistCardProps {
  gist: Gist;
  selectedGistId?: string | null;
  onGistSelected?: (id: string | null) => void;
}

export function GistCard({ gist, selectedGistId, onGistSelected }: GistGistCardProps) {
  return (
    <div className={styles.gist}>
      <label>
        <input
          type="radio"
          name="gist"
          value={gist.id}
          checked={selectedGistId === gist.id}
          onChange={(_) => onGistSelected?.(gist.id)}
        />
        &nbsp;{gist.title}
        <div className={styles.gistDetail}>
          <ul className={styles.gistFiles}>
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
