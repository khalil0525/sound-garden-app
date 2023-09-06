import { useState, useEffect } from "react";
import { projectAuth, projectFirestore, timestamp } from "../firebase/config";
import { v4 as uuidv4 } from "uuid";
import { useAuthContext } from "./useAuthContext";
export const useRegister = () => {
  const [isCancelled, setIsCancelled] = useState(false);
  // Error state so that we can displaye error messages on form
  const [error, setError] = useState(null);
  // Pending state so that we can know when the when an action is being performed
  // This is used to change the button in our app so that a user cannot
  // Click registed multiple times
  const [isPending, setIsPending] = useState(false);
  // Async function that trys to register a user, if registration is unsuccessful
  // It throws an error
  const { dispatch } = useAuthContext();

  const register = async (email, password, displayName) => {
    setError(null);
    setIsPending(true);

    try {
      //register user
      const res = await projectAuth.createUserWithEmailAndPassword(
        email,
        password
      );

      if (!res) {
        throw new Error("Could not complete signup");
      }

      // add display name to user
      await res.user.updateProfile({ displayName });
      // add a record in firestore to store users displayName and unique profile link
      const createdAt = timestamp.fromDate(new Date());
      await projectFirestore.collection("users").doc(res.user.uid).set({
        displayName,
        createdAt,
        userID: res.user.uid,
        firstName: "",
        lastName: "",
        profilePhotoURL: "",
        profilePhotoFilePath: "",
      });

      //Generate random profile link with UUID
      const genProfile = `user-${uuidv4().slice(0, 13)}`;
      // Update the users document with its randomly generated profile link
      await projectFirestore.collection("users").doc(res.user.uid).update({
        profileURL: genProfile,
      });
      // Create a liked tracks collection for this users
      await projectFirestore
        .collection("likes")
        .doc(res.user.uid)
        .set({ createdAt, likes: [] });

      //dispatch login action
      dispatch({ type: "LOGIN", payload: res.user });
      //update state
      if (!isCancelled) {
        setIsPending(false);
        setError(null);
      }
    } catch (err) {
      if (!isCancelled) {
        console.log(err.message);
        setError(err.message);
        setIsPending(false);
      }
    }
  };
  //Cleanup function
  //This will fire when the component that is using this hook unmounts,it'll make sure we aren't changing local state
  // on a componenent that already had unmounted because this will cause an error.
  //If we are performing some action in this hook and we navigate away from the page then we don't want to update state

  useEffect(() => {
    return () => setIsCancelled(true);
  }, []);

  return { register, error, isPending };
};
