import { useAuthContext } from "../../hooks/useAuthContext";
import CollectionResults from "../../components/CollectionResults/CollectionResults";
// import ActionBar from "../../components/ActionBar/ActionBar";
// import SongList from "../../components/SongList/SongList";

// import { useCollection } from "../../hooks/useCollection";
// import styles from "./Liked.module.css";

export default function Liked() {
  const { user } = useAuthContext();
  const query = [
    ["likes", "music"],
    [
      ["uid", "==", user.uid],
      ["docID", "in"],
    ],
    "likedSongID",
  ];
  // const { documents: likedSongDocuments, error: likedSongError } =
  //   useCollection(
  //     ["likes", "music"],
  //     [
  //       ["uid", "==", user.uid],
  //       ["docID", "in"],
  //     ],
  //     "likedSongID"
  //   );

  return (
    <CollectionResults query={query} />
    // <div className={styles.liked}>
    //   <ActionBar className={styles["liked__actionBar"]} user={user} />
    //   {/* <h1 className={styles["header_text"]}>Liked Tracks</h1> */}
    //   {likedSongDocuments && likedSongDocuments.length > 0 ? (
    //     <SongList
    //       className={styles["liked__songList"]}
    //       songs={likedSongDocuments}
    //       user={user}
    //     />
    //   ) : (
    //     <h1 className={styles["liked__songList"]}>
    //       You haven't liked any songs yet!
    //     </h1>
    //   )}
    // </div>
  );
}
