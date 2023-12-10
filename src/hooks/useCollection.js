import { useEffect, useState } from 'react';
import { projectFirestore } from '../firebase/config';
import moment from 'moment';

export const useCollection = (
  collection,
  query,
  collectionFilterVariable = ''
) => {
  const [documents, setDocuments] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (collection === 'skip') {
      return;
    }
    console.log(collection, query);
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
          const timestamp = moment(doc.data().createdAt.toDate())
            .startOf('hour')
            .fromNow();

          results.push({
            ...doc.data(),
            createdAt: timestamp,
          });
        });

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

    return () => unsubscribe();
  }, [collection, query, collectionFilterVariable]);

  return { documents, error };
};
