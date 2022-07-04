import React, { useEffect, useState } from "react";

import searchIcon from "../../images/Search.svg";
import styles from "./ActionBarSearch.module.css";
// import algoliasearch from "algoliasearch";
import { useAlgoliaSearch } from "../../hooks/useAlgoliaSearch";

const ActionBarSearch = ({ queryString }) => {
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

  const handleEnterPressed = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSearch();
    }
  };

  return (
    <div className={styles.actionBarSearch}>
      <img src={searchIcon} alt="Search button icon" onClick={handleSearch} />

      <input
        type="text"
        placeholder="Type here to search"
        value={searchText}
        onChange={handleSearchTextChange}
        onKeyPress={handleEnterPressed}
      />
    </div>
  );
};

export default ActionBarSearch;
