import { useEffect, useState } from 'react';
import { useAuthContext } from './useAuthContext';
import {
  projectAuth,
  GoogleAuthProvider,
  signInWithPopup,
  projectFirestore,
  timestamp,
  getAdditionalUserInfo,
} from '../firebase/config';
import { v4 as uuidv4 } from 'uuid';

export const useLogin = () => {
  const [isCancelled, setIsCancelled] = useState(false);
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const { dispatch } = useAuthContext();

  const login = async (email, password) => {
    setError(null);
    setIsPending(true);

    try {
      const res = await projectAuth.signInWithEmailAndPassword(email, password);
      dispatch({ type: 'LOGIN', payload: res.user });
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

  const signInWithGoogle = async () => {
    setError(null);
    setIsPending(true);
    try {
      const result = await signInWithPopup(
        projectAuth,
        new GoogleAuthProvider()
      );

      const isFirstLogin = getAdditionalUserInfo(result).isNewUser;

      if (isFirstLogin) {
        // Generate random display name for new users
        const displayName = `User${Math.floor(Math.random() * 100000)}`;

        // Use projectAuth.currentUser instead of result.user
        await projectAuth.currentUser.updateProfile({ displayName });

        // User document does not exist, create it
        const createdAt = timestamp.fromDate(new Date());

        await projectFirestore
          .collection('users')
          .doc(projectAuth.currentUser.uid)
          .set({
            displayName,
            createdAt,
            userID: result.user.uid,
            firstName: '',
            lastName: '',
            profilePhotoURL: '',
            profilePhotoFilePath: '',
          });
        const genProfile = `user-${uuidv4().slice(0, 13)}`;
        await projectFirestore
          .collection('users')
          .doc(projectAuth.currentUser.uid)
          .update({
            profileURL: genProfile,
          });

        dispatch({ type: 'LOGIN', payload: projectAuth.currentUser });
        if (!isCancelled) {
          setIsPending(false);
          setError(null);
        }
      }
      return dispatch({ type: 'LOGIN', payload: projectAuth.currentUser });
    } catch (err) {
      if (!isCancelled) {
        console.log(err.message);
        setError(err.message);
        setIsPending(false);
      }
    }
  };

  useEffect(() => {
    return () => setIsCancelled(true);
  }, []);

  return { login, error, isPending, signInWithGoogle };
};
