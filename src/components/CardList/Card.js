import React from "react";
import PropTypes from "prop-types"; // Import PropTypes for prop type validation
import styles from "./Card.module.css";

const Card = (props) => {
	const { background, title, content } = props;

	return (
		<li className={`${styles.card} ${background ? styles[background] : ""}`}>
			{title && (
				<div className={styles["card__title"]}>
					<p>{title.toUpperCase()}</p>
					{content && <div className={styles["card__content"]}>{content}</div>}
				</div>
			)}
		</li>
	);
};

// Define propTypes for prop type validation
Card.propTypes = {
	background: PropTypes.string, // Background CSS class name
	title: PropTypes.string, // Title text
	content: PropTypes.node, // Content (can be JSX)
};

export default Card;
