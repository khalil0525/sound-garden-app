import React, { useReducer } from "react";
import ReactPlayer from "react-player/file";

let initialState = {
  url: null,
  playing: false,
  volume: 0.5,
  muted: false,
  played: 0,
  loaded: 0,
  duration: 0,
  loop: false,
};
const AudioPlayer = () => {
  return (
    <>
      <ReactPlayer
        width={0}
        height={0}
        url="https://firebasestorage.googleapis.com/v0/b/sound-garden-eeeed.appspot.com/o/songs%2FxCvggxf5HPhL9xBbHOz49BWcsly2%2FDADADADA.mp3?alt=media&token=a0255825-856e-447b-b9f1-cd0eaba7e046"
      />
      <div>
        <button>Back</button>
        {/* {playing ? 'Pause' : 'Play'} */}
        <button>Play/Pause</button>
        <button>Reverse</button>
      </div>
    </>
  );
};

export default AudioPlayer;
