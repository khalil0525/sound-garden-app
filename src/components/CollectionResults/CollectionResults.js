import SongList from "../SongList/SongList";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useCollection } from "../../hooks/useCollection";
import styles from "./CollectionResults.module.css";
import ActionBar from "../ActionBar/ActionBar";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function CollectionResults(props) {
  const { user } = useAuthContext();
  const location = useLocation();
  //This variable will be used if we are using routes Genres/:type or Artists:id
  // from = the component that is calling this, search = the components
  // item to search(genre type or artist id)
  const { from, search } = location.state ? location.state : [null, null];
  // Otherwise we will be passed query props from the /Liked or /Uploaded routes
  const searchParams =
    from && search ? ["music", [from, "==", search]] : props.query;

  const { documents: musicDocuments, error: musicError } = useCollection(
    ...searchParams
  );
  // This is the error message that will be displayed when the query
  // Returns empty results
  let emptyListMessage =
    location && ["/uploaded", "/liked"].includes(location.pathname)
      ? `You haven't ${location.pathname.substring(
          1,
          location.pathname.length
        )} any songs yet!`
      : `No songs avaialble for this ${from}`;

  return (
    <div className={styles.collectionresults}>
      <ActionBar
        className={styles["collectionresults__actionBar"]}
        user={user}
      />

      {/* <h1 className={styles["header_text"]}>CollectionResults Tracks</h1> */}
      {/* We need user? user: "none" so that if we are logged out we can avoid an app error from firebase having no active user.uid to work with */}
      {musicDocuments && musicDocuments.length > 0 ? (
        <SongList
          className={styles["collectionresults__songList"]}
          songs={musicDocuments}
          user={user ? user : "none"}
        />
      ) : (
        <h1 className={styles["collectionresults__songList"]}>
          {emptyListMessage}
        </h1>
      )}
    </div>
  );
}
