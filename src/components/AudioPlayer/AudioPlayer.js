import React, { useReducer, useRef } from "react";
import ReactPlayer from "react-player/file";
import styles from "./AudioPlayer.module.css";
import Duration from "./Duration";
import { useAudioPlayerContext } from "../../hooks/useAudioPlayerContext";
let initialState = {
  url: null,
  playing: false,
  volume: 0.5,
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
  const { songURL } = useAudioPlayerContext();

  //Function to load songs
  const load = (url) => {
    dispatchAudioPlayerState({
      type: "LOAD_SONG",
      payload: { url, played: 0, loaded: 0 },
    });
  };

  const handlePlayPause = () => {
    dispatchAudioPlayerState({ type: "PLAY_PAUSE_CLICK" });
  };
  const handleVolumeChange = (event) => {
    dispatchAudioPlayerState({
      type: "VOLUME_CHANGE",
      payload: parseFloat(event.target.value),
    });
  };
  const handlePlay = () => {
    dispatchAudioPlayerState({ type: "PLAY" });
  };
  const handlePause = () => {
    dispatchAudioPlayerState({ type: "PAUSE" });
  };

  const handleSeekMouseDown = (event) => {
    console.log("MOUSE DOWN");
    dispatchAudioPlayerState({ type: "SEEK_MOUSE_DOWN" });
  };

  const handleSeekChange = (event) => {
    console.log("seekChange", event.target.value);
    console.log(player);
    dispatchAudioPlayerState({
      type: "SEEK_POSITION_CHANGE",
      payload: parseFloat(event.target.value),
    });
  };

  const handleSeekMouseUp = (event) => {
    console.log("MOUSE UP");
    dispatchAudioPlayerState({ type: "SEEK_MOUSE_UP" });
    player.current.seekTo(parseFloat(event.target.value));
  };

  const handleProgress = (state) => {
    // We only want to update time slider if we are not currently seeking
    if (!seeking) {
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
    console.log("onEnded");
    dispatchAudioPlayerState({ playing: false });
  };

  return (
    <div className={styles["audio-player"]}>
      <ReactPlayer
        ref={player}
        width={0}
        height={0}
        url={songURL}
        playing={playing}
        volume={volume}
        muted={muted}
        onReady={handlePlay}
        // onStart={() => console.log("onStart")}
        onPlay={handlePlay}
        onPause={handlePause}
        // onBuffer={() => console.log("onBuffer")}
        onSeek={(e) => console.log("onSeek", e)}
        // onEnded={handleEnded}
        onError={(e) => console.log("onError", e)}
        onProgress={handleProgress}
        onDuration={handleDuration}
      />
      <div className={styles["audio-player_controls"]}>
        {/* SEEK  */}
        <div className={styles["audio-player_controls_seek"]}>
          <Duration seconds={duration * played} />
          <input
            type="range"
            min={0}
            max={0.999999}
            step="any"
            value={played}
            onChange={handleSeekChange}
            onMouseDown={handleSeekMouseDown}
            onMouseUp={handleSeekMouseUp}
          />
          <Duration seconds={duration * (1 - played)} />
        </div>

        {/* PREVIOUS/PLAY&PAUSE/NEXT */}
        {/* {songURL && ()} */}
        <div className={styles["audio-player_controls_main"]}>
          <button disabled={!songURL}>Prev</button>
          {/*  */}
          <button disabled={!songURL} onClick={handlePlayPause}>
            {playing ? "Pause" : "Play"}
          </button>
          <button disabled={!songURL}>Next</button>
        </div>

        {/* VOLUME */}
        <div className={styles["audio-player_controls_volume"]}>
          <input
            type="range"
            min={0}
            max={1}
            step="any"
            value={volume}
            onChange={handleVolumeChange}
          />
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;
