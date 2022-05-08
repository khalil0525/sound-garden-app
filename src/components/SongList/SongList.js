import React from "react";
import styles from "./SongList.module.css";
import SongItem from "./SongItem";
import { useCollection } from "../../hooks/useCollection";

//We receive a song prop from whichever parent component calls this
const SongList = ({ songs, user, className }) => {
  // const { documents: likedSongDocuments, error: likedSongDocumentError } =
  //   useCollection("likes", ["uid", "==", user.uid]);
  const { documents: likedSongDocuments, response: collectionResponse } =
    useCollection("likes", ["uid", "==", user.uid]);
  // const [songs, setSongs] = useState([]);

  // Here we are extracting the tracks that the user has liked from our useCollection call.
  // We will use this to do a check on each generated songItem to see if their ID is inside of this array.

  // const likes = likedSongDocuments
  //   ? likedSongDocuments.map((likedSongObject) => {
  //       return likedSongObject.likedSongID;
  //     })
  //   : [];

  return (
    <div className={`${styles["song-list"]} ${className} `}>
      <ul className={styles["song-list__list"]}>
        {songs &&
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
