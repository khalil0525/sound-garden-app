import { useEffect, useState, useRef } from 'react';
import { projectFirestore } from '../firebase/config';
import moment from 'moment';
//Colletion can be a string or an array.
// If we want to comb through 2 collections then we will need to provide a collectionFilterVariable value
export const useCollection = (
  _collection,
  _query,
  _collectionFilterVariable = ''
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
    //This is used when we are pulling information from a Algolia search
    //Instead of a FireStore collection
    if (collection === 'skip') {
      return;
    }

    //When we do a query on two collection we will store 2 strings in an array
    //Otherwise we just receive a string
    let ref =
      typeof collection === 'object'
        ? projectFirestore.collection(collection[0])
        : projectFirestore.collection(collection);

    if (query) {
      ref = query.length === 2 ? ref.where(...query[0]) : ref.where(...query);
    }

    const unsubscribe = ref.onSnapshot(
      (snapshot) => {
        let results = [];

        snapshot.docs.forEach((doc) => {
          //Convert the timestamp to a date
          const timestamp = moment(doc.data().createdAt.toDate())
            .startOf('hour')
            .fromNow();

          results.push({
            ...doc.data(),
            createdAt: timestamp,
          });
        });

        // If we have a query that requires information from 2 collections
        // We expect to get an array of documents with each document having
        // and array of document IDs for a particular collection
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
                  .where(...query[1], ...batch)
                  .get()
                  .then((snapshot2) =>
                    snapshot2.docs.map((res) => ({
                      ...res.data(),
                      createdAt: moment(res.data().createdAt.toDate())
                        .startOf('hour')
                        .fromNow(),
                    }))
                  )
              );
            } catch (error) {
              console.log(error);
              setError('Unable to get results');
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
        console.log(collection);

        setError('could not fetch the Data');
      }
    );

    //Filter the results based on the collectionFilterVariable

    //Unsubscribe on unmount
    return () => unsubscribe();
  }, [collection, query, collectionFilterVariable]);

  return { documents, error };
};
