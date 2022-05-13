import { useEffect, useReducer, useState } from "react";
import { projectFirestore, timestamp } from "../firebase/config";

//Initial state object for our reducer. Since we aren't holding on to the old values/updating them we do this

let initialState = {
  document: null,
  isPending: false,
  error: null,
  success: null,
};

//This reducer combines all of the states that we use in our other custom hooks and new ones.
const firestoreReducer = (state, action) => {
  switch (action.type) {
    case "IS_PENDING":
      return {
        ...state,
        isPending: true,
        document: null,
        success: false,
        error: null,
      };

    case "ADDED_DOCUMENT":
      return {
        ...state,
        isPending: false,
        document: action.payload,
        success: true,
        error: null,
      };
    case "RETRIEVED_DOCUMENT":
      return {
        ...state,
        isPending: false,
        document: action.payload,
        success: true,
        error: null,
      };
    case "DELETED_DOCUMENT":
      return {
        ...state,
        isPending: false,
        document: action.payload,
        success: true,
        error: null,
      };
    case "UPDATED_DOCUMENT":
      return {
        ...state,
        isPending: false,
        document: action.payload,
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

export const useFirestore = (collection) => {
  //We are using "initialState" because we don't need to make a new copy of the state every time the hook is used.
  const [response, dispatch] = useReducer(firestoreReducer, initialState);
  //This state is used to cancel updating local state when the component that uses this hook is unmounted.
  const [isCancelled, setIsCancelled] = useState(false);
  // collection ref, this is a reference to the firestore collection we want to perform something on.
  const ref = projectFirestore.collection(collection);

  // only dispatch if not cancelled
  const dispatchIfNotCancelled = (action) => {
    if (!isCancelled) {
      dispatch(action);
    }
  };

  // add a document
  const addDocument = async (doc) => {
    dispatch({ type: "IS_PENDING" });

    try {
      // This is a special data type that we will pass to firebase so that we can give our document
      // A timestamp that shows when it was created. This will help us with ordering them later.
      const createdAt = timestamp.fromDate(new Date());
      // This will return to us a document reference for the document we just added
      const addedDocument = await ref.add({ ...doc, createdAt });
      // Add the documentID to the document
      await addedDocument.update({ docID: addedDocument.id });
      dispatchIfNotCancelled({
        type: "ADDED_DOCUMENT",
        payload: addedDocument,
      });
    } catch (err) {
      dispatchIfNotCancelled({ type: "ERROR", payload: err.message });
    }
  };

  // delete a document
  const deleteDocument = async (id) => {
    dispatch({ type: "IS_PENDING" });

    try {
      const deletedDocument = await ref.doc(id).delete();
      dispatchIfNotCancelled({
        type: "DELETED_DOCUMENT",
        payload: deletedDocument,
      });
    } catch (err) {
      dispatchIfNotCancelled({ type: "ERROR", payload: "could not delete" });
    }
  };
  const getDocument = async (id) => {
    dispatch({ type: "IS_PENDING" });
    try {
      const retrievedDocument = await ref.doc(id).get();
      dispatchIfNotCancelled({
        type: "RETRIEVED_DOCUMENT",
        payload: retrievedDocument.data(),
      });
    } catch (err) {
      dispatchIfNotCancelled({ type: "ERROR", payload: "could not retrieve" });
    }
  };

  const updateDocument = async (id, newValues) => {
    dispatch({ type: "IS_PENDING" });

    try {
      const updatedDocumentRef = await ref.doc(id);
      const updateDocument = updatedDocumentRef.update({ ...newValues });
      dispatchIfNotCancelled({
        type: "UPDATED_DOCUMENT",
        payload: updatedDocumentRef,
      });
    } catch (err) {
      dispatchIfNotCancelled({ type: "ERROR", payload: "could not update" });
    }
  };
  //This will fire when the component that is using this hook unmounts,it'll make sure we aren't changing local state
  // on a componenent that already had unmounted because this will cause an error.
  //If we are performing some action in this hook and we navigate away from the page then we don't want to update state
  useEffect(() => {
    return () => {
      setIsCancelled(true);
    };
  }, []);

  return { addDocument, getDocument, deleteDocument, updateDocument, response };
};
