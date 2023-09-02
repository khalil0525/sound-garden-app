import styles from "./Home.module.css";
import ActionBar from "../../components/ActionBar/ActionBar";
import { useAuthContext } from "../../hooks/useAuthContext";
import Card from "../../components/CardList/Card";
import CardList from "../../components/CardList/CardList";
import Button from "../../components/UI/Button/Button";

const tempList = [
	{ title: "Top 50 tamil", content: "50 tracks", background: "" },
	{ title: "Weekly Hits", content: "100 tracks", background: "" },
	{ title: "Tolly Hit track", content: "60 Tracks", background: "" },
];
export default function Home() {
	const { user } = useAuthContext();
	return (
		<div className={styles.home}>
			<ActionBar className={styles["home__actionBar"]} user={user} />

			<Card
				style={{
					backgroundColor: "#FD4D2D",
					borderRadius: "12px",
					position: "relative",
				}}
			>
				<img
					src="/img/woman-listening-to-music.png"
					alt="woman listening to music"
				></img>
				<Button>Listen Now</Button>
			</Card>
			<div>
				<CardList
					className={styles["genres__cardList"]}
					list={tempList}
					page={""}
				/>
			</div>
		</div>
	);
}
