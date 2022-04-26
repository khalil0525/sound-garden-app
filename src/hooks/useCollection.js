import { useEffect, useState } from "react";
import { projectFirestore } from "../firebase/config";

export const useCollection = (collection) => {
  const [documents, setDocuments] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ref = projectFirestore.collection(collection);

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
  }, [collection]);
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
