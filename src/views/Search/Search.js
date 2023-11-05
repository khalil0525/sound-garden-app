import { useLocation } from "react-router-dom";
import React from "react";
import styles from "./Search.module.css";

import { useAuthContext } from "../../hooks/useAuthContext";
import SongList from "../../components/SongList/SongList";
import OneColumnLayout from "../../components/Layout/OneColumnLayout";

const Search = ({ scrollRef }) => {
  const { user } = useAuthContext();
  let location = useLocation();
  const { results, query } = location.state;

  return (
    <OneColumnLayout user={user}>
      <div className={styles.search}>
        <div className={styles["search__header"]}>
          <h1 className={styles["search__queryText"]}>
            Search results for "{query}"
          </h1>
        </div>
        {results.length ? (
          <SongList
            className={styles["search__songList"]}
            scrollRef={scrollRef}
            songs={results}
            user={user ? user : "none"}
          />
        ) : (
          <h1 className={styles["search__songList"]}>
            The search yielded no results!
          </h1>
        )}
      </div>
    </OneColumnLayout>
  );
};
export default Search;
