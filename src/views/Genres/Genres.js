import styles from "./Genres.module.css";

import { useAuthContext } from "../../hooks/useAuthContext";
import CardList from "../../components/CardList/CardList";
import OneColumnLayout from "../../components/Layout/OneColumnLayout";
const genres = [
  { title: "none" },
  { title: "alternative rock" },
  { title: "ambient" },
  { title: "classical" },
  { title: "country" },
  { title: "dance & edm" },
  { title: "dancehall" },
  { title: "deep house" },
  { title: "disco" },
  { title: "drum & bass" },
  { title: "dubstep" },
  { title: "electronic" },
  { title: "hip-hop & rap" },
  { title: "house" },
  { title: "indie" },
  { title: "latin" },
  { title: "metal" },
  { title: "piano" },
  { title: "pop" },
  { title: "r&b" },
  { title: "reggae" },
  { title: "reggaeton" },
  { title: "rock" },
  { title: "soundtrack" },
  { title: "techno" },
  { title: "trance" },
  { title: "trap" },
  { title: "triphop" },
  { title: "world" },
];

export default function Genres() {
  const { user } = useAuthContext();
  return (
    <OneColumnLayout user={user}>
      <div className={styles.genres}>
        <CardList
          className={styles["genres__cardList"]}
          list={genres}
          page={"genres"}
        />
      </div>
    </OneColumnLayout>
  );
}
