import { createContext, useEffect, useReducer } from "react";

//context object
export const AudioPlayerContext = createContext();
let initialState = {
  loadedSongURL: null,
  isSongPlaying: false,
  // We don't place this inside of the init function because getItem will return null if there is no playlist in local storage
  playlist: null,
  playlistIndex: 0,
  playlistEnded: false,
  currentSongPlayedTime: 0,
  seekingFromSongItem: false,
};

//Reducer init function - This will be given to our reducer but it'll only be used if we previously loaded a playlist
const init = (initialReducerState) => {
  // Check if we have saved a playlistIndex in localstorage and if so we will update the inital state of playlist, playlistIndex and loadedSongUrl
  let indexFromLocalStorage = localStorage.getItem("playlistIndex");

  if (indexFromLocalStorage !== null) {
    const playlistFromLocalStorage = JSON.parse(
      localStorage.getItem("playlist")
    );
    let parsedPlaylistIndex = parseInt(indexFromLocalStorage);
    return {
      ...initialReducerState,
      playlistIndex: parsedPlaylistIndex,
      playlist: playlistFromLocalStorage,
      loadedSongURL: playlistFromLocalStorage[parsedPlaylistIndex].songURL,
    };
  } else {
    return {
      ...initialReducerState,
    };
  }
};

//Reducer function
export const audioPlayerReducer = (state, action) => {
  switch (action.type) {
    case "URL_CHANGE":
      return { ...state, songURL: action.payload };
    case "PLAYLIST_CHANGE":
      return {
        ...state,
        playlist: action.payload.playlistSongs,
        playlistIndex: action.payload.songIndex,
        loadedSongURL:
          action.payload.playlistSongs[action.payload.songIndex].songURL,
        isSongPlaying: true,
        currentSongPlayedTime: 0,
      };
    // This action occures when we click to play different songs to play in a
    // playlist
    case "PLAYLIST_INDEX_CHANGE":
      return {
        ...state,
        playlistIndex: action.payload,
        loadedSongURL: state.playlist[action.payload].songURL,
        isSongPlaying: true,
        currentSongPlayedTime: 0,
      };
    case "PLAYLIST_ENDED":
      return {
        ...state,
        playlistIndex: 0,
        loadedSongURL: state.playlist[0].songURL,
        isSongPlaying: true,
        playlistEnded: true,
        currentSongPlayedTime: 0,
      };
    case "LOAD_PREVIOUS_SONG":
      return {
        ...state,
        playlistIndex: state.playlistIndex - 1,
        loadedSongURL: state.playlist[state.playlistIndex - 1].songURL,
        currentSongPlayedTime: 0,
        isSongPlaying: true,
      };
    case "LOAD_NEXT_SONG":
      return {
        ...state,
        playlistIndex: state.playlistIndex + 1,
        loadedSongURL: state.playlist[state.playlistIndex + 1].songURL,
        currentSongPlayedTime: 0,
        isSongPlaying: true,
      };

    case "SONG_PLAYED":
      return {
        ...state,
        isSongPlaying: true,
        playlistEnded: false,
      };
    case "SONG_PAUSED":
      return {
        ...state,
        isSongPlaying: false,
      };
    case "PLAYED_TIME_CHANGE":
      return {
        ...state,
        currentSongPlayedTime: action.payload,
      };
    case "SEEK_FROM_SONG_ITEM":
      return {
        ...state,
        currentSongPlayedTime: action.payload,
        seekingFromSongItem: true,
      };
    case "SEEK_FROM_SONG_ITEM_COMPLETE":
      return {
        ...state,
        seekingFromSongItem: false,
      };
    default:
      console.log("DEFAULT STATE");
      return state;
  }
};

//Custom context provider component.
export const AudioPlayerContextProvider = ({ children }) => {
  //We will use dispatch on the components that have urls/playlists (songList or songItem)
  const [state, dispatchAudioPlayerContext] = useReducer(
    audioPlayerReducer,
    initialState,
    init
  );
  //Extract playlist and playlistIndex from our reducer state
  const { playlist, playlistIndex } = state;
  // This will check if a user is logged in after page refresh or when they first load the site
  useEffect(() => {
    console.log(state.loadedSongURL);
  }, [state]);

  //These 2 useEffects are used to store the current playlist and index we're at in localStorage
  useEffect(() => {
    localStorage.setItem("playlistIndex", playlistIndex);
  }, [playlistIndex]);

  useEffect(() => {
    if (playlist) {
      localStorage.setItem("playlist", JSON.stringify(playlist));
    }
  }, [playlist]);

  // Output the AuthContext state everytime we get a change
  // console.log("AudioPlayerContext state: ", state);
  return (
    <AudioPlayerContext.Provider
      value={{ ...state, dispatchAudioPlayerContext }}
    >
      {children}
    </AudioPlayerContext.Provider>
  );
};
