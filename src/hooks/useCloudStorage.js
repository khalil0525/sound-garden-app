import { useEffect, useReducer, useState, useRef } from "react";
import { projectStorage } from "../firebase/config";
import { useFirestore } from "./useFirestore";
import { useAuthContext } from "./useAuthContext";
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

    case "ADDED_FILE":
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
        document: null,
        success: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export const useCloudStorage = (path) => {
  //We are using "initialState" because we don't need to make a new copy of the state every time the hook is used.
  const [response, dispatch] = useReducer(cloudStorageReducer, initialState);
  //This state is used to cancel updating local state when the component that uses this hook is unmounted.
  const [isCancelled, setIsCancelled] = useState(false);
  //This state is used to hold the progress of the upload
  const [uploadProgress, setUploadProgress] = useState();
  const { user } = useAuthContext();
  //Essentially, useRef is like a “box” that can hold a mutable value in its .current property
  //We want to cancel the upload if a user navigates away from page and state updates won't work due to the
  //Fact that the current state snapshot isn't always the most update. useRef.current will ALWAYS be up to date
  // And since it's a variable on the same level of our useEffect we can use it to cancel the upload when we navigate away
  const addedFileRef = useRef();
  //This about using a ternary for this?..... path === "songs/" ? 'music' : 'images
  //Our fireStore hook so we can add the data we need from our uploads to it.
  const {
    addDocument,
    deleteDocument,
    response: firestoreResponse,
  } = useFirestore(path === "songs/" ? "music" : "images");
  // this is a reference to the Cloud Storage folder we want to perform something on.
  // const ref = projectStorage.ref(path);

  // only dispatch if not cancelled
  const dispatchIfNotCancelled = (action) => {
    if (!isCancelled) {
      dispatch(action);
    }
  };

  // add a file to the cloud storage
  const addFile = (file, songDetails) => {
    const fileRef = projectStorage.ref(path + user.uid + "/" + file.name);

    //We can use await because it exepects an object back. When we use .on to

    console.log(path + file.name);

    //If we navigate away from the page then we still upload the song. We need to find some way to prevent this. This happens in both of these methods.
    //There are ways to monitor the task.

    // ALL FUNCTIONS IN FIRE BASE ARE ASYNCHRONOUS. This is why we can run fileRef.put without making this function ASYNC or using await!!
    // Await will prevent the try block from moving on until it gets the promise back from fileRef.put which is an UploadTask.

    //Firebase APIs are sensitive to the performance of your app’s main thread. This means that any Firebase API that needs to deal with data on disk or network
    //is implemented in an asynchronous style. The functions will return immediately, so you can call them on the main thread without worrying about performance.
    ///All you have to do is implement callbacks using the patterns established in the documentation and samples.

    // dispatch({ type: "IS_PENDING" });
    //If we use this we must add async back to function declaration
    // try {
    //   const addedFile = await fileRef.put(file);
    //   dispatchIfNotCancelled({
    //     type: "ADDED_FILE",
    //     payload: addedFile,
    //   });
    // } catch (err) {
    //   dispatchIfNotCancelled({ type: "ERROR", payload: err.message });
    // }

    addedFileRef.current = fileRef.put(file);

    console.log(addedFileRef);

    addedFileRef.current.on(
      "state_changed",
      (snapshot) => {
        dispatch({ type: "IS_PENDING" });

        setUploadProgress(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        console.log(uploadProgress, isCancelled);
      },
      //callback for error on upload
      (error) => {
        dispatchIfNotCancelled({ type: "ERROR", payload: error.message });
      },
      //Callback for completed upload
      () => {
        addedFileRef.current.snapshot.ref
          .getDownloadURL()
          .then((downloadURL) => {
            //Need another ternary or if statement here so we can reuse this hook for songs AND images.

            addDocument({
              artist: songDetails.artistName,
              genre: songDetails.genreType,
              title: songDetails.songName,
              URL: downloadURL,
              uid: user.uid,
            });
            console.log("File URL:", downloadURL);
          });
        //
        dispatchIfNotCancelled({
          type: "ADDED_FILE",
          payload: addedFileRef.current,
        });
      }
    );

    console.log("were uploading at the moment but this still ran");
  };
  // delete a song
  const deleteFile = (id) => {};

  //This will fire when the component that is using this hook unmounts,it'll make sure we aren't changing local state
  // on a componenent that already had unmounted because this will cause an error.
  //If we are performing some action in this hook and we navigate away from the page then we don't want to update state
  useEffect(() => {
    return () => {
      console.log("CLEAN UP");
      //Don't need to wrap with if because this has no effect on a complete or failed task.
      //This will cancel the upload if it is running when we leave the page
      if (addedFileRef.current) {
        addedFileRef.current.cancel();
      }

      setIsCancelled(true);
    };
  }, []);

  return { addFile, deleteFile, response, uploadProgress };
};
