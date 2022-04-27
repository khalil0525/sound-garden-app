import React, { useEffect, useState } from "react";
import styles from "./SongList.module.css";
import SongItem from "./SongItem";

//We receive a song prop from whichever parent component calls this
const SongList = ({ songs }) => {
  // const [songs, setSongs] = useState([]);

  return (
    <div className={styles["song-list"]}>
      <ul className={styles["song-list__list"]}>
        {songs &&
          songs.map((song, index) => (
            <SongItem
              song={song}
              key={song.id}
              playlistSongs={songs}
              songIndex={index}
            />
          ))}
      </ul>
    </div>
  );
};

export default SongList;
