import { useLocation } from "react-router-dom";
import React, { useEffect } from "react";
import styles from "./Search.module.css";
import ActionBar from "../../components/ActionBar/ActionBar";
import { useAuthContext } from "../../hooks/useAuthContext";
import SongList from "../../components/SongList/SongList";

const Search = () => {
  const { user } = useAuthContext();
  let location = useLocation();
  const { results, query } = location.state;

  useEffect(() => {
    console.log(location.state);
  });

  return (
    <div className={styles.search}>
      <ActionBar
        className={styles["search__actionBar"]}
        query={query}
        user={user}
      />
      <div className={styles["search__header"]}>
        <h1 className={styles["search__queryText"]}>
          Search results for "{query}"
        </h1>
      </div>
      {results.length ? (
        <SongList
          className={styles["search__songList"]}
          songs={results}
          user={user ? user : "none"}
        />
      ) : (
        <h1>The search yielded no results!</h1>
      )}
    </div>
  );
};
export default Search;
