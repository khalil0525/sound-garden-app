import React, { useEffect, useRef, useReducer } from "react";
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
        editSaveReady:
          state.firstNameValid &&
          state.lastNameValid &&
          state.displayNameValid &&
          state.profileURLValid,
      };
    case "FIRST_NAME_CHANGE":
      let trimmedFirstName = action.payload.trimStart().trimEnd();
      return {
        ...state,
        firstName: action.payload,
        propertyChangeOccurred: true,
        firstNameChanged:
          trimmedFirstName !== state.props.userInformation.firstName,
        firstNameValid: trimmedFirstName.length <= 35,
        editSaveReady:
          (state.lastNameChanged ||
            state.displayNameChanged ||
            state.profilePhotoFile ||
            state.profileURLChanged ||
            trimmedFirstName !== state.props.userInformation.firstName) &&
          trimmedFirstName.length <= 35 &&
          state.lastNameValid &&
          state.displayNameValid &&
          state.profileURLValid,
      };
    case "LAST_NAME_CHANGE":
      let trimmedLastName = action.payload.trimStart().trimEnd();
      return {
        ...state,
        lastName: action.payload,
        propertyChangeOccurred: true,
        lastNameChanged:
          trimmedLastName !== state.props.userInformation.lastName,
        lastNameValid: trimmedLastName.length <= 35,
        editSaveReady:
          (state.firstNameChanged ||
            state.displayNameChanged ||
            state.profilePhotoFile ||
            state.profileURLChanged ||
            trimmedLastName !== state.props.userInformation.lastName) &&
          trimmedLastName.length <= 35 &&
          state.firstNameValid &&
          state.displayNameValid &&
          state.profileURLValid,
      };
    case "DISPLAY_NAME_CHANGE":
      let trimmedDisplayName = action.payload.trimStart().trimEnd();
      return {
        ...state,
        displayName: action.payload,
        propertyChangeOccurred: true,
        displayNameChanged:
          trimmedDisplayName !== state.props.userInformation.displayName,
        displayNameValid:
          trimmedDisplayName.length >= 1 && trimmedDisplayName.length <= 48,
        editSaveReady:
          (state.firstNameChanged ||
            state.lastNameChanged ||
            state.profilePhotoFile ||
            state.profileURLChanged ||
            trimmedDisplayName !== state.props.userInformation.displayName) &&
          trimmedDisplayName.length >= 1 &&
          trimmedDisplayName.length <= 48 &&
          state.lastNameValid &&
          state.firstNameValid &&
          state.profileURLValid,
      };
    case "PROFILE_URL_CHANGE":
      let trimmedProfileURL = action.payload.trimStart().trimEnd();
      return {
        ...state,
        profileURL: trimmedProfileURL,
        propertyChangeOccurred: true,
        profileURLChanged:
          trimmedProfileURL !== state.props.userInformation.profileURL,
        profileURLValid:
          trimmedProfileURL.length >= 5 && trimmedProfileURL.length <= 35,
        editSaveReady:
          (state.firstNameChanged ||
            state.lastNameChanged ||
            state.profilePhotoFile ||
            state.displayNameChanged ||
            trimmedProfileURL !== state.props.userInformation.profileURL) &&
          trimmedProfileURL.length >= 5 &&
          trimmedProfileURL.length <= 35 &&
          state.lastNameValid &&
          state.firstNameValid &&
          state.displayNameValid,
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
    profileURLValid: true,
    displayNameValid: true,
    firstNameValid: true,
    lastNameValid: true,
    props: props,
  };
  const [editProfileState, dispatchEditProfileState] = useReducer(
    editProfileOverlayReducer,
    initialState
  );
  // This is for the error text that shows up under the profileURL change box
  const previouslyTriedProfileURL = useRef();
  const {
    firstName,
    lastName,
    displayName,
    profileURL,
    profilePhotoFileURL,
    profilePhotoFile,
    profileURLChanged,
    firstNameChanged,
    lastNameChanged,
    displayNameChanged,
    profileURLValid,
    firstNameValid,
    lastNameValid,
    displayNameValid,
    editSaveReady,
  } = editProfileState;
  const profileURLCurrent = useRef(profileURL);
  profileURLCurrent.current = profileURL;
  const { user, dispatch: dispatchToAuthContext } = useAuthContext();
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
  // const {
  //   updateMultipleDocuments: updateSongDocuments,
  //   response: firestoreSongsResponse,
  // } = useFirestore("music");
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
      user.updateProfile({ displayName: newValues.displayName });
      updateUserDocument(user.uid, newValues);
    }
  };

  // This handles changing a variable that controls the error message if a user
  // Enters a profile URL that is already in use.
  useEffect(() => {
    if (
      firestoreUserResponse.success === false &&
      previouslyTriedProfileURL.current !== profileURLCurrent.current
    ) {
      console.log("changed current");
      previouslyTriedProfileURL.current = profileURLCurrent.current;
    }
    console.log(firestoreUserResponse.success);
  }, [firestoreUserResponse.success]);

  // This useEffect handles changing the artist name on all of a users songs when they change their display name
  // useEffect(() => {
  //   if (
  //     displayNameChanged &&
  //     firestoreUserResponse.success &&
  //     !firestoreSongsResponse.success &&
  //     !firestoreSongsResponse.isPending
  //   ) {
  //     let newArtistName = { artist: displayName.trimStart().trimEnd() };
  //     updateSongDocuments("userID", user.uid, newArtistName);
  //   }
  // }, [
  //   displayNameChanged,
  //   updateSongDocuments,
  //   displayName,
  //   user.uid,
  //   firestoreUserResponse.success,
  //   firestoreSongsResponse.success,
  //   firestoreSongsResponse.isPending,
  // ]);
  // This handles exiting the change menu when everything has successfully completed
  // if (
  //   (displayNameChanged &&
  //     profilePhotoFile === null &&
  //     firestoreSongsResponse.success &&
  //     firestoreUserResponse.success) ||
  //   (!displayNameChanged &&
  //     profilePhotoFile === null &&
  //     firestoreUserResponse.success) ||
  //   (displayNameChanged &&
  //     profilePhotoFile !== null &&
  //     firestoreSongsResponse.success &&
  //     firestoreUserResponse.success &&
  //     cloudStorageResponse.success) ||
  //   (!displayNameChanged &&
  //     profilePhotoFile !== null &&
  //     firestoreUserResponse.success &&
  //     cloudStorageResponse.success)
  useEffect(() => {
    if (
      (profilePhotoFile === null && firestoreUserResponse.success) ||
      (!displayNameChanged &&
        profilePhotoFile === null &&
        firestoreUserResponse.success) ||
      (profilePhotoFile !== null &&
        firestoreUserResponse.success &&
        cloudStorageResponse.success) ||
      (!displayNameChanged &&
        profilePhotoFile !== null &&
        firestoreUserResponse.success &&
        cloudStorageResponse.success)
    ) {
      dispatchToAuthContext({ type: "REFRESH_AUTH_INFORMATION" });
      props.onConfirm();
    }
  }, [
    cloudStorageResponse,
    firestoreUserResponse.success,
    displayNameChanged,
    // firestoreSongsResponse.success,
    profilePhotoFile,
    props,
    dispatchToAuthContext,
  ]);

  // This handles uploading a users photo to the cloud storage
  useEffect(() => {
    //If the fireStore document is succesfully uploaded we need to upload the file to cloud storage
    // if (
    //   (!displayNameChanged &&
    //     profilePhotoFile !== null &&
    //     firestoreUserResponse.success &&
    //     !cloudStorageResponse.isPending &&
    //     !cloudStorageResponse.success) ||
    //   (displayNameChanged &&
    //     profilePhotoFile !== null &&
    //     firestoreUserResponse.success &&
    //     firestoreSongsResponse.success &&
    //     !cloudStorageResponse.isPending &&
    //     !cloudStorageResponse.success)
    // ) {
    if (
      (!displayNameChanged &&
        profilePhotoFile !== null &&
        firestoreUserResponse.success &&
        !cloudStorageResponse.isPending &&
        !cloudStorageResponse.success) ||
      (profilePhotoFile !== null &&
        firestoreUserResponse.success &&
        !cloudStorageResponse.isPending &&
        !cloudStorageResponse.success)
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
          props.userInformation.profilePhotoFilePath,
          profilePhotoFile,
          "profilePhoto",
          user
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
    displayNameChanged,
    // firestoreSongsResponse.success,
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
          {displayNameChanged && !displayNameValid ? (
            <p>Your artist name must be shorter than 48 characters! </p>
          ) : null}

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
          {profileURLChanged &&
          previouslyTriedProfileURL.current === profileURL &&
          firestoreUserResponse.success === false &&
          !firestoreUserResponse.isPending ? (
            <p>This profile URL is already in use. Try a different one.</p>
          ) : null}
          {profileURLChanged && !profileURLValid && profileURL.length < 5 ? (
            <p>Your profile URL must be 5 characters or more </p>
          ) : null}
          {profileURLChanged && !profileURLValid && profileURL.length > 35 ? (
            <p>Your profile URL must be 35 characters or less </p>
          ) : null}

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
          {firstNameChanged && !firstNameValid ? (
            <p>Your first name must be shorter than 35 characters! </p>
          ) : null}

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
          {lastNameChanged && !lastNameValid ? (
            <p>Your last name must be shorter than 35 characters! </p>
          ) : null}
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
