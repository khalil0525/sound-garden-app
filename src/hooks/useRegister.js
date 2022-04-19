import { useState, useEffect } from "react";
import { projectAuth } from "../firebase/config";
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
      console.log(res.user);

      if (!res) {
        throw new Error("Could not complete signup");
      }

      // add display name to user
      await res.user.updateProfile({ displayName });
      // dispatch login action
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
