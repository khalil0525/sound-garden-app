import { Link } from "react-router-dom";
import styles from "./ActionBar.module.css";
import { ReactComponent as UploadIcon } from "../../images/Upload_duotone_line.svg";
import searchIcon from "../../images/Search.svg";
import placeholderImage from "../../images/blank_image_placeholder.svg";
const ActionBar = (props) => {
  return (
    <div className={styles.actionbar}>
      <nav className={styles["actionbar__nav"]}>
        {!props.user ? (
          <>
            <Link to="/login">
              <div>Sign in</div>
            </Link>
            <Link to="/register">
              <div>Create account</div>
            </Link>
          </>
        ) : (
          <Link to="/profile" className={styles["actionbar__profileLink"]}>
            <img
              src={placeholderImage}
              alt="Search button icon"
              className={styles["actionbar__profileLink-img"]}
            />
          </Link>
        )}

        <Link to="/upload" className={styles["actionbar__uploadLink"]}>
          <UploadIcon alt="Upload button icon" />
        </Link>

        <Link to="/search">
          <img src={searchIcon} alt="Search button icon" />
        </Link>
      </nav>
    </div>
  );
};

export default ActionBar;
