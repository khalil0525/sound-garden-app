import React, { useState } from "react";
import styles from "./SongItem.module.css";
import { useAudioPlayerContext } from "../../hooks/useAudioPlayerContext";
const SongItem = ({ song }) => {
  const [url, setUrl] = useState(song.URL);
  const { dispatch } = useAudioPlayerContext();
  return (
    <div className={styles["song-item"]}>
      <li>
        <div>
          <h2>{song.artist}</h2>
          <h3>{song.title}</h3>
          {/* <h1>{song.createdAt}</h1> */}
          <h4>{song.genre}</h4>

          <button
            onClick={() => dispatch({ type: "URL_CHANGE", payload: url })}
          >
            Play
          </button>
        </div>
      </li>
    </div>
  );
};

export default SongItem;
