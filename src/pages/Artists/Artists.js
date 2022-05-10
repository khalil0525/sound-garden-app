import styles from "./Artists.module.css";

import ActionBar from "../../components/ActionBar/ActionBar";
import CardList from "../../components/CardList/CardList";
import { useAuthContext } from "../../hooks/useAuthContext";

export default function Artists() {
  const { user } = useAuthContext();
  return (
    <div className={styles.artists}>
      <ActionBar className={styles["artists__actionBar"]} user={user} />

      <CardList
        className={styles["artists__cardList"]}
        list={null}
        page={"artists"}
      />
    </div>
  );
}
