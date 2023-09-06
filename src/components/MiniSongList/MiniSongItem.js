import React, { useEffect, useReducer } from "react";
import styles from "./MiniSongItem.module.css";
import { useAudioPlayerContext } from "../../hooks/useAudioPlayerContext";
import { useFirestore } from "../../hooks/useFirestore";
import { useCloudStorage } from "../../hooks/useCloudStorage";
import pauseIcon from "../../images/pause-svgrepo-com.svg";
import playIcon from "../../images/Arrow_drop_right.svg";

import placeholderImage from "../../images/blank_image_placeholder.svg";

import Button from "../UI/Button/Button";

let initialState = {
  playing: false,
  isMounted: false,
  played: 0,
  duration: 0,
  seeking: false,
};

const songItemReducer = (state, action) => {
  switch (action.type) {
    case "PLAY_PAUSE_CLICK":
      return { ...state, playing: !state.playing };
    case "SEEK_POSITION_CHANGE":
      return { ...state, played: action.payload };
    case "SEEK_MOUSE_DOWN":
      return { ...state, seeking: true };
    case "SEEK_MOUSE_UP":
      return { ...state, seeking: false };
    case "PROGRESS_CHANGE":
      return { ...state, played: action.payload };
    case "PLAY":
      return { ...state, playing: true };
    case "PAUSE":
      return { ...state, playing: false };
    case "SONG_MOUNTED":
      return { ...state, isMounted: true, played: 0 };
    case "SONG_DISMOUNTED":
      return { ...state, isMounted: false, played: 0, playing: false };
    default:
      return { ...state };
  }
};

const SongItem = ({
  song,
  playlistSongs,
  songPlaylistLocation,
  songIndex,
  liked,
  user,
  showSongItemFooter = true,
}) => {
  const [songItemState, dispatchSongItemState] = useReducer(
    songItemReducer,
    initialState
  );

  // const [edited, setEdited] = useState(false);
  const { playing, isMounted, seeking } = songItemState;
  const {
    loadedSongURL,
    isSongPlaying,
    playlist,
    currentSongPlayedTime,
    dispatchAudioPlayerContext,
    playlistLocation,
  } = useAudioPlayerContext();

  // New like system

  // We set the inital state for isLiked based on if that document was found

  // These 2 hooks are used to delete a song document/files
  const { deleteDocument: deleteSongDocument } = useFirestore("music");

  const { response: cloudStorageResponse } = useCloudStorage();
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
    if (loadedSongURL !== song.songURL) {
      //If we are on the same playlist but not playing the current song
      if (JSON.stringify(playlist) === JSON.stringify(playlistSongs)) {
        dispatchAudioPlayerContext({
          type: "PLAYLIST_INDEX_CHANGE",
          payload: songIndex,
        });
      } else {
        dispatchAudioPlayerContext({
          type: "PLAYLIST_CHANGE",
          payload: { playlistSongs, songIndex, songPlaylistLocation },
        });
      }
    } //else it's paused
    else if (playing) {
      dispatchSongItemState({ type: "PAUSE" });
      dispatchAudioPlayerContext({ type: "SONG_PAUSED" });
    } else {
      dispatchSongItemState({ type: "PLAY" });
      dispatchAudioPlayerContext({ type: "SONG_PLAYED" });
    }
    dispatchSongItemState({ type: "PLAY_PAUSE_CLICK" });
    // setIsPlaying((prevState) => !prevState);
  };

  // MOUNT THE SONG WHEN WE PLAY IT OR SWITCH BACK TO A PLACE THIS COMPONENT
  // IS AT.
  // OR DISMOUNT IF THIS WAS THE PREVIOUS SONG AND WE CHANGED
  useEffect(() => {
    if (loadedSongURL === song.songURL && !isMounted) {
      dispatchSongItemState({ type: "SONG_MOUNTED" });
    } else if (loadedSongURL !== song.songURL && isMounted) {
      dispatchSongItemState({ type: "SONG_DISMOUNTED" });
    }
  }, [loadedSongURL, song.songURL, isMounted, song.title]);

  // Change the current time based on the global played state
  useEffect(() => {
    if (isSongPlaying && isMounted && !seeking) {
      dispatchSongItemState({
        type: "PROGRESS_CHANGE",
        payload: currentSongPlayedTime,
      });
    }
  }, [isSongPlaying, isMounted, currentSongPlayedTime, seeking]);

  // When we press pause from the AudioPlayer this will be triggered to activate
  // The play state inside of the songItem
  useEffect(() => {
    // If globally no song is playing OR song was changed and this songItem isPlaying
    // Set isPlaying to false.
    if ((!isSongPlaying || !isMounted) && playing) {
      // if ((!isSongPlaying || loadedSongURL !== song.songURL) && isPlaying) {

      dispatchSongItemState({ type: "PAUSE" });
      // setIsPlaying(false);
    }
    //Otherwise, if globally a song is playing and the URL is this songs
    //
    else if (isSongPlaying && isMounted && !playing) {
      // else if (isSongPlaying && loadedSongURL === song.songURL && !isPlaying) {

      dispatchSongItemState({ type: "PLAY" });
      // setIsPlaying(true);
    }
  }, [loadedSongURL, isSongPlaying, playing, isMounted, song.title]);

  // When we edit a song this will ensure that we get a new version of our playlist
  useEffect(() => {
    if (
      playlistLocation === songPlaylistLocation &&
      JSON.stringify(playlist) !== JSON.stringify(playlistSongs)
    ) {
      dispatchAudioPlayerContext({
        type: "SONG_EDITED_IN_PLAYLIST",
        payload: playlistSongs,
      });
    }
  }, [
    playlistLocation,
    songPlaylistLocation,
    playlist,
    playlistSongs,
    dispatchAudioPlayerContext,
  ]);
  // This useEffect fires if we delete the song and get a success message back
  // It will then delete the likes on this song and then the song document itself.
  useEffect(() => {
    if (cloudStorageResponse.success) {
      deleteSongDocument(song.docID);
      dispatchAudioPlayerContext({
        type: "SONG_DELETED_FROM_PLAYLIST",
        payload: song.docID,
      });
    }
  }, [
    cloudStorageResponse.success,
    deleteSongDocument,
    song.docID,
    dispatchAudioPlayerContext,
  ]);

  return (
    <li className={styles["songItem"]}>
      <div className={styles["songItem__body"]}>
        <div className={styles["songItem__bodyContainer"]}>
          <div className={styles["songItem__aside"]}>
            <div className={styles["songItem__songPhotoContainer"]}>
              <img
                className={styles["songPhotoContainer-img"]}
                src={song.songPhotoURL ? song.songPhotoURL : placeholderImage}
                alt="Song Cover Art"
              />
            </div>
          </div>
          <div className={styles["titleContainer"]}>
            <span className={styles["titleContainer__songTitle-title"]}>
              {song.title}
            </span>
            <div className={styles["titleContainer__container"]}>
              <span className={styles["titleContainer__songTitle-artist"]}>
                {song.artist}
              </span>

              <span className={styles["titleContainer__songTitle-genre"]}>
                {song.genre}
              </span>
            </div>
          </div>
          <Button
            className={`${styles["titleContainer__playBtn"]} `}
            onClick={handlePlayPauseClick}
            iconImage={playing ? pauseIcon : playIcon}
            altText={
              playing ? "Song pause button icon" : "Song play button icon"
            }
          />
        </div>
      </div>
    </li>
  );
};

export default SongItem;
