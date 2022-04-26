import { useEffect } from "react";
import SongList from "../../components/SongList/SongList";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useCollection } from "../../hooks/useCollection";
import styles from "./Uploaded.module.css";

export default function Uploaded() {
  // const { user } = useAuthContext();
  const { documents, error } = useCollection("music");

  // useEffect(() => {}, [documents]);
  return (
    <div className={styles.uploaded}>
      <h1>Uploaded</h1>

      <SongList songs={documents}></SongList>
    </div>
  );
}
