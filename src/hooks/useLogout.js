import { useEffect, useState } from 'react';
import { projectAuth } from '../firebase/config';
import { useAuthContext } from './useAuthContext';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from '../context/SnackbarContext';

export const useLogout = () => {
  const { showSuccessSnackbar, showErrorSnackbar } = useSnackbar();

  const [isCancelled, setIsCancelled] = useState(false);
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const { dispatch } = useAuthContext();
  const navigate = useNavigate();
  const logout = async () => {
    setError(null);
    setIsPending(true);

    // sign the user out

    try {
      await projectAuth.signOut();
      // dispatch the logout action
      dispatch({ type: 'LOGOUT' });
      navigate('/');

      //update state
      if (!isCancelled) {
        showSuccessSnackbar('Successfully logged out!');
        setIsPending(false);
        setError(null);
      }
    } catch (err) {
      if (!isCancelled) {
        console.log(err.message);
        setError(err.message);
        showErrorSnackbar(err.message);
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
