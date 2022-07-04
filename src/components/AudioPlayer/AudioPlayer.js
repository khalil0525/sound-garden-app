import React, { useEffect, useReducer, useRef } from "react";
import ReactPlayer from "react-player/file";
import styles from "./AudioPlayer.module.css";
import { useAudioPlayerContext } from "../../hooks/useAudioPlayerContext";
import AudioSeekControlBar from "./AudioSeekControlBar/AudioSeekControlBar";
import AudioPlayerMarquee from "./AudioPlayerMarquee";
import previous_NextIcon from "../../images/Expand_right_stop.svg";
import pauseIcon from "../../images/pause-svgrepo-com.svg";
import playIcon from "../../images/Arrow_drop_right.svg";
import placeholderImage from "../../images/blank_image_placeholder.svg";
import Button from "../UI/Button/Button";

let initialState = {
  url: null,
  playing: false,
  volume: localStorage.getItem("volume")
    ? parseFloat(localStorage.getItem("volume"))
    : 0.5,
  muted: false,
  played: 0,
  loaded: 0,
  duration: 0,
  loop: false,
  seeking: false,
};

const audioPlayerReducer = (state, action) => {
  switch (action.type) {
    case "PLAY_PAUSE_CLICK":
      return { ...state, playing: !state.playing };
    case "VOLUME_CHANGE":
      return { ...state, volume: action.payload };
    case "SEEK_POSITION_CHANGE":
      return { ...state, played: action.payload };
    case "SEEK_MOUSE_DOWN":
      return { ...state, seeking: true };
    case "SEEK_MOUSE_UP":
      return { ...state, seeking: false };
    case "PROGRESS_CHANGE":
      return { ...state, ...action.payload };
    case "DURATION_CHANGE":
      return { ...state, duration: action.payload };
    case "LOAD_SONG":
      return { ...state, ...action.payload };
    case "PLAY":
      return { ...state, playing: true };
    case "PAUSE":
      return { ...state, playing: false };
    default:
      return { ...state };
  }
};
//Component function
const AudioPlayer = () => {
  //Reducer
  const [audioPlayerState, dispatchAudioPlayerState] = useReducer(
    audioPlayerReducer,
    initialState
  );
  //Destructure our reducer state
  const {
    url,
    playing,
    volume,
    muted,
    played,
    loaded,
    duration,
    loop,
    seeking,
  } = audioPlayerState;
  //Ref to ReactPlayer
  const player = useRef();
  //Audio player context
  const {
    loadedSongURL,
    dispatchAudioPlayerContext,
    isSongPlaying,
    playlistEnded,
    playlistIndex,
    playlist,
    currentSongPlayedTime,
    seekingFromSongItem,
    seekingFromSongItemComplete,
  } = useAudioPlayerContext();
  // const { getDocument: getArtistName, response: getArtistNameResponse } =
  //   useFirestore("users");

  //Function to load songs
  const load = (url) => {
    dispatchAudioPlayerState({
      type: "LOAD_SONG",
      payload: { url, played: 0, loaded: 0 },
    });
  };

  const handlePlayPause = () => {
    if (isSongPlaying) {
      dispatchAudioPlayerContext({ type: "SONG_PAUSED" });
    } else {
      dispatchAudioPlayerContext({ type: "SONG_PLAYED" });
    }
    dispatchAudioPlayerState({ type: "PLAY_PAUSE_CLICK" });
  };

  const handlePreviousClick = () => {
    const elapsedTime = duration * played;
    if ((elapsedTime < 4 || !isSongPlaying) && playlistIndex !== 0) {
      dispatchAudioPlayerContext({ type: "LOAD_PREVIOUS_SONG" });
    } else {
      dispatchAudioPlayerContext({
        type: "SEEK_POSITION_CHANGE",
        payload: 0.0,
      });
      player.current.seekTo(0.0);
    }
  };

  const handleNextClick = () => {
    if (playlistIndex < playlist.length - 1) {
      dispatchAudioPlayerContext({ type: "LOAD_NEXT_SONG" });
    } else {
      dispatchAudioPlayerContext({ type: "PLAYLIST_ENDED" });
    }
  };
  const handleVolumeChange = (event) => {
    dispatchAudioPlayerState({
      type: "VOLUME_CHANGE",
      payload: parseFloat(event.target.value),
    });
  };
  const handlePlay = () => {
    dispatchAudioPlayerContext({ type: "SONG_PLAYED" });
    dispatchAudioPlayerState({ type: "PLAY" });
  };
  const handlePause = () => {
    dispatchAudioPlayerContext({ type: "SONG_PAUSED" });
    dispatchAudioPlayerState({ type: "PAUSE" });
  };
  const handleAudioStart = () => {
    if (playlistEnded) {
      handlePause();
    } else {
      handlePlay();
    }
  };
  const handleSeekMouseDown = (event) => {
    dispatchAudioPlayerContext({ type: "SEEK_MOUSE_DOWN_FROM_AUDIO_PLAYER" });
    dispatchAudioPlayerState({ type: "SEEK_MOUSE_DOWN" });
  };

  const handleSeekChange = (event) => {
    dispatchAudioPlayerState({
      type: "SEEK_POSITION_CHANGE",
      payload: parseFloat(event.target.value),
    });
  };

  const handleSeekMouseUp = (event) => {
    dispatchAudioPlayerContext({
      type: "SEEK_MOUSE_UP_FROM_AUDIO_PLAYER",
      payload: parseFloat(event.target.value),
    });
    dispatchAudioPlayerState({ type: "SEEK_MOUSE_UP" });

    player.current.seekTo(parseFloat(event.target.value));
  };

  const handleProgress = (state) => {
    // We only want to update time slider if we are not currently seeking
    if (!seeking) {
      dispatchAudioPlayerContext({
        type: "PLAYED_TIME_CHANGE",
        payload: state.played,
      });
      dispatchAudioPlayerState({ type: "PROGRESS_CHANGE", payload: state });
    }
  };
  const handleDuration = (songDuration) => {
    dispatchAudioPlayerState({
      type: "DURATION_CHANGE",
      payload: songDuration,
    });
  };
  //THIS FUNCTION NEEDS TO CHECK WHETHER WE HAVE MORE TRACKS TO PLAY OR THIS IS THE LAST SONG
  const handleEnded = () => {
    // dispatchAudioPlayerState({ playing: false });
    //Calls the handleNextClick function which has the same
    //Functionality as this would have
    handleNextClick();
  };
  //This will load the song whenever the loadedSongURL changes
  useEffect(() => {
    if (loadedSongURL) {
      load(loadedSongURL);
    }
  }, [loadedSongURL]);

  //This useEffect is used to receive messages from the a songItem component
  // If a SongItem component pauses/plays the audio this will fire..
  // Or if the state of the AudioPlayerContext changes..
  useEffect(() => {
    if (!isSongPlaying && playing) {
      dispatchAudioPlayerState({ type: "PAUSE" });
    } else if (isSongPlaying && !playing) {
      dispatchAudioPlayerState({ type: "PLAY" });
    }
  }, [isSongPlaying, playing]);

  //This useEffect is used to store the user's volume settings in localStorage when it changes.
  useEffect(() => {
    localStorage.setItem("volume", volume);
  }, [volume]);

  //This is used when a SongItem sends us a position to seek to,
  // It causes the AudioPlayer to scrub through the song
  useEffect(() => {
    if (seekingFromSongItem) {
      dispatchAudioPlayerState({ type: "SEEK_MOUSE_DOWN" });
      dispatchAudioPlayerState({
        type: "SEEK_POSITION_CHANGE",
        payload: parseFloat(currentSongPlayedTime),
      });
      player.current.seekTo(parseFloat(currentSongPlayedTime));
    }
  }, [currentSongPlayedTime, seekingFromSongItem, dispatchAudioPlayerContext]);

  // When a user lifts their mouse from a SongItem seek change,
  // This will trigger in order to stop seeking in the audio player
  useEffect(() => {
    if (seekingFromSongItemComplete && seeking) {
      dispatchAudioPlayerContext({ type: "SEEK_FROM_SONG_ITEM_COMPLETE" });
      dispatchAudioPlayerState({ type: "SEEK_MOUSE_UP" });
    }
  }, [
    currentSongPlayedTime,
    dispatchAudioPlayerContext,
    seeking,
    seekingFromSongItemComplete,
  ]);

  // useEffect(() => {
  //   if (url) {
  //     getArtistName(playlist[playlistIndex].artist);
  //   }
  // }, [url]);

  return (
    <div className={styles["audioPlayer"]}>
      <ReactPlayer
        ref={player}
        width={0}
        height={0}
        url={url}
        playing={playing}
        volume={volume}
        muted={muted}
        // onReady={}
        onStart={handleAudioStart}
        onPlay={handlePlay}
        onPause={handlePause}
        // onBuffer={}
        // onSeek={}
        onEnded={handleEnded}
        // onError={}
        onProgress={handleProgress}
        onDuration={handleDuration}
      />

      {/* Grey DIV ************************ */}
      <div className={styles["audioPlayer__upper"]}>
        <div className={styles["audioPlayer__controls"]}>
          {/* SEEK  */}
          <AudioSeekControlBar
            className={styles["audioPlayer__controls-seek"]}
            durationClassName={styles["audioPlayer__controls-seek-duration"]}
            duration={duration}
            played={played}
            onChange={handleSeekChange}
            onMouseDown={handleSeekMouseDown}
            onMouseUp={handleSeekMouseUp}
          />
        </div>
      </div>
      {/* ORANGE DIV ************************ */}

      <div className={styles["audioPlayer__lower"]}>
        {/* PREVIOUS/PLAY&PAUSE/NEXT */}
        <div className={styles["audioPlayer__controls-main"]}>
          {/* PREVIOUS BUTTON */}
          <Button
            disabled={!loadedSongURL}
            className={styles["audioPlayer__controls-main-previous"]}
            onClick={handlePreviousClick}
            iconImage={previous_NextIcon}
            altText="Audio player previous button icon"
          />
          {/* PLAY BUTTON */}
          <Button
            disabled={!loadedSongURL}
            onClick={handlePlayPause}
            className={styles["audioPlayer__controls-main-play"]}
            iconImage={playing ? pauseIcon : playIcon}
            altText={
              playing ? "Audio player pause button" : "Audio player play button"
            }
          />
          {/* NEXT BUTTON */}
          <Button
            disabled={!loadedSongURL}
            className={styles["audioPlayer__controls-main-next"]}
            onClick={handleNextClick}
            iconImage={previous_NextIcon}
            altText="Audio player next button icon"
          />
        </div>

        {/* VOLUME */}
        <div className={styles["audioPlayer__controls-volume"]}>
          <input
            type="range"
            min={0}
            max={1}
            step="any"
            value={volume}
            onChange={handleVolumeChange}
          />
        </div>

        <div className={styles["audioPlayer__trackDetails"]}>
          <div className={styles["audioPlayer__trackDetails-songArt"]}>
            <img
              className={styles["audioPlayer__trackDetails-songArt-image"]}
              src={
                loadedSongURL && playlist[playlistIndex].songPhotoURL
                  ? playlist[playlistIndex].songPhotoURL
                  : placeholderImage
              }
              alt="Song Cover Art"
              width="64"
              height="64"
            />
          </div>
          <div className={styles["audioPlayer__trackDetails-songDetails"]}>
            <AudioPlayerMarquee
              className={styles["audioPlayer__trackDetails-songDetails-title"]}
            >
              {loadedSongURL && playlist[playlistIndex].title}
            </AudioPlayerMarquee>

            <p
              className={styles["audioPlayer__trackDetails-songDetails-artist"]}
            >
              {loadedSongURL && playlist[playlistIndex].artist}
            </p>
          </div>
        </div>
      </div>
    </div>
    // </div>
  );
};

export default AudioPlayer;
