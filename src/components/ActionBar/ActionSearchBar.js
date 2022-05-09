import React, { useEffect, useState } from "react";
import searchIcon from "../../images/Search.svg";
import styles from "./ActionSearchBar.module.css";

const ActionSearchBar = () => {
  const [searchText, setSearchText] = useState("");
  const handleSearchTextChange = (event) => {
    setSearchText(event.target.value);
  };
  useEffect(() => {
    console.log(searchText);
  }, [searchText]);
  return (
    <div className={styles.actionsearchbar}>
      <div className={styles["actionsearchbar__contents"]}>
        <img src={searchIcon} alt="Search button icon" />
        <input
          type="text"
          placeholder="Type here to search"
          value={searchText}
          onChange={handleSearchTextChange}
        />
      </div>
    </div>
  );
};

export default ActionSearchBar;
