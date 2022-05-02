import { useEffect, useState } from "react";
import { projectFirestore } from "../../firebase/config";
import ActionBar from "../../components/ActionBar/ActionBar";
import SongList from "../../components/SongList/SongList";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useCollection } from "../../hooks/useCollection";
import styles from "./Liked.module.css";

export default function Liked() {
  const { user } = useAuthContext();
  const { documents: likedSongDocuments, error: likedSongError } =
    useCollection(
      ["likes", "music"],
      [
        ["uid", "==", user.uid],
        ["docID", "in"],
      ],
      "likedSongID"
    );

  // const { documents: musicDocuments, error: musicError } = useCollection(
  //   "music",
  //   ["docID", "in"]
  // );

  // useEffect(() => {
  //   const filter = likedSongDocuments
  //     ? likedSongDocuments.map((likedSong) => {
  //         return likedSong.likedSongID;
  //       })
  //     : [null];

  //   setFilteredLikedSongDocuments(filter);
  //   console.log(filter);
  //   console.log(filteredLikedSongDocuments);
  //   console.log(likedSongDocuments);
  //   console.log(musicDocuments);
  // }, [likedSongDocuments]);

  return (
    <div className={styles.liked}>
      <ActionBar />
      <h1 className={styles["header_text"]}>Liked Tracks</h1>
      {likedSongDocuments && likedSongDocuments.length > 0 ? (
        <SongList songs={likedSongDocuments} user={user} />
      ) : (
        <h1>You haven't liked any songs yet!</h1>
      )}
    </div>
  );
}
