import { useEffect } from "react";
import SongList from "../../components/SongList/SongList";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useCollection } from "../../hooks/useCollection";
import styles from "./Uploaded.module.css";
import ActionBar from "../../components/ActionBar/ActionBar";

export default function Uploaded() {
  const { user } = useAuthContext();
  const { documents: musicDocuments, error: musicError } = useCollection(
    "music",
    ["uid", "==", user.uid]
  );

  return (
    <div className={styles.uploaded}>
      <ActionBar />

      <h1 className={styles["header_text"]}>Uploaded Tracks</h1>
      <SongList songs={musicDocuments} user={user} />
    </div>
  );
}
