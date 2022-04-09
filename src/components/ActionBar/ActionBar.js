import { Link } from "react-router-dom";
import styles from "./ActionBar.module.css";
const ActionBar = () => {
  return (
    <div className={styles.actionbar}>
      <nav className={styles["actionbar-nav"]}>
        <Link to="/profile">
          <button>profile</button>
        </Link>
        <Link to="/upload">
          <img src="/img/Upload_duotone_line.svg" alt="Upload button icon" />
        </Link>
        <Link to="/search">
          <button>
            <img src="/img/Search.svg" alt="Search button icon" />
          </button>
        </Link>
      </nav>
    </div>
  );
};

export default ActionBar;
