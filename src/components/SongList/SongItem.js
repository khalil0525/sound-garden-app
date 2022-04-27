import React, { useEffect, useState } from "react";
import styles from "./SongItem.module.css";
import { useAudioPlayerContext } from "../../hooks/useAudioPlayerContext";
const SongItem = ({ song, playlistSongs, songIndex }) => {
  // const [url, setUrl] = useState(song.URL);
  const { loadedSongURL, isSongPlaying, playlist, dispatchAudioPlayerContext } =
    useAudioPlayerContext();
  //This state anonymous fucntion replaced a useEffect, it will run a function only when
  // this component mounts for the first time.. It ensures that if we navigate
  // away from a page where this song component is, when we come back and it
  // is still playing we can set its state to playing
  const [isPlaying, setIsPlaying] = useState(
    () => loadedSongURL === song.URL && isSongPlaying
  );

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
    if (loadedSongURL !== song.URL) {
      //If we are on the same playlist but not playing the current song
      if (JSON.stringify(playlist) === JSON.stringify(playlistSongs)) {
        dispatchAudioPlayerContext({
          type: "PLAYLIST_INDEX_CHANGE",
          payload: songIndex,
        });
      } else {
        console.log("songs", playlistSongs);
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

  const handleSongDownloadClick = () => {
    const xhr = new XMLHttpRequest();
    xhr.responseType = "blob";
    xhr.onload = (event) => {
      const blob = xhr.response;
      let a = document.createElement("a");
      a.href = window.URL.createObjectURL(xhr.response);
      console.log();
      a.download = song.filePath.split("_")[1]; // Name the file anything you'd like.
      a.style.display = "none";
      document.body.appendChild(a);
      a.click();
    };
    xhr.open("GET", song.URL);
    xhr.send();
    // Or inserted into an <img> element
    // const img = document.getElementById("myimg");
    // img.setAttribute("src", url);
  };
  //If we navigate to a different page than where this song is located and come back
  //We want to reset the set the state so that the play/pause stays the same.
  // This will fire up whenever this component is loaded
  // useEffect(() => {
  //   if (loadedSongURL === song.URL && isSongPlaying) {
  //     setIsPlaying(true);
  //   }
  //   console.log("First USEFFECT in SongItem");
  // }, []);

  useEffect(() => {
    // If globally no song is playing OR song was changed and this songItem isPlaying
    // Set isPlaying to false.
    if ((!isSongPlaying || loadedSongURL !== song.URL) && isPlaying) {
      console.log("USEFFECT in SongItem, CONDITION 1", song.title);
      setIsPlaying(false);
    }
    //Otherwise, if globally a song is playing and the URL is this songs
    //
    else if (isSongPlaying && loadedSongURL === song.URL && !isPlaying) {
      console.log(" USEFFECT in SongItem, CONDITION 2");
      setIsPlaying(true);
    }
  }, [loadedSongURL, isSongPlaying, isPlaying, song]);

  //CREATE USEFFECT TO HANDLE SONGS THAT ARE ALREADY PLAYING TO SET isPLAYING TO FALSE

  return (
    <div className={styles["song-item"]}>
      <li className={styles["song-item__content"]}>
        <div className={styles["song-item__header"]}>
          <div className={styles["song-item__titleContainer"]}>
            <button
              className={styles["titleContainer__playBtn"]}
              onClick={handlePlayPauseClick}
            >
              {isPlaying ? (
                <img
                  src="img/pause-svgrepo-com.svg"
                  alt="Song play button icon"
                />
              ) : (
                <img
                  src="img/Arrow_drop_right.svg"
                  alt="Song play button icon"
                />
              )}
            </button>

            <div className={styles["titleContainer__songTitle"]}>
              <p className={styles["titleContainer__songTitle-artist"]}>
                {song.artist}
              </p>
              <p className={styles["titleContainer__songTitle-title"]}>
                {song.title}
              </p>
            </div>
          </div>
          <div className={styles["titleContainer__additional"]}>
            <p className={styles["titleContainer__additional-uploadDate"]}>
              {song.createdAt}
            </p>
            <span className={styles["titleContainer__additional-genre"]}>
              {song.genre}
            </span>
          </div>
        </div>
        <div className={styles["song-item__footer"]}>
          <div className={styles["song-item__actionContainer"]}>
            <button
              className={styles["actionContainer-downloadBtn"]}
              onClick={handleSongDownloadClick}
            >
              <img
                className={styles["actionContainer_downloadBtn-icon"]}
                src="img/Download.svg"
                alt="Song Download Icon"
              />
              Download
            </button>
          </div>
        </div>
        <div className={styles["song-item__aside"]}>
          <div className={styles["song-item__songPhotoContainer"]}>
            <img
              className={styles["songPhotoContainer-img"]}
              src="img/blank_image_placeholder.svg"
              alt="Song img placeholder"
            />
          </div>
        </div>
      </li>
    </div>
  );
};

export default SongItem;
