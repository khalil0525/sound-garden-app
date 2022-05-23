import styles from "./Home.module.css";
import ActionBar from "../../components/ActionBar/ActionBar";
import { useAuthContext } from "../../hooks/useAuthContext";
import UploadForm from "../../components/UploadForm/UploadForm";

export default function Home() {
  const { user } = useAuthContext();
  return (
    <div className={styles.home}>
      <ActionBar className={styles["home__actionBar"]} user={user} />
      <div className={styles["home__content"]}>
        <h2>Home</h2>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Beatae qui
          deserunt expedita quod recusandae porro a quaerat impedit, unde
          doloremque aut culpa praesentium eum suscipit itaque earum rerum
          nulla? Corrupti.ddddddd
        </p>
        <UploadForm />
      </div>
    </div>
  );
}
