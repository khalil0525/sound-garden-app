import React, { useEffect } from "react";
import styles from "./SongList.module.css";
import SongItem from "./SongItem";
import { useCollection } from "../../hooks/useCollection";

//We receive a song prop from whichever parent component calls this
const SongList = ({ songs, user, className }) => {
  // const { documents: likedSongDocuments, error: likedSongDocumentError } =
  //   useCollection("likes", ["uid", "==", user.uid]);
  //  We need user? user: "none" so that if we are logged out we can avoid an app error from firebase having no active user.uid to work with
  const { documents: likedSongDocuments, response: collectionResponse } =
    useCollection("likes", ["uid", "==", user.uid ? user.uid : "none"]);
  // const [songs, setSongs] = useState([]);

  // Here we are extracting the tracks that the user has liked from our useCollection call.
  // We will use this to do a check on each generated songItem to see if their ID is inside of this array.

  // const likes = likedSongDocuments
  //   ? likedSongDocuments.map((likedSongObject) => {
  //       return likedSongObject.likedSongID;
  //     })
  //   : [];
  useEffect(() => {
    console.log(likedSongDocuments);
  });

  return (
    <div className={`${styles["song-list"]} ${className} `}>
      <ul className={styles["song-list__list"]}>
        {songs &&
          likedSongDocuments &&
          songs.map((song, index) => (
            <SongItem
              song={song}
              key={song.docID}
              playlistSongs={songs}
              songIndex={index}
              liked={
                likedSongDocuments &&
                likedSongDocuments.find(
                  (likedDoc) => likedDoc.likedSongID === song.docID
                )
              }
              user={user}
            />
          ))}
      </ul>
    </div>
  );
};

export default SongList;
