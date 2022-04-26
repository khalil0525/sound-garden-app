import { useState, useReducer, useEffect } from "react";
import { useCloudStorage } from "../../hooks/useCloudStorage";
import { useFirestore } from "../../hooks/useFirestore";
import { Link } from "react-router-dom";
import LoadingBar from "../../components/LoadingBar/LoadingBar";
import styles from "./Upload.module.css";
import GenreSelect from "../../components/UploadForm/GenreSelect/GenreSelect";
import { useAuthContext } from "../../hooks/useAuthContext";

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
  //Destruct values from the reducer state
  const { songFile, artistName, songName, genreType, formIsValid } =
    songUploadState;
  //Cloud storage hook
  const {
    addFile,
    response: cloudStorageResponse,
    uploadProgress,
  } = useCloudStorage("songs/");
  //Fire store hook
  const { addDocument, response: firestoreResponse } = useFirestore("music");
  const { user } = useAuthContext();

  // path === "songs/" ? "music" : "images"
  //HANDLER FUNCTIONS

  const handleFileChange = (event) => {
    //Check if the file the user is passing is an audio file
    // Otherwise don't accept it.
    if (event.target.files[0].type.split("/")[0] === "audio") {
      dispatchSongUploadState({
        type: "FILE_CHANGED",
        payload: event.target.files[0],
      });
    } else {
      event.target.value = "";
    }
  };
  const handleSongUpload = async (event) => {
    if (songFile && formIsValid) {
      //Try to add a document to the FireStore database, we will then use this to store the file
      // URL and generate a unique filename
      addDocument({
        artist: artistName,
        genre: genreType,
        title: songName,
        // URL: downloadURL,
        uid: user.uid,
      });
    }
  };

  useEffect(() => {
    //If the fireStore document is succesfully uploaded we need to upload the file to cloud storage
    if (firestoreResponse.success) {
      console.log(firestoreResponse.document);
      addFile(firestoreResponse.document, user, songFile);
    }
  }, [firestoreResponse.success]);

  const handleCancelClick = () => {
    dispatchSongUploadState({
      type: "CANCEL_UPLOAD",
    });
  };
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

  return (
    <>
      <div className={styles["upload"]}>
        <div className={styles["upload-container"]}>
          {!songFile && (
            <div className={styles["file-picker"]}>
              <input type="file" onChange={handleFileChange}></input>
            </div>
          )}
          {songFile && (
            <div className={styles["upload-form"]}>
              <LoadingBar progress={uploadProgress} song={songFile.name} />
              {!cloudStorageResponse.success && (
                <>
                  <label htmlFor="artist-name">Artist:</label>
                  <input
                    type="text"
                    id="artist-name"
                    name="artist-name"
                    value={artistName}
                    onChange={handleArtistNameChange}
                    disabled={cloudStorageResponse.isPending}
                  ></input>

                  <label htmlFor="song-name">Song Name:</label>
                  <input
                    type="text"
                    id="song-name"
                    name="song-name"
                    value={songName}
                    onChange={handleSongNameChange}
                    disabled={cloudStorageResponse.isPending}
                  ></input>

                  <GenreSelect
                    onGenreTypeChange={handleGenreTypeChange}
                    genreValue={genreType}
                    disabled={cloudStorageResponse.isPending}
                  />

                  {!cloudStorageResponse.isPending && (
                    <div className={styles["action-container"]}>
                      <div onClick={handleCancelClick}>Cancel</div>
                      <button
                        onClick={handleSongUpload}
                        disabled={!formIsValid}
                      >
                        Upload
                      </button>
                    </div>
                  )}
                </>
              )}
              {cloudStorageResponse.success && (
                <>
                  {/* <div onClick={handleCancelClick}>Upload Another track?</div> */}
                  <h2>Uploaded Sucessfully!</h2>
                  <div>
                    <Link to="/uploaded">Go to your uploaded tracks</Link>
                  </div>
                </>
              )}
              {cloudStorageResponse.isPending && (
                <button disabled>Uploading... Please wait</button>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};
export default Upload;
