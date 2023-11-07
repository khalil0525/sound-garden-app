const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp(functions.config().firebase);

exports.onUserUpdate = functions.firestore
  .document("users/{userID}")
  .onUpdate((change, context) => {
    const { before, after } = change;
    const { userID } = context.params;

    const db = admin.firestore();

    if (before.get("profileURL") !== after.get('profileURL')) {
      const batch = db.batch()

      // delete the old profileURL document from the `profileURLS` collection
      if (before.get('profileURL')) {
        // new users may not have a profileURL value
        batch.delete(db.collection('profileURLS')
          .doc(before.get('profileURL')));
      }

      // add a new profileURL document
      batch.set(db.collection('profileURLS')
        .doc(after.get('profileURL')), { userID });

      return batch.commit();
    }
    return true;
  });
  
  exports.onSongDelete = functions.firestore
  .document("music/{songID}")
  .onDelete((snap, context) => {
    const deletedDocumentID = snap.data().docID;
    const db = admin.firestore();
	const likesCollectionsRef = db.collection('likes')
	const likesQuery = likesCollectionsRef.where('likes', 'array-contains', `${deletedDocumentID}`);
	
	// We return this because when we change documents with cloud functions we must return a promise
	return likesQuery.get().then((querySnapshot) => {
		if(querySnapshot.empty){
			return null;
		}else{
			const promises = []
			//let batch = db.batch();
			querySnapshot.forEach((doc) => {
			const filteredLikes = doc.data().likes.filter((like) => like !== `${deletedDocumentID}`);
			//batch.update(doc.ref, {likes:filteredLikes});
			promises.push(doc.ref.update({likes: filteredLikes}));
		})
		return Promise.all(promises)
		//return batch.commit()
		}
		

	})
  });
  
exports.onArtistNameChange = functions.firestore
  .document("users/{userID}")
  .onUpdate((change, context) => {
    const { before, after } = change;
    const { userID } = context.params;

    const db = admin.firestore();
    if (before.get("displayName") !== after.get('displayName')){
		const batch = db.batch()
		const musicCollectionsRef = db.collection('music')
		const musicQuery = musicCollectionsRef.where('userID', '==', `${userID}`);
		
		// We return this because when we change documents with cloud functions we must return a promise
		return musicQuery.get().then((querySnapshot) => {
			if(querySnapshot.empty){
				return null;
			}else{
				const promises = []
				//let batch = db.batch();
				querySnapshot.forEach((doc) => {
				//batch.update(doc.ref, {likes:filteredLikes});
				promises.push(doc.ref.update({artist: after.get('displayName')}));
			})
			return Promise.all(promises);
			//return batch.commit()
			}
		})
    }
    return true;
  });