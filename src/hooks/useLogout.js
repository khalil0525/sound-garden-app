import { useEffect, useState } from "react";
import { projectAuth } from "../firebase/config";
import { useAuthContext } from "./useAuthContext";

export const useLogout = () => {
  const [isCancelled, setIsCancelled] = useState(false);
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const { dispatch } = useAuthContext();

  const logout = async () => {
    setError(null);
    setIsPending(true);

    // sign the user out

    try {
      await projectAuth.signOut();
      // dispatch the logout action
      dispatch({ type: "LOGOUT" });
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
  return { logout, error, isPending };
};
