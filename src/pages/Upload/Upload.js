import { useState, useReducer, useEffect } from "react";
import { useCloudStorage } from "../../hooks/useCloudStorage";
import { useFirestore } from "../../hooks/useFirestore";
import { Link } from "react-router-dom";
import LoadingBar from "../../components/LoadingBar/LoadingBar";
import styles from "./Upload.module.css";
import GenreSelect from "../../components/UploadForm/GenreSelect/GenreSelect";
import { useAuthContext } from "../../hooks/useAuthContext";
import placeholderImage from "../../images/blank_image_placeholder.svg";
let initialState = {
  songFile: null,
  songPhotoFile: null,
  songPhotoURL: null,
  songDuration: null,
  songDurationIsValid: false,
  uploadIsReady: false,
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
    case "SONG_DURATION_CHANGED":
      return {
        ...state,
        songDuration: action.payload,
        songDurationIsValid: true,
        uploadIsReady: state.songName.length > 0,
      };
    case "PHOTO_FILE_CHANGED":
      return {
        ...state,
        songPhotoFile: action.payload,
        songPhotoURL: URL.createObjectURL(action.payload),
      };

    case "SONG_NAME_CHANGE":
      return {
        ...state,
        songName: action.payload,
        formIsValid: action.payload.length > 0,
        uploadIsReady: action.payload.length > 0 && state.songDurationIsValid,
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
  const [songUploadState, dispatchSongUploadState] = useReducer(
    uploadReducer,
    initialState
  );

  //Destruct values from the reducer state
  const {
    songFile,
    songPhotoFile,
    songPhotoURL,
    songName,
    genreType,
    formIsValid,
    songDuration,
    songDurationIsValid,
    uploadIsReady,
  } = songUploadState;

  //Cloud storage hook
  const {
    addSongFiles,
    // addFile,
    response: cloudStorageResponse,
    uploadProgress,
  } = useCloudStorage();

  //Fire store hook
  const { addDocument, response: firestoreResponse } = useFirestore("music");
  const { user } = useAuthContext();

  // path === "songs/" ? "music" : "images"
  //HANDLER FUNCTIONS

  const handleSongUpload = (event) => {
    if (songFile && formIsValid && uploadIsReady) {
      //Try to add a document to the FireStore database, we will then use this to store the file
      // URL and generate a unique filename
      addDocument({
        artist: user.displayName,
        genre: genreType,
        title: songName,
        duration: songDuration,
        userID: user.uid,
      });
    }
  };

  useEffect(() => {
    //If the fireStore document is succesfully uploaded we need to upload the file to cloud storage
    if (
      firestoreResponse.success &&
      !cloudStorageResponse.isPending &&
      !cloudStorageResponse.success
    ) {
      // Call to useCloudStorage to add song file
      console.log("Reacehed useEffect");
      addSongFiles(firestoreResponse.document, user, [songFile, songPhotoFile]);
    }
  }, [
    firestoreResponse,
    cloudStorageResponse,
    addSongFiles,
    user,
    songFile,
    songPhotoFile,
  ]);

  const handleCancelClick = () => {
    dispatchSongUploadState({
      type: "CANCEL_UPLOAD",
    });
  };
  const handleSongFileChange = (event) => {
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
  const handleSongPhotoFileChange = (event) => {
    if (event.target.files[0].type.split("/")[0] === "image") {
      dispatchSongUploadState({
        type: "PHOTO_FILE_CHANGED",
        payload: event.target.files[0],
      });
    } else {
      event.target.value = "";
    }
  };
  const handleSongNameChange = (event) => {
    dispatchSongUploadState({
      type: "SONG_NAME_CHANGE",
      payload: event.target.value,
    });
  };
  const handleGenreTypeChange = (event) => {
    dispatchSongUploadState({
      type: "GENRE_TYPE_CHANGE",
      payload: event.target.value,
    });
    // setGenreType(event.target.value);
  };
  useEffect(() => {
    const getAudioDuration = () => {
      // Obtain the uploaded file, you can change the logic if you are working with multiupload
      // Create instance of FileReader
      let reader = new FileReader();
      // When the file has been succesfully read
      reader.onload = (event) => {
        // Create an instance of AudioContext
        let audioContext = new (window.AudioContext ||
          window.webkitAudioContext)();
        audioContext.decodeAudioData(event.target.result, (buffer) => {
          let duration = buffer.duration;

          if (duration) {
            console.log(duration);
            dispatchSongUploadState({
              type: "SONG_DURATION_CHANGED",
              payload: duration,
            });
          }
          console.log(
            "The duration of the song is of: " + duration + " seconds"
          );
        });
      };
      // In case that the file couldn't be read
      reader.onerror = (event) => {
        console.error("An error ocurred reading the file: ", event);
      };
      // Read file as an ArrayBuffer, important !
      reader.readAsArrayBuffer(songFile);
    };
    if (songFile != null) {
      getAudioDuration();
    }
    // return () => getAudioDuration();
  }, [songFile]);

  useEffect(() => {
    console.log(firestoreResponse);
  }, [firestoreResponse]);

  return (
    <>
      <div className={styles["upload"]}>
        <div className={styles["upload-container"]}>
          {!songFile && (
            <div className={styles["file-picker"]}>
              <input
                type="file"
                onChange={handleSongFileChange}
                accept=".mp3, .ogg, .wav"
              ></input>
            </div>
          )}
          {songFile && (
            <div className={styles["upload-form"]}>
              <LoadingBar progress={uploadProgress} song={songFile.name} />
              {!cloudStorageResponse.success && (
                <>
                  <div className={styles["photo-picker"]}>
                    <img
                      className={styles["photo-picker-photo"]}
                      src={songPhotoFile ? songPhotoURL : placeholderImage}
                      alt="Song Cover Art"
                      width="160"
                      height="160"
                    />

                    <input
                      type="file"
                      onChange={handleSongPhotoFileChange}
                      disabled={cloudStorageResponse.isPending}
                      accept="image/*"
                    />
                  </div>

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
                        disabled={!uploadIsReady}
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
