import React, { useEffect, useRef, useState } from "react";
import styles from "./SongItem.module.css";
import { useAudioPlayerContext } from "../../hooks/useAudioPlayerContext";
import { useFirestore } from "../../hooks/useFirestore";
import { useCollection } from "../../hooks/useCollection";

// import { ReactComponent as LikeIcon } from "/Heart_fill.svg";
const SongItem = ({ song, playlistSongs, songIndex, liked, user }) => {
  // const [url, setUrl] = useState(song.URL);
  const { loadedSongURL, isSongPlaying, playlist, dispatchAudioPlayerContext } =
    useAudioPlayerContext();

  //This state anonymous fucntion replaced a useEffect, it will run a function only when
  // this component mounts for the first time.. It ensures that if we navigate
  // away from a page where this song component is, when we come back and it
  // is still playing we can set its state to playing
  const [isPlaying, setIsPlaying] = useState(
    () => loadedSongURL === song.songURL && isSongPlaying
  );
  // This is the state that controls the like button and helps send/receive data to firestore collection()
  // This receives either undefined or a document from the likes collection
  // We set the inital state for isLiked based on if that document was found
  const [isLiked, setIsLiked] = useState(() => liked !== undefined);

  const {
    addDocument,
    deleteDocument,
    response: firestoreResponse,
    error,
  } = useFirestore("likes");

  //***********************************************************
  // We only change playlists when we click play on a song
  // that is not apart of the current playlist.
  // If we are on any other page and the current loadedSongURL
  // is attached to a component on that page, the playlist will
  // Still reference the playlist in the component we started
  // the song at. However, we will be able to Play/pause the track
  // from that other page
  //***********************************************************
  // useEffect(() => {
  //   if () {
  //     setIsLiked(true);
  //   }
  // }, [likedSongDocument]);

  const handlePlayPauseClick = () => {
    if (loadedSongURL !== song.songURL) {
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
    xhr.open("GET", song.songURL);
    xhr.send();
    // Or inserted into an <img> element
    // const img = document.getElementById("myimg");
    // img.setAttribute("src", url);
  };

  const handleLikeClick = () => {
    setIsLiked((prevState) => !prevState);
    if (!isLiked) {
      addDocument({ uid: user.uid, likedSongID: song.id });
    } else {
      deleteDocument(liked.id);
    }
  };
  // useEffect(() => console.log(likedSongDocument));
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
    if ((!isSongPlaying || loadedSongURL !== song.songURL) && isPlaying) {
      console.log("USEFFECT in SongItem, CONDITION 1", song.title);
      setIsPlaying(false);
    }
    //Otherwise, if globally a song is playing and the URL is this songs
    //
    else if (isSongPlaying && loadedSongURL === song.songURL && !isPlaying) {
      console.log(" USEFFECT in SongItem, CONDITION 2");
      setIsPlaying(true);
    }
  }, [loadedSongURL, isSongPlaying, isPlaying, song]);

  // useEffect(() => {
  //   likeRef.current = isLiked;
  //   if (likeRef.current) {
  //   }
  // }, [isLiked, song, user, addDocument]);
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
                  alt="Song pause button icon"
                  width="36"
                  height="36"
                />
              ) : (
                <img
                  src="img/Arrow_drop_right.svg"
                  alt="Song play button icon"
                  width="36"
                  height="36"
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
              className={`${styles["actionContainer-likeBtn"]} ${
                isLiked && styles["actionContainer-likeBtn--liked"]
              } `}
              onClick={handleLikeClick}
              disabled={firestoreResponse.isPending}
            >
              <img
                className={styles["actionContainer_likeBtn-icon"]}
                src="img/Heart_greyfill.svg"
                alt="Song Like Icon"
              />
              Like
            </button>
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
              src={
                song.songPhotoURL
                  ? song.songPhotoURL
                  : "img/blank_image_placeholder.svg"
              }
              alt="Song Cover Art"
            />
          </div>
        </div>
      </li>
    </div>
  );
};

export default SongItem;
