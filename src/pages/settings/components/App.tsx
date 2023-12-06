import React from "react";
import styles from "./App.module.css";

export function App() {
  return (
    <section className={styles.section}>
      <div>
        <label>
          Github Username
          <input type="text" name="githubUsername" className={styles.gistsSection} />
        </label>
      </div>
      <div>
        <label> Select Default Gist </label>
      </div>
      <div className={styles.gistsSection}></div>
      <div className={styles.buttonContainer}>
        <button className="ms-Button ms-Button--primary">
          <span className="ms-Button-label">Save</span>
        </button>
      </div>
    </section>
  );
}

export default App;
