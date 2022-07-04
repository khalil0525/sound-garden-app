import React, { useEffect, useReducer, useState } from "react";
import styles from "./SongItem.module.css";
import { useAudioPlayerContext } from "../../hooks/useAudioPlayerContext";
import { useFirestore } from "../../hooks/useFirestore";
import { useCloudStorage } from "../../hooks/useCloudStorage";
import AudioSeekControlBar from "../AudioPlayer/AudioSeekControlBar/AudioSeekControlBar";
import pauseIcon from "../../images/pause-svgrepo-com.svg";
import playIcon from "../../images/Arrow_drop_right.svg";
import downloadIcon from "../../images/Download.svg";
import placeholderImage from "../../images/blank_image_placeholder.svg";
import editIcon from "../../images/pencil_solid.svg";
import deleteIcon from "../../images/trash_solid.svg";
import { ReactComponent as HeartIcon } from "../../images/Heart_greyfill.svg";
import Modal from "../UI/Modal/Modal";
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
}) => {
  const [songItemState, dispatchSongItemState] = useReducer(
    songItemReducer,
    initialState
  );
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  // const [edited, setEdited] = useState(false);
  const { playing, isMounted, played, duration, seeking } = songItemState;
  const {
    loadedSongURL,
    isSongPlaying,
    playlist,
    currentSongPlayedTime,
    dispatchAudioPlayerContext,
    playlistLocation,
  } = useAudioPlayerContext();

  // New like system

  const {
    getDocument: getLikedDocument,
    updateDocument: updateLikedDocument,
    response: firestoreLikedDocumentResponse,
  } = useFirestore("likes");

  // We set the inital state for isLiked based on if that document was found
  const [isLiked, setIsLiked] = useState(() =>
    user.uid ? liked.includes(song.docID) : false
  );

  // These 2 hooks are used to delete a song document/files
  const {
    deleteDocument: deleteSongDocument,
    response: deleteSongDocumentResponse,
  } = useFirestore("music");

  const { deleteSongFiles, response: cloudStorageResponse } = useCloudStorage();
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

  const handleSongDownloadClick = () => {
    const xhr = new XMLHttpRequest();
    xhr.responseType = "blob";
    xhr.onload = (event) => {
      const blob = xhr.response;
      let a = document.createElement("a");
      a.href = window.URL.createObjectURL(xhr.response);

      a.download =
        song.songFilePath.split("_")[song.songFilePath.split("_").length - 1]; // Name the file anything you'd like.
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

  const handleEditSong = () => {
    setIsEditing(false);
  };

  const handleDeleteSong = async () => {
    deleteSongFiles(song);
  };

  const handleLikeClick = () => {
    if (user.uid) {
      setIsLiked((prevState) => !prevState);
      let newState;
      if (!isLiked) {
        newState = { likes: [...liked, song.docID] };
        updateLikedDocument(user.uid, newState);
      } else {
        newState = { likes: liked.filter((like) => like !== song.docID) };
        updateLikedDocument(user.uid, newState);
      }
    }
  };

  const handleSeekMouseDown = () => {
    if (isMounted) {
      dispatchAudioPlayerContext({ type: "SEEK_MOUSE_DOWN_FROM_SONG_ITEM" });
      dispatchSongItemState({ type: "SEEK_MOUSE_DOWN" });
    }
  };

  const handleSeekChange = (event) => {
    if (isMounted) {
      dispatchAudioPlayerContext({
        type: "SEEK_CHANGE_FROM_SONG_ITEM",
        payload: parseFloat(event.target.value),
      });
      dispatchSongItemState({
        type: "SEEK_POSITION_CHANGE",
        payload: parseFloat(event.target.value),
      });
    }
  };

  const handleSeekMouseUp = (event) => {
    if (isMounted) {
      dispatchAudioPlayerContext({
        type: "SEEK_MOUSE_UP_FROM_SONG_ITEM",
        payload: event.target.value,
      });
      dispatchSongItemState({ type: "SEEK_MOUSE_UP" });
    }
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
      <div className={styles["songItem__header"]}>
        <div className={styles["songItem__titleContainer"]}>
          <Button
            className={`${styles["titleContainer__playBtn"]} `}
            onClick={handlePlayPauseClick}
            iconImage={playing ? pauseIcon : playIcon}
            altText={
              playing ? "Song pause button icon" : "Song play button icon"
            }
          />

          <div className={styles["titleContainer__songTitle"]}>
            <span className={styles["titleContainer__songTitle-artist"]}>
              {song.artist}
            </span>
            <span className={styles["titleContainer__songTitle-title"]}>
              {song.title}
            </span>
          </div>
          <div className={styles["titleContainer__additional"]}>
            <div className={styles["titleContainer__additional-dateContainer"]}>
              <span className={styles["titleContainer__additional-uploadDate"]}>
                {song.createdAt}
              </span>
            </div>
            <div
              className={styles["titleContainer__additional-genreContainer"]}
            >
              <span className={styles["titleContainer__additional-genre"]}>
                {song.genre}
              </span>
            </div>
          </div>
        </div>
      </div>
      <AudioSeekControlBar
        className={styles["songItem__seekControl"]}
        durationClassName={styles["songItem__duration"]}
        duration={song.duration}
        played={played}
        onChange={handleSeekChange}
        onMouseDown={handleSeekMouseDown}
        onMouseUp={handleSeekMouseUp}
      />

      <div className={styles["songItem__footer"]}>
        <div className={styles["songItem__actionContainer"]}>
          <Button
            className={`${styles["actionContainer__btn"]} ${
              isLiked && user.uid && styles["actionContainer-likeBtn--liked"]
            } `}
            onClick={handleLikeClick}
            disabled={firestoreLikedDocumentResponse.isPending}
            buttonSize="small"
            iconImage={(className) => (
              <HeartIcon className={className} alt="Song Like Icon" />
            )}
          >
            Like
          </Button>
          <Button
            className={styles["actionContainer__btn"]}
            onClick={handleSongDownloadClick}
            buttonSize="small"
            iconClasses={styles["actionContainer_downloadBtn-icon"]}
            iconImage={downloadIcon}
            altText="Song Download Icon"
          >
            Download
          </Button>

          {user.uid === song.userID && (
            <>
              <Button
                className={`${styles["actionContainer__btn"]}`}
                onClick={() => setIsEditing(true)}
                disabled={isEditing}
                buttonSize="small"
                iconClasses={styles["actionContainer_editBtn-icon"]}
                iconImage={editIcon}
                altText="Song Edit Icon"
              >
                Edit
              </Button>
              <Button
                className={styles["actionContainer__btn"]}
                onClick={() => setIsDeleting(true)}
                disabled={isDeleting}
                buttonSize="small"
                iconClasses={styles["actionContainer_deleteBtn-icon"]}
                iconImage={deleteIcon}
                altText="Song Delete Icon"
              >
                Delete
              </Button>
            </>
          )}
          {isEditing && (
            <Modal
              action="editSongInformation"
              song={song}
              onConfirm={handleEditSong}
              onCancel={() => setIsEditing(false)}
            />
          )}
          {isDeleting && (
            <Modal
              action="deleteSong"
              onConfirm={handleDeleteSong}
              onCancel={() => setIsDeleting(false)}
            />
          )}
        </div>
      </div>
      <div className={styles["songItem__aside"]}>
        <div className={styles["songItem__songPhotoContainer"]}>
          <img
            className={styles["songPhotoContainer-img"]}
            src={song.songPhotoURL ? song.songPhotoURL : placeholderImage}
            alt="Song Cover Art"
          />
        </div>
      </div>
    </li>
  );
};

export default SongItem;
