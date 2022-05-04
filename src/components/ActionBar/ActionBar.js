import { Link } from "react-router-dom";
import styles from "./ActionBar.module.css";
import uploadIcon from "../../images/Upload_duotone_line.svg";
import searchIcon from "../../images/Search.svg";

const ActionBar = () => {
  return (
    <div className={styles.actionbar}>
      <nav className={styles["actionbar-nav"]}>
        <Link to="/profile">
          <button>profile</button>
        </Link>
        <Link to="/upload">
          <img src={uploadIcon} alt="Upload button icon" />
        </Link>
        <Link to="/search">
          <button>
            <img src={searchIcon} alt="Search button icon" />
          </button>
        </Link>
      </nav>
    </div>
  );
};

export default ActionBar;
