import React from "react";
import searchIcon from "../../images/Search.svg";
import styles from "./ActionSearchBar.module.css";
const ActionSearchBar = () => {
  return (
    <div className={styles.actionsearchbar}>
      <div className={styles["actionsearchbar__contents"]}>
        <img src={searchIcon} alt="Search button icon" />
        <input type="text" placeholder="Type here to search" />
      </div>
    </div>
  );
};

export default ActionSearchBar;
