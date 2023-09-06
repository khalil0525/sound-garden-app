import { useEffect, useReducer, useState, useRef } from "react";
import { projectStorage } from "../firebase/config";
// import { useFirestore } from "./useFirestore";
// import { useAuthContext } from "./useAuthContext";
//Initial state object for our reducer. Since we aren't holding on to the old values/updating them we do this

let initialState = {
  file: null,
  isPending: false,
  error: null,
  success: null,
};
//This reducer combines all of the states that we use in our other custom hooks and new ones.
const cloudStorageReducer = (state, action) => {
  switch (action.type) {
    case "IS_PENDING":
      return {
        ...state,
        isPending: true,
        file: null,
        success: false,
        error: null,
      };

    case "ADDED_FILES":
      return {
        ...state,
        isPending: false,
        file: action.payload,
        success: true,
        error: null,
      };
    case "ADDED_FILE":
      return {
        ...state,
        isPending: false,
        file: action.payload,
        success: true,
        error: null,
      };
    case "DELETED_FILES":
      return {
        ...state,
        isPending: false,
        success: true,
        error: null,
      };
    case "DELETED_FILE":
      return {
        ...state,
        isPending: false,
        file: action.payload,
        success: true,
        error: null,
      };
    case "REPLACED_FILE":
      return {
        ...state,
        isPending: false,
        file: action.payload,
        success: true,
        error: null,
      };

    case "ERROR":
      return {
        isPending: false,
        file: null,
        success: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export const useCloudStorage = () => {
  //We are using "initialState" because we don't need to make a new copy of the state every time the hook is used.
  const [response, dispatch] = useReducer(cloudStorageReducer, initialState);
  //This state is used to cancel updating local state when the component that uses this hook is unmounted.
  const [isCancelled, setIsCancelled] = useState(false);
  //This state is used to hold the progress of the upload
  const [uploadProgress, setUploadProgress] = useState();

  //Essentially, useRef is like a “box” that can hold a mutable value in its .current property
  //We want to cancel the upload if a user navigates away from page and state updates won't work due to the
  //Fact that the current state snapshot isn't always the most update. useRef.current will ALWAYS be up to date
  // And since it's a variable on the same level of our useEffect we can use it to cancel the upload when we navigate away
  const addedSongFileRef = useRef();
  const dispatchIfNotCancelled = (action) => {
    if (!isCancelled) {
      dispatch(action);
    }
  };
  // add song file to the cloud storage
  const addSongFiles = async (fireStoreDocRef, user, files) => {
    //Create the song file path from the information we received
    dispatch({ type: "IS_PENDING" });
    const songPath =
      "songs/" + user.uid + "/" + fireStoreDocRef.id + "_" + files[0].name;

    // Create a variable to hold the photo upload result, if we have one

    let photoPath, photoURL;
    // Here we try to add the photo file to the cloud storage first before we add the song.
    if (files[1]) {
      photoPath =
        "images/" + user.uid + "/" + fireStoreDocRef.id + "_" + files[1].name;
      try {
        const photoPathRef = projectStorage.ref(photoPath);
        let photoUploadRes = await photoPathRef.put(files[1]);
        photoURL = await photoUploadRes.ref.getDownloadURL();
      } catch (error) {
        console.log("Photo upload error: ", error);
        dispatchIfNotCancelled({ type: "ERROR", payload: error.message });
      }
    }

    const songFileRef = projectStorage.ref(songPath);
    addedSongFileRef.current = songFileRef.put(files[0]);

    const unsubscribe = addedSongFileRef.current.on(
      "state_changed",
      (snapshot) => {
        // dispatch({ type: "IS_PENDING" });

        setUploadProgress(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
      },
      //callback for error on upload
      (error) => {
        dispatchIfNotCancelled({ type: "ERROR", payload: error.message });
      },
      //Callback for completed upload
      () => {
        addedSongFileRef.current.snapshot.ref
          .getDownloadURL()
          .then((downloadURL) => {
            //Need another ternary or if statement here so we can reuse this hook for songs AND images.
            //Update the URL to the song URL in the cloud storage and the filePath to it's location.
            fireStoreDocRef.update({
              songURL: downloadURL,
              songFilePath: songPath,
              songPhotoURL: files[1] ? photoURL : "",
              songPhotoFilePath: files[1] ? photoPath : "",
            });
          });
        dispatchIfNotCancelled({
          type: "ADDED_FILES",
          payload: addedSongFileRef.current,
        });
        unsubscribe();
      }
    );
  };

  const deleteSongFiles = async (songInformation) => {
    const { songFilePath, songPhotoFilePath } = songInformation;
    dispatch({ type: "IS_PENDING" });
    try {
      const refToDeleteSong = projectStorage.ref(songFilePath);
      await refToDeleteSong.delete();
      if (songPhotoFilePath !== "") {
        const refToDeleteSongPhoto = projectStorage.ref(songPhotoFilePath);
        await refToDeleteSongPhoto.delete();
      }

      // const deletedFile = await projectStorage
      //   .ref(songFilePath)
      //   .delete()
      //   .then(() => {
      //     if (songPhotoFilePath !== "") {
      //       projectStorage
      //         .ref(songPhotoFilePath)
      //         .delete()
      //         .then(() => {
      //           console.log("Deleted song file and song art file");
      //         })
      //         .catch((error) => {
      //           console.log("Error deleting photo!:  ", error);
      //           dispatchIfNotCancelled({
      //             type: "ERROR",
      //             payload: error.message,
      //           });
      //         });
      //     }
      //   });
      // console.log("DELETE COMPLETED");
      dispatchIfNotCancelled({ type: "DELETED_FILES" });
    } catch (error) {
      console.log("Error deleting song file!!:  ", error);
      dispatchIfNotCancelled({ type: "ERROR", payload: error.message });
    }
  };
  const addFile = async (
    fireStoreDocRef,
    collection,
    user,
    newFile,
    newFilePropertyName
  ) => {
    dispatch({ type: "IS_PENDING" });

    try {
      const newFilePath =
        collection +
        "/" +
        user.uid +
        "/" +
        fireStoreDocRef.id +
        "_" +
        newFile.name;
      const fileRef = projectStorage.ref(newFilePath);
      const addedFile = await fileRef.put(newFile);
      const downloadURL = await addedFile.ref.getDownloadURL();
      let newFilePathVariableName = `${newFilePropertyName}FilePath`;
      let newFileURLVariableName = `${newFilePropertyName}URL`;
      await fireStoreDocRef.update({
        [newFilePathVariableName]: newFilePath,
        [newFileURLVariableName]: downloadURL,
      });
      if (newFilePropertyName === "profilePhoto") {
        await user.updateProfile({ photoURL: downloadURL });
      }

      dispatchIfNotCancelled({
        type: "ADDED_FILE",
        payload: addedFile,
      });
    } catch (error) {
      console.log("Error adding file!!:  ", error);
      dispatchIfNotCancelled({ type: "ERROR", payload: error.message });
    }
  };

  const replaceFile = async (
    fireStoreDocRef,
    storageFilePathToDelete,
    newFile,
    newFilePropertyName,
    user
  ) => {
    dispatch({ type: "IS_PENDING" });

    try {
      const newFilePath =
        storageFilePathToDelete.split("_")[0] + "_" + newFile.name;
      const fileToDeleteRef = projectStorage.ref(storageFilePathToDelete);
      await fileToDeleteRef.delete();
      const newFileRef = projectStorage.ref(newFilePath);
      const addedFile = await newFileRef.put(newFile);

      const downloadURL = await addedFile.ref.getDownloadURL();
      let newFilePathVariableName = `${newFilePropertyName}FilePath`;
      let newFileURLVariableName = `${newFilePropertyName}URL`;
      await fireStoreDocRef.update({
        [newFilePathVariableName]: newFilePath,
        [newFileURLVariableName]: downloadURL,
      });
      if (newFilePropertyName === "profilePhoto") {
        await user.updateProfile({ photoURL: downloadURL });
      }

      dispatchIfNotCancelled({
        type: "REPLACED_FILE",
        payload: addedFile,
      });
    } catch (error) {
      console.log("Error replacing song file!!:  ", error);
      dispatchIfNotCancelled({ type: "ERROR", payload: error.message });
    }
  };
  // delete a song or photo...
  // We can obtain the storageFilePath from its database entry
  // We can delete a whole song + it's photo or delete a photo after we change it on a song
  const deleteFile = async (storageFilePath) => {
    dispatch({ type: "IS_PENDING" });
    try {
      const deletedFile = await projectStorage.ref(storageFilePath).delete();

      dispatchIfNotCancelled({ type: "DELETED_FILE", payload: deletedFile });
    } catch (error) {
      console.log("Error deleting song file!!:  ", error);
      dispatchIfNotCancelled({ type: "ERROR", payload: error.message });
    }
  };

  //This will fire when the component that is using this hook unmounts,it'll make sure we aren't changing local state
  // on a componenent that already had unmounted because this will cause an error.
  //If we are performing some action in this hook and we navigate away from the page then we don't want to update state
  useEffect(() => {
    return () => {
      //Don't need to wrap with if because this has no effect on a complete or failed task.
      //This will cancel the upload if it is running when we leave the page
      if (addedSongFileRef.current) {
        addedSongFileRef.current.cancel();
      }

      setIsCancelled(true);
    };
  }, []);

  return {
    addSongFiles,
    addFile,
    deleteFile,
    deleteSongFiles,
    replaceFile,
    response,
    uploadProgress,
  };
};
