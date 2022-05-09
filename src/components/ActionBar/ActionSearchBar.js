import React, { useEffect, useState } from "react";

import searchIcon from "../../images/Search.svg";
import styles from "./ActionSearchBar.module.css";
// import algoliasearch from "algoliasearch";
import { useAlgoliaSearch } from "../../hooks/useAlgoliaSearch";

const ActionSearchBar = ({ queryString }) => {
  const [searchText, setSearchText] = useState(() =>
    queryString ? queryString : ""
  );
  const { searchForDocuments, error } = useAlgoliaSearch();

  const handleSearchTextChange = (event) => {
    setSearchText(event.target.value);
  };

  const handleSearch = async () => {
    if (searchText.trim().length > 0 && searchText !== queryString) {
      searchForDocuments(searchText);
    }
  };
  const handleEnterPressed = async (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSearch();
    }
  };

  // useEffect(() => {
  //   console.log(searchText);
  // }, [searchText]);

  return (
    <div className={styles.actionsearchbar}>
      <div className={styles["actionsearchbar__contents"]}>
        <img src={searchIcon} alt="Search button icon" onClick={handleSearch} />

        <input
          type="text"
          placeholder="Type here to search"
          value={searchText}
          onChange={handleSearchTextChange}
          onKeyPress={handleEnterPressed}
        />
      </div>
    </div>
  );
};

export default ActionSearchBar;
