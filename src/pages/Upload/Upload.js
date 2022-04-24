import { useState, useReducer } from "react";
import { useCloudStorage } from "../../hooks/useCloudStorage";
import LoadingBar from "../../components/LoadingBar/LoadingBar";
import styles from "./Upload.module.css";
import GenreSelect from "../../components/UploadForm/GenreSelect/GenreSelect";

let initialState = {
  songFile: null,
  artistName: "",
  songName: "",
  genreType: "none",
  formIsValid: false,
};
const uploadReducer = (state, action) => {
  switch (action.type) {
    case "FILE_CHANGED":
      return {
        ...state,
        songFile: action.payload,
      };
    case "ARTIST_NAME_CHANGE":
      return {
        ...state,
        artistName: action.payload,
        formIsValid: action.payload.length > 0 && state.songName.length > 0,
      };

    case "SONG_NAME_CHANGE":
      return {
        ...state,
        songName: action.payload,
        formIsValid: action.payload.length > 0 && state.artistName.length > 0,
      };
    case "GENRE_TYPE_CHANGE":
      return {
        ...state,
        genreType: action.payload,
      };
    case "CANCEL_UPLOAD":
      return {
        ...initialState,
      };

    default:
      return state;
  }
};

const Upload = () => {
  // const [songFile, setSongFile] = useState(null);
  // const [artistName, setArtistName] = useState("");
  // const [songName, setSongName] = useState("");
  // const [genreType, setGenreType] = useState("");
  // const [formIsValid, setFormIsValid] = useState(false);
  const [songUploadState, dispatchSongUploadState] = useReducer(
    uploadReducer,
    initialState
  );
  const { addFile, response, uploadProgress } = useCloudStorage("songs/");
  const { songFile, artistName, songName, genreType, formIsValid } =
    songUploadState;
  const handleFileChange = (event) => {
    dispatchSongUploadState({
      type: "FILE_CHANGED",
      payload: event.target.files[0],
    });
  };

  const handleSongUpload = (event) => {
    if (songFile && formIsValid) {
      addFile(songFile, { artistName, songName, genreType });
      //Then wait, then clear the previous file... Possibly redirect to uploaded?
    }
  };
  const handleCancelClick = () => {
    dispatchSongUploadState({
      type: "CANCEL_UPLOAD",
    });
  };
  //TURN THIS INTO A REDUCER
  const handleArtistNameChange = (event) => {
    dispatchSongUploadState({
      type: "ARTIST_NAME_CHANGE",
      payload: event.target.value,
    });
    // setArtistName();
    // setFormIsValid(event.target.value.length > 0 && songName.length > 0);
  };
  const handleSongNameChange = (event) => {
    dispatchSongUploadState({
      type: "SONG_NAME_CHANGE",
      payload: event.target.value,
    });
    // setSongName(event.target.value);
    // setFormIsValid(event.target.value.length > 0 && artistName.length > 0);
  };
  const handleGenreTypeChange = (event) => {
    dispatchSongUploadState({
      type: "GENRE_TYPE_CHANGE",
      payload: event.target.value,
    });
    // setGenreType(event.target.value);
  };
  // const handle

  return (
    <div>
      {!songFile && (
        <div>
          <input type="file" onChange={handleFileChange}></input>
        </div>
      )}

      {songFile && (
        <div className={styles["upload"]}>
          <LoadingBar progress={uploadProgress} song={songFile.name} />
          <label htmlFor="artist-name">Artist:</label>
          <input
            type="text"
            id="artist-name"
            name="artist-name"
            value={artistName}
            onChange={handleArtistNameChange}
          ></input>

          <label htmlFor="song-name">Song Name:</label>
          <input
            type="text"
            id="song-name"
            name="song-name"
            value={songName}
            onChange={handleSongNameChange}
          ></input>

          <GenreSelect
            onGenreTypeChange={handleGenreTypeChange}
            genreValue={genreType}
          />

          {!response.isPending && (
            <div className={styles["button-container"]}>
              <button onClick={handleCancelClick}>Cancel</button>
              <button onClick={handleSongUpload} disabled={!formIsValid}>
                Upload
              </button>
            </div>
          )}

          {response.isPending && (
            <button disabled>Uploading... Please wait</button>
          )}
        </div>
      )}
    </div>
  );
};
export default Upload;
