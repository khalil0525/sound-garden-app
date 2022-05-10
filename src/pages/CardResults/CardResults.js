import SongList from "../../components/SongList/SongList";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useCollection } from "../../hooks/useCollection";
import styles from "./CardResults.module.css";
import ActionBar from "../../components/ActionBar/ActionBar";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
export default function CardResults() {
  const { user } = useAuthContext();
  const location = useLocation();
  const { from, search } = location.state;
  const { documents: musicDocuments, error: musicError } = useCollection(
    "music",
    [from, "==", search]
  );
  useEffect(() => {
    console.log(location);
  });
  return (
    <div className={styles.cardresults}>
      <ActionBar className={styles["cardresults__actionBar"]} user={user} />

      {/* <h1 className={styles["header_text"]}>cardresults Tracks</h1> */}
      <SongList
        className={styles["cardresults__songList"]}
        songs={musicDocuments}
        user={user}
      />
    </div>
  );
}
