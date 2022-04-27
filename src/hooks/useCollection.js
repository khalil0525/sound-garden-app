import { useEffect, useState, useRef } from "react";
import { projectFirestore } from "../firebase/config";

export const useCollection = (collection, _query) => {
  const [documents, setDocuments] = useState(null);
  const [error, setError] = useState(null);

  // We are using useRef here because the _query data that we are passing is a
  // reference type (array) and upon component reevaluation (state change)
  // reference types are seen as being "different" than before even if we
  // did not change the content of it and therefore it would cause and infinite
  // loop.
  // This is because it works like an instance variable in a class and when this
  // hook is used in a component there will only be 1 instance of it during
  // mount/unmounting. This use ref will persist and only cause the useEffect
  // to fire if the .current value of it changes.

  const query = useRef(_query).current;

  useEffect(() => {
    let ref = projectFirestore.collection(collection);

    if (query) {
      ref = ref.where(...query);
    }

    const unsubscribe = ref.onSnapshot(
      (snapshot) => {
        let results = [];
        snapshot.docs.forEach((doc) => {
          //Convert the timestamp to a date
          const timestamp = doc.data().createdAt.toDate().toDateString();
          results.push({ ...doc.data(), id: doc.id, createdAt: timestamp });
        });

        // update state
        setDocuments(results);
        setError(null);
      },
      (error) => {
        console.log(error);
        setError("could not fetch the Data");
      }
    );
    //Unsubscribe on unmount
    return () => unsubscribe();
  }, [collection, query]);

  return { documents, error };
};
// get docments based on query... docProperty === property to look at in our documents.... queryString === what the docProperty value should be = to
// const getDocument = async (docProperty, queryString) => {
//   dispatch({ type: "IS_PENDING" });
//   try {
//     const queryDocuments = await ref
//       .where(docProperty, "==", queryString)
//       .get();

// let res = [];
// query
//   .get()
//   .then((querySnapshot) => {
//     querySnapshot.forEach((doc) => {
//       // doc.data() is never undefined for query doc snapshots
//       console.log(doc.id, " => ", doc.data());
//       res = [...res, doc.data()];
//     });
//     console.log(res);
//
// })
// .catch((error) => {
//   console.log("Error getting documents: ", error);
// });
// };
