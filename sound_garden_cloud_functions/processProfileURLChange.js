const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp(functions.config().firebase);

exports.onProfileURLUpdate = functions.firestore
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