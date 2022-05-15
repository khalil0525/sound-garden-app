import React from "react";
import styles from "./DeleteSongOverlay.module.css";
const DeleteSongOverlay = (props) => {
  return (
    <div className={styles.modal}>
      <header className={styles.header}>
        <h2>Are you sure?</h2>
      </header>
      <div className={styles.content}>
        <p>
          Removing this track is irreversible. You will lose all the plays and
          likes for this track with no way to get them back.
        </p>
      </div>
      <footer className={styles.actions}>
        <button
          style={{ border: "none", background: "none" }}
          onClick={props.onCancel}
        >
          Cancel
        </button>
        <button onClick={props.onConfirm}>Delete Forever</button>
      </footer>
    </div>
  );
};

export default DeleteSongOverlay;
