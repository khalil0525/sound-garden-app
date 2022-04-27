import React, { useEffect, useReducer, useRef } from "react";
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
  const {
    loadedSongURL,
    dispatchAudioPlayerContext,
    isSongPlaying,
    playlistEnded,
    playlistIndex,
    playlist,
  } = useAudioPlayerContext();

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
      console.log("first previous condition");
      dispatchAudioPlayerContext({ type: "LOAD_PREVIOUS_SONG" });
    } else {
      console.log("second previous condition");
      dispatchAudioPlayerContext({
        type: "SEEK_POSITION_CHANGE",
        payload: 0.0,
      });
      player.current.seekTo(0.0);
    }
  };
  const handleNextClick = () => {
    console.log("onEnded");
    if (playlistIndex < playlist.length - 1) {
      dispatchAudioPlayerContext({ type: "LOAD_NEXT_SONG" });
      console.log("LOAD NEXT SONG");
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
    console.log("handlePlay");
    dispatchAudioPlayerContext({ type: "SONG_PLAYED" });
    dispatchAudioPlayerState({ type: "PLAY" });
  };
  const handlePause = () => {
    console.log("handlePause");
    dispatchAudioPlayerContext({ type: "SONG_PAUSED" });
    dispatchAudioPlayerState({ type: "PAUSE" });
  };
  const handleAudioStart = () => {
    console.log("handle audio ready");
    if (playlistEnded) {
      handlePause();
    } else {
      console.log("handle audio ready (handlePlay())");
      handlePlay();
    }
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
    // dispatchAudioPlayerState({ playing: false });
    //Calls the handleNextClick function which has the same
    //Functionality as this would have
    handleNextClick();
  };
  //This will load the song whenever the loadedSongURL changes
  useEffect(() => {
    if (loadedSongURL) {
      console.log("Loading new song");
      load(loadedSongURL);
    }
  }, [loadedSongURL]);

  //This useEffect is used to receive messages from the a songItem component
  // If a SongItem component pauses/plays the audio this will fire..
  // Or if the state of the AudioPlayerContext changes..
  useEffect(() => {
    if (!isSongPlaying && playing) {
      console.log("second use effect Audio Player, CONDITION 1");
      // console.log("2nd use effect pause");
      dispatchAudioPlayerState({ type: "PAUSE" });
    } else if (isSongPlaying && !playing) {
      console.log("second use effect Audio Player, CONDITION 2");
      // console.log("2nd use effect play");
      // console.log(player.current.getSecondsLoaded());
      // console.log(audioPlayerState);
      dispatchAudioPlayerState({ type: "PLAY" });
    }
  }, [isSongPlaying, playing]);

  return (
    <div className={styles["audio-player"]}>
      <ReactPlayer
        ref={player}
        width={0}
        height={0}
        url={url}
        playing={playing}
        volume={volume}
        muted={muted}
        onReady={(e) => console.log("track is loaded")}
        onStart={handleAudioStart}
        onPlay={handlePlay}
        onPause={handlePause}
        // onBuffer={() => console.log("onBuffer")}
        onSeek={(e) => console.log("onSeek", e)}
        onEnded={handleEnded}
        onError={(e) => console.log("onError", e)}
        onProgress={handleProgress}
        onDuration={handleDuration}
      />

      {/* AUDIO PLAYER MAIN CONTAINER ************************ */}
      <div className={styles["audio-player__container"]}>
        <div className={styles["audio-player__contents"]}>
          {/* Grey DIV ************************ */}
          <div className={styles["audio-player__upper"]}>
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
            </div>
          </div>
          {/* ORANGE DIV ************************ */}

          <div className={styles["audio-player__lower"]}>
            {/* PREVIOUS/PLAY&PAUSE/NEXT */}
            {/* {loadedSongURL && ()} */}
            <div className={styles["audio-player_controls_main"]}>
              <button
                disabled={!loadedSongURL}
                className={styles["audio-player_controls_main_previous"]}
                onClick={handlePreviousClick}
              >
                <img
                  src="/img/Expand_right_stop.svg"
                  alt="Audio player previous button"
                ></img>
              </button>

              <button
                disabled={!loadedSongURL}
                onClick={handlePlayPause}
                className={styles["audio-player_controls_main_play"]}
              >
                {playing ? (
                  // Pause button img
                  <img
                    src="/img/pause-svgrepo-com.svg"
                    alt="Audio player pause button"
                  ></img>
                ) : (
                  // Play button img
                  <img
                    src="/img/Arrow_drop_right.svg"
                    alt="Audio player play button"
                  ></img>
                )}
              </button>

              <button
                disabled={!loadedSongURL}
                className={styles["audio-player_controls_main_next"]}
                onClick={handleNextClick}
              >
                <img
                  src="/img/Expand_right_stop.svg"
                  alt="Audio player previous button"
                ></img>
              </button>
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
      </div>
    </div>
  );
};

export default AudioPlayer;
