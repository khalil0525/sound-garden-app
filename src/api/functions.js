import { getFunctions, httpsCallable } from 'firebase/functions';

const functions = getFunctions();

export const unfollowUser = httpsCallable(functions, 'unfollowUser');

export const removeLike = httpsCallable(functions, 'removeLike');

export const getUserProfile = httpsCallable(functions, 'getUserProfile');

export const getSongs = httpsCallable(functions, 'getSongs');
export const followUser = httpsCallable(functions, 'followUser');

export const addLike = httpsCallable(functions, 'addLike');
export const getSong = httpsCallable(functions, 'getSong');
export const getPlaylist = httpsCallable(functions, 'getPlaylist');
export const getPlaylists = httpsCallable(functions, 'getPlaylists');
export const addSongToPlaylist = httpsCallable(functions, 'addSongToPlaylist');
export const removeSongFromPlaylist = httpsCallable(
  functions,
  'removeSongFromPlaylist'
);
export const authorizePlay = httpsCallable(functions, 'authorizePlay');
