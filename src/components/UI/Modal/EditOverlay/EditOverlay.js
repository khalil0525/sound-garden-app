import React, { useEffect, useState } from "react";
import { useCloudStorage } from "../../../../hooks/useCloudStorage";
import { useFirestore } from "../../../../hooks/useFirestore";
import styles from "./EditOverlay.module.css";
import GenreSelect from "../../../UploadForm/GenreSelect/GenreSelect";
import placeholderImage from "../../../../images/blank_image_placeholder.svg";
import { useAuthContext } from "../../../../hooks/useAuthContext";
const EditOverlay = (props) => {
  const [songTitle, setSongTitle] = useState(() => props.song.title);
  const [songPhotoFile, setSongPhotoFile] = useState(null);
  const [songPhotoFileURL, setSongPhotoFileURL] = useState(() =>
    props.song.songPhotoURL ? props.song.songPhotoURL : null
  );
  const [songGenre, setSongGenre] = useState(() => props.song.genre);
  const [propertyChangeOccurred, setPropertyChangeOccurred] = useState(false);
  const { user } = useAuthContext();
  const {
    replaceFile,
    addFile,
    response: cloudStorageResponse,
  } = useCloudStorage();

  //Fire store hook
  const { updateDocument, response: firestoreResponse } = useFirestore("music");

  const handleSongPhotoFileChange = (event) => {
    if (event.target.files[0].type.split("/")[0] === "image") {
      setSongPhotoFile(event.target.files[0]);
      setSongPhotoFileURL(URL.createObjectURL(event.target.files[0]));
      // dispatchSongUploadState({
      //   type: "PHOTO_FILE_CHANGED",
      //   payload: event.target.files[0],
      // });
    } else {
      event.target.value = "";
    }
  };

  const handleSongNameChange = (event) => {
    setSongTitle(event.target.value);
    // dispatchSongUploadState({
    //   type: "SONG_NAME_CHANGE",
    //   payload: event.target.value,
    // });
  };
  const handleGenreTypeChange = (event) => {
    setSongGenre(event.target.value);
    // dispatchSongUploadState({
    //   type: "GENRE_TYPE_CHANGE",
    //   payload: event.target.value,
    // });
    // setGenreType(event.target.value);
  };
  const handleSongUpdate = () => {
    let newValues = { title: songTitle, genre: songGenre };
    if (propertyChangeOccurred) {
      updateDocument(props.song.docID, newValues);
    }
    // if (songFile && formIsValid && uploadIsReady) {
    //   //Try to add a document to the FireStore database, we will then use this to store the file
    //   // URL and generate a unique filename
    //   addDocument({
    //     artist: artistName,
    //     genre: genreType,
    //     title: songName,
    //     duration: songDuration,
    //     uid: user.uid,
    //   });
    // }
  };
  useEffect(() => {
    //If the fireStore document is succesfully uploaded we need to upload the file to cloud storage
    if (
      firestoreResponse.success &&
      !cloudStorageResponse.isPending &&
      !cloudStorageResponse.success &&
      songPhotoFile !== null
    ) {
      if (props.song.songPhotoURL === "") {
        addFile(
          firestoreResponse.document,
          "/images",
          user,
          songPhotoFile,
          "songPhoto"
        );
      } else {
        replaceFile(
          firestoreResponse.document,
          props.song.songPhotoFilePath,
          songPhotoFile,
          "songPhoto"
        );
      }
      // Call to useCloudStorage to add song file
      console.log(firestoreResponse.document);
    }
  }, [
    firestoreResponse,
    cloudStorageResponse,
    replaceFile,
    addFile,
    user,
    songPhotoFile,
    props.song.songPhotoFilePath,
    props.song.songPhotoURL,
  ]);
  // useEffect(() => {
  //   console.log(props.song.songPhotoFilePath.split("_"));
  // });
  useEffect(() => {
    const { songPhotoURL, title, genre } = props.song;
    if (
      songPhotoURL !== songPhotoFileURL ||
      title !== songTitle ||
      genre !== songGenre
    ) {
      setPropertyChangeOccurred(true);
    }
  }, [props.song, songPhotoFileURL, songTitle, songGenre]);

  // setSongName(event.target.value);
  // setFormIsValid(event.target.value.length > 0 && artistName.length > 0);

  return (
    <div className={styles.modal}>
      <div className={styles["upload-container"]}>
        <div className={styles["upload-form"]}>
          <div className={styles["photo-picker"]}>
            <img
              className={styles["photo-picker-photo"]}
              src={songPhotoFileURL ? songPhotoFileURL : placeholderImage}
              alt="Song Cover Art"
              width="160"
              height="160"
            />
            {/* */}
            <input
              type="file"
              disabled={cloudStorageResponse.isPending}
              onChange={handleSongPhotoFileChange}
              accept="image/*"
            />
          </div>

          <label htmlFor="song-name">Song Name:</label>
          {/*  */}
          <input
            type="text"
            id="song-name"
            name="song-name"
            value={songTitle}
            disabled={cloudStorageResponse.isPending}
            onChange={handleSongNameChange}
          ></input>
          {/* */}
          <GenreSelect
            onGenreTypeChange={handleGenreTypeChange}
            disabled={cloudStorageResponse.isPending}
            genreValue={songGenre}
          />
          {/* */}
          {!cloudStorageResponse.isPending && (
            <div className={styles["action-container"]}>
              <div onClick={props.onCancel}>Cancel</div>
              {/*  */}
              <button
                onClick={handleSongUpdate}
                disabled={!propertyChangeOccurred}
              >
                Save Changes
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditOverlay;
