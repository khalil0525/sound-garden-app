import { useEffect, useState, useRef } from "react";
import { projectFirestore } from "../firebase/config";
import moment from "moment";
//Colletion can be a string or an array.
// If we want to comb through 2 collections then we will need to provide a collectionFilterVariable value
export const useCollection = (
  _collection,
  _query,
  _collectionFilterVariable = ""
) => {
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
  const collection = useRef(_collection).current;
  const collectionFilterVariable = useRef(_collectionFilterVariable).current;

  useEffect(() => {
    if (collection === "skip") {
      return;
    }

    let ref =
      typeof collection === "object"
        ? projectFirestore.collection(collection[0])
        : projectFirestore.collection(collection);

    if (query) {
      ref = query.length === 2 ? ref.where(...query[0]) : ref.where(...query);
    }

    const unsubscribe = ref.onSnapshot(
      (snapshot) => {
        let results = [];

        snapshot.docs.forEach((doc) => {
          // if (query.length === 2) {
          //   let extractData = doc.data();
          //   let extractVariable = extractData[collectionFilterVariable];
          //   console.log(extractVariable);
          // }
          //Convert the timestamp to a date
          const timestamp = moment(doc.data().createdAt.toDate())
            .startOf("day")
            .fromNow();
          results.push({ ...doc.data(), createdAt: timestamp });
        });

        //If we have a query that requires information from 2 collections
        if (query.length === 2) {
          const extractResults =
            results && results.length > 0
              ? results.map((doc) => {
                  return doc[collectionFilterVariable];
                })
              : [null];
          let secondResults = [];
          while (extractResults.length) {
            const batch = extractResults.splice(0, 10);
            try {
              secondResults.push(
                projectFirestore
                  .collection(collection[1])
                  .where(...query[1], batch)
                  .get()
                  .then((snapshot2) =>
                    snapshot2.docs.map((res) => ({
                      ...res.data(),
                      createdAt: moment(res.data().createdAt.toDate())
                        .startOf("day")
                        .fromNow(),
                    }))
                  )
              );
            } catch (error) {
              console.log(error);
              setError("Unable to get results");
            }
          }
          Promise.all(secondResults).then((content) =>
            setDocuments(content.flat())
          );

          // update state
        } else {
          setDocuments(results);
          setError(null);
        }
      },
      (error) => {
        console.log(error + collection);

        setError("could not fetch the Data");
      }
    );

    //Filter the results based on the collectionFilterVariable

    //Unsubscribe on unmount
    return () => unsubscribe();
  }, [collection, query, collectionFilterVariable]);

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
