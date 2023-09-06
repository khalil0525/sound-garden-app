import React from "react";
import styles from "./Layout.module.css";
import ActionBar from "../ActionBar/ActionBar";

// Pass the child props
export default function TwoColumnLayout({ children, user }) {
	return (
		<div className={styles.twoColumnlayout}>
			<ActionBar className={styles["actionBarTwoCol"]} user={user} />
			{/* display the child prop */}
			{children}
		</div>
	);
}
