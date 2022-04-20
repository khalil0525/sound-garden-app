import { useEffect, useReducer, useState } from "react";
import { projectStorage } from "../firebase/config";

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
  const [isCancelled, setIsCancelled] = useState();

  // collection ref, this is a reference to the Cloud Storage folder we want to perform something on.
  const ref = projectStorage.ref(path);

  // only dispatch if not cancelled
  const dispatchIfNotCancelled = (action) => {
    if (!isCancelled) {
      dispatch(action);
    }
  };

  // add a document
  const addFile = async (file) => {
    let fileRef = projectStorage.ref(path + file.name);

    console.log(path + file.name);

    dispatch({ type: "IS_PENDING" });

    try {
      const addedFile = await fileRef.put(file);
      dispatchIfNotCancelled({
        type: "ADDED_FILE",
        payload: addedFile,
      });
    } catch (err) {
      dispatchIfNotCancelled({ type: "ERROR", payload: err.message });
    }
  };
  // delete a song
  const deleteFile = (id) => {};

  //This will fire when the component that is using this hook unmounts,it'll make sure we aren't changing local state
  // on a componenent that already had unmounted because this will cause an error.
  //If we are performing some action in this hook and we navigate away from the page then we don't want to update state
  useEffect(() => {
    return () => {
      setIsCancelled(true);
    };
  }, []);

  return { addFile, deleteFile, response };
};
