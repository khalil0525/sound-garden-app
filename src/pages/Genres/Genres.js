import styles from "./Genres.module.css";
import ActionBar from "../../components/ActionBar/ActionBar";
import { useAuthContext } from "../../hooks/useAuthContext";
export default function Genres() {
  const { user } = useAuthContext();
  return (
    <div className={styles.genres}>
      <ActionBar user={user} />
      <h2>Genres</h2>
    </div>
  );
}
