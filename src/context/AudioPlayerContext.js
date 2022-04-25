import { createContext, useEffect, useReducer } from "react";

//context object
export const AudioPlayerContext = createContext();

//Reducer function
export const audioPlayerReducer = (state, action) => {
  switch (action.type) {
    case "URL_CHANGE":
      return { ...state, songURL: action.payload };

    case "PLAYLIST_CHANGE":
      return { ...state, playlist: action.payload };

    default:
      return state;
  }
};

//Custom context provider component.
export const AudioPlayerContextProvider = ({ children }) => {
  //We will use dispatch on the components that have urls/playlists (songList or songItem)
  const [state, dispatch] = useReducer(audioPlayerReducer, {
    songURL: null,
    playlist: null,
    playlistIndex: 0,
  });
  // This will check if a user is logged in after page refresh or when they first load the site
  useEffect(() => {
    // const unsub = projectAuth.onAuthStateChanged((user) => {
    //   dispatch({ type: "AUTH_IS_READY", payload: user });
    //   //Cleanup function
    //   unsub();
    // });
    console.log(state.songURL);
  }, [state]);
  // Output the AuthContext state everytime we get a change
  console.log("AudioPlayerContext state: ", state);
  return (
    <AudioPlayerContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AudioPlayerContext.Provider>
  );
};
