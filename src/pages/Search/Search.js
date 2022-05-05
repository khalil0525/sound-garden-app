import React from "react";
import styles from "./Search.module.css";
import ActionBar from "../../components/ActionBar/ActionBar";
import { useAuthContext } from "../../hooks/useAuthContext";
const Search = () => {
  const { user } = useAuthContext();
  return (
    <div className={styles.search}>
      <ActionBar user={user} />
      <h1>search page </h1>
    </div>
  );
};
export default Search;
