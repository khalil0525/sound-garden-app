import SongList from "../../components/SongList/SongList";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useCollection } from "../../hooks/useCollection";
import styles from "./CollectionResults.module.css";
import ActionBar from "../../components/ActionBar/ActionBar";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
export default function CollectionResults() {
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
    <div className={styles.collectionresults}>
      <ActionBar
        className={styles["collectionresults__actionBar"]}
        user={user}
      />

      {/* <h1 className={styles["header_text"]}>CollectionResults Tracks</h1> */}
      <SongList
        className={styles["collectionresults__songList"]}
        songs={musicDocuments}
        user={user}
      />
    </div>
  );
}
