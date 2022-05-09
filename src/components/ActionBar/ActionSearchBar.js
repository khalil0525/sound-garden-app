import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import searchIcon from "../../images/Search.svg";
import styles from "./ActionSearchBar.module.css";
import algoliasearch from "algoliasearch";

const ActionSearchBar = ({ queryString }) => {
  const [searchText, setSearchText] = useState(() =>
    queryString ? queryString : ""
  );
  const navigate = useNavigate();
  const algoliaClient = algoliasearch(
    "RM45T5M6YJ",
    "04f3df8c65a977d567d539ce2da52bc0"
  );
  const index = algoliaClient.initIndex("soundgarden_music");

  const handleSearchTextChange = (event) => {
    setSearchText(event.target.value);
  };
  const handleSearchClick = async () => {
    if (searchText.length > 0) {
      try {
        await index.search(searchText).then(({ hits }) => {
          // console.log(hits);
          navigate("/search", {
            replace: false,
            state: {
              results: hits,
              query: searchText,
            },
          });
        });
      } catch (err) {
        console.log("Error occured: ", err);
      }
    }
  };

  useEffect(() => {
    console.log(searchText);
  }, [searchText]);

  return (
    <div className={styles.actionsearchbar}>
      <div className={styles["actionsearchbar__contents"]}>
        <img
          src={searchIcon}
          alt="Search button icon"
          onClick={handleSearchClick}
        />

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
