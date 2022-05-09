import { useState } from "react";
import algoliasearch from "algoliasearch";
import { useNavigate } from "react-router-dom";
import moment from "moment";
export const useAlgoliaSearch = () => {
  // const [documents, setDocuments] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const algoliaClient = algoliasearch(
    "RM45T5M6YJ",
    "04f3df8c65a977d567d539ce2da52bc0"
  );
  const index = algoliaClient.initIndex("soundgarden_music");

  const searchForDocuments = async (queryString) => {
    try {
      await index.search(queryString).then(({ hits }) => {
        let results = [];
        hits.forEach((doc) => {
          let timestamp = moment(doc.createdAt).startOf("day").fromNow();

          results.push({ ...doc, createdAt: timestamp });
        });

        navigate("/search", {
          replace: false,
          state: {
            results,
            query: queryString,
          },
        });
      });
    } catch (err) {
      setError(err);
      console.log("Error occured: ", err);
    }
  };
  return { searchForDocuments, error };
};
