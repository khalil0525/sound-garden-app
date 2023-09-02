import styles from "./Home.module.css";
import ActionBar from "../../components/ActionBar/ActionBar";
import { useAuthContext } from "../../hooks/useAuthContext";
import Card from "../../components/CardList/Card";
import CardList from "../../components/CardList/CardList";
import Button from "../../components/UI/Button/Button";
import card1bg from "../../images/cardBg1.png";
import card2bg from "../../images/cardBg2.png";
import card3bg from "../../images/cardBg3.png";
import womanListeningToMusicBg from "../../images/woman-listening-to-music.png";
const tempList = [
	{ title: "Top 50 tamil", content: "50 tracks", background: card1bg },
	{ title: "Weekly Hits", content: "100 tracks", background: card2bg },
	{ title: "Tolly Hit track", content: "60 Tracks", background: card3bg },
];
export default function Home() {
	const { user } = useAuthContext();
	return (
		<div className={styles.home}>
			<ActionBar className={styles["home__actionBar"]} user={user} />
			<div className={styles["home__content"]}>
				<div>
					<Card
						style={{
							backgroundColor: "#FD4D2D",
							borderRadius: "12px",
							position: "relative",
							width: "50%",
						}}
						background={null}
					>
						<img
							src="/img/woman-listening-to-music.png"
							alt="woman listening to music"
						></img>
						<Button>Listen Now</Button>
					</Card>
				</div>
				<div className={styles["home__container"]}>
					<p className={styles["home__title"]}>Playlists</p>
					<CardList
						className={styles["home__cardList"]}
						list={tempList}
						page=""
					/>
				</div>

				<div className={styles["home__container"]}>
					<p className={styles["home__title"]}>Trending</p>
					<CardList
						className={styles["home__cardList"]}
						list={tempList}
						page=""
					/>
				</div>
			</div>
		</div>
	);
}
