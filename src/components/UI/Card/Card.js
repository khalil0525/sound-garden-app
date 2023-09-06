import React from "react";
import PropTypes from "prop-types";
import styles from "./Card.module.css";

const Card = ({ background, className, children }) => {
	const cardClasses = [styles.card + " " + className];

	if (background) {
		cardClasses.push(styles[background]);
	}

	return (
		<div
			className={cardClasses}
			style={background ? { backgroundImage: `url(${background})` } : null}
		>
			{children}
		</div>
	);
};

Card.propTypes = {
	background: PropTypes.string,
	title: PropTypes.string,
	content: PropTypes.node,
};

export default Card;
