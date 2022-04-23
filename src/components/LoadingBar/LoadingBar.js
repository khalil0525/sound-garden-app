import { useState, useEffect } from "react";
import styles from "./LoadingBar.module.css";

const LoadingBar = (props) => {
  const [totalLoaded, setTotalLoaded] = useState("0%");

  useEffect(() => {
    setTotalLoaded(props.progress + "%");
  }, [props.progress]);

  return (
    <div className={styles["loading-bar"]}>
      <div className={styles["loading-bar_inner"]}>
        <div
          className={styles["loading-bar_fill"]}
          style={{ width: totalLoaded }}
        ></div>
      </div>
    </div>
  );
};
export default LoadingBar;
