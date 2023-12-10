import { createContext, useCallback, useEffect, useReducer } from 'react';

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
  seekingFromSongItemComplete: false,
  seekingFromAudioPlayer: false,
  playlistLocation: null,
};

//Reducer init function - This will be given to our reducer but it'll only be used if we previously loaded a playlist
const init = (initialReducerState) => {
  // Check if we have saved a playlistIndex in localstorage and if so we will update the inital state of playlist, playlistIndex and loadedSongUrl
  let indexFromLocalStorage = localStorage.getItem('playlistIndex');

  if (indexFromLocalStorage !== null) {
    const playlistFromLocalStorage = JSON.parse(
      localStorage.getItem('playlist')
    );

    let parsedPlaylistIndex = parseInt(indexFromLocalStorage);
    let playlistLocationFromLocalStorage =
      localStorage.getItem('playlistLocation');
    return {
      ...initialReducerState,
      playlistIndex: parsedPlaylistIndex,
      playlist: playlistFromLocalStorage,
      loadedSongURL:
        playlistFromLocalStorage !== null && playlistFromLocalStorage.length > 0
          ? playlistFromLocalStorage[parsedPlaylistIndex].songURL
          : null,
      playlistLocation:
        playlistFromLocalStorage !== null && playlistFromLocalStorage.length > 0
          ? playlistLocationFromLocalStorage
          : null,
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
    case 'URL_CHANGE':
      return { ...state, songURL: action.payload };
    case 'PLAYLIST_CHANGE':
      return {
        ...state,
        playlist: action.payload.playlistSongs,
        playlistIndex: action.payload.songIndex,
        loadedSongURL:
          action.payload.playlistSongs[action.payload.songIndex].songURL,
        playlistLocation: action.payload.songPlaylistLocation,
        isSongPlaying: true,
        currentSongPlayedTime: 0,
      };
    case 'SONG_EDITED_IN_PLAYLIST':
      return {
        ...state,
        playlist: action.payload,
      };
    case 'SONG_DELETED_FROM_PLAYLIST':
      const newPlaylist = state.playlist
        ? state.playlist.filter((song) => {
            return song.docID !== action.payload;
          })
        : state.playlist;
      const newPlaylistIndex =
        newPlaylist && newPlaylist.length > state.playlistIndex
          ? state.playlistIndex
          : 0;

      const newLoadedSong =
        newPlaylist && newPlaylist.length !== 0
          ? newPlaylist[newPlaylistIndex].songURL
          : null;
      const newIsPlaying =
        newLoadedSong !== null && state.isSongPlaying ? true : false;

      return {
        ...state,
        playlist: newPlaylist,
        loadedSongURL: newLoadedSong,
        playlistIndex: newPlaylistIndex,
        isSongPlaying: newIsPlaying,
        currentSongPlayedTime: 0,
      };
    // This action occures when we click to play different songs to play in a
    // playlist
    case 'PLAYLIST_INDEX_CHANGE':
      return {
        ...state,
        playlistIndex: action.payload,
        loadedSongURL: state.playlist[action.payload].songURL,
        isSongPlaying: true,
        currentSongPlayedTime: 0,
      };
    case 'PLAYLIST_ENDED':
      return {
        ...state,
        playlistIndex: 0,
        loadedSongURL: state.playlist[0].songURL,
        isSongPlaying: true,
        playlistEnded: true,
        currentSongPlayedTime: 0,
      };
    case 'LOAD_PREVIOUS_SONG':
      return {
        ...state,
        playlistIndex: state.playlistIndex - 1,
        loadedSongURL: state.playlist[state.playlistIndex - 1].songURL,
        currentSongPlayedTime: 0,
        isSongPlaying: true,
      };
    case 'LOAD_NEXT_SONG':
      return {
        ...state,
        playlistIndex: state.playlistIndex + 1,
        loadedSongURL: state.playlist[state.playlistIndex + 1].songURL,
        currentSongPlayedTime: 0,
        isSongPlaying: true,
      };

    case 'SONG_PLAYED':
      return {
        ...state,
        isSongPlaying: true,
        playlistEnded: false,
      };
    case 'SONG_PAUSED':
      return {
        ...state,
        isSongPlaying: false,
      };
    case 'PLAYED_TIME_CHANGE':
      return {
        ...state,
        currentSongPlayedTime: action.payload,
      };
    //FOR SEEKING FROM THE SONG ITEM*****************
    case 'SEEK_MOUSE_DOWN_FROM_SONG_ITEM':
      return {
        ...state,
        seekingFromSongItem: true,
      };
    case 'SEEK_CHANGE_FROM_SONG_ITEM':
      return {
        ...state,
        currentSongPlayedTime: action.payload,
      };
    case 'SEEK_MOUSE_UP_FROM_SONG_ITEM':
      return {
        ...state,
        currentSongPlayedTime: action.payload,
        seekingFromSongItem: false,
        seekingFromSongItemComplete: true,
      };
    case 'SEEK_FROM_SONG_ITEM_COMPLETE':
      return {
        ...state,
        seekingFromSongItemComplete: false,
      };

    //FOR SEEKING FROM THE AUDIOPLAYER*************************
    case 'SEEK_MOUSE_DOWN_FROM_AUDIO_PLAYER':
      return {
        ...state,
        seekingFromAudioPlayer: true,
      };
    //We dont need this because the song item should scrub live
    // case "SEEK_CHANGE_FROM_AUDIO_PLAYER":
    //   return {
    //     ...state,
    //     currentSongPlayedTime: action.payload,
    //   };
    case 'SEEK_MOUSE_UP_FROM_AUDIO_PLAYER':
      return {
        ...state,
        seekingFromAudioPlayer: false,
        currentSongPlayedTime: action.payload,
      };
    default:
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
  const { playlist, playlistIndex, playlistLocation } = state;

  const updatePlaylistIndex = useCallback(() => {
    localStorage.setItem('playlistIndex', playlistIndex);
  }, [playlistIndex]);

  const updatePlaylist = useCallback(() => {
    if (playlist) {
      localStorage.setItem('playlist', JSON.stringify(playlist));
    }
  }, [playlist]);

  const updatePlaylistLocation = useCallback(() => {
    localStorage.setItem('playlistLocation', playlistLocation);
  }, [playlistLocation]);

  useEffect(() => {
    updatePlaylistIndex();
  }, [updatePlaylistIndex]);

  useEffect(() => {
    updatePlaylist();
  }, [updatePlaylist]);

  useEffect(() => {
    updatePlaylistLocation();
  }, [updatePlaylistLocation]);

  return (
    <AudioPlayerContext.Provider
      value={{ ...state, dispatchAudioPlayerContext }}>
      {children}
    </AudioPlayerContext.Provider>
  );
};
