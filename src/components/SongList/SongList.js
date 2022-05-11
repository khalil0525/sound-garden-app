import React, { useEffect, useState } from "react";
import styles from "./SongList.module.css";
import SongItem from "./SongItem";
import { useCollection } from "../../hooks/useCollection";
import InfiniteScroll from "react-infinite-scroll-component";
//We receive a song prop from whichever parent component calls this
const SongList = ({ songs, user, className, playlistLocation, scrollRef }) => {
  // const { documents: likedSongDocuments, error: likedSongDocumentError } =
  //   useCollection("likes", ["uid", "==", user.uid]);
  //  We need user? user: "none" so that if we are logged out we can avoid an app error from firebase having no active user.uid to work with
  const { documents: likedSongDocuments, response: collectionResponse } =
    useCollection("likes", ["uid", "==", user.uid ? user.uid : "none"]);

  useEffect(() => {
    console.log(scrollRef);
    console.log(likedSongDocuments);
  });

  const [count, setCount] = useState({
    prev: 0,
    next: 10,
  });
  const [hasMore, setHasMore] = useState(true);
  const [current, setCurrent] = useState(songs.slice(count.prev, count.next));
  const getMoreData = () => {
    if (current.length === songs.length) {
      setHasMore(false);
      return;
    }
    setTimeout(() => {
      setCurrent(current.concat(songs.slice(count.prev + 10, count.next + 10)));
    }, 2000);
    setCount((prevState) => ({
      prev: prevState.prev + 10,
      next: prevState.next + 10,
    }));
  };
  return (
    <div className={`${styles["song-list"]} ${className} `}>
      <InfiniteScroll
        dataLength={current.length}
        next={getMoreData}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
        className={styles["song-list__list"]}
        scrollableTarget={scrollRef.current}
      >
        {/* <ul > */}
        {current &&
          likedSongDocuments &&
          current.map((song, index) => (
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
              songPlaylistLocation={playlistLocation}
              user={user}
            />
          ))}
        {/* </ul> */}
      </InfiniteScroll>
    </div>
  );
};

export default SongList;
