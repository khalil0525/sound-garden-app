import React, { useEffect, useState } from "react";
import styles from "./SongList.module.css";
import SongItem from "./SongItem";

//We receive a song prop from whichever parent component calls this
const SongList = ({ songs }) => {
  // const [songs, setSongs] = useState([]);

  return (
    <div>
      <h1>Uploaded Tracks</h1>
      <ul>
        {songs && songs.map((song) => <SongItem song={song} key={song.URL} />)}
      </ul>
    </div>
  );
};

export default SongList;
