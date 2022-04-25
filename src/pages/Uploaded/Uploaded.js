import SongList from "../../components/SongList/SongList";
import { useAuthContext } from "../../hooks/useAuthContext";
import styles from "./Uploaded.module.css";

export default function Uploaded() {
  const { user } = useAuthContext();

  return (
    <div className={styles.uploaded}>
      <h2>Uploaded</h2>

      <SongList type="uid" query={user.uid}></SongList>
    </div>
  );
}
