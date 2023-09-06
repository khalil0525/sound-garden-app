import React from "react";
import styles from "./Layout.module.css";
import ActionBar from "../ActionBar/ActionBar";

// Pass the child props
export default function ThreeColumnLayout({ children, user }) {
	return (
		<div className={styles.layout}>
			<ActionBar className={styles["actionBar"]} user={user} />

			{children}
		</div>
	);
}
