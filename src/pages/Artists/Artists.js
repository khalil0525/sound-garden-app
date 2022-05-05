import styles from "./Artists.module.css";

import ActionBar from "../../components/ActionBar/ActionBar";
import { useAuthContext } from "../../hooks/useAuthContext";

export default function Artists() {
  const { user } = useAuthContext();
  return (
    <div className={styles.artists}>
      <ActionBar user={user} />
      <h2>Artists</h2>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Beatae qui
        deserunt expedita quod recusandae porro a quaerat impedit, unde
        doloremque aut culpa praesentium eum suscipit itaque earum rerum nulla?
        Corrupti.
      </p>
    </div>
  );
}
