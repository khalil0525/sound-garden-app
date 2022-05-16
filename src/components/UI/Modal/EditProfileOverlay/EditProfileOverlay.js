import React, { useEffect, useState, useReducer } from "react";
import { useCloudStorage } from "../../../../hooks/useCloudStorage";
import { useFirestore } from "../../../../hooks/useFirestore";
import styles from "./EditProfileOverlay.module.css";

import placeholderImage from "../../../../images/blank_image_placeholder.svg";
import { useAuthContext } from "../../../../hooks/useAuthContext";
//    profileURLChanged: false,
// displayNameChanged: false,
// firstNameChanged: false,
// lastNameChanged: false,
const editProfileOverlayReducer = (state, action) => {
  switch (action.type) {
    case "PHOTO_FILE_CHANGED":
      return {
        ...state,
        profilePhotoFile: action.payload,
        profilePhotoFileURL: URL.createObjectURL(action.payload),
        propertyChangeOccurred: true,
        editSaveReady: state.formIsValid,
      };
    case "FIRST_NAME_CHANGE":
      let trimmedFirstName = action.payload.trimStart().trimEnd();
      return {
        ...state,
        firstName: action.payload,
        propertyChangeOccurred: true,
        firstNameChanged:
          trimmedFirstName !== state.props.userInformation.firstName,
        editSaveReady:
          state.formIsValid &&
          (state.lastNameChanged ||
            state.displayNameChanged ||
            state.profilePhotoFile ||
            state.profileURLChanged ||
            (trimmedFirstName.length <= 35 &&
              trimmedFirstName !== state.props.userInformation.firstName)),
        formIsValid:
          state.displayName.length >= 5 &&
          state.displayName.length <= 35 &&
          state.profileURL.length >= 5 &&
          state.profileURL.length <= 35 &&
          state.lastName.length <= 35 &&
          trimmedFirstName.length <= 35,
      };
    case "LAST_NAME_CHANGE":
      let trimmedLastName = action.payload.trimStart().trimEnd();
      return {
        ...state,
        lastName: action.payload,
        propertyChangeOccurred: true,
        lastNameChanged:
          trimmedLastName !== state.props.userInformation.lastName,
        editSaveReady:
          state.formIsValid &&
          (state.firstNameChanged ||
            state.displayNameChanged ||
            state.profilePhotoFile ||
            state.profileURLChanged ||
            (trimmedLastName.length <= 35 &&
              trimmedLastName !== state.props.userInformation.lastName)),
        formIsValid:
          state.displayName.length >= 5 &&
          state.displayName.length <= 35 &&
          state.profileURL.length >= 5 &&
          state.profileURL.length <= 35 &&
          state.firstName.length <= 35 &&
          trimmedLastName.length <= 35,
      };
    case "DISPLAY_NAME_CHANGE":
      let trimmedDisplayName = action.payload.trimStart().trimEnd();
      return {
        ...state,
        displayName: action.payload,
        propertyChangeOccurred: true,
        displayNameChanged:
          trimmedDisplayName !== state.props.userInformation.displayName,
        editSaveReady:
          state.formIsValid &&
          (state.firstNameChanged ||
            state.lastNameChanged ||
            state.profilePhotoFile ||
            state.profileURLChanged ||
            (trimmedDisplayName.length >= 5 &&
              trimmedDisplayName.length <= 35 &&
              trimmedDisplayName !== state.props.userInformation.displayName)),
        formIsValid:
          state.profileURL.length >= 5 &&
          state.profileURL.length <= 35 &&
          state.firstName.length <= 35 &&
          state.lastName.length <= 35 &&
          trimmedDisplayName.length >= 5 &&
          trimmedDisplayName.length <= 35,
      };
    case "PROFILE_URL_CHANGE":
      let trimmedProfileURL = action.payload.trimStart().trimEnd();
      return {
        ...state,
        profileURL: trimmedProfileURL,
        propertyChangeOccurred: true,
        profileURLChanged:
          trimmedProfileURL !== state.props.userInformation.profileURL,
        editSaveReady:
          state.formIsValid &&
          (state.firstNameChanged ||
            state.lastNameChanged ||
            state.displayNameChanged ||
            state.profilePhotoFile ||
            (trimmedProfileURL.length >= 5 &&
              trimmedProfileURL.length <= 35 &&
              trimmedProfileURL !== state.props.userInformation.profileURL)),
        formIsValid:
          state.displayName.length >= 5 &&
          state.displayName.length <= 35 &&
          state.firstName.length <= 35 &&
          state.lastName.length <= 35 &&
          trimmedProfileURL.length >= 5 &&
          trimmedProfileURL.length <= 35,
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
    firstNameChanged: false,
    lastNameChanged: false,
    props: props,
  };
  const [editProfileState, dispatchEditProfileState] = useReducer(
    editProfileOverlayReducer,
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
  const {
    updateDocument: updateUserDocument,
    response: firestoreUserResponse,
  } = useFirestore("users");
  const {
    updateMultipleDocuments: updateSongDocuments,
    response: firestoreSongsResponse,
  } = useFirestore("music");
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

  const handleProfileUpdate = () => {
    let newValues = {
      firstName: firstName.trimStart().trimEnd(),
      lastName: lastName.trimStart().trimEnd(),
      displayName: displayName.trimStart().trimEnd(),
      profileURL: profileURL,
    };
    if (editSaveReady) {
      updateUserDocument(user.uid, newValues);
      if (displayNameChanged) {
        let newArtistName = { artist: displayName.trimStart().trimEnd() };
        updateSongDocuments("userID", user.uid, newArtistName);
      }
    }
  };

  useEffect(() => {
    if (
      cloudStorageResponse.success ||
      (profilePhotoFile === null && firestoreUserResponse.success)
    ) {
      props.onConfirm();
    }
  }, [
    cloudStorageResponse,
    firestoreUserResponse.success,
    profilePhotoFile,
    props,
  ]);

  useEffect(() => {
    //If the fireStore document is succesfully uploaded we need to upload the file to cloud storage
    if (
      firestoreUserResponse.success &&
      !cloudStorageResponse.isPending &&
      !cloudStorageResponse.success &&
      profilePhotoFile !== null
    ) {
      //If the song previously didn't have a photo
      if (props.userInformation.profilePhotoURL === "") {
        addFile(
          firestoreUserResponse.document,
          "/images",
          user,
          profilePhotoFile,
          "profilePhoto"
        );
      } else {
        //If the song previously had a photo
        replaceFile(
          firestoreUserResponse.document,
          props.userInformation.profilePhotoURL,
          profilePhotoFile,
          "profilePhoto"
        );
      }
      // Call to useCloudStorage to add song file
      console.log(firestoreUserResponse.document);
    }
  }, [
    firestoreUserResponse,
    cloudStorageResponse,
    replaceFile,
    addFile,
    user,
    profilePhotoFile,
    props.userInformation.profilePhotoFilePath,
    props.userInformation.profilePhotoURL,
  ]);

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
              <button onClick={handleProfileUpdate} disabled={!editSaveReady}>
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
