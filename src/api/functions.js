import { getFunctions, httpsCallable } from 'firebase/functions';

const functions = getFunctions();

export const unfollowUser = httpsCallable(functions, 'unfollowUser');

export const removeLike = httpsCallable(functions, 'removeLike');

export const getUserProfile = httpsCallable(functions, 'getUserProfile');

export const getSongs = httpsCallable(functions, 'getSongs');
export const followUser = httpsCallable(functions, 'followUser');

export const addLike = httpsCallable(functions, 'addLike');
