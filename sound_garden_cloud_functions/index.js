const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);

exports.onUserUpdate = functions.firestore
  .document('users/{userID}')
  .onUpdate((change, context) => {
    const { before, after } = change;
    const { userID } = context.params;

    const db = admin.firestore();

    if (before.get('profileURL') !== after.get('profileURL')) {
      const batch = db.batch();

      // delete the old profileURL document from the `profileURLS` collection
      if (before.get('profileURL')) {
        // new users may not have a profileURL value
        batch.delete(
          db.collection('profileURLS').doc(before.get('profileURL'))
        );
      }

      // add a new profileURL document
      batch.set(db.collection('profileURLS').doc(after.get('profileURL')), {
        user: db.collection('users').doc(userID),
      });

      return batch.commit();
    }
    return true;
  });

exports.onSongDelete = functions.firestore
  .document('music/{songID}')
  .onDelete((snap, context) => {
    const deletedDocumentID = snap.data().docID;
    const db = admin.firestore();
    const likesCollectionsRef = db.collection('likes');
    const likesQuery = likesCollectionsRef.where(
      'likes',
      'array-contains',
      `${deletedDocumentID}`
    );

    // We return this because when we change documents with cloud functions we must return a promise
    return likesQuery.get().then((querySnapshot) => {
      if (querySnapshot.empty) {
        return null;
      } else {
        const promises = [];
        //let batch = db.batch();
        querySnapshot.forEach((doc) => {
          const filteredLikes = doc
            .data()
            .likes.filter((like) => like !== `${deletedDocumentID}`);
          //batch.update(doc.ref, {likes:filteredLikes});
          promises.push(doc.ref.update({ likes: filteredLikes }));
        });
        return Promise.all(promises);
        //return batch.commit()
      }
    });
  });

exports.onArtistNameChange = functions.firestore
  .document('users/{userID}')
  .onUpdate((change, context) => {
    const { before, after } = change;
    const { userID } = context.params;

    const db = admin.firestore();
    if (before.get('displayName') !== after.get('displayName')) {
      const batch = db.batch();
      const musicCollectionsRef = db.collection('music');
      const musicQuery = musicCollectionsRef.where('userID', '==', `${userID}`);

      // We return this because when we change documents with cloud functions we must return a promise
      return musicQuery.get().then((querySnapshot) => {
        if (querySnapshot.empty) {
          return null;
        } else {
          const promises = [];
          //let batch = db.batch();
          querySnapshot.forEach((doc) => {
            //batch.update(doc.ref, {likes:filteredLikes});
            promises.push(doc.ref.update({ artist: after.get('displayName') }));
          });
          return Promise.all(promises);
          //return batch.commit()
        }
      });
    }
    return true;
  });

exports.createUserDirectories = functions.auth.user().onCreate(async (user) => {
  const db = admin.firestore();
  const userId = user.uid;

  // Create a new user document
  const userRef = db.collection('users').doc(userId);

  // Initialize empty arrays for followers, following, likes, and playlist
  const followers = [];
  const following = [];
  const likes = [];
  const playlist = [];
  const songs = [];
  // Update the user document with the empty arrays
  await userRef.set({
    followers: followers,
    following: following,
    likes: likes,
    playlist: playlist,
    songs: songs,
  });

  console.log(`User directories created for user: ${userId}`);

  return null;
});

exports.followUser = functions.https.onCall(async (data, context) => {
  const { userIdToFollow } = data;
  const followerId = context.auth.uid;

  // Check if the user is trying to follow themselves (optional)
  if (userIdToFollow === followerId) {
    return { success: false, message: 'You cannot follow yourself.' };
  }

  // Get references to the user documents
  const userToFollowRef = admin
    .firestore()
    .collection('users')
    .doc(userIdToFollow);
  const followerRef = admin.firestore().collection('users').doc(followerId);

  try {
    // Check if the user is already following the target user
    const userToFollowSnapshot = await userToFollowRef.get();
    const userToFollowData = userToFollowSnapshot.data();

    if (!userToFollowData) {
      return { success: false, message: 'User to follow does not exist.' };
    }

    // Update the follower's "following" array
    await followerRef.update({
      following: admin.firestore.FieldValue.arrayUnion(userIdToFollow),
    });

    // Update the target user's "followers" array
    await userToFollowRef.update({
      followers: admin.firestore.FieldValue.arrayUnion(followerId),
    });

    return { success: true, message: 'You are now following the user.' };
  } catch (error) {
    return {
      success: false,
      message: 'An error occurred while following the user.',
    };
  }
});

exports.unfollowUser = functions.https.onCall(async (data, context) => {
  const { userIdToUnfollow } = data;
  const followerId = context.auth.uid;

  // Get references to the user documents
  const userToUnfollowRef = admin
    .firestore()
    .collection('users')
    .doc(userIdToUnfollow);
  const followerRef = admin.firestore().collection('users').doc(followerId);

  try {
    // Check if the user is already following the target user
    const userToUnfollowSnapshot = await userToUnfollowRef.get();
    const userToUnfollowData = userToUnfollowSnapshot.data();

    if (!userToUnfollowData) {
      return { success: false, message: 'User to unfollow does not exist.' };
    }

    // Remove the follower's reference from the "following" array
    await followerRef.update({
      following: admin.firestore.FieldValue.arrayRemove(userIdToUnfollow),
    });

    // Remove the target user's reference from the "followers" array
    await userToUnfollowRef.update({
      followers: admin.firestore.FieldValue.arrayRemove(followerId),
    });

    return { success: true, message: 'You have unfollowed the user.' };
  } catch (error) {
    return {
      success: false,
      message: 'An error occurred while unfollowing the user.',
    };
  }
});
exports.addLike = functions.https.onCall(async (data, context) => {
  const { songId } = data;
  const userId = context.auth.uid;

  // Get references to the user and song documents
  const userRef = admin.firestore().collection('users').doc(userId);
  const songRef = admin.firestore().collection('music').doc(songId);

  try {
    // Check if the user has already liked the song
    const userSnapshot = await userRef.get();
    const userData = userSnapshot.data();
    if (!userData) {
      return { success: false, message: 'User does not exist.' };
    }
    const likedSongs = userData.likes || [];

    if (likedSongs.includes(songId)) {
      return { success: false, message: 'You have already liked this song.' };
    }

    // Update the user's "likes" array
    await userRef.update({
      likes: admin.firestore.FieldValue.arrayUnion(songId),
    });

    // Update the song's "likes" array
    await songRef.update({
      likes: admin.firestore.FieldValue.arrayUnion(userId),
    });

    return { success: true, message: 'You have liked the song.' };
  } catch (error) {
    return {
      success: false,
      message: 'An error occurred while adding the like.',
    };
  }
});

exports.removeLike = functions.https.onCall(async (data, context) => {
  const { songId } = data;
  const userId = context.auth.uid;

  // Get references to the user and song documents
  const userRef = admin.firestore().collection('users').doc(userId);
  const songRef = admin.firestore().collection('music').doc(songId);

  try {
    // Check if the user has liked the song
    const userSnapshot = await userRef.get();
    const userData = userSnapshot.data();
    if (!userData) {
      return { success: false, message: 'User does not exist.' };
    }
    const likedSongs = userData.likes || [];

    if (!likedSongs.includes(songId)) {
      return { success: false, message: 'You have not liked this song.' };
    }

    // Update the user's "likes" array
    await userRef.update({
      likes: admin.firestore.FieldValue.arrayRemove(songId),
    });

    // Update the song's "likes" array
    await songRef.update({
      likes: admin.firestore.FieldValue.arrayRemove(userId),
    });

    return {
      success: true,
      message: 'You have removed your like from the song.',
    };
  } catch (error) {
    return {
      success: false,
      message: 'An error occurred while removing the like.',
    };
  }
});
exports.getUserProfile = functions.https.onCall(async (data, context) => {
  try {
    const { profileURL } = data; // Assuming you pass profileURL as a parameter
    const profileData = await admin
      .firestore()
      .collection('users')
      .where('profileURL', '==', profileURL)
      .get()
      .then((querySnapshot) => {
        console.log(querySnapshot.docs);
        if (querySnapshot.docs[0]) {
          return querySnapshot.docs[0].data();
        } else {
          throw new functions.https.HttpsError('not-found', 'User not found');
        }
      });
    // const profileSnapshot = await admin.firestore().collection('users').get();

    // const profileData = profileSnapshot.docs[0].data;
    console.log(profileData);
    return profileData;
  } catch (error) {
    throw new functions.https.HttpsError('internal', error);
  }
});

// Callable function to get songs with optional filtering
exports.getSongs = functions.https.onCall(async (data, context) => {
  try {
    const songsCollection = admin.firestore().collection('music');
    let query = songsCollection; // Initialize the query with the collection

    // Check if a "where" condition is provided in the data
    if (data.where) {
      const { field, operator, value } = data.where;
      query = query.where(field, operator, value);
    }

    const songsSnapshot = await query.get();
    const songsData = [];

    songsSnapshot.docs.forEach((doc) => {
      songsData.push(doc.data());
    });

    return songsData;
  } catch (error) {
    throw new functions.https.HttpsError('internal', 'Internal server error');
  }
});

// exports.authorizePlay = functions.https.onCall(async (data, context) => {
//   const userId = context.auth.uid;
//   const songId = data.songId;

//   // Check if the user has already played this song today.
//   const playsCollection = admin
//     .firestore()
//     .collection('users')
//     .doc(userId)
//     .collection('plays');
//   const lastDay = new Date(new Date().getTime() - 24 * 60 * 60 * 1000);
//   const todayPlays = await playsCollection
//     .where('songId', '==', songId)
//     .where('timestamp', '>=', lastDay)
//     .get();

//   if (todayPlays.size >= 3) {
//     return { authorized: false, message: 'Maximum daily plays reached.' };
//   }

//   // Retrieve the song's document.
//   const songRef = admin.firestore().collection('songs').doc(songId);
//   const songDoc = await songRef.get();

//   if (!songDoc.exists) {
//     return { authorized: false, message: 'Song not found.' };
//   }

//   const songData = songDoc.data();

//   // Check if enough time has passed since the last play.
//   const lastPlayTimestamp = songData.lastPlayTimestamp || 0;
//   const timeSinceLastPlay = new Date().getTime() - lastPlayTimestamp;
//   if (timeSinceLastPlay < songData.playCooldown) {
//     return { authorized: false, message: 'Cooldown time not met.' };
//   }

//   // Record the play and update song data.
//   const playTimestamp = new Date();
//   await playsCollection.add({ songId, timestamp: playTimestamp });
//   await songRef.update({
//     playCount: (songData.playCount || 0) + 1,
//     lastPlayTimestamp: playTimestamp,
//   });

//   return { authorized: true };
// });
