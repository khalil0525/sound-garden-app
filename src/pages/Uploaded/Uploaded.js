import { useAuthContext } from "../../hooks/useAuthContext";
//
import CollectionResults from "../../components/CollectionResults/CollectionResults";
import OneColumnLayout from "../../components/Layout/OneColumnLayout";
// import { useEffect } from "react";
// import SongList from "../../components/SongList/SongList";
// import { useCollection } from "../../hooks/useCollection";
// import styles from "./Uploaded.module.css";
// import ActionBar from "../../components/ActionBar/ActionBar";
export default function Uploaded({ scrollRef }) {
  const { user } = useAuthContext();
  const query = ["music", ["userID", "==", user.uid]];
  // const { documents: musicDocuments, error: musicError } = useCollection(
  //   "music",
  //   ["uid", "==", user.uid]
  // );

  return (
    <OneColumnLayout user={user}>
      <CollectionResults
        scrollRef={scrollRef}
        query={query}
      />
    </OneColumnLayout>
    // <div className={styles.uploaded}>
    //   <ActionBar className={styles["uploaded__actionBar"]} user={user} />

    //   {/* <h1 className={styles["header_text"]}>Uploaded Tracks</h1> */}
    //   <SongList
    //     className={styles["uploaded__songList"]}
    //     songs={musicDocuments}
    //     user={user}
    //   />
    // </div>
  );
}
