import React from "react";
import PropTypes from "prop-types";
import styles from "./ListCard.module.css";

const ListCard = ({ background, title, content }) => {
	const cardClasses = [styles.card];

	if (background) {
		cardClasses.push(styles[background]);
	}

	return (
		<li
			className={styles.card}
			style={background ? { backgroundImage: `url(${background})` } : {}}
		>
			{title && (
				<div className={styles["card__title"]}>
					<p>{title.toUpperCase()}</p>
					{content && <div className={styles["card__content"]}>{content}</div>}
				</div>
			)}
		</li>
	);
};

ListCard.propTypes = {
	background: PropTypes.string,
	title: PropTypes.string,
	content: PropTypes.node,
};

export default ListCard;
