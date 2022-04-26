import React, { useEffect, useState } from "react";
import styles from "./SongItem.module.css";
import { useAudioPlayerContext } from "../../hooks/useAudioPlayerContext";
const SongItem = ({ song, playlistSongs, songIndex }) => {
  // const [url, setUrl] = useState(song.URL);
  const { loadedSongURL, isSongPlaying, playlist, dispatchAudioPlayerContext } =
    useAudioPlayerContext();
  const [isPlaying, setIsPlaying] = useState(false);

  //***********************************************************
  // We only change playlists when we click play on a song
  // that is not apart of the current playlist.
  // If we are on any other page and the current loadedSongURL
  // is attached to a component on that page, the playlist will
  // Still reference the playlist in the component we started
  // the song at. However, we will be able to Play/pause the track
  // from that other page
  //***********************************************************
  const handlePlayPauseClick = () => {
    console.log("songs", playlistSongs);
    if (loadedSongURL !== song.URL) {
      //If we are on the same playlist but not playing the current song
      if (JSON.stringify(playlist) === JSON.stringify(playlistSongs)) {
        dispatchAudioPlayerContext({
          type: "PLAYLIST_INDEX_CHANGE",
          payload: songIndex,
        });
      } else {
        dispatchAudioPlayerContext({
          type: "PLAYLIST_CHANGE",
          payload: { playlistSongs, songIndex },
        });
      }
    } //else it's paused
    else if (isPlaying) {
      dispatchAudioPlayerContext({ type: "SONG_PAUSED" });
    } else {
      dispatchAudioPlayerContext({ type: "SONG_PLAYED" });
    }
    // console.log("global", JSON.stringify(playlist));
    // console.log("local", JSON.stringify(playlistSongs));
    // console.log(JSON.stringify(playlistSongs) === JSON.stringify(playlist));
    //We always set the playing state to its previous state regardless of the above
    setIsPlaying((prevState) => !prevState);
  };

  //If we navigate to a different page than where this song is located and come back
  //We want to reset the set the state so that the play/pause stays the same.
  // This will fire up whenever this component is loaded
  useEffect(() => {
    if (loadedSongURL === song.URL && isSongPlaying) {
      setIsPlaying(true);
    }
    console.log("First USEFFECT in SongItem");
  }, []);

  useEffect(() => {
    // If globally no song is playing OR song was changed and this songItem isPlaying
    // Set isPlaying to false.
    if ((!isSongPlaying || loadedSongURL !== song.URL) && isPlaying) {
      console.log("Second USEFFECT in SongItem, CONDITION 1", song.title);
      setIsPlaying(false);
    }
    //Otherwise, if globally a song is playing and the URL is this songs
    //
    else if (isSongPlaying && loadedSongURL === song.URL && !isPlaying) {
      console.log("Second USEFFECT in SongItem, CONDITION 2");
      setIsPlaying(true);
    }
  }, [loadedSongURL, isSongPlaying, isPlaying]);

  //CREATE USEFFECT TO HANDLE SONGS THAT ARE ALREADY PLAYING TO SET isPLAYING TO FALSE

  return (
    <div className={styles["song-item"]}>
      <li>
        <div>
          <button onClick={handlePlayPauseClick}>
            {isPlaying ? (
              <img
                src="img/pause-svgrepo-com.svg"
                alt="Song play button icon"
              />
            ) : (
              <img src="img/Arrow_drop_right.svg" alt="Song play button icon" />
            )}
          </button>
        </div>

        <div className={styles["song-item_header_song_details"]}>
          <h3>{song.artist}</h3>
          <h1>{song.title}</h1>
        </div>
        <div className={styles["song-item_header_song_details_other"]}>
          <h4>{song.createdAt}</h4>
          <h4>{song.genre}</h4>
        </div>
      </li>
    </div>
  );
};

export default SongItem;
