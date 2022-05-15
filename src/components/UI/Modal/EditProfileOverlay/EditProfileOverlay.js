import React, { useEffect, useState, useReducer } from "react";
import { useCloudStorage } from "../../../../hooks/useCloudStorage";
import { useFirestore } from "../../../../hooks/useFirestore";
import styles from "./EditProfileOverlay.module.css";

import placeholderImage from "../../../../images/blank_image_placeholder.svg";
import { useAuthContext } from "../../../../hooks/useAuthContext";

const editSongOverlayReducer = (state, action) => {
  switch (action.type) {
    case "PHOTO_FILE_CHANGED":
      return {
        ...state,
        songPhotoFile: action.payload,
        songPhotoFileURL: URL.createObjectURL(action.payload),
        propertyChangeOccurred: true,
        editSaveReady: state.formIsValid,
      };
    case "FIRST_NAME_CHANGE":
      return {
        ...state,
        songTitle: action.payload,
        formIsValid: action.payload.length > 0,
        propertyChangeOccurred: true,
        editSaveReady: action.payload.length > 0,
      };
    case "LAST_NAME_CHANGE":
      return {
        ...state,
        songGenre: action.payload,
        propertyChangeOccurred: true,
        editSaveReady: state.formIsValid,
      };
    case "DISPLAY_NAME_CHANGE":
      return {
        ...state,
      };
    case "PROFILE_URL_CHANGE":
      return {
        ...state,
      };

    default:
      return state;
  }
};

const EditProfileOverlay = (props) => {
  let initialState = {
    firstName: props.userInformation.firstName,
    lastName: props.userInformation.lastName,
    displayName: props.userInformation.displayName,
    profileURL: props.userInformation.profileURL,
    profilePhotoFileURL: props.userInformation.profilePhotoURL
      ? props.userInformation.profilePhotoURL
      : "",
    profilePhotoFile: null,
    formIsValid: true,
    editSaveReady: false,
    propertyChangeOccurred: false,
    profileURLChanged: false,
    displayNameChanged: false,
  };
  const [editProfileState, dispatchEditProfileState] = useReducer(
    editSongOverlayReducer,
    initialState
  );
  const {
    firstName,
    lastName,
    displayName,
    profileURL,
    profilePhotoFileURL,
    profilePhotoFile,
    profileURLChanged,
    displayNameChanged,
    editSaveReady,
  } = editProfileState;

  const { user } = useAuthContext();
  const {
    replaceFile,
    addFile,
    response: cloudStorageResponse,
  } = useCloudStorage();

  //Fire store hook
  const { updateDocument, response: firestoreResponse } = useFirestore("users");

  const handleProfilePhotoFileChange = (event) => {
    if (event.target.files[0].type.split("/")[0] === "image") {
      dispatchEditProfileState({
        type: "PHOTO_FILE_CHANGED",
        payload: event.target.files[0],
      });
    } else {
      event.target.value = "";
    }
  };

  const handleFirstNameChange = (event) => {
    dispatchEditProfileState({
      type: "FIRST_NAME_CHANGE",
      payload: event.target.value,
    });
  };

  const handleLastNameChange = (event) => {
    dispatchEditProfileState({
      type: "LAST_NAME_CHANGE",
      payload: event.target.value,
    });
  };
  const handleDisplayNameChange = (event) => {
    dispatchEditProfileState({
      type: "DISPLAY_NAME_CHANGE",
      payload: event.target.value,
    });
  };
  const handleProfileURLChange = (event) => {
    dispatchEditProfileState({
      type: "PROFILE_URL_CHANGE",
      payload: event.target.value,
    });
  };

  const handleSongUpdate = () => {
    let newValues = { title: songTitle, genre: songGenre };
    if (editSaveReady) {
      updateDocument(props.song.docID, newValues);
    }
  };

  // useEffect(() => {
  //   if (
  //     cloudStorageResponse.success ||
  //     (songPhotoFile === null && firestoreResponse.success)
  //   ) {
  //     props.onConfirm();
  //   }
  // }, [cloudStorageResponse, firestoreResponse.success, songPhotoFile, props]);

  // useEffect(() => {
  //   //If the fireStore document is succesfully uploaded we need to upload the file to cloud storage
  //   if (
  //     firestoreResponse.success &&
  //     !cloudStorageResponse.isPending &&
  //     !cloudStorageResponse.success &&
  //     songPhotoFile !== null
  //   ) {
  //     //If the song previously didn't have a photo
  //     if (props.song.songPhotoURL === "") {
  //       addFile(
  //         firestoreResponse.document,
  //         "/images",
  //         user,
  //         songPhotoFile,
  //         "songPhoto"
  //       );
  //     } else {
  //       //If the song previously had a photo
  //       replaceFile(
  //         firestoreResponse.document,
  //         props.song.songPhotoFilePath,
  //         songPhotoFile,
  //         "songPhoto"
  //       );
  //     }
  //     // Call to useCloudStorage to add song file
  //     console.log(firestoreResponse.document);
  //   }
  // }, [
  //   firestoreResponse,
  //   cloudStorageResponse,
  //   replaceFile,
  //   addFile,
  //   user,
  //   songPhotoFile,
  //   props.song.songPhotoFilePath,
  //   props.song.songPhotoURL,
  // ]);

  return (
    <div className={styles.modal}>
      <div className={styles["upload-container"]}>
        <div className={styles["upload-form"]}>
          <div className={styles["photo-picker"]}>
            <img
              className={styles["photo-picker-photo"]}
              src={profilePhotoFileURL ? profilePhotoFileURL : placeholderImage}
              alt="Song Cover Art"
              width="160"
              height="160"
            />
            {/* */}
            <input
              type="file"
              disabled={cloudStorageResponse.isPending}
              onChange={handleProfilePhotoFileChange}
              accept="image/*"
            />
          </div>
          <label htmlFor="display-name">Display Name:</label>
          {/*  */}
          <input
            type="text"
            id="display-name"
            name="display-namee"
            value={displayName}
            disabled={cloudStorageResponse.isPending}
            onChange={handleDisplayNameChange}
          ></input>
          <label htmlFor="profile-url">Profile URL :</label>
          {/*  */}
          <input
            type="text"
            id="profile-url"
            name="profile-url"
            value={profileURL}
            disabled={cloudStorageResponse.isPending}
            onChange={handleProfileURLChange}
          ></input>

          <label htmlFor="first-name">First Name:</label>
          {/*  */}
          <input
            type="text"
            id="first-name"
            name="first-name"
            value={firstName}
            disabled={cloudStorageResponse.isPending}
            onChange={handleFirstNameChange}
          ></input>
          <label htmlFor="last-name">Last Name:</label>
          {/*  */}
          <input
            type="text"
            id="last-name"
            name="last-name"
            value={lastName}
            disabled={cloudStorageResponse.isPending}
            onChange={handleLastNameChange}
          ></input>

          {/* */}
          {!cloudStorageResponse.isPending && !cloudStorageResponse.success && (
            <div className={styles["action-container"]}>
              <div onClick={props.onCancel}>Cancel</div>
              {/*  */}
              <button onClick={handleSongUpdate} disabled={!editSaveReady}>
                Save Changes
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditProfileOverlay;
