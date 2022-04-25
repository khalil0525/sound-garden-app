import React, { useEffect, useState } from "react";
import styles from "./SongList.module.css";
import { useFirestore } from "../../hooks/useFirestore";
import SongItem from "./SongItem";
// Different types are:
// search(name, genre): query = whatever is in the search input
// liked : query = will need to query the users "liked" collection in firebase and then query those document IDs
// Uploaded(uid): query = user.uid
const SongList = ({ type, query }) => {
  const [songs, setSongs] = useState([]);
  const { getDocument, response } = useFirestore("music");

  const getSongs = async () => {
    const sub = await getDocument(type, query);
    console.log(sub);
    // console.log(response.success);
    sub.queryDocuments.docs.forEach((doc) => {
      console.log(doc.data());
      setSongs((prev) => [...prev, doc.data()]);
    });
  };

  useEffect(() => {
    getSongs();
  }, []);

  return (
    <div>
      {songs && (
        <>
          <h1>Uploaded Tracks</h1>
          <ul>
            {songs.map((song) => (
              <SongItem song={song} key={song.URL} />
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default SongList;
