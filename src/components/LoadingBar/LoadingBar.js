import { useState, useEffect } from "react";
import styles from "./LoadingBar.module.css";

const LoadingBar = (props) => {
  const [totalLoaded, setTotalLoaded] = useState(0);

  //Convert the progress into whole number
  useEffect(() => {
    if (props.progress) {
      let progress = Math.round(props.progress);
      setTotalLoaded(progress);
    }
  }, [props.progress]);

  return (
    <div>
      <div className={styles["loading-bar_header"]}>
        <p>{props.song}</p>
        {totalLoaded !== 0 && <p>{totalLoaded}</p>}
      </div>

      <div className={styles["loading-bar"]}>
        <div className={styles["loading-bar_inner"]}>
          <div
            className={styles["loading-bar_fill"]}
            style={{ width: totalLoaded + "%" }}
          ></div>
        </div>
      </div>
    </div>
  );
};
export default LoadingBar;
