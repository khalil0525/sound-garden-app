import React from "react";
import styles from "./Layout.module.css";
import ActionBar from "../ActionBar/ActionBar";

// Pass the child props
export default function OneColumnLayout({ children, user }) {
  return (
    <div className={styles.oneColumnlayout}>
      <ActionBar
        className={styles["actionBarOneCol"]}
        user={user}
      />
      {/* display the child prop */}
      <div className={styles.oneColumnlayoutContainer}>{children}</div>
    </div>
  );
}
