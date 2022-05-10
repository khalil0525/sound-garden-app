import styles from "./Genres.module.css";
import ActionBar from "../../components/ActionBar/ActionBar";
import { useAuthContext } from "../../hooks/useAuthContext";
import CardList from "../../components/CardList/CardList";
const genres = [
  "none",
  "alternative rock",
  "ambient",
  "classical",
  "dance & edm",
  "dancehall",
  "deep house",
  "disco",
  "drum & bass",
  "dubstep",
  "electronic",
  "hip-hop & rap",
  "house",
  "indie",
  "latin",
  "metal",
  "piano",
  "pop",
  "r&b",
  "reggae",
  "reggaeton",
  "rock",
  "soundtrack",
  "techno",
  "trance",
  "trap",
  "triphop",
  "world",
];

export default function Genres() {
  const { user } = useAuthContext();
  return (
    <div className={styles.genres}>
      <ActionBar className={styles["genres__actionBar"]} user={user} />
      {/* <h2>Genres</h2> */}
      <CardList
        className={styles["genres__cardList"]}
        list={genres}
        page={"genres"}
      />
    </div>
  );
}
