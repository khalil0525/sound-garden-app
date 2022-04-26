import { createContext, useEffect, useReducer } from "react";

//context object
export const AudioPlayerContext = createContext();

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
          action.payload.playlistSongs[action.payload.songIndex].URL,
        isSongPlaying: true,
      };
    // This action occures when we click to play different songs to play in a
    // playlist
    case "PLAYLIST_INDEX_CHANGE":
      return {
        ...state,
        playlistIndex: action.payload,
        loadedSongURL: state.playlist[action.payload].URL,
        isSongPlaying: true,
      };
    case "PLAYLIST_ENDED":
      return {
        ...state,
        playlistIndex: 0,
        loadedSongURL: state.playlist[0].URL,
        isSongPlaying: true,
        playlistEnded: true,
      };
    case "LOAD_PREVIOUS_SONG":
      return {
        ...state,
        playlistIndex: state.playlistIndex - 1,
        loadedSongURL: state.playlist[state.playlistIndex - 1].URL,
        isSongPlaying: true,
      };

    case "LOAD_NEXT_SONG":
      return {
        ...state,
        playlistIndex: state.playlistIndex + 1,
        loadedSongURL: state.playlist[state.playlistIndex + 1].URL,
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
    default:
      console.log("DEFAULT STATE");
      return state;
  }
};

//Custom context provider component.
export const AudioPlayerContextProvider = ({ children }) => {
  //We will use dispatch on the components that have urls/playlists (songList or songItem)
  const [state, dispatchAudioPlayerContext] = useReducer(audioPlayerReducer, {
    loadedSongURL: null,
    isSongPlaying: false,
    playlist: null,
    playlistIndex: 0,
    playlistEnded: false,
  });
  // This will check if a user is logged in after page refresh or when they first load the site
  useEffect(() => {
    // const unsub = projectAuth.onAuthStateChanged((user) => {
    //   dispatch({ type: "AUTH_IS_READY", payload: user });
    //   //Cleanup function
    //   unsub();
    // });
    console.log(state.loadedSongURL);
  }, [state]);
  // Output the AuthContext state everytime we get a change
  console.log("AudioPlayerContext state: ", state);
  return (
    <AudioPlayerContext.Provider
      value={{ ...state, dispatchAudioPlayerContext }}
    >
      {children}
    </AudioPlayerContext.Provider>
  );
};
