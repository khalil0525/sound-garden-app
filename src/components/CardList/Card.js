import styles from "./Card.module.css";

const Card = (props) => {
	return (
		<li className={styles.card}>
			<div className={styles["card__title"]}>
				<p>{props.title && props.title.toUpperCase()}</p>
			</div>
		</li>
	);
};
export default Card;
