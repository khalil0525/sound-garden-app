import { useState } from "react";
import { projectAuth } from "../firebase/config";

export const useRegister = () => {
  // Error state so that we can displaye error messages on form
  const [error, setError] = useState(null);
  // Pending state so that we can know when the when an action is being performed
  // This is used to change the button in our app so that a user cannot
  // Click registed multiple times
  const [isPending, setIsPending] = useState(false);
  // Async function that trys to register a user, if registration is unsuccessful
  // It throws an error
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

      setIsPending(false);
      setError(null);
    } catch (err) {
      console.log(err.message);
      setError(err.message);
      setIsPending(false);
    }
  };

  return { register, error, isPending };
};
