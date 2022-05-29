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
        <p className={styles.tempInfo}>
          Welcome to SoundGarden!
          <br />
          <br />
          <strong>
            The app is currently not fully functioning, and will be updated over
            time.
          </strong>
          <br />
          <br />{" "}
          <strong>
            <em>Current features:</em>
          </strong>
          <br />
          <br />
          <ul>
            <li>
              <strong>Create/Sign In</strong> to an account{" "}
            </li>
            <li>
              <strong>Search</strong> for songs
            </li>
            <li>
              <strong>Upload/Delete/Like/Download/Stream</strong> songs
            </li>
            <li>
              View a list of <strong>liked</strong> songs
            </li>
            <li>
              View all songs for a <strong>genre</strong>
            </li>
            <li>
              Edit details on your <strong>profile </strong>(banner upload not
              working
            </li>
            <li>
              View songs you <strong>uploaded</strong>
            </li>
          </ul>
          <br />
          <br /> <strong>The app is currently not optimized for mobile!</strong>
        </p>
        {/* <UploadForm /> */}
      </div>
    </div>
  );
}
