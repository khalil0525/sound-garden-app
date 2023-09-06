import SongList from "../SongList/SongList";
import MiniSongList from "../MiniSongList/MiniSongList";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useCollection } from "../../hooks/useCollection";
import styles from "./CollectionResults.module.css";

import { useLocation } from "react-router-dom";

export default function CollectionResults({
  scrollRef,
  query,
  hideActionBar = false,
}) {
  const { user } = useAuthContext();
  const location = useLocation();
  //This variable will be used if we are using routes Genres/:type or Artists:id
  // from = the component that is calling this, search = the components
  // item to search(genre type or artist id)
  // Otherwise we will be passed query props from the /Liked or /Uploaded routes
  const { from, search } =
    location.state && location.state.from ? location.state : [null, null];

  //These variable are only used if we are rendering an algolia search
  const { results: algoliaResults, query: algoliaQuery } =
    location.state && location.state.results ? location.state : [null, null];
  //SearchParams is check which page we need to render.
  // If we are coming from Genres/Artists then the first condition is true
  // If we are coming from Uploaded/Liked then second condition is true
  // Else we're coming from search, and we want to skip using useCollection
  // Because we are getting result from an AlgoliaSearch
  const searchParams =
    from && search
      ? ["music", [from, "==", search]]
      : query
      ? query
      : ["skip", "skip", "skip"];

  const { documents: musicDocuments } = useCollection(...searchParams);

  // This is the error message that will be displayed when the query
  // Returns empty results
  let emptyListMessage =
    location && ["/uploaded", "/liked"].includes(location.pathname)
      ? `You haven't ${location.pathname.substring(
          1,
          location.pathname.length
        )} any songs yet!`
      : `No songs available for this ${from}`;

  return (
    <div className={styles.collectionResults}>
      <div className={styles["collectionResults__header"]}>
        {location.pathname === "/search" ? (
          <h1 className={styles["search__queryText"]}>
            Search results for "{algoliaQuery}"
          </h1>
        ) : null}
      </div>
      {/* We need user? user: "none" so that if we are logged out we can avoid an app error from firebase having no active user.uid to work with */}
      {(location.pathname !== "/search") & (location.pathname !== "/") ? (
        musicDocuments && musicDocuments.length > 0 ? (
          <SongList
            className={styles["collectionResults__songList"]}
            songs={musicDocuments}
            user={user ? user : "none"}
            scrollRef={scrollRef}
            playlistLocation={location && location.pathname}
          />
        ) : (
          <h1 className={styles["collectionResults__songList"]}>
            {emptyListMessage}
          </h1>
        )
      ) : null}

      {location.pathname === "/" ? (
        musicDocuments && musicDocuments.length > 0 ? (
          <MiniSongList
            className={styles["collectionResults__songList"]}
            songs={musicDocuments}
            user={user ? user : "none"}
            scrollRef={scrollRef}
            playlistLocation={location && location.pathname}
          />
        ) : (
          <h1 className={styles["collectionResults__songList"]}>
            {emptyListMessage}
          </h1>
        )
      ) : null}

      {/* FOR SEARCH PAGE */}
      {location.pathname === "/search" ? (
        algoliaResults.length ? (
          <SongList
            className={styles["collectionResults__songList"]}
            scrollRef={scrollRef}
            songs={algoliaResults}
            user={user ? user : "none"}
          />
        ) : (
          <h1 className={styles["collectionResults__songList"]}>
            The search yielded no results!
          </h1>
        )
      ) : null}
    </div>
  );
}
