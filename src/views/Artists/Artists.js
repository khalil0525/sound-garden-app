import styles from "./Artists.module.css";

import ActionBar from "../../components/ActionBar/ActionBar";
import CardList from "../../components/CardList/CardList";
import { useAuthContext } from "../../hooks/useAuthContext";
const alphabet = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
];
export default function Artists() {
  const { user } = useAuthContext();
  return (
    <div className={styles.artists}>
      <ActionBar className={styles["artists__actionBar"]} user={user} />

      <CardList
        className={styles["artists__cardList"]}
        list={alphabet}
        page={"artists"}
      />
    </div>
  );
}
