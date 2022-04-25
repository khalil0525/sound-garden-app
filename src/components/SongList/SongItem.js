import React, { useState } from "react";
import styles from "./SongItem.module.css";
const SongItem = ({ song }) => {
  const [url, setUrl] = useState(song.URL);
  return (
    <div className={styles["song-item"]}>
      <li>
        <div>
          <h2>{song.artist}</h2>
          <h3>{song.title}</h3>
          {/* <h1>{song.createdAt}</h1> */}
          <h4>{song.genre}</h4>

          <button>Play</button>
        </div>
      </li>
    </div>
  );
};

export default SongItem;
